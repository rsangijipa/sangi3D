/**
 * Procedural seamless PBR texture library for Expedição pelo Igarapé.
 * Uses periodic value noise (tileable without seams) and central-difference
 * height-to-normal conversion. Color maps use SRGBColorSpace; data maps stay linear.
 */

import * as THREE from 'three';

export interface PBRTextureSet {
  map: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
}

export interface MaterialLibrary {
  canoeWood: PBRTextureSet;
  paddleWood: PBRTextureSet;
  mossyBark: PBRTextureSet;
  bankGround: PBRTextureSet;
  canvasFabric: PBRTextureSet;
  ropeFiber: PBRTextureSet;
  waterNormal: THREE.CanvasTexture;
  tropicalLeafMap: THREE.CanvasTexture;
  fernFrondMap: THREE.CanvasTexture;
  contactShadowMap: THREE.CanvasTexture;
  softParticleMap: THREE.CanvasTexture;
  dispose: () => void;
}

/** Deterministic integer hash for periodic 2D noise */
function hash2(ix: number, iy: number, seed: number): number {
  let n = Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seed, 1442695041);
  n = (n ^ (n >>> 13)) * 1274126177;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

/** Smooth periodic 2D value noise with integer tile period `px`, `py` */
function periodicNoise(u: number, v: number, px: number, py: number, seed: number): number {
  const x = ((u * px) % px + px) % px;
  const y = ((v * py) % py + py) % py;
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const ix1 = (ix + 1) % px;
  const iy1 = (iy + 1) % py;

  const n00 = hash2(ix, iy, seed);
  const n10 = hash2(ix1, iy, seed);
  const n01 = hash2(ix, iy1, seed);
  const n11 = hash2(ix1, iy1, seed);

  const nx0 = n00 + (n10 - n00) * sx;
  const nx1 = n01 + (n11 - n01) * sx;
  return nx0 + (nx1 - nx0) * sy;
}

function fbmPeriodic(
  u: number,
  v: number,
  basePx: number,
  basePy: number,
  octaves: number,
  seed: number
): number {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  let px = basePx;
  let py = basePy;
  for (let i = 0; i < octaves; i++) {
    sum += amp * periodicNoise(u, v, px, py, seed + i * 31);
    norm += amp;
    amp *= 0.5;
    px *= 2;
    py *= 2;
  }
  return sum / norm;
}

function createCanvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

function heightFieldToNormalTexture(
  heights: Float32Array,
  size: number,
  strength: number,
  anisotropy: number
): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(size);
  const img = ctx.createImageData(size, size);
  const data = img.data;

  for (let y = 0; y < size; y++) {
    const ym = (y - 1 + size) % size;
    const yp = (y + 1) % size;
    for (let x = 0; x < size; x++) {
      const xm = (x - 1 + size) % size;
      const xp = (x + 1) % size;
      const dx = (heights[y * size + xp] - heights[y * size + xm]) * strength;
      const dy = (heights[yp * size + x] - heights[ym * size + x]) * strength;
      let nx = -dx;
      let ny = -dy;
      let nz = 1.0;
      const invLen = 1 / Math.hypot(nx, ny, nz);
      nx *= invLen;
      ny *= invLen;
      nz *= invLen;
      const idx = (y * size + x) * 4;
      data[idx] = Math.round((nx * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = anisotropy;
  return tex;
}

function finalizeTexture(
  canvas: HTMLCanvasElement,
  isColor: boolean,
  anisotropy: number,
  repeat = true
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  tex.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  if (isColor) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  tex.anisotropy = anisotropy;
  return tex;
}

function generateWoodPBR(
  size: number,
  anisotropy: number,
  seed: number,
  darkWeathered: boolean
): PBRTextureSet {
  const [cColor, ctxColor] = createCanvas(size);
  const [cRough, ctxRough] = createCanvas(size);
  const imgColor = ctxColor.createImageData(size, size);
  const imgRough = ctxRough.createImageData(size, size);
  const heights = new Float32Array(size * size);

  const plankCount = darkWeathered ? 5 : 2;
  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const warp = fbmPeriodic(u, v, 3, 6, 3, seed) * 0.14;
      const grain =
        (Math.sin((u * 14 + warp * 8) * Math.PI * 2) * 0.5 + 0.5) * 0.42 +
        fbmPeriodic(u, v, 10, 4, 3, seed + 19) * 0.58;
      const fine = fbmPeriodic(u, v, 24, 6, 2, seed + 77);

      // Subtle plank seams for canoe hull
      const plankPhase = (u * plankCount) % 1;
      const seam =
        darkWeathered && (plankPhase < 0.018 || plankPhase > 0.982) ? 0.52 : 1.0;

      // Dampness & age blotches
      const patina = fbmPeriodic(u, v, 4, 4, 3, seed + 131);
      const h = (grain * 0.45 + fine * 0.35) * seam;
      heights[y * size + x] = h;

      let r: number;
      let g: number;
      let b: number;
      let rough: number;

      if (darkWeathered) {
        // Rich warm weathered Amazonian dugout itaúba wood (smooth subtle grain, no harsh zebra stripes)
        const base = 0.46 + (grain - 0.5) * 0.24 + (patina - 0.5) * 0.16;
        r = Math.min(255, Math.max(0, (base * 142 + fine * 16) * seam));
        g = Math.min(255, Math.max(0, (base * 92 + fine * 11) * seam));
        b = Math.min(255, Math.max(0, (base * 52 + fine * 6) * seam));
        // Subtle green-brown damp moss hint in crevices
        if (patina > 0.68) {
          const m = (patina - 0.68) * 1.1;
          g = Math.min(255, g + m * 16);
          r = Math.max(0, r - m * 8);
        }
        rough = Math.min(242, Math.max(130, 178 + (1 - patina) * 44 - grain * 14));
      } else {
        // Warmer hand-carved wooden paddle
        const base = 0.56 + (grain - 0.5) * 0.22 + (patina - 0.5) * 0.1;
        r = Math.min(255, Math.max(0, base * 192 + fine * 14));
        g = Math.min(255, Math.max(0, base * 134 + fine * 10));
        b = Math.min(255, Math.max(0, base * 76 + fine * 6));
        rough = Math.min(215, Math.max(105, 146 + (1 - grain) * 34));
      }

      const idx = (y * size + x) * 4;
      imgColor.data[idx] = r;
      imgColor.data[idx + 1] = g;
      imgColor.data[idx + 2] = b;
      imgColor.data[idx + 3] = 255;

      imgRough.data[idx] = rough;
      imgRough.data[idx + 1] = rough;
      imgRough.data[idx + 2] = rough;
      imgRough.data[idx + 3] = 255;
    }
  }

  ctxColor.putImageData(imgColor, 0, 0);
  ctxRough.putImageData(imgRough, 0, 0);

  return {
    map: finalizeTexture(cColor, true, anisotropy),
    normalMap: heightFieldToNormalTexture(heights, size, darkWeathered ? 2.1 : 1.5, anisotropy),
    roughnessMap: finalizeTexture(cRough, false, anisotropy),
  };
}

function generateMossyBarkPBR(size: number, anisotropy: number): PBRTextureSet {
  const [cColor, ctxColor] = createCanvas(size);
  const [cRough, ctxRough] = createCanvas(size);
  const imgColor = ctxColor.createImageData(size, size);
  const imgRough = ctxRough.createImageData(size, size);
  const heights = new Float32Array(size * size);

  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const furrow = fbmPeriodic(u, v, 12, 4, 4, 41);
      const ridge = Math.pow(furrow, 1.25);
      const mossMask = fbmPeriodic(u, v, 5, 5, 3, 97);
      const moss = Math.max(0, Math.min(1, (mossMask - 0.46) * 3.0));
      heights[y * size + x] = ridge * 0.78 + moss * 0.22;

      // Warm gnarled Samaúma bark blended with deep rainforest moss
      const br = 68 + ridge * 58;
      const bg = 58 + ridge * 46;
      const bb = 42 + ridge * 30;

      const mr = 42 + ridge * 36;
      const mg = 84 + ridge * 52;
      const mb = 26 + ridge * 20;

      const idx = (y * size + x) * 4;
      imgColor.data[idx] = br + (mr - br) * moss;
      imgColor.data[idx + 1] = bg + (mg - bg) * moss;
      imgColor.data[idx + 2] = bb + (mb - bb) * moss;
      imgColor.data[idx + 3] = 255;

      const rough = Math.round(205 + (1 - ridge) * 38 - moss * 12);
      imgRough.data[idx] = rough;
      imgRough.data[idx + 1] = rough;
      imgRough.data[idx + 2] = rough;
      imgRough.data[idx + 3] = 255;
    }
  }

  ctxColor.putImageData(imgColor, 0, 0);
  ctxRough.putImageData(imgRough, 0, 0);

  return {
    map: finalizeTexture(cColor, true, anisotropy),
    normalMap: heightFieldToNormalTexture(heights, size, 4.4, anisotropy),
    roughnessMap: finalizeTexture(cRough, false, anisotropy),
  };
}

function generateBankGroundPBR(size: number, anisotropy: number): PBRTextureSet {
  const [cColor, ctxColor] = createCanvas(size);
  const [cRough, ctxRough] = createCanvas(size);
  const imgColor = ctxColor.createImageData(size, size);
  const imgRough = ctxRough.createImageData(size, size);
  const heights = new Float32Array(size * size);

  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const soil = fbmPeriodic(u, v, 8, 8, 4, 211);
      const litter = fbmPeriodic(u, v, 22, 22, 3, 307);
      const moss = Math.max(0, Math.min(1, (fbmPeriodic(u, v, 5, 5, 3, 419) - 0.36) * 2.6));

      heights[y * size + x] = soil * 0.55 + litter * 0.45;

      // Deep dark Amazonian humic soil, damp brown leaf litter & lush moss (never pale sand)
      let r = 24 + soil * 22 + (litter > 0.62 ? 24 : 0);
      let g = 22 + soil * 18 + (litter > 0.62 ? 15 : 0);
      let b = 13 + soil * 11;

      r = r * (1 - moss * 0.52) + 28 * moss;
      g = g * (1 - moss * 0.25) + 58 * moss;
      b = b * (1 - moss * 0.52) + 18 * moss;

      const idx = (y * size + x) * 4;
      imgColor.data[idx] = Math.min(255, r);
      imgColor.data[idx + 1] = Math.min(255, g);
      imgColor.data[idx + 2] = Math.min(255, b);
      imgColor.data[idx + 3] = 255;

      const rough = Math.round(170 + litter * 68);
      imgRough.data[idx] = rough;
      imgRough.data[idx + 1] = rough;
      imgRough.data[idx + 2] = rough;
      imgRough.data[idx + 3] = 255;
    }
  }

  ctxColor.putImageData(imgColor, 0, 0);
  ctxRough.putImageData(imgRough, 0, 0);

  return {
    map: finalizeTexture(cColor, true, anisotropy),
    normalMap: heightFieldToNormalTexture(heights, size, 3.6, anisotropy),
    roughnessMap: finalizeTexture(cRough, false, anisotropy),
  };
}

function generateCanvasFabricPBR(size: number, anisotropy: number): PBRTextureSet {
  const [cColor, ctxColor] = createCanvas(size);
  const [cRough, ctxRough] = createCanvas(size);
  const imgColor = ctxColor.createImageData(size, size);
  const imgRough = ctxRough.createImageData(size, size);
  const heights = new Float32Array(size * size);

  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const weaveX = Math.sin(u * 96 * Math.PI) * 0.5 + 0.5;
      const weaveY = Math.sin(v * 96 * Math.PI) * 0.5 + 0.5;
      const weave = (weaveX + weaveY) * 0.5;
      const crease = fbmPeriodic(u, v, 5, 5, 3, 521);
      heights[y * size + x] = weave * 0.35 + crease * 0.65;

      // Olive drab expedition backpack canvas
      const shade = 0.72 + crease * 0.36 + (weave - 0.5) * 0.12;
      const idx = (y * size + x) * 4;
      imgColor.data[idx] = Math.min(255, 68 * shade);
      imgColor.data[idx + 1] = Math.min(255, 79 * shade);
      imgColor.data[idx + 2] = Math.min(255, 49 * shade);
      imgColor.data[idx + 3] = 255;

      const rough = Math.round(215 + (1 - weave) * 32);
      imgRough.data[idx] = rough;
      imgRough.data[idx + 1] = rough;
      imgRough.data[idx + 2] = rough;
      imgRough.data[idx + 3] = 255;
    }
  }

  ctxColor.putImageData(imgColor, 0, 0);
  ctxRough.putImageData(imgRough, 0, 0);

  return {
    map: finalizeTexture(cColor, true, anisotropy),
    normalMap: heightFieldToNormalTexture(heights, size, 3.0, anisotropy),
    roughnessMap: finalizeTexture(cRough, false, anisotropy),
  };
}

function generateRopePBR(size: number, anisotropy: number): PBRTextureSet {
  const [cColor, ctxColor] = createCanvas(size);
  const [cRough, ctxRough] = createCanvas(size);
  const imgColor = ctxColor.createImageData(size, size);
  const imgRough = ctxRough.createImageData(size, size);
  const heights = new Float32Array(size * size);

  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const twist = Math.sin((u * 14 + v * 6) * Math.PI * 2) * 0.5 + 0.5;
      const fiber = fbmPeriodic(u, v, 24, 12, 2, 601);
      heights[y * size + x] = twist * 0.75 + fiber * 0.25;

      const shade = 0.65 + twist * 0.35 + (fiber - 0.5) * 0.16;
      const idx = (y * size + x) * 4;
      imgColor.data[idx] = Math.min(255, 168 * shade);
      imgColor.data[idx + 1] = Math.min(255, 138 * shade);
      imgColor.data[idx + 2] = Math.min(255, 96 * shade);
      imgColor.data[idx + 3] = 255;

      const rough = 230;
      imgRough.data[idx] = rough;
      imgRough.data[idx + 1] = rough;
      imgRough.data[idx + 2] = rough;
      imgRough.data[idx + 3] = 255;
    }
  }

  ctxColor.putImageData(imgColor, 0, 0);
  ctxRough.putImageData(imgRough, 0, 0);

  return {
    map: finalizeTexture(cColor, true, anisotropy),
    normalMap: heightFieldToNormalTexture(heights, size, 4.5, anisotropy),
    roughnessMap: finalizeTexture(cRough, false, anisotropy),
  };
}

function generateWaterNormalMap(size: number, anisotropy: number): THREE.CanvasTexture {
  const heights = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const w1 = fbmPeriodic(u, v, 6, 12, 4, 811);
      const w2 = Math.sin((u * 8 + v * 3) * Math.PI * 2 + w1 * 2.5) * 0.18;
      const w3 = Math.cos((u * 4 - v * 9) * Math.PI * 2) * 0.12;
      heights[y * size + x] = w1 * 0.7 + w2 + w3;
    }
  }
  return heightFieldToNormalTexture(heights, size, 3.2, anisotropy);
}

/** Alpha-cutout tropical leaf cluster card for lush rainforest canopy & understory */
function generateTropicalLeafCard(size: number, anisotropy: number): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(size);
  ctx.clearRect(0, 0, size, size);

  const cx = size * 0.5;
  const cy = size * 0.56;

  // Draw 5 overlapping pointed tropical leaves radiating from stem
  const leaves = [
    { angle: -0.95, len: 0.42, wid: 0.16, hue: '#2f5e24', tip: '#4e8834' },
    { angle: 0.95, len: 0.42, wid: 0.16, hue: '#2a5620', tip: '#498030' },
    { angle: -0.45, len: 0.48, wid: 0.19, hue: '#356a28', tip: '#649e38' },
    { angle: 0.45, len: 0.48, wid: 0.19, hue: '#316224', tip: '#599234' },
    { angle: 0.0, len: 0.52, wid: 0.21, hue: '#3d742c', tip: '#74ad3c' },
  ];

  for (const lf of leaves) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(lf.angle);
    const L = size * lf.len;
    const W = size * lf.wid;

    const grad = ctx.createLinearGradient(0, 0, 0, -L);
    grad.addColorStop(0, '#1e4217');
    grad.addColorStop(0.55, lf.hue);
    grad.addColorStop(1, lf.tip);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-W, -L * 0.28, -W * 0.72, -L * 0.76, 0, -L);
    ctx.bezierCurveTo(W * 0.72, -L * 0.76, W, -L * 0.28, 0, 0);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Central vein + lateral veins
    ctx.strokeStyle = 'rgba(148, 198, 86, 0.48)';
    ctx.lineWidth = Math.max(1.5, size * 0.008);
    ctx.beginPath();
    ctx.moveTo(0, -L * 0.05);
    ctx.lineTo(0, -L * 0.92);
    ctx.stroke();

    ctx.lineWidth = Math.max(1, size * 0.004);
    for (let i = 1; i <= 5; i++) {
      const t = i / 6;
      const vy = -L * t;
      const vw = W * Math.sin(t * Math.PI) * 0.58;
      ctx.beginPath();
      ctx.moveTo(0, vy);
      ctx.lineTo(-vw, vy - L * 0.08);
      ctx.moveTo(0, vy);
      ctx.lineTo(vw, vy - L * 0.08);
      ctx.stroke();
    }
    ctx.restore();
  }

  return finalizeTexture(canvas, true, anisotropy, false);
}

/** Alpha-cutout fern frond for riverbank understory */
function generateFernFrondCard(size: number, anisotropy: number): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(size);
  ctx.clearRect(0, 0, size, size);

  const cx = size * 0.5;
  ctx.strokeStyle = '#2d571e';
  ctx.lineWidth = size * 0.016;
  ctx.beginPath();
  ctx.moveTo(cx, size * 0.96);
  ctx.quadraticCurveTo(cx + size * 0.02, size * 0.5, cx, size * 0.08);
  ctx.stroke();

  const pairs = 13;
  for (let i = 0; i < pairs; i++) {
    const t = i / (pairs - 1);
    const y = size * (0.9 - t * 0.78);
    const span = size * (0.36 * Math.sin(t * Math.PI * 0.88 + 0.2));
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.translate(cx, y);
      ctx.rotate(side * (1.28 - t * 0.25));
      const grad = ctx.createLinearGradient(0, 0, 0, -span);
      grad.addColorStop(0, '#25501c');
      grad.addColorStop(1, '#5d9834');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-span * 0.18, -span * 0.5, 0, -span);
      ctx.quadraticCurveTo(span * 0.18, -span * 0.5, 0, 0);
      ctx.fill();
      ctx.restore();
    }
  }

  return finalizeTexture(canvas, true, anisotropy, false);
}

function generateContactShadow(size: number): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(size);
  const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.05, size / 2, size / 2, size * 0.5);
  g.addColorStop(0, 'rgba(6, 10, 6, 0.85)');
  g.addColorStop(0.55, 'rgba(6, 10, 6, 0.42)');
  g.addColorStop(1, 'rgba(6, 10, 6, 0.0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

function generateSoftParticle(size: number): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(size);
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size * 0.5);
  g.addColorStop(0, 'rgba(255, 252, 232, 1.0)');
  g.addColorStop(0.35, 'rgba(255, 240, 195, 0.65)');
  g.addColorStop(1, 'rgba(255, 230, 165, 0.0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createMaterialLibrary(
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean
): MaterialLibrary {
  const anisotropy = isSoftwareGl ? 1 : Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const texSize = isSoftwareGl ? 128 : 256;

  const canoeWood = generateWoodPBR(texSize, anisotropy, 11, true);
  const paddleWood = generateWoodPBR(texSize, anisotropy, 29, false);
  const mossyBark = generateMossyBarkPBR(texSize, anisotropy);
  const bankGround = generateBankGroundPBR(texSize, anisotropy);
  const canvasFabric = generateCanvasFabricPBR(isSoftwareGl ? 128 : 256, anisotropy);
  const ropeFiber = generateRopePBR(128, anisotropy);
  const waterNormal = generateWaterNormalMap(texSize, anisotropy);
  const tropicalLeafMap = generateTropicalLeafCard(256, anisotropy);
  const fernFrondMap = generateFernFrondCard(256, anisotropy);
  const contactShadowMap = generateContactShadow(128);
  const softParticleMap = generateSoftParticle(64);

  const allTextures: THREE.Texture[] = [
    canoeWood.map,
    canoeWood.normalMap,
    canoeWood.roughnessMap,
    paddleWood.map,
    paddleWood.normalMap,
    paddleWood.roughnessMap,
    mossyBark.map,
    mossyBark.normalMap,
    mossyBark.roughnessMap,
    bankGround.map,
    bankGround.normalMap,
    bankGround.roughnessMap,
    canvasFabric.map,
    canvasFabric.normalMap,
    canvasFabric.roughnessMap,
    ropeFiber.map,
    ropeFiber.normalMap,
    ropeFiber.roughnessMap,
    waterNormal,
    tropicalLeafMap,
    fernFrondMap,
    contactShadowMap,
    softParticleMap,
  ];

  return {
    canoeWood,
    paddleWood,
    mossyBark,
    bankGround,
    canvasFabric,
    ropeFiber,
    waterNormal,
    tropicalLeafMap,
    fernFrondMap,
    contactShadowMap,
    softParticleMap,
    dispose: () => {
      for (const t of allTextures) {
        t.dispose();
      }
    },
  };
}
