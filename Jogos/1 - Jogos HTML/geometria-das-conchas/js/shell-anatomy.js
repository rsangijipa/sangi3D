/**
 * js/shell-anatomy.js
 * Controlador de anatomia interna e cortes tridimensionais das conchas marinhas.
 * Implementa:
 *  - 5 modalidades de visualização: Concha Inteira, Corte Longitudinal, Corte Progressivo, Raio X e Vista Explodida
 *  - Septos curvos com espessura real, câmara corporal e câmaras camerais prévias
 *  - Sifúnculo 3D contínuo com posição central (Náutilo) ou marginal (Amonite)
 *  - Fechamento sólido mineral das bordas cortadas (seam caps)
 *  - Pontos de Interesse anatômicos (POIs) 3D interativos com etiquetas e descrições
 */
import * as THREE from 'three';
import {
  computeSpeciesMorphConstants,
  evalShellPoint,
  buildWallGridGeometry,
  buildSeamStrip,
  buildLipSealGeometry,
  buildSecondaryBivalve,
} from './shell-geometry.js';
import { SHELL_SPECIES } from './shell-species.js';

export function createShellAnatomyController(parentGroup, mats) {
  const rootGroup = new THREE.Group();
  parentGroup.add(rootGroup);

  const outerGroup = new THREE.Group();
  const innerGroup = new THREE.Group();
  const septaGroup = new THREE.Group();
  const siphuncleGroup = new THREE.Group();
  const capsGroup = new THREE.Group();
  const poiGroup = new THREE.Group();

  rootGroup.add(outerGroup, innerGroup, septaGroup, siphuncleGroup, capsGroup, poiGroup);

  const activeGeos = [];
  const activeMeshes = [];
  let currentMetrics = {
    vertexCount: 0,
    chamberCount: 0,
    width: 1.0,
    height: 1.0,
    depth: 1.0,
    ratioWH: 1.0,
    estimatedVolumeCm3: 120,
    estimatedAreaCm2: 240,
    estimatedMassGrams: 280,
  };

  function clearAll() {
    [outerGroup, innerGroup, septaGroup, siphuncleGroup, capsGroup, poiGroup].forEach((grp) => {
      while (grp.children.length) {
        const c = grp.children[0];
        grp.remove(c);
        if (c.geometry) c.geometry.dispose();
      }
    });
    activeGeos.forEach((g) => g.dispose());
    activeGeos.length = 0;
    activeMeshes.length = 0;
  }

  // Constrói septo côncavo individual com arco anatômico
  function buildSeptumGeometry(theta, phiStart, phiEnd, params, morph, wallThick) {
    const segR = 8;
    const segPhi = 16;
    const positions = [];
    const indices = [];

    for (let ir = 0; ir <= segR; ir++) {
      const f = ir / segR;
      for (let ip = 0; ip <= segPhi; ip++) {
        const phi = phiStart + (ip / segPhi) * (phiEnd - phiStart);
        // Curvatura côncava voltada para a abertura
        const curveTheta = theta - (1 - f * f) * 0.22;
        const base = evalShellPoint(curveTheta, phi, params, morph, 0);
        const maxR = Math.max(0.003, base.rTube - Math.min(wallThick, base.rTube * 0.32));
        const rLoc = maxR * f;

        const radXZ = base.R + rLoc * base.cosPhi;
        const x = radXZ * Math.cos(curveTheta);
        const z = radXZ * Math.sin(curveTheta);
        const y = base.yCenter + rLoc * base.sinPhi * 0.9;
        positions.push(x, y, z);
      }
    }

    const row = segPhi + 1;
    for (let ir = 0; ir < segR; ir++) {
      for (let ip = 0; ip < segPhi; ip++) {
        const a = ir * row + ip;
        const b = (ir + 1) * row + ip;
        const c = (ir + 1) * row + (ip + 1);
        const d = ir * row + (ip + 1);
        indices.push(a, b, d, b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  // Constrói tubo 3D contínuo do sifúnculo
  function buildSiphuncleGeometry(thetaStart, thetaEnd, params, morph, isMarginal = false) {
    const steps = 48;
    const radSegments = 10;
    const siphRadius = 0.007 * morph.scaleRatio;
    const points = [];

    for (let i = 0; i <= steps; i++) {
      const t = thetaStart + (i / steps) * (thetaEnd - thetaStart);
      const base = evalShellPoint(t, 0, params, morph, 0);
      const shift = isMarginal ? base.rTube * 0.75 : 0;
      const radXZ = base.R + shift;
      const x = radXZ * Math.cos(t);
      const z = radXZ * Math.sin(t);
      const y = base.yCenter;
      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    return new THREE.TubeGeometry(curve, steps, siphRadius, radSegments, false);
  }

  // Constrói marcadores e POIs anatômicos
  function buildPOIs(species) {
    if (!species.anatomyPOIs || !species.anatomyPOIs.length) return;
    const poiSphereGeo = new THREE.SphereGeometry(0.024, 16, 16);
    const poiMat = new THREE.MeshStandardMaterial({
      color: 0xe0c38b,
      emissive: 0xb99859,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
    });

    species.anatomyPOIs.forEach((poi) => {
      const mesh = new THREE.Mesh(poiSphereGeo, poiMat);
      mesh.position.set(poi.normPos[0], poi.normPos[1], poi.normPos[2]);
      mesh.userData = { poi };
      poiGroup.add(mesh);
    });
  }

  function rebuild(state, segU = 120, segV = 30) {
    clearAll();
    rootGroup.position.set(0, 0, 0);
    rootGroup.rotation.set(0, 0, 0);

    const speciesId = state.speciesId || 'nautilus';
    const spec = SHELL_SPECIES[speciesId] || SHELL_SPECIES.nautilus;
    const morph = computeSpeciesMorphConstants(speciesId, state);
    const wallThick = (state.wallThickness ?? spec.defaultParams.wallThickness) * morph.scaleRatio;

    // Crescimento progressivo 4D: limita theta máximo de acordo com state.growthProgress
    const growthProgress = Math.max(0.08, Math.min(1.0, state.growthProgress ?? 1.0));
    const effectiveTheta = 0.2 + growthProgress * (morph.maxTheta - 0.2);

    const thetaVals = [];
    for (let i = 0; i <= segU; i++) {
      thetaVals.push(0.2 + (i / segU) * (effectiveTheta - 0.2));
    }

    const viewMode = state.viewMode || (state.cutaway ? 'cutaway' : 'whole');
    const isCut = viewMode === 'cutaway' || viewMode === 'progressive';
    const isXray = viewMode === 'xray';
    const isExploded = viewMode === 'exploded';

    // Determina faixa angular phi da seção de corte
    let phiStart = 0;
    let phiEnd = Math.PI * 2;
    if (viewMode === 'cutaway') {
      phiStart = Math.PI * 0.96;
      phiEnd = Math.PI * 2.04;
    } else if (viewMode === 'progressive') {
      const cutP = Math.max(0.05, Math.min(0.95, state.cutProgress ?? 0.5));
      phiStart = Math.PI * (1.0 - cutP * 0.95);
      phiEnd = Math.PI * (1.0 + cutP * 0.95);
    }

    const phiVals = [];
    for (let j = 0; j <= segV; j++) {
      phiVals.push(phiStart + (j / segV) * (phiEnd - phiStart));
    }

    // Material de casca externa (normal ou raio X)
    const shellMaterial = isXray ? mats.xrayMat : mats.outerShellMat;
    const nacreMaterial = isXray ? mats.xrayMat : mats.nacreMat;
    const cutMaterial = isXray ? mats.xrayMat : mats.cutRimMat;

    // 1. Casca externa
    const outerGeo = buildWallGridGeometry(
      thetaVals,
      phiVals,
      state,
      morph,
      () => 0,
      true
    );
    const outerMesh = new THREE.Mesh(outerGeo, shellMaterial);
    outerMesh.castShadow = !isXray;
    outerMesh.receiveShadow = true;
    outerGroup.add(outerMesh);
    activeGeos.push(outerGeo);
    activeMeshes.push(outerMesh);

    // 2. Casca interna (nácar de aragonita)
    const innerGeo = buildWallGridGeometry(
      thetaVals,
      phiVals,
      state,
      morph,
      (theta, phi) => {
        const pt = evalShellPoint(theta, phi, state, morph, 0);
        return -Math.min(wallThick, pt.rTube * 0.32);
      },
      false
    );
    const innerMesh = new THREE.Mesh(innerGeo, nacreMaterial);
    innerMesh.receiveShadow = true;
    innerGroup.add(innerMesh);
    activeGeos.push(innerGeo);
    activeMeshes.push(innerMesh);

    // 3. Lábio selado da abertura
    const lipGeo = buildLipSealGeometry(
      thetaVals[thetaVals.length - 1],
      phiVals,
      state,
      morph,
      wallThick
    );
    const lipMesh = new THREE.Mesh(lipGeo, cutMaterial);
    lipMesh.castShadow = !isXray;
    lipGroup_add: {
      capsGroup.add(lipMesh);
      activeGeos.push(lipGeo);
      activeMeshes.push(lipMesh);
    }

    // 4. Borda de fechamento do corte seccionado (seam caps)
    if (isCut) {
      const seamA = buildSeamStrip(thetaVals, phiStart, state, morph, wallThick);
      const seamB = buildSeamStrip(thetaVals, phiEnd, state, morph, wallThick);
      const mA = new THREE.Mesh(seamA, cutMaterial);
      const mB = new THREE.Mesh(seamB, cutMaterial);
      mA.castShadow = !isXray;
      mB.castShadow = !isXray;
      capsGroup.add(mA, mB);
      activeGeos.push(seamA, seamB);
      activeMeshes.push(mA, mB);
    }

    // 5. Câmaras internas e septos (para espécies com câmaras: Náutilo e Amonite)
    let chamberCount = 0;
    const hasChambers = spec.defaultParams.hasChambers;
    if (hasChambers && (isCut || isXray || isExploded)) {
      const chamberLimit = effectiveTheta - 1.25;
      const stepT = speciesId === 'ammonite' ? 0.32 : 0.42;

      for (let t = 1.6; t < chamberLimit; t += stepT) {
        const septGeo = buildSeptumGeometry(t, phiStart, phiEnd, state, morph, wallThick);
        const septMesh = new THREE.Mesh(septGeo, isXray ? mats.xrayMat : mats.septaMat);
        septMesh.receiveShadow = true;
        septMesh.castShadow = !isXray;
        septaGroup.add(septMesh);
        activeGeos.push(septGeo);
        activeMeshes.push(septMesh);
        chamberCount++;
      }

      // Sifúnculo contínuo 3D
      if (spec.defaultParams.hasSiphuncle) {
        const isMarginal = spec.defaultParams.siphunclePosition === 'marginal';
        const siphGeo = buildSiphuncleGeometry(1.4, chamberLimit, state, morph, isMarginal);
        const siphMesh = new THREE.Mesh(siphGeo, isXray ? mats.xrayMat : mats.siphuncleMat);
        siphMesh.castShadow = !isXray;
        siphuncleGroup.add(siphMesh);
        activeGeos.push(siphGeo);
        activeMeshes.push(siphMesh);
      }
    }

    // 6. Segunda valva para Bivalves (Vieira e Ostra)
    if (spec.defaultParams.bivalve) {
      const isScallop = speciesId === 'scallop';
      const secGeo = buildSecondaryBivalve(outerGeo, isScallop);
      const secMesh = new THREE.Mesh(secGeo, shellMaterial);
      secMesh.castShadow = !isXray;
      secMesh.receiveShadow = true;
      outerGroup.add(secMesh);
      activeGeos.push(secGeo);
      activeMeshes.push(secMesh);
    }

    // 7. Configuração da Vista Explodida
    if (isExploded) {
      const expDist = Math.max(0.1, state.explodedDistance ?? 0.35);
      outerGroup.position.set(0, expDist * 0.45, 0);
      septaGroup.position.set(0, 0, expDist * 0.4);
      siphuncleGroup.position.set(0, -expDist * 0.3, -expDist * 0.2);
    } else {
      outerGroup.position.set(0, 0, 0);
      septaGroup.position.set(0, 0, 0);
      siphuncleGroup.position.set(0, 0, 0);
    }

    // 8. Pontos de interesse anatômicos
    if (state.showAnatomyLabels) {
      buildPOIs(spec);
    }

    // 9. Cálculo de BoundingBox e métricas morfométricas
    rootGroup.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(rootGroup);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Pousa a concha com contato perfeito sobre a bancada / areia
    rootGroup.position.set(-center.x, -box.min.y + 0.02, -center.z);

    const volEstimate = Number((size.x * size.y * size.z * 0.52 * 1000).toFixed(1)); // cm³
    const areaEstimate = Number(((size.x * size.y + size.y * size.z + size.z * size.x) * 2.1 * 100).toFixed(1)); // cm²
    const density = spec.defaultParams.mineralDensity || 2.72;
    const massEstimate = Number((volEstimate * 0.28 * density).toFixed(0)); // gramas

    currentMetrics = {
      vertexCount: outerGeo.attributes.position.count + innerGeo.attributes.position.count,
      chamberCount,
      width: Number(size.x.toFixed(2)),
      height: Number(size.y.toFixed(2)),
      depth: Number(size.z.toFixed(2)),
      ratioWH: Number((size.x / Math.max(0.05, size.z)).toFixed(2)),
      estimatedVolumeCm3: volEstimate,
      estimatedAreaCm2: areaEstimate,
      estimatedMassGrams: massEstimate,
    };

    return currentMetrics;
  }

  return {
    rootGroup,
    outerGroup,
    innerGroup,
    septaGroup,
    siphuncleGroup,
    capsGroup,
    poiGroup,
    rebuild,
    getMetrics: () => currentMetrics,
    dispose() {
      clearAll();
    },
  };
}
