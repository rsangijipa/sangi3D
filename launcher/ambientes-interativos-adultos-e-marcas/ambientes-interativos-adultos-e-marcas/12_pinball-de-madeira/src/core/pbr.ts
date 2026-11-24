import * as THREE from 'three';
import { clamp01, fbmT, hash, lerp, ridgedT, smoothstep, valueT, worleyT, type CellSample } from './noise';

/**
 * Gerador de conjuntos de texturas PBR (cor + normal + rugosidade) 100% procedurais.
 * O relevo é calculado como mapa de altura e convertido em normal map por diferenças centrais,
 * o que dá aos materiais o micro-relevo que a luz rasante revela (madeira, gesso, areia, casca...).
 */

export interface TexSample {
  h: number;
  r: number;
  g: number;
  b: number;
  rough: number;
}

export interface TexSet {
  map: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  dispose(): void;
}

export interface TexOptions {
  size: number;
  aniso: number;
  normalStrength?: number;
  repeat?: [number, number];
  sample: (u: number, v: number, out: TexSample) => void;
}

function canvas(size: number) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  return c;
}

function finish(tex: THREE.CanvasTexture, aniso: number, repeat: [number, number], srgb: boolean) {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat[0], repeat[1]);
  tex.anisotropy = aniso;
  tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.needsUpdate = true;
  return tex;
}

export function makeTexSet(o: TexOptions): TexSet {
  const n = o.size;
  const heights = new Float32Array(n * n);
  const cC = canvas(n);
  const nC = canvas(n);
  const rC = canvas(n);
  const cx = cC.getContext('2d')!;
  const nx = nC.getContext('2d')!;
  const rx = rC.getContext('2d')!;
  const cImg = cx.createImageData(n, n);
  const nImg = nx.createImageData(n, n);
  const rImg = rx.createImageData(n, n);
  const s: TexSample = { h: 0, r: 0, g: 0, b: 0, rough: 0 };

  for (let y = 0; y < n; y++) {
    const v = 1 - y / n;
    for (let x = 0; x < n; x++) {
      const u = x / n;
      o.sample(u, v, s);
      const i = y * n + x;
      heights[i] = s.h;
      const p = i * 4;
      cImg.data[p] = clamp01(s.r) * 255;
      cImg.data[p + 1] = clamp01(s.g) * 255;
      cImg.data[p + 2] = clamp01(s.b) * 255;
      cImg.data[p + 3] = 255;
      const rr = clamp01(s.rough) * 255;
      // rugosidade lida do canal G (padrão do three.js)
      rImg.data[p] = rr;
      rImg.data[p + 1] = rr;
      rImg.data[p + 2] = rr;
      rImg.data[p + 3] = 255;
    }
  }

  const k = (o.normalStrength ?? 2) * (n / 512);
  for (let y = 0; y < n; y++) {
    const yu = ((y - 1 + n) % n) * n;
    const yd = ((y + 1) % n) * n;
    const yr = y * n;
    for (let x = 0; x < n; x++) {
      const xl = (x - 1 + n) % n;
      const xr = (x + 1) % n;
      const dx = (heights[yr + xr] - heights[yr + xl]) * k;
      const dy = (heights[yd + x] - heights[yu + x]) * k;
      const inv = 1 / Math.sqrt(dx * dx + dy * dy + 1);
      const p = (yr + x) * 4;
      nImg.data[p] = (-dx * inv * 0.5 + 0.5) * 255;
      nImg.data[p + 1] = (dy * inv * 0.5 + 0.5) * 255;
      nImg.data[p + 2] = (inv * 0.5 + 0.5) * 255;
      nImg.data[p + 3] = 255;
    }
  }

  cx.putImageData(cImg, 0, 0);
  nx.putImageData(nImg, 0, 0);
  rx.putImageData(rImg, 0, 0);
  const repeat = o.repeat ?? [1, 1];
  const map = finish(new THREE.CanvasTexture(cC), o.aniso, repeat, true);
  const normalMap = finish(new THREE.CanvasTexture(nC), o.aniso, repeat, false);
  const roughnessMap = finish(new THREE.CanvasTexture(rC), o.aniso, repeat, false);
  return {
    map,
    normalMap,
    roughnessMap,
    dispose() {
      map.dispose();
      normalMap.dispose();
      roughnessMap.dispose();
    },
  };
}

type RGB = [number, number, number];
/** Cor hexadecimal em sRGB (o canvas trabalha em sRGB). */
function srgbHex(h: string): RGB {
  const v = parseInt(h.replace('#', ''), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}
const mix3 = (a: RGB, b: RGB, t: number): RGB => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/* ------------------------------------------------------------------ */
/* Biblioteca de superfícies                                            */
/* ------------------------------------------------------------------ */

export interface WoodOptions {
  light: string;
  dark: string;
  planks?: number; // linhas de tábuas; 0 = madeira contínua
  grainScale?: number;
  gloss?: number; // 0..1 (verniz)
  seed?: number;
  weathered?: number;
}

/** Madeira com veios, nós, variação por tábua e frestas entre as tábuas. */
export function woodSampler(o: WoodOptions) {
  const L = srgbHex(o.light);
  const D = srgbHex(o.dark);
  const rows = o.planks ?? 0;
  const seed = o.seed ?? 3;
  const gs = o.grainScale ?? 1;
  const gloss = o.gloss ?? 0.3;
  const weathered = o.weathered ?? 0;
  const cell: CellSample = { f1: 0, f2: 0, id: 0 };
  return (u: number, v: number, s: TexSample) => {
    let lv = v;
    let plankId = 0;
    let gap = 0;
    let lu = u;
    if (rows > 0) {
      const row = Math.floor(v * rows);
      lv = v * rows - row;
      const offset = hash(row, 1, seed) * 0.9;
      const segs = 2;
      const along = u * segs + offset;
      const seg = Math.floor(along);
      lu = along - seg;
      plankId = hash(row, seg, seed);
      const edgeV = Math.min(lv, 1 - lv);
      const edgeU = Math.min(lu, 1 - lu) / segs * 6;
      gap = 1 - smoothstep(0.0, 0.035, Math.min(edgeV, edgeU));
    }
    // veios: anéis distorcidos por ruído, alongados ao longo de U
    const warp = fbmT(u * 4 * gs, v * 16 * gs, 4 * gs, 4, seed + 5);
    const ringCoord = (v * (rows || 1) * 7 + warp * 3.2 + plankId * 5) * 5 * gs;
    const rings = Math.pow(Math.abs(Math.sin(ringCoord * Math.PI)), 0.6);
    const fine = fbmT(u * 64 * gs, v * 512 * gs, 64 * gs, 3, seed + 9);
    // nós ocasionais
    worleyT(u * 6, v * 6 * Math.max(1, rows / 2), 6, seed + 21, cell);
    const knot = cell.id > 0.86 ? smoothstep(0.28, 0.0, cell.f1) : 0;
    let t = rings * 0.55 + fine * 0.35 + knot * 0.8 + (plankId - 0.5) * 0.35;
    t = clamp01(t);
    let c = mix3(L, D, t);
    const tone = 0.86 + plankId * 0.28;
    c = [c[0] * tone, c[1] * tone, c[2] * tone];
    if (weathered > 0) {
      const w = fbmT(u * 8, v * 8, 8, 4, seed + 40);
      const gray: RGB = [0.52, 0.5, 0.47];
      c = mix3(c, gray, weathered * smoothstep(0.35, 0.8, w) * 0.6);
    }
    c = mix3(c, [c[0] * 0.25, c[1] * 0.22, c[2] * 0.2], gap);
    s.r = c[0];
    s.g = c[1];
    s.b = c[2];
    s.h = (1 - gap) * 0.6 + fine * 0.18 - rings * 0.07 - knot * 0.1 + weathered * fbmT(u * 32, v * 128, 32, 3, seed) * 0.15;
    s.rough = clamp01(lerp(0.78, 0.32, gloss) + fine * 0.12 + gap * 0.3 + weathered * 0.25 + knot * 0.05);
  };
}

/** Gesso/reboco artesanal levemente irregular. */
export function plasterSampler(color: string, seed = 11, relief = 1) {
  const C = srgbHex(color);
  return (u: number, v: number, s: TexSample) => {
    const big = fbmT(u * 3, v * 3, 3, 4, seed);
    const mid = fbmT(u * 18, v * 18, 18, 4, seed + 3);
    const fine = valueT(u * 256, v * 256, 256, seed + 9);
    const t = 0.92 + (big - 0.5) * 0.12 + (mid - 0.5) * 0.06 + (fine - 0.5) * 0.03;
    s.r = C[0] * t;
    s.g = C[1] * t;
    s.b = C[2] * t;
    s.h = (mid * 0.6 + fine * 0.25 + big * 0.4) * relief;
    s.rough = 0.88 + (fine - 0.5) * 0.1;
  };
}

/** Tatame: trama de palha de junco com faixas regulares. */
export function tatamiSampler(seed = 4) {
  const A = srgbHex('#b8a86a');
  const B = srgbHex('#8f8547');
  return (u: number, v: number, s: TexSample) => {
    const strands = 96;
    const sv = v * strands;
    const strand = Math.floor(sv);
    const local = sv - strand;
    const roundness = Math.sin(local * Math.PI);
    const weft = Math.abs(Math.sin(u * Math.PI * 24));
    const jitter = hash(strand, 3, seed);
    const fib = fbmT(u * 128, v * 8, 128, 3, seed);
    const t = clamp01(0.35 + jitter * 0.4 + fib * 0.3 - weft * 0.08);
    const c = mix3(A, B, t);
    const pinch = smoothstep(0.92, 1, weft) * 0.4;
    s.r = c[0] * (1 - pinch * 0.4);
    s.g = c[1] * (1 - pinch * 0.4);
    s.b = c[2] * (1 - pinch * 0.4);
    s.h = roundness * 0.6 - pinch * 0.5 + fib * 0.1;
    s.rough = 0.7 + fib * 0.15;
  };
}

/** Tecido (linho / algodão) com trama visível. */
export function fabricSampler(color: string, seed = 8, threads = 160) {
  const C = srgbHex(color);
  return (u: number, v: number, s: TexSample) => {
    const wu = Math.sin(u * Math.PI * threads);
    const wv = Math.sin(v * Math.PI * threads);
    const over = (Math.floor(u * threads) + Math.floor(v * threads)) % 2 === 0 ? 1 : 0;
    const weave = over ? Math.abs(wu) : Math.abs(wv);
    const slub = fbmT(u * 32, v * 4, 32, 3, seed);
    const mottle = fbmT(u * 6, v * 6, 6, 4, seed + 5);
    const t = 0.82 + weave * 0.16 + (slub - 0.5) * 0.12 + (mottle - 0.5) * 0.1;
    s.r = C[0] * t;
    s.g = C[1] * t;
    s.b = C[2] * t;
    s.h = weave * 0.7 + slub * 0.2;
    s.rough = 0.92;
  };
}

/** Pedra / rocha com fissuras celulares e liquens. */
export function stoneSampler(light: string, dark: string, seed = 12, lichen = 0) {
  const L = srgbHex(light);
  const D = srgbHex(dark);
  const M = srgbHex('#7d8a4a');
  const cell: CellSample = { f1: 0, f2: 0, id: 0 };
  return (u: number, v: number, s: TexSample) => {
    const n = fbmT(u * 6, v * 6, 6, 5, seed);
    worleyT(u * 5, v * 5, 5, seed + 2, cell);
    const crack = smoothstep(0.06, 0.0, cell.f2 - cell.f1);
    const speck = valueT(u * 300, v * 300, 300, seed + 4);
    let c = mix3(L, D, clamp01(n * 0.9 + cell.id * 0.25 - 0.1));
    c = mix3(c, [c[0] * 0.92 + speck * 0.12, c[1] * 0.92 + speck * 0.12, c[2] * 0.92 + speck * 0.12], 0.5);
    if (lichen > 0) {
      const l = fbmT(u * 10, v * 10, 10, 4, seed + 9);
      c = mix3(c, M, smoothstep(0.62, 0.78, l) * lichen);
    }
    c = mix3(c, [c[0] * 0.35, c[1] * 0.35, c[2] * 0.35], crack);
    s.r = c[0];
    s.g = c[1];
    s.b = c[2];
    s.h = n * 0.8 - crack * 0.6 + speck * 0.08;
    s.rough = 0.72 + n * 0.2;
  };
}

/** Casca de árvore: sulcos verticais profundos e musgo nas fendas. */
export function barkSampler(seed = 6) {
  const L = srgbHex('#7a6450');
  const D = srgbHex('#2e241c');
  const M = srgbHex('#4f6a2e');
  return (u: number, v: number, s: TexSample) => {
    const warp = fbmT(u * 4, v * 2, 4, 3, seed) * 0.6;
    const ridges = ridgedT(u * 10 + warp * 3, v * 2.5, 10, 4, seed + 3);
    const plates = fbmT(u * 14, v * 5, 14, 4, seed + 8);
    const fine = valueT(u * 200, v * 120, 200, seed + 2);
    const depth = clamp01(ridges * 0.75 + plates * 0.35);
    let c = mix3(D, L, depth);
    const moss = smoothstep(0.55, 0.25, depth) * smoothstep(0.45, 0.7, fbmT(u * 6, v * 3, 6, 4, seed + 15));
    c = mix3(c, M, moss * 0.75);
    s.r = c[0] * (0.92 + fine * 0.12);
    s.g = c[1] * (0.92 + fine * 0.12);
    s.b = c[2] * (0.92 + fine * 0.12);
    s.h = depth + fine * 0.05;
    s.rough = 0.9 - moss * 0.1;
  };
}

/** Telhas de madeira (shingles) escalonadas. */
export function shingleSampler(seed = 2) {
  const A = srgbHex('#6b4b36');
  const B = srgbHex('#3a2a20');
  return (u: number, v: number, s: TexSample) => {
    const rows = 10;
    const ry = v * rows;
    const row = Math.floor(ry);
    const lv = ry - row;
    const cols = 8;
    const rx = u * cols + (row % 2) * 0.5;
    const col = Math.floor(rx);
    const lu = rx - col;
    const id = hash(((col % cols) + cols) % cols, row, seed);
    const grain = fbmT(u * 16, v * 80, 16, 3, seed + 1);
    const edge = smoothstep(0.0, 0.05, Math.min(lu, 1 - lu));
    const bottom = smoothstep(0.0, 0.12, lv);
    const t = clamp01(0.3 + id * 0.5 + grain * 0.3);
    let c = mix3(A, B, t);
    const shade = (0.55 + 0.45 * lv) * (0.5 + 0.5 * edge);
    c = [c[0] * shade, c[1] * shade, c[2] * shade];
    const moss = smoothstep(0.62, 0.8, fbmT(u * 5, v * 5, 5, 4, seed + 9));
    c = mix3(c, srgbHex('#566b33'), moss * 0.5);
    s.r = c[0];
    s.g = c[1];
    s.b = c[2];
    s.h = lv * 0.7 * edge * bottom + grain * 0.12;
    s.rough = 0.85;
  };
}

/** Areia fina com micro-grãos e ondulações sutis. */
export function sandSampler(color: string, seed = 5) {
  const C = srgbHex(color);
  return (u: number, v: number, s: TexSample) => {
    const g1 = valueT(u * 420, v * 420, 420, seed);
    const g2 = valueT(u * 900, v * 900, 900, seed + 1);
    const patches = fbmT(u * 5, v * 5, 5, 4, seed + 2);
    const dark = hash(Math.floor(u * 700), Math.floor(v * 700), seed + 3) > 0.94 ? 0.6 : 1;
    const light = hash(Math.floor(u * 650), Math.floor(v * 650), seed + 5) > 0.95 ? 1.25 : 1;
    const t = (0.88 + (patches - 0.5) * 0.14 + (g1 - 0.5) * 0.12) * dark * light;
    s.r = C[0] * t;
    s.g = C[1] * t;
    s.b = C[2] * t;
    s.h = g1 * 0.55 + g2 * 0.35 + patches * 0.2;
    s.rough = 0.92 + (g2 - 0.5) * 0.06;
  };
}

/** Solo da clareira: terra, folhas secas e grama rala. */
export function groundSampler(seed = 9) {
  const G = srgbHex('#4d6b2b');
  const G2 = srgbHex('#6f8a3a');
  const S = srgbHex('#5b4632');
  const cell: CellSample = { f1: 0, f2: 0, id: 0 };
  return (u: number, v: number, s: TexSample) => {
    const n = fbmT(u * 8, v * 8, 8, 5, seed);
    const blades = valueT(u * 220, v * 220, 220, seed + 1);
    worleyT(u * 30, v * 30, 30, seed + 4, cell);
    const pebble = smoothstep(0.25, 0.1, cell.f1) * (cell.id > 0.8 ? 1 : 0);
    const soil = smoothstep(0.55, 0.75, n);
    let c = mix3(G, G2, blades);
    c = mix3(c, S, soil * 0.85);
    c = mix3(c, srgbHex('#8a7f70'), pebble);
    s.r = c[0];
    s.g = c[1];
    s.b = c[2];
    s.h = blades * 0.4 + pebble * 0.6 + n * 0.3;
    s.rough = 0.95;
  };
}

/** Metal martelado (tigela tibetana) — pequenas covas de martelo. */
export function hammeredSampler(color: string, seed = 14) {
  const C = srgbHex(color);
  const cell: CellSample = { f1: 0, f2: 0, id: 0 };
  return (u: number, v: number, s: TexSample) => {
    worleyT(u * 22, v * 22, 22, seed, cell);
    const dimple = cell.f1 * cell.f1;
    const n = fbmT(u * 6, v * 6, 6, 4, seed + 1);
    const t = 0.9 + (n - 0.5) * 0.2 + cell.id * 0.06;
    s.r = C[0] * t;
    s.g = C[1] * t;
    s.b = C[2] * t;
    s.h = dimple;
    s.rough = 0.22 + n * 0.18;
  };
}

/** Bronze envelhecido com pátina esverdeada nas regiões menos polidas. */
export function bronzeSampler(seed = 21) {
  const B = srgbHex('#8a6431');
  const P = srgbHex('#4f6b58');
  return (u: number, v: number, s: TexSample) => {
    const n = fbmT(u * 6, v * 6, 6, 5, seed);
    const pat = smoothstep(0.58, 0.82, n);
    const c = mix3(B, P, pat * 0.7);
    s.r = c[0];
    s.g = c[1];
    s.b = c[2];
    s.h = n * 0.3 + pat * 0.2;
    s.rough = 0.3 + pat * 0.45;
  };
}

/** Papel washi / shoji com fibras longas. */
export function paperSampler(color: string, seed = 33) {
  const C = srgbHex(color);
  return (u: number, v: number, s: TexSample) => {
    const fib = ridgedT(u * 18, v * 3, 18, 3, seed);
    const fib2 = ridgedT(v * 14 + 0.3, u * 4, 14, 3, seed + 1);
    const n = fbmT(u * 6, v * 6, 6, 4, seed + 2);
    const t = 0.9 + n * 0.08 - (fib * fib2) * 0.06;
    s.r = C[0] * t;
    s.g = C[1] * t;
    s.b = C[2] * t;
    s.h = fib * 0.3 + n * 0.2;
    s.rough = 0.95;
  };
}

/** Atalho: cria um MeshStandardMaterial já com todos os mapas. */
export function pbrMaterial(
  set: TexSet,
  extra: THREE.MeshStandardMaterialParameters = {},
  normalScale = 1,
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map: set.map,
    normalMap: set.normalMap,
    roughnessMap: set.roughnessMap,
    normalScale: new THREE.Vector2(normalScale, normalScale),
    roughness: 1,
    ...extra,
  });
}

export function physicalMaterial(
  set: TexSet,
  extra: THREE.MeshPhysicalMaterialParameters = {},
  normalScale = 1,
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    map: set.map,
    normalMap: set.normalMap,
    roughnessMap: set.roughnessMap,
    normalScale: new THREE.Vector2(normalScale, normalScale),
    roughness: 1,
    ...extra,
  });
}

/** Duplica as texturas de um conjunto com outra repetição (compartilhando a imagem). */
export function withRepeat(set: TexSet, rx: number, ry: number): TexSet {
  const clone = (t: THREE.CanvasTexture) => {
    const c = t.clone() as THREE.CanvasTexture;
    c.repeat.set(rx, ry);
    c.needsUpdate = true;
    return c;
  };
  const map = clone(set.map);
  const normalMap = clone(set.normalMap);
  const roughnessMap = clone(set.roughnessMap);
  return {
    map,
    normalMap,
    roughnessMap,
    dispose() {
      map.dispose();
      normalMap.dispose();
      roughnessMap.dispose();
    },
  };
}
