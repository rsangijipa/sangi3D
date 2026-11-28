/**
 * js/shell-geometry.js
 * Gerador paramétrico de concha marinha em espiral logarítmica com:
 *  - Parede dupla contínua e estanque (casca externa calcificada + nácar interno + lábio fechado) -> T01
 *  - Modo Corte Anatômico com paredes de seção fechadas + septos camerais curvos e sifúnculo -> T02
 *  - Escultura radial de costelas sincronizada às coordenadas (u, v)
 */
import * as THREE from 'three';
import { TEXTURE_STYLES } from './state.js';

function computeMorphConstants(params) {
  const maxTheta = params.spiralTurns * Math.PI * 2;
  // Vincula a taxa de expansão logarítmica b à abertura para evitar auto-interseção das voltas (Raup)
  const tubeFactor = 0.40 + params.aperture * 0.36;
  const b = 0.165 + (params.aperture - 0.30) * 0.115;
  // Normaliza para que o espécime inteiro caiba na bandeja de museu (~1.7m * escala)
  const normScale = (0.78 * params.scaleRatio) / Math.max(1.0, Math.exp(b * maxTheta));
  return { maxTheta, b, tubeFactor, normScale };
}

function evalShellPoint(theta, phi, params, morph, ribAmp, ribFreq, radiusOffset = 0) {
  const { b, tubeFactor, normScale } = morph;

  // Raio logarítmico normalizado da linha central da espira
  const R = normScale * Math.exp(b * theta);
  const tubeBase = R * tubeFactor;
  const tipFade = Math.min(1, Math.max(0.05, theta / 1.1));

  // Costelas / pregas de crescimento alinhadas ao longo da espiral
  const rib =
    ribAmp *
    tubeBase *
    (0.5 + 0.5 * Math.sin(theta * ribFreq)) *
    Math.sin(phi * 2.0 + 0.4) *
    0.55;

  const rTube = Math.max(0.004, (tubeBase + rib) * tipFade + radiusOffset);

  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);
  const radXZ = R + rTube * cosPhi;
  const x = radXZ * Math.cos(theta);
  const z = radXZ * Math.sin(theta);
  const yCenter = params.spirePitch * R * 1.35;
  const y = yCenter + rTube * sinPhi * 0.88;

  return { x, y, z, R, rTube, yCenter };
}

function buildWallGridGeometry(thetaVals, phiVals, params, morph, ribAmp, ribFreq, offsetFn, flipWinding) {
  const nU = thetaVals.length;
  const nV = phiVals.length;
  const positions = new Float32Array(nU * nV * 3);
  const uvs = new Float32Array(nU * nV * 2);
  const indices = [];

  for (let iu = 0; iu < nU; iu++) {
    const theta = thetaVals[iu];
    const u = iu / Math.max(1, nU - 1);
    for (let iv = 0; iv < nV; iv++) {
      const phi = phiVals[iv];
      const v = iv / Math.max(1, nV - 1);
      const off = offsetFn(theta, phi, u, v);
      const pt = evalShellPoint(theta, phi, params, morph, ribAmp, ribFreq, off);

      const idx = iu * nV + iv;
      positions[idx * 3] = pt.x;
      positions[idx * 3 + 1] = pt.y;
      positions[idx * 3 + 2] = pt.z;
      uvs[idx * 2] = u;
      uvs[idx * 2 + 1] = v;
    }
  }

  for (let iu = 0; iu < nU - 1; iu++) {
    for (let iv = 0; iv < nV - 1; iv++) {
      const a = iu * nV + iv;
      const b = (iu + 1) * nV + iv;
      const c = (iu + 1) * nV + (iv + 1);
      const d = iu * nV + (iv + 1);
      if (!flipWinding) {
        indices.push(a, b, d, b, c, d);
      } else {
        indices.push(a, d, b, b, d, c);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function buildCutSeamStrip(thetaVals, phiConst, params, morph, ribAmp, ribFreq, wallThick) {
  const nU = thetaVals.length;
  const positions = new Float32Array(nU * 2 * 3);
  const uvs = new Float32Array(nU * 2 * 2);
  const indices = [];

  for (let iu = 0; iu < nU; iu++) {
    const theta = thetaVals[iu];
    const u = iu / Math.max(1, nU - 1);
    const ptOut = evalShellPoint(theta, phiConst, params, morph, ribAmp, ribFreq, 0);
    const thick = Math.min(wallThick, ptOut.rTube * 0.30);
    const ptIn = evalShellPoint(theta, phiConst, params, morph, ribAmp * 0.15, ribFreq, -thick);

    const i0 = iu * 2;
    positions[i0 * 3] = ptOut.x;
    positions[i0 * 3 + 1] = ptOut.y;
    positions[i0 * 3 + 2] = ptOut.z;
    uvs[i0 * 2] = u;
    uvs[i0 * 2 + 1] = 0;

    const i1 = i0 + 1;
    positions[i1 * 3] = ptIn.x;
    positions[i1 * 3 + 1] = ptIn.y;
    positions[i1 * 3 + 2] = ptIn.z;
    uvs[i1 * 2] = u;
    uvs[i1 * 2 + 1] = 1;
  }

  for (let iu = 0; iu < nU - 1; iu++) {
    const a = iu * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    indices.push(a, b, c, b, d, c);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function buildLipSealGeometry(thetaEnd, phiVals, params, morph, ribAmp, ribFreq, wallThick) {
  const nV = phiVals.length;
  const positions = new Float32Array(nV * 2 * 3);
  const uvs = new Float32Array(nV * 2 * 2);
  const indices = [];

  for (let iv = 0; iv < nV; iv++) {
    const phi = phiVals[iv];
    const v = iv / Math.max(1, nV - 1);
    const ptOut = evalShellPoint(thetaEnd, phi, params, morph, ribAmp, ribFreq, 0);
    const thick = Math.min(wallThick, ptOut.rTube * 0.30);
    const ptIn = evalShellPoint(thetaEnd, phi, params, morph, ribAmp * 0.15, ribFreq, -thick);

    const i0 = iv * 2;
    positions[i0 * 3] = ptOut.x;
    positions[i0 * 3 + 1] = ptOut.y;
    positions[i0 * 3 + 2] = ptOut.z;
    uvs[i0 * 2] = 0;
    uvs[i0 * 2 + 1] = v;

    const i1 = i0 + 1;
    positions[i1 * 3] = ptIn.x;
    positions[i1 * 3 + 1] = ptIn.y;
    positions[i1 * 3 + 2] = ptIn.z;
    uvs[i1 * 2] = 1;
    uvs[i1 * 2 + 1] = v;
  }

  for (let iv = 0; iv < nV - 1; iv++) {
    const a = iv * 2;
    const b = a + 1;
    const c = a + 2;
    const d = a + 3;
    indices.push(a, c, b, b, c, d);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function buildSeptumChamberPartition(theta, phiStart, phiEnd, params, morph, wallThick) {
  // Septo côncavo interno em forma de lua/arco que divide as câmaras do Náutilo (T02)
  const segR = 8;
  const segPhi = 16;
  const positions = [];
  const indices = [];

  for (let ir = 0; ir <= segR; ir++) {
    const f = ir / segR;
    for (let ip = 0; ip <= segPhi; ip++) {
      const phi = phiStart + (ip / segPhi) * (phiEnd - phiStart);
      const curveTheta = theta - (1 - f * f) * 0.24;
      const base = evalShellPoint(curveTheta, phi, params, morph, 0, 1, 0);
      const maxR = Math.max(0.004, base.rTube - Math.min(wallThick, base.rTube * 0.30));
      const rLoc = maxR * f;

      const radXZ = base.R + rLoc * Math.cos(phi);
      const x = radXZ * Math.cos(curveTheta);
      const z = radXZ * Math.sin(curveTheta);
      const y = base.yCenter + rLoc * Math.sin(phi) * 0.88;
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

export function createParametricShellController(parentGroup, mats) {
  const shellRoot = new THREE.Group();
  parentGroup.add(shellRoot);

  const septaGroup = new THREE.Group();
  shellRoot.add(septaGroup);

  let activeMeshes = [];
  let activeGeos = [];
  let lastMetrics = {
    vertexCount: 0,
    chamberCount: 0,
    width: 1,
    height: 1,
    depth: 1,
    ratioWH: 1,
  };

  function clearCurrent() {
    activeMeshes.forEach((m) => shellRoot.remove(m));
    activeGeos.forEach((g) => g.dispose());
    while (septaGroup.children.length) {
      const ch = septaGroup.children[0];
      septaGroup.remove(ch);
      if (ch.geometry) ch.geometry.dispose();
    }
    activeMeshes = [];
    activeGeos = [];
  }

  function rebuild(params, segU = 120, segV = 30) {
    clearCurrent();
    // CRÍTICO: zerar translação antes de medir BoundingBox para não acumular deslocamentos!
    shellRoot.position.set(0, 0, 0);

    const texSpec = TEXTURE_STYLES[params.textureStyle] || TEXTURE_STYLES.banded;
    const ribAmp = texSpec.ribAmp;
    const ribFreq = texSpec.ribFreq;
    const morph = computeMorphConstants(params);
    const { maxTheta } = morph;
    const wallThick = 0.022 * params.scaleRatio;

    const thetaVals = [];
    for (let i = 0; i <= segU; i++) {
      thetaVals.push(0.2 + (i / segU) * (maxTheta - 0.2));
    }

    const isCut = Boolean(params.cutaway);
    const phiStart = isCut ? Math.PI * 0.96 : 0;
    const phiEnd = isCut ? Math.PI * 2.04 : Math.PI * 2;
    const phiVals = [];
    for (let j = 0; j <= segV; j++) {
      phiVals.push(phiStart + (j / segV) * (phiEnd - phiStart));
    }

    // 1. Casca Externa Calcificada (normais apontam para FORA -> flipWinding = true)
    const outerGeo = buildWallGridGeometry(
      thetaVals,
      phiVals,
      params,
      morph,
      ribAmp,
      ribFreq,
      () => 0,
      true
    );
    const outerMesh = new THREE.Mesh(outerGeo, mats.outerShellMat);
    outerMesh.castShadow = true;
    outerMesh.receiveShadow = true;

    // 2. Casca Interna em Madrepérola Iridescente (normais apontam para DENTRO das câmaras -> flipWinding = false)
    const innerGeo = buildWallGridGeometry(
      thetaVals,
      phiVals,
      params,
      morph,
      ribAmp * 0.15,
      ribFreq,
      (theta, phi) => {
        const pt = evalShellPoint(theta, phi, params, morph, ribAmp, ribFreq, 0);
        return -Math.min(wallThick, pt.rTube * 0.30);
      },
      false
    );
    const innerMesh = new THREE.Mesh(innerGeo, mats.nacreMat);
    innerMesh.receiveShadow = true;

    // 3. Lábio da Abertura selando casca externa e interna
    const lipGeo = buildLipSealGeometry(
      thetaVals[thetaVals.length - 1],
      phiVals,
      params,
      morph,
      ribAmp,
      ribFreq,
      wallThick
    );
    const lipMesh = new THREE.Mesh(lipGeo, mats.cutRimMat);
    lipMesh.castShadow = true;
    lipMesh.receiveShadow = true;

    shellRoot.add(outerMesh, innerMesh, lipMesh);
    activeGeos.push(outerGeo, innerGeo, lipGeo);
    activeMeshes.push(outerMesh, innerMesh, lipMesh);

    let chamberCount = 0;
    if (isCut) {
      const seamA = buildCutSeamStrip(thetaVals, phiStart, params, morph, ribAmp, ribFreq, wallThick);
      const seamB = buildCutSeamStrip(thetaVals, phiEnd, params, morph, ribAmp, ribFreq, wallThick);
      const mA = new THREE.Mesh(seamA, mats.cutRimMat);
      const mB = new THREE.Mesh(seamB, mats.cutRimMat);
      mA.castShadow = true;
      mB.castShadow = true;
      shellRoot.add(mA, mB);
      activeGeos.push(seamA, seamB);
      activeMeshes.push(mA, mB);

      const chamberLimit = maxTheta - 1.35;
      for (let t = 1.6; t < chamberLimit; t += 0.44) {
        const septGeo = buildSeptumChamberPartition(t, phiStart, phiEnd, params, morph, wallThick);
        const septMesh = new THREE.Mesh(septGeo, mats.nacreMat);
        septMesh.receiveShadow = true;
        septMesh.castShadow = true;
        septaGroup.add(septMesh);
        chamberCount++;
      }
    }

    // Centraliza e pousa suavemente sobre o leito de areia (y_min ≈ 0.03)
    shellRoot.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(shellRoot);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    shellRoot.position.set(-center.x, -box.min.y + 0.03, -center.z);

    lastMetrics = {
      vertexCount: outerGeo.attributes.position.count + innerGeo.attributes.position.count,
      chamberCount,
      width: Number(size.x.toFixed(2)),
      height: Number(size.y.toFixed(2)),
      depth: Number(size.z.toFixed(2)),
      ratioWH: Number((size.x / Math.max(0.05, size.z)).toFixed(2)),
    };

    return lastMetrics;
  }

  return {
    shellRoot,
    septaGroup,
    rebuild,
    getMetrics: () => lastMetrics,
    getMeshCount: () => activeMeshes.length + septaGroup.children.length,
    dispose() {
      clearCurrent();
    },
  };
}
