import * as THREE from '../../../shared/vendor/three.module.js';
import { rng } from './config.js';

/**
 * Gera e mantém cache de texturas PBR procedurais (travertino com juntas,
 * latão escovado, concreto arquitetônico e sprites atmosféricos) com descarte centralizado.
 */
export function createMaterialLibrary() {
  const textures = [];
  const materials = [];

  function trackTex(tex) {
    textures.push(tex);
    return tex;
  }

  function trackMat(mat) {
    materials.push(mat);
    return mat;
  }

  function createTravertineSet(seed = 44391, repeatX = 2, repeatY = 2) {
    const size = 512;
    const colCanvas = document.createElement('canvas');
    const bumpCanvas = document.createElement('canvas');
    const roughCanvas = document.createElement('canvas');
    colCanvas.width = bumpCanvas.width = roughCanvas.width = size;
    colCanvas.height = bumpCanvas.height = roughCanvas.height = size;

    const colCtx = colCanvas.getContext('2d');
    const bumpCtx = bumpCanvas.getContext('2d');
    const roughCtx = roughCanvas.getContext('2d');

    const colImg = colCtx.createImageData(size, size);
    const bumpImg = bumpCtx.createImageData(size, size);
    const roughImg = roughCtx.createImageData(size, size);

    const rand = rng(seed);
    const cols = 4;
    const rows = 4;
    const tileW = size / cols;
    const tileH = size / rows;

    // Precompute block variation
    const blockTint = new Float32Array(cols * rows);
    for (let i = 0; i < blockTint.length; i++) {
      blockTint[i] = 0.92 + rand() * 0.14;
    }

    for (let y = 0; y < size; y++) {
      const row = Math.floor(y / tileH);
      const localY = y - row * tileH;
      const offsetX = (row % 2) * (tileW * 0.5);

      for (let x = 0; x < size; x++) {
        const sx = (x + offsetX) % size;
        const col = Math.floor(sx / tileW);
        const localX = sx - col * tileW;
        const bTint = blockTint[row * cols + col];

        const jointX = Math.min(localX, tileW - localX);
        const jointY = Math.min(localY, tileH - localY);
        const minEdge = Math.min(jointX, jointY);
        const isJoint = minEdge < 3.2;

        // Travertine horizontal sedimentary veining & pores
        const u = x / size;
        const v = y / size;
        const vein =
          Math.sin((v * 24 + Math.sin(u * Math.PI * 4 + row) * 0.35) * Math.PI * 2) * 0.5 + 0.5;
        const fine = (rand() - 0.5) * 16;
        const pore = rand() > 0.965 ? -18 : 0;

        let r, g, b, heightVal, roughVal;
        if (isJoint) {
          const edgeFade = minEdge / 3.2;
          r = 148 + edgeFade * 22 + fine * 0.4;
          g = 136 + edgeFade * 20 + fine * 0.4;
          b = 122 + edgeFade * 17 + fine * 0.4;
          heightVal = 70 + edgeFade * 65;
          roughVal = 242;
        } else {
          const base = (212 + vein * 18 + pore + fine) * bTint;
          r = Math.min(248, base * 1.04);
          g = Math.min(238, base * 0.96);
          b = Math.min(220, base * 0.85);
          heightVal = 175 + vein * 34 + pore + fine * 0.7;
          roughVal = 198 + (1 - vein) * 30 - (pore < 0 ? 18 : 0);
        }

        const idx = (y * size + x) * 4;
        colImg.data[idx] = Math.max(0, Math.min(255, r));
        colImg.data[idx + 1] = Math.max(0, Math.min(255, g));
        colImg.data[idx + 2] = Math.max(0, Math.min(255, b));
        colImg.data[idx + 3] = 255;

        const hv = Math.max(0, Math.min(255, heightVal));
        bumpImg.data[idx] = bumpImg.data[idx + 1] = bumpImg.data[idx + 2] = hv;
        bumpImg.data[idx + 3] = 255;

        const rv = Math.max(0, Math.min(255, roughVal));
        roughImg.data[idx] = roughImg.data[idx + 1] = roughImg.data[idx + 2] = rv;
        roughImg.data[idx + 3] = 255;
      }
    }

    colCtx.putImageData(colImg, 0, 0);
    bumpCtx.putImageData(bumpImg, 0, 0);
    roughCtx.putImageData(roughImg, 0, 0);

    const makeTex = (canvas, srgb) => {
      const t = trackTex(new THREE.CanvasTexture(canvas));
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeatX, repeatY);
      t.anisotropy = 4;
      return t;
    };

    return {
      map: makeTex(colCanvas, true),
      bumpMap: makeTex(bumpCanvas, false),
      roughnessMap: makeTex(roughCanvas, false),
    };
  }

  function createBrassTexture(seed = 9182) {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    const img = ctx.createImageData(size, size);
    const rand = rng(seed);
    for (let y = 0; y < size; y++) {
      const brush = Math.sin(y * 0.9) * 6 + (rand() - 0.5) * 14;
      for (let x = 0; x < size; x++) {
        const streak = (rand() - 0.5) * 10 + Math.sin(x * 0.04 + y * 0.6) * 4;
        const v = 186 + brush + streak;
        const i = (y * size + x) * 4;
        img.data[i] = Math.min(255, v * 1.03);
        img.data[i + 1] = Math.min(255, v * 0.86);
        img.data[i + 2] = Math.min(255, v * 0.56);
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    const t = trackTex(new THREE.CanvasTexture(canvas));
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 2);
    return t;
  }

  function createPlaqueTexture(title, subtitle) {
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 176;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#12191e';
    ctx.fillRect(0, 0, 768, 176);
    ctx.strokeStyle = '#d3b278';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 748, 156);
    ctx.strokeStyle = 'rgba(168, 191, 255, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 728, 136);
    ctx.fillStyle = '#f3e2c4';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 44px system-ui, "Segoe UI", sans-serif';
    ctx.fillText(title, 384, subtitle ? 68 : 88, 690);
    if (subtitle) {
      ctx.fillStyle = '#a8bfff';
      ctx.font = '600 24px system-ui, "Segoe UI", sans-serif';
      ctx.fillText(subtitle, 384, 124, 690);
    }
    const t = trackTex(new THREE.CanvasTexture(canvas));
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  const travSet = createTravertineSet(44391, 2, 2);
  const floorSet = createTravertineSet(77213, 6, 6);
  const brassMap = createBrassTexture(9182);

  const travertine = trackMat(new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: travSet.map,
    bumpMap: travSet.bumpMap,
    bumpScale: 0.045,
    roughnessMap: travSet.roughnessMap,
    roughness: 0.9,
    metalness: 0.02,
  }));

  const travertineFloor = trackMat(new THREE.MeshStandardMaterial({
    color: 0xf7eee2,
    map: floorSet.map,
    bumpMap: floorSet.bumpMap,
    bumpScale: 0.05,
    roughnessMap: floorSet.roughnessMap,
    roughness: 0.86,
    metalness: 0.03,
  }));

  const concrete = trackMat(new THREE.MeshStandardMaterial({
    color: 0x766e66,
    bumpMap: travSet.bumpMap,
    bumpScale: 0.025,
    roughness: 0.92,
    metalness: 0.04,
  }));

  const brass = trackMat(new THREE.MeshStandardMaterial({
    color: 0xc9a362,
    map: brassMap,
    roughness: 0.3,
    metalness: 0.84,
  }));

  const darkBrass = trackMat(new THREE.MeshStandardMaterial({
    color: 0x6f5938,
    map: brassMap,
    roughness: 0.36,
    metalness: 0.78,
  }));

  const sapphireGlass = trackMat(new THREE.MeshStandardMaterial({
    color: 0x16399e,
    emissive: 0x265dff,
    emissiveIntensity: 0.55,
    roughness: 0.16,
    metalness: 0.15,
  }));

  const cobaltGlow = trackMat(new THREE.MeshStandardMaterial({
    color: 0x6ea8ff,
    emissive: 0x4589ff,
    emissiveIntensity: 1.35,
    roughness: 0.2,
  }));

  const amberGlow = trackMat(new THREE.MeshStandardMaterial({
    color: 0xffd088,
    emissive: 0xffad42,
    emissiveIntensity: 1.05,
    roughness: 0.25,
  }));

  const emeraldGlow = trackMat(new THREE.MeshStandardMaterial({
    color: 0x7ae2ba,
    emissive: 0x3ec896,
    emissiveIntensity: 1.15,
    roughness: 0.25,
  }));

  const foliage = trackMat(new THREE.MeshStandardMaterial({
    color: 0x5c7f5a,
    roughness: 0.82,
    metalness: 0.02,
  }));

  const mirrorFallback = trackMat(new THREE.MeshStandardMaterial({
    color: 0x8ea7c4,
    roughness: 0.12,
    metalness: 0.92,
  }));

  const godrayMat = trackMat(new THREE.MeshBasicMaterial({
    color: 0xd9e8ff,
    transparent: true,
    opacity: 0.07,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  }));

  return {
    travertine,
    travertineFloor,
    concrete,
    brass,
    darkBrass,
    sapphireGlass,
    cobaltGlow,
    amberGlow,
    emeraldGlow,
    foliage,
    mirrorFallback,
    godrayMat,
    trackMat,
    trackTex,
    createPlaqueTexture,
    dispose() {
      textures.forEach(t => t.dispose());
      materials.forEach(m => m.dispose());
    },
  };
}
