/**
 * js/materials.js
 * Texturas PBR procedurais originais (albedo sRGB, normal/bump/roughness lineares)
 * e Probe de Ambiente HDR noturno via PMREMGenerator.
 */
import * as THREE from 'three';
import { mulberry32 } from './state.js';

function makeCanvasTexture(size, drawFn, isColor = true, repeat = [1, 1]) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  drawFn(ctx, size);
  const tex = new THREE.CanvasTexture(c);
  if (isColor) tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat[0], repeat[1]);
  tex.anisotropy = 4;
  return tex;
}

export function createNightEnvironment(renderer) {
  const w = 128;
  const h = 64;
  const data = new Uint16Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    const elev = (0.5 - (y + 0.5) / h) * Math.PI;
    for (let x = 0; x < w; x++) {
      const az = ((x + 0.5) / w) * Math.PI * 2;
      // Céu noturno azul-índigo + disco lunar frio + rebate quente âmbar de baixo
      const skyMix = Math.max(0, Math.sin(elev));
      const moonSpot = Math.exp(-((elev - 0.52) ** 2 * 14 + (az - 3.65) ** 2 * 12)) * 2.4;
      const horizonGlow = Math.exp(-elev * elev * 18) * 0.22;
      const r = 0.04 + horizonGlow * 0.55 + moonSpot * 0.85;
      const g = 0.07 + skyMix * 0.08 + horizonGlow * 0.65 + moonSpot * 0.92;
      const b = 0.14 + skyMix * 0.18 + horizonGlow * 0.9 + moonSpot * 1.15;
      const o = (y * w + x) * 4;
      data[o] = THREE.DataUtils.toHalfFloat(r);
      data[o + 1] = THREE.DataUtils.toHalfFloat(g);
      data[o + 2] = THREE.DataUtils.toHalfFloat(b);
      data[o + 3] = THREE.DataUtils.toHalfFloat(1);
    }
  }
  const dt = new THREE.DataTexture(data, w, h, THREE.RGBAFormat, THREE.HalfFloatType);
  dt.mapping = THREE.EquirectangularReflectionMapping;
  dt.needsUpdate = true;
  const pmrem = new THREE.PMREMGenerator(renderer);
  try {
    return pmrem.fromEquirectangular(dt);
  } finally {
    dt.dispose();
    pmrem.dispose();
  }
}

export function createWorldMaterials(seed = 7711) {
  const rnd = mulberry32(seed);
  const textures = [];
  const materials = [];
  const trackTex = (t) => (textures.push(t), t);
  const trackMat = (m) => (materials.push(m), m);

  // 1. Solo da trilha + gramado com mapa PBR rico e escuro para contraste noturno
  const terrainMap = trackTex(makeCanvasTexture(512, (ctx, s) => {
    const im = ctx.createImageData(s, s);
    for (let i = 0; i < s * s; i++) {
      const x = i % s;
      const y = (i / s) | 0;
      const gr = Math.sin(x * 0.11 + y * 0.09) * 14 + Math.cos(x * 0.29 - y * 0.23) * 8 + (rnd() - 0.5) * 24;
      const mossPatch = Math.max(0, Math.sin(x * 0.025) * Math.cos(y * 0.03));
      im.data[i * 4] = Math.max(8, Math.min(255, 76 + gr - mossPatch * 28));
      im.data[i * 4 + 1] = Math.max(8, Math.min(255, 62 + gr * 0.8 + mossPatch * 32));
      im.data[i * 4 + 2] = Math.max(6, Math.min(255, 36 + gr * 0.5));
      im.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(im, 0, 0);
  }, true, [14, 18]));

  const terrainRough = trackTex(makeCanvasTexture(256, (ctx, s) => {
    const im = ctx.createImageData(s, s);
    for (let i = 0; i < s * s; i++) {
      const n = 205 + (rnd() - 0.5) * 45;
      im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = Math.max(120, Math.min(255, n));
      im.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(im, 0, 0);
  }, false, [14, 18]));

  const terrainMat = trackMat(new THREE.MeshStandardMaterial({
    map: terrainMap,
    roughnessMap: terrainRough,
    bumpMap: terrainRough,
    bumpScale: 0.08,
    vertexColors: true,
    roughness: 0.92,
    metalness: 0.02,
    envMapIntensity: 0.55,
  }));

  // 2. Madeira & casca rústica (postes e troncos)
  const barkMap = trackTex(makeCanvasTexture(512, (ctx, s) => {
    ctx.fillStyle = '#3b291d';
    ctx.fillRect(0, 0, s, s);
    for (let x = 0; x < s; x += 2) {
      const f = Math.sin(x * 0.09) * 14 + (rnd() - 0.5) * 20;
      ctx.fillStyle = `rgb(${55 + f}, ${38 + f * 0.7}, ${25 + f * 0.5})`;
      ctx.fillRect(x, 0, 2, s);
    }
    for (let i = 0; i < 420; i++) {
      ctx.fillStyle = rnd() < 0.3 ? 'rgba(62,92,42,0.22)' : 'rgba(18,12,9,0.34)';
      ctx.fillRect(rnd() * s, rnd() * s, 2 + rnd() * 5, 16 + rnd() * 70);
    }
  }, true, [2, 3]));

  const barkBump = trackTex(makeCanvasTexture(256, (ctx, s) => {
    const im = ctx.createImageData(s, s);
    for (let i = 0; i < s * s; i++) {
      const x = i % s;
      const y = (i / s) | 0;
      const groove = Math.sin(x * 0.24 + Math.sin(y * 0.04) * 2.0) * 55 + 128 + (rnd() - 0.5) * 25;
      im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = Math.max(0, Math.min(255, groove));
      im.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(im, 0, 0);
  }, false, [2, 3]));

  const barkMat = trackMat(new THREE.MeshStandardMaterial({
    map: barkMap,
    bumpMap: barkBump,
    bumpScale: 0.055,
    roughness: 0.90,
    metalness: 0.02,
    envMapIntensity: 0.45,
  }));

  // 3. Corda de sisal trançada do poste
  const ropeMap = trackTex(makeCanvasTexture(256, (ctx, s) => {
    ctx.fillStyle = '#8b6f47';
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = 'rgba(42,29,15,0.45)';
    ctx.lineWidth = 3;
    for (let y = -s; y < s * 2; y += 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(s, y + 64);
      ctx.stroke();
    }
  }, true, [4, 2]));

  const ropeMat = trackMat(new THREE.MeshStandardMaterial({
    map: ropeMap,
    bumpMap: ropeMap,
    bumpScale: 0.025,
    roughness: 0.94,
    metalness: 0.0,
  }));

  // 4. Rocha seca/musgosa e rocha molhada de margem (/water: superfícies úmidas com baixa rugosidade!)
  const rockMap = trackTex(makeCanvasTexture(256, (ctx, s) => {
    const im = ctx.createImageData(s, s);
    for (let i = 0; i < s * s; i++) {
      const x = i % s;
      const y = (i / s) | 0;
      const grain = Math.sin(x * 0.08) * Math.cos(y * 0.08) * 18 + (rnd() - 0.5) * 28;
      im.data[i * 4] = Math.max(15, Math.min(255, 68 + grain));
      im.data[i * 4 + 1] = Math.max(15, Math.min(255, 74 + grain));
      im.data[i * 4 + 2] = Math.max(15, Math.min(255, 66 + grain));
      im.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(im, 0, 0);
  }, true, [2, 2]));

  const wetRockMat = trackMat(new THREE.MeshStandardMaterial({
    map: rockMap,
    bumpMap: rockMap,
    bumpScale: 0.04,
    color: 0x3b443e,
    roughness: 0.18, // brilho úmido na zona de respingo do riacho
    metalness: 0.06,
    envMapIntensity: 1.25,
  }));

  const mossRockMat = trackMat(new THREE.MeshStandardMaterial({
    map: rockMap,
    bumpMap: rockMap,
    bumpScale: 0.045,
    color: 0x5c7243,
    roughness: 0.88,
    metalness: 0.02,
    vertexColors: true,
    envMapIntensity: 0.55,
  }));

  // 5. Latão envelhecido, ferro forjado e vidro do lampião
  const bronzeMat = trackMat(new THREE.MeshStandardMaterial({
    color: 0x33281d,
    roughness: 0.36,
    metalness: 0.85,
    envMapIntensity: 1.1,
  }));

  const lanternGlassMat = trackMat(new THREE.MeshPhysicalMaterial({
    color: 0xffe4aa,
    emissive: 0xff9f2e,
    emissiveIntensity: 0.85,
    roughness: 0.14,
    metalness: 0.05,
    transparent: true,
    opacity: 0.58,
  }));

  // 6. Folhagens PBR com recorte alpha orgânico de raminho (sem blocos quadrados!)
  const canopyTex = trackTex(makeCanvasTexture(256, (ctx, s) => {
    ctx.clearRect(0, 0, s, s);
    // Desenha caule central e 7 folíolos apontados realistas com nervuras
    ctx.strokeStyle = '#334d21';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(s * 0.5, s * 0.95);
    ctx.quadraticCurveTo(s * 0.48, s * 0.5, s * 0.5, s * 0.08);
    ctx.stroke();

    const leavesSpec = [
      [0.5, 0.20, 0.0, 0.24, 0.13],
      [0.34, 0.36, -0.58, 0.26, 0.12],
      [0.66, 0.38, 0.58, 0.26, 0.12],
      [0.30, 0.56, -0.75, 0.28, 0.13],
      [0.70, 0.58, 0.75, 0.28, 0.13],
      [0.36, 0.76, -0.82, 0.24, 0.11],
      [0.64, 0.78, 0.82, 0.24, 0.11],
    ];
    leavesSpec.forEach(([lx, ly, rot, len, wid], idx) => {
      ctx.save();
      ctx.translate(lx * s, ly * s);
      ctx.rotate(rot);
      const grad = ctx.createLinearGradient(0, -len * s, 0, len * s * 0.3);
      grad.addColorStop(0, idx < 3 ? '#5e8836' : '#3a5d22');
      grad.addColorStop(1, '#223a14');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, len * s * 0.25);
      ctx.bezierCurveTo(wid * s, 0, wid * s * 0.8, -len * s * 0.7, 0, -len * s);
      ctx.bezierCurveTo(-wid * s * 0.8, -len * s * 0.7, -wid * s, 0, 0, len * s * 0.25);
      ctx.fill();
      ctx.strokeStyle = 'rgba(130, 178, 65, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, len * s * 0.2);
      ctx.lineTo(0, -len * s * 0.9);
      ctx.stroke();
      ctx.restore();
    });
  }, true));

  const leafMat = trackMat(new THREE.MeshStandardMaterial({
    color: 0x3b6126,
    roughness: 0.65,
    metalness: 0.0,
    side: THREE.DoubleSide,
    envMapIntensity: 0.32,
  }));

  const broadLeafTex = trackTex(makeCanvasTexture(256, (ctx, s) => {
    const im = ctx.createImageData(s, s);
    for (let y = 0; y < s; y++) {
      const v = 1 - y / (s - 1);
      for (let x = 0; x < s; x++) {
        const u = x / (s - 1) * 2 - 1;
        const mid = Math.exp(-u * u * 180);
        const vein = Math.exp(-Math.pow(Math.sin((v * 7 - Math.abs(u) * 0.8) * Math.PI), 2) * 32);
        const i = (y * s + x) * 4;
        im.data[i] = Math.min(255, 32 + mid * 42 + vein * 16 + (rnd() - 0.5) * 10);
        im.data[i + 1] = Math.min(255, 82 + mid * 55 + vein * 22 + (rnd() - 0.5) * 14);
        im.data[i + 2] = Math.min(255, 24 + mid * 14 + (rnd() - 0.5) * 8);
        im.data[i + 3] = 255;
      }
    }
    ctx.putImageData(im, 0, 0);
  }, true));

  const broadLeafMat = trackMat(new THREE.MeshPhysicalMaterial({
    map: broadLeafTex,
    roughness: 0.38,
    clearcoat: 0.32,
    side: THREE.DoubleSide,
    envMapIntensity: 0.72,
  }));

  const heliconiaMat = trackMat(new THREE.MeshPhysicalMaterial({
    color: 0xc92b16,
    roughness: 0.32,
    clearcoat: 0.38,
    side: THREE.DoubleSide,
    emissive: 0x3b0903,
    emissiveIntensity: 0.32,
  }));

  function dispose() {
    textures.forEach((t) => t.dispose());
    materials.forEach((m) => m.dispose());
  }

  return {
    terrainMat,
    barkMat,
    ropeMat,
    wetRockMat,
    mossRockMat,
    bronzeMat,
    lanternGlassMat,
    leafMat,
    broadLeafMat,
    heliconiaMat,
    dispose,
  };
}
