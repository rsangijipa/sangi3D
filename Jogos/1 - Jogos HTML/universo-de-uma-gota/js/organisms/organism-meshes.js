/**
 * Construtores 3D procedurais, deformáveis e instanciados para todos os 20 organismos.
 * Utiliza geometrias compartilhadas em cache e InstancedMesh para cílios e células coloniais.
 */

import * as THREE from '../../../../../Sistema/shared/vendor/three.module.js';
import {createOrganismMaterial} from '../optics/optical-shaders.js';

// Cache de geometrias compartilhadas
const geoCache = new Map();
function cachedGeo(key, factory) {
  if (!geoCache.has(key)) geoCache.set(key, factory());
  return geoCache.get(key);
}

function getSlipperGeo() {
  return cachedGeo('slipper', () => {
    const g = new THREE.SphereGeometry(0.45, 24, 16);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      const nx = x / 0.45;
      // Corpo alongado em chinelo com sulco oral lateral
      x *= 2.15;
      const taper = 1.0 - nx * 0.14;
      y *= 0.72 * taper;
      z *= 0.62 * taper;
      // Sulco oral (depressão diagonal ventral)
      const groove = Math.exp(-Math.pow((nx + 0.1) * 2.2, 2)) * Math.max(0, -y / 0.35);
      y += groove * 0.11;
      z -= groove * 0.06;
      pos.setXYZ(i, x, y, z);
    }
    g.computeVertexNormals();
    return g;
  });
}

function getNavicularGeo() {
  return cachedGeo('navicular', () => {
    const g = new THREE.SphereGeometry(0.45, 24, 14);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      const nx = Math.abs(x / 0.45);
      x *= 2.25;
      const pinch = Math.max(0.14, 1.0 - nx * nx * 0.86);
      y *= 0.56 * pinch;
      z *= 0.32 * pinch;
      pos.setXYZ(i, x, y, z);
    }
    g.computeVertexNormals();
    return g;
  });
}

function getCrescentGeo() {
  return cachedGeo('crescent', () => {
    const g = new THREE.SphereGeometry(0.45, 24, 12);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      const nx = x / 0.45;
      const taper = Math.max(0.08, 1.0 - nx * nx * 0.92);
      x *= 2.2;
      y = y * 0.35 * taper - (nx * nx - 0.35) * 0.28;
      z *= 0.28 * taper;
      pos.setXYZ(i, x, y, z);
    }
    g.computeVertexNormals();
    return g;
  });
}

function getSpiralGeo() {
  return cachedGeo('spiral', () => {
    const pts = [];
    for (let i = 0; i <= 24; i++) {
      const t = (i / 24 - 0.5) * 2.0;
      pts.push(new THREE.Vector3(t * 0.75, Math.sin(t * 7.5) * 0.14, Math.cos(t * 7.5) * 0.14));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 24, 0.055, 7, false);
  });
}

function getAmoebaBasePositions() {
  return cachedGeo('amoeba-base', () => {
    const g = new THREE.SphereGeometry(0.46, 28, 18);
    return new Float32Array(g.attributes.position.array);
  });
}

function tag(mesh, organelleId, organelleTag = 0) {
  mesh.userData.organelleId = organelleId;
  if (mesh.material?.uniforms?.uOrganelleTag) {
    mesh.material.uniforms.uOrganelleTag.value = organelleTag;
  }
  return mesh;
}

export function createOrganismAssembly(agent, sharedUniforms, qualityProfile = 'high') {
  const group = new THREE.Group();
  const materials = [];
  const dynamicParts = {};
  const speciesId = agent.speciesId;

  function mat(opts) {
    const m = createOrganismMaterial(sharedUniforms, opts);
    materials.push(m);
    return m;
  }

  const sphereSmall = cachedGeo('sphere-10', () => new THREE.SphereGeometry(1, 12, 10));
  const sphereMed = cachedGeo('sphere-18', () => new THREE.SphereGeometry(1, 20, 14));
  const cylSeg = cachedGeo('cyl-seg', () => new THREE.CylinderGeometry(1, 1, 1, 12, 1));
  const ciliumGeo = cachedGeo('cilium', () => {
    const g = new THREE.CylinderGeometry(0.008, 0.016, 0.14, 4, 1);
    g.translate(0, 0.07, 0);
    return g;
  });

  if (speciesId === 'paramecium' || speciesId === 'didinium' || speciesId === 'coleps') {
    const isDidinium = speciesId === 'didinium';
    const isColeps = speciesId === 'coleps';
    const bodyGeo = isDidinium || isColeps
      ? cachedGeo('barrel', () => new THREE.SphereGeometry(0.45, 20, 14).scale(1.35, 0.85, 0.85))
      : getSlipperGeo();

    const body = tag(new THREE.Mesh(bodyGeo, mat({
      baseColor: isDidinium ? '#6b5e4a' : isColeps ? '#8c7a56' : '#2e656a',
      rimColor: isColeps ? '#e2cf98' : '#a8f0e4',
      opacity: 0.56,
      deformAmp: isDidinium ? 0.012 : 0.022,
      striae: isColeps ? 1.0 : 0.0,
      noiseScale: isColeps ? 14.0 : 7.5,
      phase: agent.phase,
    })), 'membrane', 3);
    group.add(body);
    dynamicParts.membrane = body;

    // Macronúcleo e micronúcleo
    const macro = tag(new THREE.Mesh(sphereSmall, mat({
      baseColor: '#5c8478',
      rimColor: '#b7dec7',
      opacity: 0.78,
      deformAmp: 0.004,
      noiseScale: 10.0,
    })), 'nucleus', 2);
    macro.scale.set(0.22, 0.11, 0.10);
    macro.position.set(-0.04, 0.03, 0);
    group.add(macro);

    // Vacúolos contráteis (2)
    const cv1 = tag(new THREE.Mesh(sphereSmall, mat({baseColor: '#1f4f5c', rimColor: '#bff8ee', opacity: 0.72, deformAmp: 0})), 'vacuole_contractile', 4);
    cv1.scale.setScalar(0.085);
    cv1.position.set(-0.48, 0.05, 0.02);
    const cv2 = tag(new THREE.Mesh(sphereSmall, mat({baseColor: '#1f4f5c', rimColor: '#bff8ee', opacity: 0.72, deformAmp: 0})), 'vacuole_contractile', 4);
    cv2.scale.setScalar(0.085);
    cv2.position.set(0.46, 0.04, -0.02);
    group.add(cv1, cv2);
    dynamicParts.contractileVacuoles = [cv1, cv2];

    // Vacúolos alimentares dinâmicos
    const foodVacuoles = [];
    for (let i = 0; i < 4; i++) {
      const fv = tag(new THREE.Mesh(sphereSmall, mat({baseColor: '#9c7a48', rimColor: '#e7cf93', opacity: 0.78, deformAmp: 0})), 'vacuole_food', 4);
      fv.scale.setScalar(0.055);
      fv.visible = false;
      group.add(fv);
      foodVacuoles.push(fv);
    }
    dynamicParts.foodVacuoles = foodVacuoles;

    // Cílios instanciados em ondas metacrônicas (1 draw call!)
    const ciliaCount = qualityProfile === 'low' ? 36 : qualityProfile === 'medium' ? 60 : 84;
    const ciliaMat = mat({
      baseColor: '#7bc6c0',
      rimColor: '#d9fbf6',
      opacity: 0.65,
      deformAmp: 0,
    });
    const ciliaMesh = tag(new THREE.InstancedMesh(ciliumGeo, ciliaMat, ciliaCount), 'cilia', 3);
    const ciliaData = [];
    for (let i = 0; i < ciliaCount; i++) {
      const t = (i / ciliaCount) * Math.PI * 2;
      const ring = isDidinium ? (i % 2 === 0 ? 0.35 : -0.18) : ((i % 7) - 3) / 3.4;
      const rx = isDidinium || isColeps ? 0.60 : 0.94;
      const ry = isDidinium || isColeps ? 0.38 : 0.32;
      const x = ring * rx;
      const rScale = Math.sqrt(Math.max(0.08, 1 - ring * ring * 0.85));
      const y = Math.sin(t) * ry * rScale;
      const z = Math.cos(t) * ry * 0.85 * rScale;
      ciliaData.push({x, y, z, angle: t, phaseOffset: ring * 4.5 + t});
    }
    group.add(ciliaMesh);
    dynamicParts.ciliaMesh = ciliaMesh;
    dynamicParts.ciliaData = ciliaData;

  } else if (speciesId === 'amoeba' || speciesId === 'arcella') {
    if (speciesId === 'arcella') {
      // Teca protetora em cúpula âmbar
      const domeGeo = cachedGeo('arcella-dome', () => new THREE.SphereGeometry(0.42, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.62));
      const dome = tag(new THREE.Mesh(domeGeo, mat({
        baseColor: '#8d5b2d',
        rimColor: '#e2b676',
        opacity: 0.82,
        noiseScale: 16.0,
        striae: 0.6,
        deformAmp: 0,
      })), 'cuticle', 5);
      dome.rotation.x = Math.PI * 0.5;
      group.add(dome);
      dynamicParts.membrane = dome;
    }

    // Malha deformável por pseudópodes
    const amoebaGeo = new THREE.SphereGeometry(speciesId === 'arcella' ? 0.32 : 0.46, 28, 18);
    const amoebaMat = mat({
      baseColor: '#3f6e68',
      rimColor: '#b7ede4',
      opacity: 0.58,
      deformAmp: 0.01,
      noiseScale: 8.5,
      phase: agent.phase,
    });
    const body = tag(new THREE.Mesh(amoebaGeo, amoebaMat), speciesId === 'arcella' ? 'pseudopods' : 'membrane', 3);
    group.add(body);
    dynamicParts.amoebaGeo = amoebaGeo;
    dynamicParts.amoebaBase = getAmoebaBasePositions();
    if (!dynamicParts.membrane) dynamicParts.membrane = body;

    const nuc = tag(new THREE.Mesh(sphereSmall, mat({baseColor: '#6b9485', rimColor: '#cdecd9', opacity: 0.82})), 'nucleus', 2);
    nuc.scale.set(0.11, 0.09, 0.07);
    group.add(nuc);

    const cv = tag(new THREE.Mesh(sphereSmall, mat({baseColor: '#255a66', rimColor: '#b7f6ec', opacity: 0.72})), 'vacuole_contractile', 4);
    cv.scale.setScalar(0.065);
    cv.position.set(-0.14, 0.08, 0.02);
    group.add(cv);
    dynamicParts.contractileVacuoles = [cv];

  } else if (speciesId === 'diatom' || speciesId === 'closterium' || speciesId === 'desmid') {
    const isCentric = speciesId === 'diatom' && agent.morphVariant % 3 === 1;
    let bodyGeo;
    if (speciesId === 'closterium') bodyGeo = getCrescentGeo();
    else if (isCentric) bodyGeo = cachedGeo('centric-diatom', () => new THREE.CylinderGeometry(0.42, 0.42, 0.18, 24, 1).rotateX(Math.PI * 0.5));
    else if (speciesId === 'desmid') bodyGeo = cachedGeo('desmid-geo', () => new THREE.SphereGeometry(0.44, 24, 14).scale(1.15, 0.95, 0.25));
    else bodyGeo = getNavicularGeo();

    const shell = tag(new THREE.Mesh(bodyGeo, mat({
      baseColor: speciesId === 'diatom' ? '#665b36' : '#3a7a4c',
      rimColor: speciesId === 'diatom' ? '#e7d294' : '#9ee5b4',
      opacity: 0.70,
      striae: speciesId === 'diatom' ? 1.0 : 0.0,
      noiseScale: 12.0,
      deformAmp: 0,
    })), speciesId === 'diatom' ? 'frustule' : 'cell_wall', 5);
    group.add(shell);
    dynamicParts.membrane = shell;

    // Cloroplastos internos (2 lobos simétricos)
    for (const side of [-1, 1]) {
      const chloro = tag(new THREE.Mesh(sphereSmall, mat({
        baseColor: speciesId === 'diatom' ? '#9e7c33' : '#4a9e5a',
        rimColor: speciesId === 'diatom' ? '#e5c470' : '#92e8a1',
        opacity: 0.85,
        deformAmp: 0,
      })), 'chloroplast', 1);
      chloro.scale.set(isCentric ? 0.14 : 0.26, 0.11, 0.06);
      chloro.position.set(side * (isCentric ? 0.15 : 0.30), 0, 0);
      group.add(chloro);
    }

  } else if (speciesId === 'volvox') {
    const outer = tag(new THREE.Mesh(sphereMed, mat({
      baseColor: '#2d6847',
      rimColor: '#98e6b4',
      opacity: 0.38,
      deformAmp: 0.008,
      noiseScale: 5.0,
    })), 'membrane', 3);
    outer.scale.setScalar(0.48);
    group.add(outer);
    dynamicParts.membrane = outer;

    // Colônias-filhas internas
    for (const [dx, dy, dz, r] of [[-0.14, 0.08, 0.05, 0.12], [0.15, -0.09, -0.06, 0.10], [0.02, -0.14, 0.10, 0.085], [-0.08, -0.06, -0.14, 0.09]]) {
      const daughter = tag(new THREE.Mesh(sphereSmall, mat({
        baseColor: '#489e64',
        rimColor: '#b7f5ca',
        opacity: 0.78,
        deformAmp: 0.005,
      })), 'chloroplast', 1);
      daughter.scale.setScalar(r);
      daughter.position.set(dx, dy, dz);
      group.add(daughter);
    }

    // Células somáticas periféricas instanciadas (LOD adaptativo)
    const cellCount = qualityProfile === 'low' ? 42 : qualityProfile === 'medium' ? 78 : 120;
    const cellMesh = tag(new THREE.InstancedMesh(sphereSmall, mat({
      baseColor: '#58b874',
      rimColor: '#c3f7d2',
      opacity: 0.88,
      deformAmp: 0,
    }), cellCount), 'chloroplast', 1);
    const dummy = new THREE.Object3D();
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < cellCount; i++) {
      const y = 1 - (i / (cellCount - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      dummy.position.set(Math.cos(theta) * radiusAtY * 0.455, y * 0.455, Math.sin(theta) * radiusAtY * 0.455);
      dummy.scale.setScalar(0.022);
      dummy.updateMatrix();
      cellMesh.setMatrixAt(i, dummy.matrix);
    }
    cellMesh.instanceMatrix.needsUpdate = true;
    group.add(cellMesh);

  } else if (speciesId === 'spirogyra' || speciesId === 'cyanobacteria' || speciesId === 'nematode') {
    const segCount = (agent.chain?.length || 9) - 1;
    const isNematode = speciesId === 'nematode';
    const isCyano = speciesId === 'cyanobacteria';
    const segMat = mat({
      baseColor: isNematode ? '#7c7666' : isCyano ? '#2d7a72' : '#3a844f',
      rimColor: isNematode ? '#d8d2be' : isCyano ? '#88e2d8' : '#9ae8aa',
      opacity: isNematode ? 0.66 : 0.74,
      striae: isCyano ? 1.0 : 0.0,
      deformAmp: 0,
    });
    const segMesh = tag(new THREE.InstancedMesh(cylSeg, segMat, segCount), isNematode ? 'cuticle' : 'cell_wall', isNematode ? 5 : 1);
    group.add(segMesh);
    dynamicParts.filamentSegments = segMesh;
    dynamicParts.filamentCount = segCount;
    dynamicParts.membrane = segMesh;

    if (isNematode) {
      // Tubo digestivo interno
      const gutMat = mat({baseColor: '#8d6c45', rimColor: '#cdb082', opacity: 0.72, deformAmp: 0});
      const gutMesh = tag(new THREE.InstancedMesh(cylSeg, gutMat, segCount), 'digestive', 4);
      group.add(gutMesh);
      dynamicParts.gutSegments = gutMesh;
    }

  } else if (speciesId === 'tardigrade') {
    const bodyMat = mat({baseColor: '#767a6e', rimColor: '#d7dfd1', opacity: 0.64, deformAmp: 0.012, noiseScale: 8.0});
    const segments = [];
    for (let i = 0; i < 4; i++) {
      const seg = tag(new THREE.Mesh(sphereSmall, bodyMat), 'cuticle', 5);
      const r = i === 0 ? 0.14 : i === 3 ? 0.13 : 0.16;
      seg.scale.set(0.18, r, r * 0.9);
      seg.position.set((1.5 - i) * 0.19, 0, 0);
      group.add(seg);
      segments.push(seg);
    }
    dynamicParts.membrane = segments[1];
    // 4 pares de patas com garras
    const legs = [];
    for (let i = 0; i < 4; i++) {
      for (const side of [-1, 1]) {
        const leg = tag(new THREE.Mesh(cylSeg, bodyMat), 'cuticle', 5);
        leg.scale.set(0.036, 0.13, 0.036);
        leg.position.set((1.3 - i) * 0.18, side * 0.14, -0.04);
        leg.rotation.z = side * 0.55;
        group.add(leg);
        legs.push({mesh: leg, index: i, side});
      }
    }
    dynamicParts.legs = legs;
    // Faringe muscular
    const pharynx = tag(new THREE.Mesh(sphereSmall, mat({baseColor: '#8c694a', rimColor: '#d8b791', opacity: 0.85})), 'digestive', 4);
    pharynx.scale.set(0.08, 0.06, 0.06);
    pharynx.position.set(0.24, 0, 0);
    group.add(pharynx);

  } else if (speciesId === 'rotifer') {
    const bodyMat = mat({baseColor: '#56787e', rimColor: '#c3e9ef', opacity: 0.58, deformAmp: 0.014});
    const trunk = tag(new THREE.Mesh(sphereMed, bodyMat), 'cuticle', 5);
    trunk.scale.set(0.38, 0.17, 0.16);
    group.add(trunk);
    dynamicParts.membrane = trunk;
    // Coroa ciliada dupla anterior
    const coronaGeo = cachedGeo('corona', () => new THREE.TorusGeometry(0.11, 0.025, 8, 16));
    const corona = tag(new THREE.Mesh(coronaGeo, mat({baseColor: '#8cd8de', rimColor: '#e2fcfc', opacity: 0.82})), 'cilia', 3);
    corona.position.set(0.39, 0, 0);
    corona.rotation.y = Math.PI * 0.5;
    group.add(corona);
    dynamicParts.corona = corona;
    // Mastax pulsante interno
    const mastax = tag(new THREE.Mesh(sphereSmall, mat({baseColor: '#b08654', rimColor: '#ecd19c', opacity: 0.88})), 'digestive', 4);
    mastax.scale.setScalar(0.065);
    mastax.position.set(0.14, 0, 0);
    group.add(mastax);
    dynamicParts.mastax = mastax;

  } else if (speciesId === 'vorticella' || speciesId === 'stentor') {
    const isVorticella = speciesId === 'vorticella';
    const bellGeo = cachedGeo('bell', () => new THREE.CylinderGeometry(0.24, 0.07, 0.38, 18, 1, false).rotateZ(-Math.PI * 0.5));
    const bell = tag(new THREE.Mesh(bellGeo, mat({
      baseColor: isVorticella ? '#4b7b82' : '#326d7b',
      rimColor: '#b6f2ef',
      opacity: 0.62,
      deformAmp: 0.015,
    })), 'membrane', 3);
    bell.position.set(isVorticella ? 0.25 : 0.1, 0, 0);
    group.add(bell);
    dynamicParts.membrane = bell;
    dynamicParts.bell = bell;

    if (isVorticella) {
      const stalk = tag(new THREE.Mesh(cylSeg, mat({baseColor: '#76b5ba', rimColor: '#ccf7f4', opacity: 0.78})), 'cuticle', 5);
      stalk.scale.set(0.018, 0.65, 0.018);
      stalk.rotation.z = Math.PI * 0.5;
      stalk.position.set(-0.22, 0, 0);
      group.add(stalk);
      dynamicParts.stalk = stalk;
    }

  } else if (speciesId === 'euglena' || speciesId === 'chlamydomonas') {
    const isEuglena = speciesId === 'euglena';
    const body = tag(new THREE.Mesh(sphereMed, mat({
      baseColor: '#3f8a52',
      rimColor: '#9ef0b0',
      opacity: 0.68,
      deformAmp: isEuglena ? 0.025 : 0.006,
      phase: agent.phase,
    })), 'chloroplast', 1);
    body.scale.set(isEuglena ? 0.42 : 0.28, isEuglena ? 0.15 : 0.22, isEuglena ? 0.14 : 0.22);
    group.add(body);
    dynamicParts.membrane = body;

    // Estigma vermelho (mancha ocelar)
    const stigma = tag(new THREE.Mesh(sphereSmall, mat({baseColor: '#d9483b', rimColor: '#ff9687', opacity: 0.95})), 'stigma', 4);
    stigma.scale.setScalar(0.035);
    stigma.position.set(isEuglena ? 0.26 : 0.14, 0.06, 0.04);
    group.add(stigma);

    // Flagelo anterior
    const flag = tag(new THREE.Mesh(cylSeg, mat({baseColor: '#91e3c4', rimColor: '#dcfff0', opacity: 0.72})), 'flagella', 3);
    flag.scale.set(0.012, 0.36, 0.012);
    flag.rotation.z = Math.PI * 0.5;
    flag.position.set(isEuglena ? 0.55 : 0.40, 0, 0);
    group.add(flag);
    dynamicParts.flagellum = flag;

  } else {
    // Bactérias (bacillus, spirillum)
    const isSpirillum = speciesId === 'spirillum';
    const geo = isSpirillum ? getSpiralGeo() : cachedGeo('rod', () => new THREE.CapsuleGeometry(0.11, 0.42, 4, 10).rotateZ(Math.PI * 0.5));
    const rod = tag(new THREE.Mesh(geo, mat({
      baseColor: '#699992',
      rimColor: '#c9f3ec',
      opacity: 0.76,
      deformAmp: 0,
    })), 'cell_wall', 5);
    group.add(rod);
    dynamicParts.membrane = rod;
  }

  const highlightables = [];
  group.traverse((child) => {
    if (child.isMesh && child.material?.uniforms?.uHighlight) highlightables.push(child);
  });

  return {group, materials, dynamicParts, highlightables};
}

const scratchDummy = new THREE.Object3D();
const scratchV1 = new THREE.Vector3();
const scratchV2 = new THREE.Vector3();
const scratchDir = new THREE.Vector3();
const scratchUp = new THREE.Vector3(0, 1, 0);

export function updateOrganismAssembly(assembly, agent, time, blur, light, highlightOrganelleId, membraneAlphaScale = 1.0) {
  const {group, materials, dynamicParts} = assembly;
  const s = agent.size;

  // Filamentos/Nematódeos posicionados diretamente pelas cadeias de pontos em coordenadas de mundo
  if (dynamicParts.filamentSegments && agent.chain) {
    group.position.set(0, 0, 0);
    group.rotation.set(0, 0, 0);
    group.scale.set(1, 1, 1);
    const pts = agent.chain;
    const thick = agent.speciesId === 'nematode' ? 0.095 : agent.speciesId === 'cyanobacteria' ? 0.075 : 0.125;
    for (let i = 0; i < dynamicParts.filamentCount; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      scratchV1.set(a.x, a.y, a.z);
      scratchV2.set(b.x, b.y, b.z);
      scratchDir.subVectors(scratchV2, scratchV1);
      const len = scratchDir.length() || 0.001;
      scratchDummy.position.copy(scratchV1).addScaledVector(scratchDir, 0.5);
      scratchDummy.quaternion.setFromUnitVectors(scratchUp, scratchDir.normalize());
      const taper = agent.speciesId === 'nematode' ? Math.sin(((i + 0.5) / dynamicParts.filamentCount) * Math.PI) * 0.85 + 0.25 : 1.0;
      scratchDummy.scale.set(thick * taper, len * 1.04, thick * taper);
      scratchDummy.updateMatrix();
      dynamicParts.filamentSegments.setMatrixAt(i, scratchDummy.matrix);
      if (dynamicParts.gutSegments) {
        scratchDummy.scale.set(thick * taper * 0.45, len * 1.02, thick * taper * 0.45);
        scratchDummy.updateMatrix();
        dynamicParts.gutSegments.setMatrixAt(i, scratchDummy.matrix);
      }
    }
    dynamicParts.filamentSegments.instanceMatrix.needsUpdate = true;
    if (dynamicParts.gutSegments) dynamicParts.gutSegments.instanceMatrix.needsUpdate = true;
  } else {
    group.scale.setScalar(s);
  }

  // Cílios metacrônicos
  if (dynamicParts.ciliaMesh && dynamicParts.ciliaData) {
    const data = dynamicParts.ciliaData;
    for (let i = 0; i < data.length; i++) {
      const c = data[i];
      const beat = Math.sin(time * 13.0 - c.phaseOffset) * 0.55;
      scratchDummy.position.set(c.x, c.y, c.z);
      scratchDummy.rotation.set(0, 0, c.angle - Math.PI * 0.5 + beat);
      scratchDummy.scale.setScalar(1);
      scratchDummy.updateMatrix();
      dynamicParts.ciliaMesh.setMatrixAt(i, scratchDummy.matrix);
    }
    dynamicParts.ciliaMesh.instanceMatrix.needsUpdate = true;
  }

  // Ameba: deformação de pseudópodes conservando volume
  if (dynamicParts.amoebaGeo && agent.lobes) {
    const pos = dynamicParts.amoebaGeo.attributes.position;
    const base = dynamicParts.amoebaBase;
    const lobes = agent.lobes;
    const n = lobes.length;
    for (let i = 0; i < pos.count; i++) {
      const bx = base[i * 3];
      const by = base[i * 3 + 1];
      const bz = base[i * 3 + 2];
      const theta = Math.atan2(by, bx);
      const normAngle = ((theta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const fIdx = (normAngle / (Math.PI * 2)) * n;
      const i0 = Math.floor(fIdx) % n;
      const i1 = (i0 + 1) % n;
      const frac = fIdx - Math.floor(fIdx);
      const lobeScale = lobes[i0] * (1 - frac) + lobes[i1] * frac;
      pos.setXYZ(i, bx * lobeScale, by * lobeScale, bz * (0.78 + 0.15 / lobeScale));
    }
    pos.needsUpdate = true;
    dynamicParts.amoebaGeo.computeVertexNormals();
  }

  // Vacúolos contráteis pulsantes
  if (dynamicParts.contractileVacuoles) {
    dynamicParts.contractileVacuoles.forEach((cv, idx) => {
      const pulse = 0.55 + 0.45 * Math.pow(Math.sin(time * 1.15 + idx * Math.PI * 0.5 + agent.phase) * 0.5 + 0.5, 2);
      cv.scale.setScalar(0.08 * pulse);
    });
  }

  // Vacúolos alimentares após ingestão
  if (dynamicParts.foodVacuoles && agent.vacuoles) {
    dynamicParts.foodVacuoles.forEach((fv, idx) => {
      const v = agent.vacuoles[idx];
      if (v) {
        fv.visible = true;
        fv.position.set(v.x, v.y, 0.04);
        fv.scale.setScalar(0.065 * (1 - v.digestion * 0.45));
      } else {
        fv.visible = false;
      }
    });
  }

  // Tardígrado: patas articuladas
  if (dynamicParts.legs) {
    for (const leg of dynamicParts.legs) {
      const stride = Math.sin(time * 3.8 + leg.index * 1.4 + (leg.side > 0 ? 0 : Math.PI)) * 0.35;
      leg.mesh.rotation.z = leg.side * 0.55 + stride;
    }
  }

  // Rotífero: rotação da coroa e pulsação do mastax
  if (dynamicParts.corona) {
    dynamicParts.corona.rotation.x = time * 8.5;
  }
  if (dynamicParts.mastax) {
    const chew = 0.85 + Math.sin(time * 9.0) * 0.22;
    dynamicParts.mastax.scale.set(0.07 * chew, 0.06 / chew, 0.06);
  }

  // Vorticela: extensão/contração do pedúnculo
  if (dynamicParts.stalk && dynamicParts.bell) {
    const ext = agent.stalkExtension ?? 1.0;
    dynamicParts.stalk.scale.y = 0.65 * ext;
    dynamicParts.stalk.position.x = -0.22 * ext;
    dynamicParts.bell.position.x = 0.25 * ext;
  }

  // Flagelo de Euglena / Clamidomonas
  if (dynamicParts.flagellum) {
    dynamicParts.flagellum.rotation.y = Math.sin(time * 12.0 + agent.phase) * 0.45;
  }

  // Atualiza uniforms de foco, luz, constrição de divisão e destaque anatômico
  for (const m of materials) {
    m.uniforms.uBlur.value = blur;
    m.uniforms.uLight.value = light;
    m.uniforms.uConstriction.value = agent.divisionProgress || 0;
    m.uniforms.uFlash.value = agent.captureProgress > 0.1 ? agent.captureProgress * 0.4 : 0;
  }
  for (let i = 0; i < assembly.highlightables.length; i++) {
    const child = assembly.highlightables[i];
    const isTarget = highlightOrganelleId && child.userData.organelleId === highlightOrganelleId;
    child.material.uniforms.uHighlight.value = isTarget ? 1.0 : 0.0;
    if (child.userData.organelleId === 'membrane' || child.userData.organelleId === 'cuticle') {
      child.material.uniforms.uOpacity.value = 0.58 * membraneAlphaScale;
    }
  }
}
