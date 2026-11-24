import * as THREE from 'three';

export interface PBRTextureSet {
  map: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  aoMap?: THREE.CanvasTexture;
}

// Fast deterministic PRNG (Mulberry32)
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Tileable 2D value noise for seamless PBR generation
function createNoiseGrid(size: number, seed: number): Float32Array {
  const rand = mulberry32(seed);
  const grid = new Float32Array(size * size);
  for (let i = 0; i < grid.length; i++) grid[i] = rand();
  return grid;
}

function sampleTileNoise(grid: Float32Array, size: number, x: number, y: number): number {
  const fx = ((x % size) + size) % size;
  const fy = ((y % size) + size) % size;
  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const x1 = (x0 + 1) % size;
  const y1 = (y0 + 1) % size;
  const tx = fx - x0;
  const ty = fy - y0;
  const sx = tx * tx * (3 - 2 * tx);
  const sy = ty * ty * (3 - 2 * ty);

  const v00 = grid[y0 * size + x0];
  const v10 = grid[y0 * size + x1];
  const v01 = grid[y1 * size + x0];
  const v11 = grid[y1 * size + x1];

  const nx0 = v00 + (v10 - v00) * sx;
  const nx1 = v01 + (v11 - v01) * sx;
  return nx0 + (nx1 - nx0) * sy;
}

function fbmTile(
  grids: Float32Array[],
  gridSize: number,
  u: number,
  v: number,
  baseFreq: number
): number {
  let sum = 0;
  let amp = 0.5;
  let freq = baseFreq;
  let norm = 0;
  for (let i = 0; i < grids.length; i++) {
    sum += amp * sampleTileNoise(grids[i], gridSize, u * freq, v * freq);
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}

function configureTexture(
  canvas: HTMLCanvasElement,
  colorSpace: THREE.ColorSpace,
  repeatX = 1,
  repeatY = 1
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.colorSpace = colorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

function buildNormalCanvasFromHeight(
  height: Float32Array,
  width: number,
  heightPx: number,
  strength: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = heightPx;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(width, heightPx);
  const data = img.data;

  for (let y = 0; y < heightPx; y++) {
    const ym = (y - 1 + heightPx) % heightPx;
    const yp = (y + 1) % heightPx;
    for (let x = 0; x < width; x++) {
      const xm = (x - 1 + width) % width;
      const xp = (x + 1) % width;

      const hl = height[y * width + xm];
      const hr = height[y * width + xp];
      const hu = height[ym * width + x];
      const hd = height[yp * width + x];

      const dx = (hl - hr) * strength;
      const dy = (hu - hd) * strength;
      const dz = 1.0;
      const invLen = 1 / Math.sqrt(dx * dx + dy * dy + dz * dz);

      const idx = (y * width + x) * 4;
      data[idx] = Math.round((dx * invLen * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.round((dy * invLen * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.round((dz * invLen * 0.5 + 0.5) * 255);
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

// ---------------------------------------------------------------------------
// 1. HERO TERRACOTTA (Handcrafted porous clay, kiln variations, throwing rings)
// ---------------------------------------------------------------------------
function generateTerracottaTextures(): PBRTextureSet {
  const size = 1024; // Crisp 1K normal/roughness + 2K visual feel via high-frequency pores
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const colorCtx = colorCanvas.getContext('2d')!;
  const colorImg = colorCtx.createImageData(size, size);

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const roughCtx = roughCanvas.getContext('2d')!;
  const roughImg = roughCtx.createImageData(size, size);

  const height = new Float32Array(size * size);
  const g1 = createNoiseGrid(32, 101);
  const g2 = createNoiseGrid(32, 202);
  const g3 = createNoiseGrid(32, 303);
  const rand = mulberry32(404);

  for (let y = 0; y < size; y++) {
    const v = y / size;
    // Horizontal wheel-throwing undulations
    const wheelRing =
      Math.sin(v * Math.PI * 52) * 0.35 +
      Math.sin(v * Math.PI * 19 + 1.2) * 0.25 +
      Math.sin(v * Math.PI * 124) * 0.12;
    // Subtle mineral patina near upper rim and darker damp clay near base
    const rimChalk = Math.pow(Math.max(0, 1 - Math.abs(v - 0.14) * 5.2), 2);
    const baseDamp = Math.pow(Math.max(0, (v - 0.62) / 0.38), 1.6);

    for (let x = 0; x < size; x++) {
      const u = x / size;
      const nBroad = fbmTile([g1, g2, g3], 32, u, v, 4);
      const nFine = sampleTileNoise(g3, 32, u * 48, v * 48);
      const grain = (rand() - 0.5) * 0.12;
      const pore = rand() > 0.992 ? -0.35 : 0;

      const h = 0.5 + wheelRing * 0.12 + (nBroad - 0.5) * 0.35 + (nFine - 0.5) * 0.16 + pore + grain * 0.3;
      height[y * size + x] = h;

      // Rich warm terracotta clay palette
      let r = 179 + (nBroad - 0.5) * 34 + (nFine - 0.5) * 18 + grain * 26;
      let g = 104 + (nBroad - 0.5) * 24 + (nFine - 0.5) * 14 + grain * 18;
      let b = 74 + (nBroad - 0.5) * 18 + (nFine - 0.5) * 11 + grain * 14;

      // Efflorescence chalk near rim
      const chalkAmt = rimChalk * Math.max(0, nBroad - 0.36) * 0.58;
      r = r * (1 - chalkAmt) + 216 * chalkAmt;
      g = g * (1 - chalkAmt) + 194 * chalkAmt;
      b = b * (1 - chalkAmt) + 174 * chalkAmt;

      // Kiln & damp earth darkening at bottom
      const dampAmt = baseDamp * (0.22 + nBroad * 0.2);
      r *= 1 - dampAmt;
      g *= 1 - dampAmt * 1.08;
      b *= 1 - dampAmt * 1.12;

      if (pore < 0) {
        r *= 0.72;
        g *= 0.7;
        b *= 0.68;
      }

      const idx = (y * size + x) * 4;
      colorImg.data[idx] = Math.max(0, Math.min(255, Math.round(r)));
      colorImg.data[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
      colorImg.data[idx + 2] = Math.max(0, Math.min(255, Math.round(b)));
      colorImg.data[idx + 3] = 255;

      // Roughness: porous clay 0.74 - 0.94, damp base slightly lower
      const roughVal = Math.max(
        0.55,
        Math.min(0.97, 0.84 + (nBroad - 0.5) * 0.14 + chalkAmt * 0.12 - dampAmt * 0.25 + (pore < 0 ? 0.1 : 0))
      );
      const rByte = Math.round(roughVal * 255);
      roughImg.data[idx] = rByte;
      roughImg.data[idx + 1] = rByte;
      roughImg.data[idx + 2] = rByte;
      roughImg.data[idx + 3] = 255;
    }
  }

  colorCtx.putImageData(colorImg, 0, 0);
  roughCtx.putImageData(roughImg, 0, 0);
  const normalCanvas = buildNormalCanvasFromHeight(height, size, size, 3.2);

  return {
    map: configureTexture(colorCanvas, THREE.SRGBColorSpace, 1, 1),
    normalMap: configureTexture(normalCanvas, THREE.NoColorSpace, 1, 1),
    roughnessMap: configureTexture(roughCanvas, THREE.NoColorSpace, 1, 1),
  };
}

// ---------------------------------------------------------------------------
// 2. HERO SOIL (Rich organic dark loam, granules, subtle mineral flecks)
// ---------------------------------------------------------------------------
function generateSoilTextures(): PBRTextureSet {
  const size = 1024;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const colorCtx = colorCanvas.getContext('2d')!;
  const colorImg = colorCtx.createImageData(size, size);

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const roughCtx = roughCanvas.getContext('2d')!;
  const roughImg = roughCtx.createImageData(size, size);

  const height = new Float32Array(size * size);
  const g1 = createNoiseGrid(32, 501);
  const g2 = createNoiseGrid(32, 502);
  const g3 = createNoiseGrid(32, 503);
  const g4 = createNoiseGrid(64, 504);
  const rand = mulberry32(505);

  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const clumps = fbmTile([g1, g2, g3], 32, u, v, 6);
      const crumbs = sampleTileNoise(g4, 64, u * 54, v * 54);
      const grit = (rand() - 0.5) * 0.25;
      const isMineral = rand() > 0.994;

      const h = clumps * 0.55 + crumbs * 0.35 + grit * 0.2 + (isMineral ? 0.28 : 0);
      height[y * size + x] = h;

      let r = 64 + clumps * 34 + (crumbs - 0.5) * 28 + grit * 20;
      let g = 48 + clumps * 25 + (crumbs - 0.5) * 22 + grit * 16;
      let b = 36 + clumps * 17 + (crumbs - 0.5) * 16 + grit * 12;

      if (isMineral) {
        r = 165;
        g = 152;
        b = 136;
      }

      const idx = (y * size + x) * 4;
      colorImg.data[idx] = Math.max(0, Math.min(255, Math.round(r)));
      colorImg.data[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
      colorImg.data[idx + 2] = Math.max(0, Math.min(255, Math.round(b)));
      colorImg.data[idx + 3] = 255;

      const rough = isMineral ? 0.65 : Math.max(0.68, Math.min(0.98, 0.9 - crumbs * 0.12 + grit * 0.08));
      const rByte = Math.round(rough * 255);
      roughImg.data[idx] = rByte;
      roughImg.data[idx + 1] = rByte;
      roughImg.data[idx + 2] = rByte;
      roughImg.data[idx + 3] = 255;
    }
  }

  colorCtx.putImageData(colorImg, 0, 0);
  roughCtx.putImageData(roughImg, 0, 0);
  const normalCanvas = buildNormalCanvasFromHeight(height, size, size, 5.2);

  return {
    map: configureTexture(colorCanvas, THREE.SRGBColorSpace, 2, 2),
    normalMap: configureTexture(normalCanvas, THREE.NoColorSpace, 2, 2),
    roughnessMap: configureTexture(roughCanvas, THREE.NoColorSpace, 2, 2),
  };
}

// ---------------------------------------------------------------------------
// 3. AGED WORKBENCH WOOD (Visible fibers, plank joints, worn warmth)
// ---------------------------------------------------------------------------
function generateWoodTextures(): PBRTextureSet {
  const size = 1024;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const colorCtx = colorCanvas.getContext('2d')!;
  const colorImg = colorCtx.createImageData(size, size);

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const roughCtx = roughCanvas.getContext('2d')!;
  const roughImg = roughCtx.createImageData(size, size);

  const height = new Float32Array(size * size);
  const g1 = createNoiseGrid(32, 601);
  const g2 = createNoiseGrid(32, 602);
  const g3 = createNoiseGrid(32, 603);
  const rand = mulberry32(604);

  for (let y = 0; y < size; y++) {
    const v = y / size;
    // 4 horizontal planks
    const plankCoord = (v * 4) % 1;
    const plankIndex = Math.floor(v * 4);
    const seamDist = Math.min(plankCoord, 1 - plankCoord);
    const seamFactor = seamDist < 0.012 ? seamDist / 0.012 : 1;
    const plankTint = (plankIndex % 2 === 0 ? 1 : 0.93) + (plankIndex === 2 ? 0.05 : 0);

    for (let x = 0; x < size; x++) {
      const u = x / size;
      const warp = fbmTile([g1, g2], 32, u, v + plankIndex * 0.27, 3) * 0.16;
      const rings = Math.sin((v * 26 + warp * 18) * Math.PI * 2) * 0.5 + 0.5;
      const fineFiber = sampleTileNoise(g3, 32, u * 12, v * 110);
      const wear = fbmTile([g1, g2, g3], 32, u, v, 4);
      const micro = (rand() - 0.5) * 0.06;

      const grain = rings * 0.55 + fineFiber * 0.45;
      const h = (0.35 + grain * 0.45 + micro) * (0.25 + 0.75 * seamFactor);
      height[y * size + x] = h;

      // Aged oiled oak/walnut workbench tone
      let r = (106 + grain * 34 + (wear - 0.5) * 26) * plankTint;
      let g = (78 + grain * 25 + (wear - 0.5) * 19) * plankTint;
      let b = (56 + grain * 16 + (wear - 0.5) * 14) * plankTint;

      // Darken plank seams
      const seamShade = 0.28 + 0.72 * seamFactor;
      r *= seamShade;
      g *= seamShade;
      b *= seamShade;

      const idx = (y * size + x) * 4;
      colorImg.data[idx] = Math.max(0, Math.min(255, Math.round(r)));
      colorImg.data[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
      colorImg.data[idx + 2] = Math.max(0, Math.min(255, Math.round(b)));
      colorImg.data[idx + 3] = 255;

      // Hand-worn sheen in middle, rougher in deep grain & seams
      const rough = Math.max(
        0.48,
        Math.min(0.95, 0.74 - grain * 0.12 + (1 - seamFactor) * 0.22 + (wear - 0.5) * 0.14)
      );
      const rByte = Math.round(rough * 255);
      roughImg.data[idx] = rByte;
      roughImg.data[idx + 1] = rByte;
      roughImg.data[idx + 2] = rByte;
      roughImg.data[idx + 3] = 255;
    }
  }

  colorCtx.putImageData(colorImg, 0, 0);
  roughCtx.putImageData(roughImg, 0, 0);
  const normalCanvas = buildNormalCanvasFromHeight(height, size, size, 3.6);

  return {
    map: configureTexture(colorCanvas, THREE.SRGBColorSpace, 2, 1),
    normalMap: configureTexture(normalCanvas, THREE.NoColorSpace, 2, 1),
    roughnessMap: configureTexture(roughCanvas, THREE.NoColorSpace, 2, 1),
  };
}

// ---------------------------------------------------------------------------
// 4. AGED COPPER (Brushed sheen, subtle oxidation patina, gentle usage marks)
// ---------------------------------------------------------------------------
function generateCopperTextures(): PBRTextureSet {
  const size = 512;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const colorCtx = colorCanvas.getContext('2d')!;
  const colorImg = colorCtx.createImageData(size, size);

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const roughCtx = roughCanvas.getContext('2d')!;
  const roughImg = roughCtx.createImageData(size, size);

  const height = new Float32Array(size * size);
  const g1 = createNoiseGrid(32, 701);
  const g2 = createNoiseGrid(32, 702);
  const g3 = createNoiseGrid(32, 703);

  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const patinaNoise = fbmTile([g1, g2, g3], 32, u, v, 4);
      const brushed = sampleTileNoise(g3, 32, u * 8, v * 90);
      const tarnish = Math.max(0, patinaNoise - 0.56) * 2.1;
      const verdigris = Math.max(0, patinaNoise - 0.74) * 3.0;

      height[y * size + x] = 0.5 + (brushed - 0.5) * 0.2 + tarnish * 0.12;

      // Base warm aged copper
      let r = 186 - tarnish * 62 + (brushed - 0.5) * 14;
      let g = 118 - tarnish * 42 + (brushed - 0.5) * 10;
      let b = 82 - tarnish * 28 + (brushed - 0.5) * 8;

      // Subtle verdigris oxidation flecks
      if (verdigris > 0) {
        const m = Math.min(0.42, verdigris * 0.38);
        r = r * (1 - m) + 92 * m;
        g = g * (1 - m) + 126 * m;
        b = b * (1 - m) + 112 * m;
      }

      const idx = (y * size + x) * 4;
      colorImg.data[idx] = Math.max(0, Math.min(255, Math.round(r)));
      colorImg.data[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
      colorImg.data[idx + 2] = Math.max(0, Math.min(255, Math.round(b)));
      colorImg.data[idx + 3] = 255;

      const rough = Math.max(0.24, Math.min(0.84, 0.34 + tarnish * 0.32 + verdigris * 0.25 + (brushed - 0.5) * 0.08));
      const rByte = Math.round(rough * 255);
      roughImg.data[idx] = rByte;
      roughImg.data[idx + 1] = rByte;
      roughImg.data[idx + 2] = rByte;
      roughImg.data[idx + 3] = 255;
    }
  }

  colorCtx.putImageData(colorImg, 0, 0);
  roughCtx.putImageData(roughImg, 0, 0);
  const normalCanvas = buildNormalCanvasFromHeight(height, size, size, 1.8);

  return {
    map: configureTexture(colorCanvas, THREE.SRGBColorSpace, 1, 1),
    normalMap: configureTexture(normalCanvas, THREE.NoColorSpace, 1, 1),
    roughnessMap: configureTexture(roughCanvas, THREE.NoColorSpace, 1, 1),
  };
}

// ---------------------------------------------------------------------------
// 5. RAW LINEN FABRIC (Visible woven warp/weft, slub threads)
// ---------------------------------------------------------------------------
function generateLinenTextures(): PBRTextureSet {
  const size = 512;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const colorCtx = colorCanvas.getContext('2d')!;
  const colorImg = colorCtx.createImageData(size, size);

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const roughCtx = roughCanvas.getContext('2d')!;
  const roughImg = roughCtx.createImageData(size, size);

  const height = new Float32Array(size * size);
  const g1 = createNoiseGrid(32, 801);
  const g2 = createNoiseGrid(32, 802);

  for (let y = 0; y < size; y++) {
    const v = y / size;
    const weftSlub = sampleTileNoise(g1, 32, 0.5, v * 48);
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const warpSlub = sampleTileNoise(g2, 32, u * 48, 0.5);
      const warp = Math.sin(u * Math.PI * 150) * 0.5 + 0.5;
      const weft = Math.sin(v * Math.PI * 150) * 0.5 + 0.5;
      const checker = (Math.floor(u * 150) + Math.floor(v * 150)) % 2 === 0;
      const weave = checker ? warp * 0.75 + weft * 0.25 : weft * 0.75 + warp * 0.25;
      const slub = (warpSlub + weftSlub) * 0.5;

      height[y * size + x] = weave * 0.65 + slub * 0.35;

      const tone = 204 + (weave - 0.5) * 26 + (slub - 0.5) * 22;
      const idx = (y * size + x) * 4;
      colorImg.data[idx] = Math.max(0, Math.min(255, Math.round(tone * 1.01)));
      colorImg.data[idx + 1] = Math.max(0, Math.min(255, Math.round(tone * 0.96)));
      colorImg.data[idx + 2] = Math.max(0, Math.min(255, Math.round(tone * 0.87)));
      colorImg.data[idx + 3] = 255;

      const rByte = Math.round((0.88 + (1 - weave) * 0.1) * 255);
      roughImg.data[idx] = rByte;
      roughImg.data[idx + 1] = rByte;
      roughImg.data[idx + 2] = rByte;
      roughImg.data[idx + 3] = 255;
    }
  }

  colorCtx.putImageData(colorImg, 0, 0);
  roughCtx.putImageData(roughImg, 0, 0);
  const normalCanvas = buildNormalCanvasFromHeight(height, size, size, 2.8);

  return {
    map: configureTexture(colorCanvas, THREE.SRGBColorSpace, 3, 3),
    normalMap: configureTexture(normalCanvas, THREE.NoColorSpace, 3, 3),
    roughnessMap: configureTexture(roughCanvas, THREE.NoColorSpace, 3, 3),
  };
}

// ---------------------------------------------------------------------------
// 6. BOTANICAL LEAF (Midrib, lateral venation, organic micro-cells)
// ---------------------------------------------------------------------------
function generateLeafTextures(): PBRTextureSet {
  const size = 512;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const colorCtx = colorCanvas.getContext('2d')!;
  const colorImg = colorCtx.createImageData(size, size);

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const roughCtx = roughCanvas.getContext('2d')!;
  const roughImg = roughCtx.createImageData(size, size);

  const height = new Float32Array(size * size);
  const g1 = createNoiseGrid(32, 901);
  const g2 = createNoiseGrid(32, 902);

  for (let y = 0; y < size; y++) {
    const v = y / size; // 0 = base, 1 = tip
    for (let x = 0; x < size; x++) {
      const u = x / size; // 0.5 = center midrib
      const dx = Math.abs(u - 0.5);
      const midrib = Math.exp(-dx * 42) * (1 - v * 0.55);

      // Pinnate lateral veins angling upward
      const veinWave = Math.sin((v * 14 - dx * 7.5) * Math.PI * 2);
      const lateralVein = Math.pow(Math.max(0, veinWave), 10) * Math.exp(-dx * 2.2) * (1 - Math.exp(-dx * 25));

      const cells = fbmTile([g1, g2], 32, u, v, 8);
      const veinTotal = Math.min(1, midrib * 0.95 + lateralVein * 0.45);
      height[y * size + x] = 0.45 + veinTotal * 0.42 + (cells - 0.5) * 0.14;

      // Neutral-tinted greyscale-green detail map so species color multiplies naturally
      const lum = 186 + veinTotal * 46 + (cells - 0.5) * 28 - Math.abs(u - 0.5) * 26;
      const idx = (y * size + x) * 4;
      colorImg.data[idx] = Math.max(0, Math.min(255, Math.round(lum * 0.96)));
      colorImg.data[idx + 1] = Math.max(0, Math.min(255, Math.round(lum * 1.04)));
      colorImg.data[idx + 2] = Math.max(0, Math.min(255, Math.round(lum * 0.9)));
      colorImg.data[idx + 3] = 255;

      const rough = Math.max(0.32, Math.min(0.75, 0.52 - veinTotal * 0.12 + (cells - 0.5) * 0.14));
      const rByte = Math.round(rough * 255);
      roughImg.data[idx] = rByte;
      roughImg.data[idx + 1] = rByte;
      roughImg.data[idx + 2] = rByte;
      roughImg.data[idx + 3] = 255;
    }
  }

  colorCtx.putImageData(colorImg, 0, 0);
  roughCtx.putImageData(roughImg, 0, 0);
  const normalCanvas = buildNormalCanvasFromHeight(height, size, size, 2.6);

  return {
    map: configureTexture(colorCanvas, THREE.SRGBColorSpace, 1, 1),
    normalMap: configureTexture(normalCanvas, THREE.NoColorSpace, 1, 1),
    roughnessMap: configureTexture(roughCanvas, THREE.NoColorSpace, 1, 1),
  };
}

// ---------------------------------------------------------------------------
// 7. IMPERFECT GREENHOUSE GLASS (Subtle edge grime, condensation streaks)
// ---------------------------------------------------------------------------
function generateGlassRoughnessTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  const g1 = createNoiseGrid(32, 1001);
  const g2 = createNoiseGrid(32, 1002);

  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const edge = Math.max(
        Math.pow(Math.abs(u - 0.5) * 2, 3),
        Math.pow(Math.abs(v - 0.5) * 2, 3)
      );
      const mist = fbmTile([g1, g2], 32, u, v, 5);
      const streak = sampleTileNoise(g2, 32, u * 18, v * 3);
      const rough = Math.max(0.06, Math.min(0.85, 0.12 + edge * 0.42 + mist * 0.22 + streak * 0.08));
      const b = Math.round(rough * 255);
      const idx = (y * size + x) * 4;
      img.data[idx] = b;
      img.data[idx + 1] = b;
      img.data[idx + 2] = b;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return configureTexture(canvas, THREE.NoColorSpace, 1, 1);
}

export interface GardenTextureAtlas {
  terracotta: PBRTextureSet;
  soil: PBRTextureSet;
  wood: PBRTextureSet;
  copper: PBRTextureSet;
  linen: PBRTextureSet;
  leaf: PBRTextureSet;
  glassRoughness: THREE.CanvasTexture;
}

let cachedAtlas: GardenTextureAtlas | null = null;

export function getGardenTextures(): GardenTextureAtlas {
  if (!cachedAtlas) {
    cachedAtlas = {
      terracotta: generateTerracottaTextures(),
      soil: generateSoilTextures(),
      wood: generateWoodTextures(),
      copper: generateCopperTextures(),
      linen: generateLinenTextures(),
      leaf: generateLeafTextures(),
      glassRoughness: generateGlassRoughnessTexture(),
    };
  }
  return cachedAtlas;
}
