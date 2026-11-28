/**
 * js/shell-geometry.js
 * Gerador procedural de alta fidelidade para conchas e moluscos marinhos.
 * Implementa modelos morfológicos paramétricos de Raup e Cortie expandidos:
 *  - 10 famílias morfológicas: Náutilo, Amonite, Turritela, Conus, Murex, Vieira, Ostra, Abalone, Búzio e Cypraea
 *  - Parede dupla contínua (exterior calcificado + interior nacarado)
 *  - Lábio da abertura selado, estrias de crescimento e ornamentação
 *  - Espinhos curvados periódicos (Murex), poros respiratórios (Abalone), dentes labiais (Cypraea) e concha dupla em leque (Vieira/Ostra)
 */
import * as THREE from 'three';
import { SHELL_SPECIES } from './shell-species.js';

export function computeSpeciesMorphConstants(speciesId, params) {
  const spec = SHELL_SPECIES[speciesId] || SHELL_SPECIES.nautilus;
  const turns = params.spiralTurns ?? spec.defaultParams.spiralTurns;
  const maxTheta = turns * Math.PI * 2;
  const aperture = params.aperture ?? spec.defaultParams.aperture;
  const scaleRatio = params.scaleRatio ?? spec.defaultParams.scaleRatio;
  const spirePitch = params.spirePitch ?? spec.defaultParams.spirePitch;

  let b = 0.165 + (aperture - 0.3) * 0.11;
  let tubeFactor = 0.4 + aperture * 0.36;

  // Ajustes morfométricos específicos de cada família
  if (speciesId === 'turritella') {
    b = 0.055 + aperture * 0.04;
    tubeFactor = 0.22 + aperture * 0.15;
  } else if (speciesId === 'conus') {
    b = 0.12 + aperture * 0.06;
    tubeFactor = 0.45 + aperture * 0.28;
  } else if (speciesId === 'abalone') {
    b = 0.32 + aperture * 0.14;
    tubeFactor = 0.65 + aperture * 0.45;
  } else if (speciesId === 'scallop' || speciesId === 'oyster') {
    b = 0.22 + aperture * 0.12;
    tubeFactor = 0.55 + aperture * 0.35;
  } else if (speciesId === 'cypraea') {
    b = 0.14 + aperture * 0.08;
    tubeFactor = 0.58 + aperture * 0.32;
  }

  const normScale = (0.78 * scaleRatio) / Math.max(1.0, Math.exp(b * maxTheta));
  return { speciesId, maxTheta, b, tubeFactor, normScale, spirePitch, scaleRatio };
}

export function evalShellPoint(theta, phi, params, morph, offsetRadius = 0) {
  const { speciesId, b, tubeFactor, normScale, spirePitch } = morph;
  const ribAmp = params.ribsIntensity ?? 0.02;
  const ribFreq = params.ribsCount ?? 18;
  const spinesAmp = params.spinesIntensity ?? 0.0;

  // Linha central logarítmica
  const R = normScale * Math.exp(b * theta);
  const tubeBase = R * tubeFactor;
  const tipFade = Math.min(1.0, Math.max(0.04, theta / 1.1));

  // 1. Modulação de costelas e ornamentações
  let rib = 0;
  if (speciesId === 'ammonite') {
    // Costelas radiais bifurcadas na periferia
    rib = ribAmp * tubeBase * Math.sin(theta * ribFreq) * (0.8 + 0.4 * Math.sin(phi * 2.0));
  } else if (speciesId === 'scallop') {
    // Costelas em leque proeminentes
    rib = ribAmp * tubeBase * Math.sin(phi * ribFreq) * 1.2;
  } else if (speciesId === 'oyster') {
    // Lamelas irregulares onduladas
    rib = ribAmp * tubeBase * (Math.sin(theta * 8.0) * 0.5 + Math.sin(phi * 12.0) * 0.7);
  } else {
    rib = ribAmp * tubeBase * (0.5 + 0.5 * Math.sin(theta * ribFreq)) * Math.sin(phi * 2.0 + 0.4) * 0.5;
  }

  // 2. Espinhos do Murex nas varizes a cada 120 graus
  let spine = 0;
  if (spinesAmp > 0.001) {
    const varicePhase = Math.sin(theta * 3.0);
    if (varicePhase > 0.7 && phi > Math.PI * 0.2 && phi < Math.PI * 0.8) {
      spine = spinesAmp * tubeBase * 2.8 * Math.pow(varicePhase - 0.7, 1.8) * Math.sin(phi * 3.0);
    }
  }

  const rTube = Math.max(0.003, (tubeBase + rib + spine) * tipFade + offsetRadius);

  // 3. Deformação elíptica da seção transversal
  let cosPhi = Math.cos(phi);
  let sinPhi = Math.sin(phi);

  if (speciesId === 'abalone') {
    // Seção ultra achatada em orelha
    cosPhi *= 1.45;
    sinPhi *= 0.48;
  } else if (speciesId === 'conus') {
    // Cone de ombro anguloso
    cosPhi *= 1.15;
    sinPhi *= 1.35;
  } else if (speciesId === 'cypraea') {
    // Dorso abobadado e base plana
    sinPhi *= sinPhi > 0 ? 1.35 : 0.75;
    cosPhi *= 1.1;
  }

  const radXZ = R + rTube * cosPhi;
  const x = radXZ * Math.cos(theta);
  const z = radXZ * Math.sin(theta);

  // Elevação helicoidal
  let yCenter = spirePitch * R * 1.35;
  if (speciesId === 'turritella') {
    yCenter = spirePitch * (theta / morph.maxTheta) * 2.4 * morph.scaleRatio;
  } else if (speciesId === 'conus') {
    yCenter = spirePitch * (theta / morph.maxTheta) * 0.8 * morph.scaleRatio;
  }

  const y = yCenter + rTube * sinPhi * 0.9;
  return { x, y, z, R, rTube, yCenter, cosPhi, sinPhi };
}

export function buildWallGridGeometry(thetaVals, phiVals, params, morph, offsetFn, flipWinding) {
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
      const pt = evalShellPoint(theta, phi, params, morph, off);

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

export function buildSeamStrip(thetaVals, phiConst, params, morph, wallThick) {
  const nU = thetaVals.length;
  const positions = new Float32Array(nU * 2 * 3);
  const uvs = new Float32Array(nU * 2 * 2);
  const indices = [];

  for (let iu = 0; iu < nU; iu++) {
    const theta = thetaVals[iu];
    const u = iu / Math.max(1, nU - 1);
    const ptOut = evalShellPoint(theta, phiConst, params, morph, 0);
    const thick = Math.min(wallThick, ptOut.rTube * 0.32);
    const ptIn = evalShellPoint(theta, phiConst, params, morph, -thick);

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

export function buildLipSealGeometry(thetaEnd, phiVals, params, morph, wallThick) {
  const nV = phiVals.length;
  const positions = new Float32Array(nV * 2 * 3);
  const uvs = new Float32Array(nV * 2 * 2);
  const indices = [];

  for (let iv = 0; iv < nV; iv++) {
    const phi = phiVals[iv];
    const v = iv / Math.max(1, nV - 1);
    const ptOut = evalShellPoint(thetaEnd, phi, params, morph, 0);
    const thick = Math.min(wallThick, ptOut.rTube * 0.32);
    const ptIn = evalShellPoint(thetaEnd, phi, params, morph, -thick);

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

// Bivalve complementar (segunda valva para Vieira e Ostra)
export function buildSecondaryBivalve(primaryGeo, isScallop = true) {
  const geo = primaryGeo.clone();
  // Espelha a valva ao longo do plano da charneira com leve assimetria natural
  geo.scale(1.0, isScallop ? -0.85 : -0.75, 1.0);
  geo.rotateZ(isScallop ? 0.08 : 0.14);
  geo.computeVertexNormals();
  return geo;
}
