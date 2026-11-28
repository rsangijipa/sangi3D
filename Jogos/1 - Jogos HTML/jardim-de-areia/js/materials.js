/**
 * js/materials.js
 * Texturas PBR procedurais originais de alta fidelidade (areia granítica Shirakawa,
 * madeira hinoki/yakisugi, rocha basáltica estratificada, musgo e shoji).
 */
import * as THREE from 'three';
import { mulberry32 } from './state.js';

function canvasTex(size, drawFn, isColor = true, repeat = [1, 1]) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  drawFn(ctx, size);
  const t = new THREE.CanvasTexture(c);
  if (isColor) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 8;
  return t;
}

export function createZenMaterials(seed = 5391) {
  const rnd = mulberry32(seed);
  const textures = [];
  const materials = [];
  const tTrack = (t) => (textures.push(t), t);
  const mTrack = (m) => (materials.push(m), m);

  // 1. Areia de granito claro Shirakawa: quartzo creme, feldspato cinza e mica pontual
  const sandMap = tTrack(canvasTex(512, (ctx, s) => {
    const im = ctx.createImageData(s, s);
    for (let i = 0; i < s * s; i++) {
      const n = (rnd() - 0.5) * 18;
      const spec = rnd();
      let base = 219 + n;
      if (spec > 0.94) base -= 48; // grão mineral escuro de biotita
      else if (spec < 0.08) base += 18; // quartzo claro
      const clamped = Math.max(85, Math.min(246, base));
      im.data[i * 4] = clamped + 5;
      im.data[i * 4 + 1] = clamped + 1;
      im.data[i * 4 + 2] = clamped - 7;
      im.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(im, 0, 0);
  }, true, [10, 7]));

  const sandBump = tTrack(canvasTex(256, (ctx, s) => {
    const im = ctx.createImageData(s, s);
    for (let i = 0; i < s * s; i++) {
      const v = Math.max(0, Math.min(255, 128 + (rnd() - 0.5) * 90));
      im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = v;
      im.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(im, 0, 0);
  }, false, [14, 10]));

  const sandMat = mTrack(new THREE.MeshStandardMaterial({
    map: sandMap,
    bumpMap: sandBump,
    bumpScale: 0.014,
    roughness: 0.94,
    metalness: 0.02,
    envMapIntensity: 0.35,
  }));

  // 2. Madeira clara Hinoki (rastelo e detalhes internos) & Cedro escuro do pavilhão
  const hinokiMap = tTrack(canvasTex(512, (ctx, s) => {
    ctx.fillStyle = '#c8a376';
    ctx.fillRect(0, 0, s, s);
    for (let y = 0; y < s; y += 2) {
      const w = Math.sin(y * 0.08) * 12 + (rnd() - 0.5) * 14;
      ctx.fillStyle = `rgb(${198 + w}, ${158 + w * 0.8}, ${110 + w * 0.6})`;
      ctx.fillRect(0, y, s, 2);
    }
  }, true, [1, 2]));

  const hinokiBump = tTrack(canvasTex(256, (ctx, s) => {
    const im = ctx.createImageData(s, s);
    for (let y = 0; y < s; y++) {
      const wave = Math.sin(y * 0.25) * 28;
      for (let x = 0; x < s; x++) {
        const i = (y * s + x) * 4;
        const v = Math.max(0, Math.min(255, 128 + wave + (rnd() - 0.5) * 16));
        im.data[i] = im.data[i + 1] = im.data[i + 2] = v;
        im.data[i + 3] = 255;
      }
    }
    ctx.putImageData(im, 0, 0);
  }, false, [1, 2]));

  const hinokiMat = mTrack(new THREE.MeshStandardMaterial({
    map: hinokiMap,
    bumpMap: hinokiBump,
    bumpScale: 0.015,
    roughness: 0.62,
    metalness: 0.02,
  }));

  const darkCedarMat = mTrack(new THREE.MeshStandardMaterial({
    map: hinokiMap,
    bumpMap: hinokiBump,
    bumpScale: 0.024,
    color: 0x5c4738,
    roughness: 0.82,
    metalness: 0.03,
  }));

  const weatheredDeckMat = mTrack(new THREE.MeshStandardMaterial({
    map: hinokiMap,
    bumpMap: hinokiBump,
    bumpScale: 0.02,
    color: 0x8f755a,
    roughness: 0.78,
    metalness: 0.02,
  }));

  // 3. Rocha basáltica/andesito natural + líquen sutil
  const rockMap = tTrack(canvasTex(512, (ctx, s) => {
    const im = ctx.createImageData(s, s);
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const i = (y * s + x) * 4;
        const strata = Math.sin(y * 0.07 + Math.sin(x * 0.03) * 2.5) * 14;
        const noise = (rnd() - 0.5) * 22;
        const lichen = rnd() > 0.965 ? 24 : 0;
        const g = Math.max(25, Math.min(210, 74 + strata + noise));
        im.data[i] = g + lichen * 0.6;
        im.data[i + 1] = g + 4 + lichen;
        im.data[i + 2] = g + 6;
        im.data[i + 3] = 255;
      }
    }
    ctx.putImageData(im, 0, 0);
  }, true, [2, 2]));

  const rockMat = mTrack(new THREE.MeshStandardMaterial({
    map: rockMap,
    bumpMap: rockMap,
    bumpScale: 0.045,
    roughness: 0.88,
    metalness: 0.04,
    vertexColors: true,
    envMapIntensity: 0.5,
  }));

  // 4. Musgo denso (Kyoto sugi-goke) ao redor das pedras
  const mossMap = tTrack(canvasTex(256, (ctx, s) => {
    const im = ctx.createImageData(s, s);
    for (let i = 0; i < s * s; i++) {
      const f = (rnd() - 0.5) * 32;
      im.data[i * 4] = Math.max(15, Math.min(180, 62 + f * 0.7));
      im.data[i * 4 + 1] = Math.max(25, Math.min(200, 96 + f));
      im.data[i * 4 + 2] = Math.max(10, Math.min(140, 34 + f * 0.5));
      im.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(im, 0, 0);
  }, true, [3, 3]));

  const mossMat = mTrack(new THREE.MeshStandardMaterial({
    map: mossMap,
    bumpMap: mossMap,
    bumpScale: 0.038,
    roughness: 0.96,
    metalness: 0.0,
    envMapIntensity: 0.3,
  }));

  // 5. Papel Shoji translúcido, reboco terroso e telha cerâmica escura
  const shojiMat = mTrack(new THREE.MeshPhysicalMaterial({
    color: 0xf4ebd7,
    emissive: 0xffd28c,
    emissiveIntensity: 0.24,
    roughness: 0.78,
    metalness: 0,
    transmission: 0.25,
    thickness: 0.1,
  }));

  const plasterMat = mTrack(new THREE.MeshStandardMaterial({
    color: 0xcfc4ac,
    bumpMap: sandBump,
    bumpScale: 0.012,
    roughness: 0.93,
  }));

  const roofTileMat = mTrack(new THREE.MeshStandardMaterial({
    color: 0x2f3437,
    roughness: 0.68,
    metalness: 0.14,
  }));

  const brassMat = mTrack(new THREE.MeshStandardMaterial({
    color: 0x7c6945,
    roughness: 0.4,
    metalness: 0.85,
  }));

  function dispose() {
    textures.forEach((t) => t.dispose());
    materials.forEach((m) => m.dispose());
  }

  return {
    sandMat,
    hinokiMat,
    darkCedarMat,
    weatheredDeckMat,
    rockMat,
    mossMat,
    shojiMat,
    plasterMat,
    roofTileMat,
    brassMat,
    dispose,
  };
}
