// Texturas procedurais PBR geradas em canvas (sem arquivos externos).
// Cor em sRGB; rugosidade e normal como dados lineares. UV pensadas em metros.
import * as THREE from 'three';
import { mulberry } from '../sim/weavePath.ts';

export interface PbrSet {
  map: THREE.Texture;
  normalMap: THREE.Texture;
  roughnessMap?: THREE.Texture;
}

let maxAniso = 4;
export function setMaxAnisotropy(v: number): void { maxAniso = Math.max(1, Math.min(8, v)); }

// ---------- ruído ----------

class Noise2 {
  private perm: Uint8Array;
  private grad: Float32Array;
  constructor(seed: number) {
    const rnd = mulberry(seed);
    this.perm = new Uint8Array(512);
    const p = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
    this.grad = new Float32Array(512);
    for (let i = 0; i < 256; i++) { const a = rnd() * Math.PI * 2; this.grad[i * 2] = Math.cos(a); this.grad[i * 2 + 1] = Math.sin(a); }
  }
  /** Perlin 2D com período (tileável) px, py. */
  get(x: number, y: number, px = 256, py = 256): number {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10);
    const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);
    const g = (ix: number, iy: number, dx: number, dy: number) => {
      const h = this.perm[(this.perm[((ix % px) + px) % px & 255] + (((iy % py) + py) % py)) & 511] & 255;
      return this.grad[h * 2] * dx + this.grad[h * 2 + 1] * dy;
    };
    const n00 = g(xi, yi, xf, yf), n10 = g(xi + 1, yi, xf - 1, yf);
    const n01 = g(xi, yi + 1, xf, yf - 1), n11 = g(xi + 1, yi + 1, xf - 1, yf - 1);
    const a = n00 + (n10 - n00) * u, b = n01 + (n11 - n01) * u;
    return a + (b - a) * v;
  }
  fbm(x: number, y: number, oct: number, px: number, py: number): number {
    let s = 0, amp = 0.5, f = 1;
    for (let i = 0; i < oct; i++) { s += amp * this.get(x * f, y * f, px * f, py * f); amp *= 0.5; f *= 2; }
    return s;
  }
}

function canvas(w: number, h = w): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  return [c, ctx];
}

function tex(c: HTMLCanvasElement, color: boolean, repeat = true): THREE.Texture {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  if (repeat) { t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping; }
  t.anisotropy = maxAniso;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.needsUpdate = true;
  return t;
}

/** Converte altura (0..1) em normal map tangente (tileável). */
function heightToNormal(h: Float32Array, w: number, hh: number, strength: number): HTMLCanvasElement {
  const [c, ctx] = canvas(w, hh);
  const img = ctx.createImageData(w, hh);
  for (let y = 0; y < hh; y++) {
    for (let x = 0; x < w; x++) {
      const l = h[y * w + ((x - 1 + w) % w)], r = h[y * w + ((x + 1) % w)];
      const u = h[((y - 1 + hh) % hh) * w + x], d = h[((y + 1) % hh) * w + x];
      let nx = (l - r) * strength, ny = (d - u) * strength, nz = 1;
      const len = Math.hypot(nx, ny, nz); nx /= len; ny /= len; nz /= len;
      const k = (y * w + x) * 4;
      img.data[k] = (nx * 0.5 + 0.5) * 255;
      img.data[k + 1] = (ny * 0.5 + 0.5) * 255;
      img.data[k + 2] = (nz * 0.5 + 0.5) * 255;
      img.data[k + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

function grayCanvas(v: Float32Array, w: number, h: number, lo: number, hi: number): HTMLCanvasElement {
  const [c, ctx] = canvas(w, h);
  const img = ctx.createImageData(w, h);
  for (let i = 0; i < w * h; i++) {
    const g = Math.max(0, Math.min(255, (lo + (hi - lo) * v[i]) * 255));
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = g;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

function hexRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mix(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

// ---------- madeira ----------

export function woodTextures(seed: number, light: string, dark: string, size = 512): PbrSet {
  const n = new Noise2(seed);
  const h = new Float32Array(size * size);
  const rough = new Float32Array(size * size);
  const [c, ctx] = canvas(size);
  const img = ctx.createImageData(size, size);
  const L = hexRgb(light), D = hexRgb(dark);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size, v = y / size;
      // Veios alongados em v (comprimento da peça) com distorção.
      const warp = n.fbm(u * 4, v * 1, 4, 4, 1) * 2.2;
      const ring = Math.sin((u * 26 + warp * 3.2) * Math.PI);
      const fine = n.fbm(u * 64, v * 4, 3, 64, 4);
      const pores = n.get(u * 180, v * 14, 180, 14);
      const g = Math.pow(0.5 + 0.5 * ring, 2.4) * 0.65 + (fine * 0.5 + 0.5) * 0.35;
      const col = mix(L, D, Math.min(1, g * 0.85 + Math.max(0, -pores) * 0.35));
      const k = (y * size + x) * 4;
      img.data[k] = col[0]; img.data[k + 1] = col[1]; img.data[k + 2] = col[2]; img.data[k + 3] = 255;
      h[y * size + x] = 0.55 - g * 0.25 - Math.max(0, -pores) * 0.35;
      rough[y * size + x] = 0.5 + g * 0.3 + Math.max(0, -pores) * 0.2;
    }
  }
  ctx.putImageData(img, 0, 0);
  return { map: tex(c, true), normalMap: tex(heightToNormal(h, size, size, 2.2), false), roughnessMap: tex(grayCanvas(rough, size, size, 0.45, 0.92), false) };
}

// ---------- reboco ----------

export function plasterTextures(seed: number, base: string, size = 512): PbrSet {
  const n = new Noise2(seed);
  const h = new Float32Array(size * size);
  const [c, ctx] = canvas(size);
  const img = ctx.createImageData(size, size);
  const B = hexRgb(base);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size, v = y / size;
    const big = n.fbm(u * 3, v * 3, 4, 3, 3);
    const trowel = n.fbm(u * 9 + big, v * 5, 3, 9, 5);
    const grit = n.get(u * 220, v * 220, 220, 220);
    const val = big * 0.5 + trowel * 0.35 + grit * 0.15;
    const k = (y * size + x) * 4;
    const tint = 1 + val * 0.22;
    img.data[k] = Math.min(255, B[0] * tint + val * 10);
    img.data[k + 1] = Math.min(255, B[1] * tint + val * 6);
    img.data[k + 2] = Math.min(255, B[2] * tint);
    img.data[k + 3] = 255;
    h[y * size + x] = 0.5 + trowel * 0.4 + grit * 0.25;
  }
  ctx.putImageData(img, 0, 0);
  return { map: tex(c, true), normalMap: tex(heightToNormal(h, size, size, 3.5), false) };
}

// ---------- piso de terracota ----------

export function tileTextures(seed: number, size = 1024): PbrSet {
  const n = new Noise2(seed);
  const rnd = mulberry(seed + 7);
  const tiles = 4; // 4x4 ladrilhos por repetição
  const tileTint: number[] = [];
  for (let i = 0; i < tiles * tiles; i++) tileTint.push(rnd());
  const h = new Float32Array(size * size);
  const rough = new Float32Array(size * size);
  const [c, ctx] = canvas(size);
  const img = ctx.createImageData(size, size);
  const A = hexRgb('#B86E4B'), B = hexRgb('#9A5136'), G = hexRgb('#CDB79A');
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = (x / size) * tiles, v = (y / size) * tiles;
    const tu = Math.floor(u), tv = Math.floor(v);
    const fu = u - tu, fv = v - tv;
    const edge = Math.min(fu, 1 - fu, fv, 1 - fv);
    const grout = edge < 0.022 ? 1 : 0;
    const bevel = Math.min(1, edge / 0.06);
    const t = tileTint[tv * tiles + tu];
    const sp = n.fbm(x / size * 12, y / size * 12, 4, 12, 12);
    const wear = n.fbm(x / size * 3, y / size * 3, 3, 3, 3);
    let col = mix(A, B, Math.min(1, Math.max(0, t * 0.7 + sp * 0.6)));
    col = mix(col, [215, 170, 130], Math.max(0, wear) * 0.35);
    if (grout) col = mix(G, [150, 130, 110], n.get(x * 0.3, y * 0.3, 1e9, 1e9) * 0.5 + 0.3);
    const k = (y * size + x) * 4;
    img.data[k] = col[0]; img.data[k + 1] = col[1]; img.data[k + 2] = col[2]; img.data[k + 3] = 255;
    h[y * size + x] = grout ? 0.1 : 0.35 + Math.sqrt(bevel) * 0.5 + sp * 0.06;
    rough[y * size + x] = grout ? 0.95 : 0.62 + sp * 0.2 - Math.max(0, wear) * 0.2;
  }
  ctx.putImageData(img, 0, 0);
  return { map: tex(c, true), normalMap: tex(heightToNormal(h, size, size, 4), false), roughnessMap: tex(grayCanvas(rough, size, size, 0, 1), false) };
}

// ---------- fibra de fio (torção de cabos) ----------

/** Normal map do fio torcido: u = comprimento (1 torção por unidade), v = circunferência. */
export function yarnFiberTextures(seed: number, size = 256): { normalMap: THREE.Texture; roughnessMap: THREE.Texture; aoMap: THREE.Texture } {
  const n = new Noise2(seed);
  const h = new Float32Array(size * size);
  const ao = new Float32Array(size * size);
  const plies = 3;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = x / size, v = y / size;
    // Cabos em hélice: faixa diagonal repetida `plies` vezes ao redor.
    const p = ((v * plies + u * 1.0) % 1 + 1) % 1;
    const ply = Math.sin(p * Math.PI);
    const fibers = n.fbm(u * 6 + v * 40, v * 32, 3, 6, 32) * 0.5 + n.get(u * 3 + v * 90, v * 90, 3, 90) * 0.25;
    h[y * size + x] = Math.pow(ply, 0.7) * 0.8 + fibers * 0.35;
    ao[y * size + x] = 0.55 + Math.pow(ply, 0.5) * 0.45;
  }
  const t = tex(heightToNormal(h, size, size, 5), false);
  const r = tex(grayCanvas(h, size, size, 0.95, 0.7), false);
  const a = tex(grayCanvas(ao, size, size, 0, 1), false);
  return { normalMap: t, roughnessMap: r, aoMap: a };
}

// ---------- vime (cesta) ----------

export function wickerTextures(seed: number, size = 512): PbrSet {
  const n = new Noise2(seed);
  const h = new Float32Array(size * size);
  const [c, ctx] = canvas(size);
  const img = ctx.createImageData(size, size);
  const L = hexRgb('#D9B07A'), D = hexRgb('#7A5330');
  const cells = 16;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = (x / size) * cells, v = (y / size) * cells;
    const cu = Math.floor(u), cv = Math.floor(v);
    const fu = u - cu, fv = v - cv;
    const horiz = (cu + cv) % 2 === 0;
    const across = horiz ? fv : fu;
    const along = horiz ? fu : fv;
    const strand = Math.sin(across * Math.PI);
    const bulge = 0.7 + 0.3 * Math.sin(along * Math.PI);
    const fib = n.fbm(x / size * 40, y / size * 40, 3, 40, 40);
    const height = strand * bulge;
    const col = mix(D, L, Math.min(1, height * 0.9 + fib * 0.3 + 0.1));
    const k = (y * size + x) * 4;
    img.data[k] = col[0]; img.data[k + 1] = col[1]; img.data[k + 2] = col[2]; img.data[k + 3] = 255;
    h[y * size + x] = height + fib * 0.1;
  }
  ctx.putImageData(img, 0, 0);
  return { map: tex(c, true), normalMap: tex(heightToNormal(h, size, size, 6), false) };
}

// ---------- cerâmica salpicada ----------

export function ceramicTextures(seed: number, base: string, speck: string, size = 512): PbrSet {
  const n = new Noise2(seed);
  const rnd = mulberry(seed);
  const [c, ctx] = canvas(size);
  const B = hexRgb(base), S = hexRgb(speck);
  const img = ctx.createImageData(size, size);
  const h = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const v = n.fbm(x / size * 5, y / size * 5, 4, 5, 5);
    const drip = n.fbm(x / size * 2, y / size * 12, 3, 2, 12);
    const col = mix(B, [B[0] * 0.8, B[1] * 0.85, B[2] * 0.9], Math.max(0, v + drip * 0.5));
    const k = (y * size + x) * 4;
    img.data[k] = col[0]; img.data[k + 1] = col[1]; img.data[k + 2] = col[2]; img.data[k + 3] = 255;
    h[y * size + x] = 0.5 + v * 0.2;
  }
  ctx.putImageData(img, 0, 0);
  ctx.fillStyle = `rgb(${S[0]},${S[1]},${S[2]})`;
  for (let i = 0; i < size * 3; i++) {
    const r = rnd() * 1.6 + 0.3;
    ctx.globalAlpha = 0.35 + rnd() * 0.6;
    ctx.beginPath(); ctx.arc(rnd() * size, rnd() * size, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  return { map: tex(c, true), normalMap: tex(heightToNormal(h, size, size, 1.5), false) };
}

// ---------- tecido de linho (toalhas dobradas, mantas) ----------

export function clothTextures(seed: number, a: string, b: string, stripes: string[], size = 512): PbrSet {
  const n = new Noise2(seed);
  const [c, ctx] = canvas(size);
  const img = ctx.createImageData(size, size);
  const h = new Float32Array(size * size);
  const A = hexRgb(a), Bc = hexRgb(b);
  const S = stripes.map(hexRgb);
  const threads = 96;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const u = (x / size) * threads, v = (y / size) * threads;
    const wu = Math.sin((u % 1) * Math.PI), wv = Math.sin((v % 1) * Math.PI);
    const over = (Math.floor(u) + Math.floor(v)) % 2 === 0;
    const hgt = over ? wu * 0.6 + 0.4 * wv : wv * 0.6 + 0.4 * wu;
    const band = Math.floor((y / size) * 8);
    let col = mix(A, Bc, n.fbm(x / size * 8, y / size * 8, 3, 8, 8) * 0.5 + 0.5);
    if (S.length && band % 4 === 1) col = S[(band >> 2) % S.length];
    col = mix(col, [col[0] * 0.75, col[1] * 0.75, col[2] * 0.75], 1 - hgt);
    const k = (y * size + x) * 4;
    img.data[k] = col[0]; img.data[k + 1] = col[1]; img.data[k + 2] = col[2]; img.data[k + 3] = 255;
    h[y * size + x] = hgt;
  }
  ctx.putImageData(img, 0, 0);
  return { map: tex(c, true), normalMap: tex(heightToNormal(h, size, size, 3), false) };
}

// ---------- etiquetas (papel kraft com texto) ----------

export function tagTexture(text: string, sub: string): THREE.Texture {
  const [c, ctx] = canvas(256, 128);
  const g = ctx.createLinearGradient(0, 0, 256, 128);
  g.addColorStop(0, '#EBDDC2'); g.addColorStop(1, '#DCC8A6');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 128);
  const rnd = mulberry(text.length * 31 + 7);
  for (let i = 0; i < 600; i++) { ctx.fillStyle = `rgba(120,90,50,${rnd() * 0.08})`; ctx.fillRect(rnd() * 256, rnd() * 128, 1.5, 1.5); }
  ctx.strokeStyle = 'rgba(110,80,50,0.35)'; ctx.lineWidth = 2; ctx.strokeRect(6, 6, 244, 116);
  ctx.fillStyle = '#3D3328';
  ctx.font = '600 34px Georgia, "Times New Roman", serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(fit(ctx, text, 220), 128, sub ? 52 : 64);
  if (sub) { ctx.font = 'italic 22px Georgia, serif'; ctx.fillStyle = '#6B5A45'; ctx.fillText(fit(ctx, sub, 220), 128, 92); }
  const t = tex(c, true, false);
  t.anisotropy = maxAniso;
  return t;
}

function fit(ctx: CanvasRenderingContext2D, s: string, w: number): string {
  if (ctx.measureText(s).width <= w) return s;
  let t = s;
  while (t.length > 1 && ctx.measureText(t + '…').width > w) t = t.slice(0, -1);
  return t + '…';
}

// ---------- folhas e flores (cartões alfa) ----------

export function leafTexture(): THREE.Texture {
  const [c, ctx] = canvas(128, 128);
  ctx.clearRect(0, 0, 128, 128);
  const g = ctx.createLinearGradient(0, 0, 128, 128);
  g.addColorStop(0, '#7E9A52'); g.addColorStop(1, '#3F5E2E');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(64, 6);
  ctx.bezierCurveTo(118, 30, 112, 92, 64, 122);
  ctx.bezierCurveTo(16, 92, 10, 30, 64, 6);
  ctx.fill();
  ctx.strokeStyle = 'rgba(220,235,180,0.55)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(64, 10); ctx.lineTo(64, 118); ctx.stroke();
  for (let i = 0; i < 5; i++) {
    const y = 30 + i * 17;
    ctx.beginPath(); ctx.moveTo(64, y); ctx.lineTo(36, y - 12); ctx.moveTo(64, y); ctx.lineTo(92, y - 12); ctx.stroke();
  }
  return tex(c, true, false);
}

export function lavenderCardTexture(seed: number): THREE.Texture {
  const [c, ctx] = canvas(128, 256);
  const rnd = mulberry(seed);
  ctx.clearRect(0, 0, 128, 256);
  for (let s = 0; s < 9; s++) {
    const x0 = 64 + (rnd() - 0.5) * 70;
    const lean = (rnd() - 0.5) * 30;
    ctx.strokeStyle = `rgb(${86 + rnd() * 30},${110 + rnd() * 25},${70})`;
    ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(64 + (rnd() - 0.5) * 20, 256); ctx.quadraticCurveTo(x0, 160, x0 + lean, 70); ctx.stroke();
    for (let b = 0; b < 16; b++) {
      const t = b / 16;
      const bx = x0 + lean * (1 - t * 0.3) + (rnd() - 0.5) * 7;
      const by = 70 - t * 58;
      ctx.fillStyle = `rgb(${120 + rnd() * 40},${90 + rnd() * 30},${170 + rnd() * 40})`;
      ctx.beginPath(); ctx.ellipse(bx, by, 4.2 - t * 1.6, 5.5 - t * 2, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  return tex(c, true, false);
}

/** Céu de fim de tarde para o plano distante (alfa nulo não usado). */
export function hillTexture(seed: number, top: string, bottom: string): THREE.Texture {
  const [c, ctx] = canvas(512, 256);
  const n = new Noise2(seed);
  const img = ctx.createImageData(512, 256);
  const T = hexRgb(top), B = hexRgb(bottom);
  for (let y = 0; y < 256; y++) for (let x = 0; x < 512; x++) {
    const v = n.fbm(x / 512 * 8, y / 256 * 4, 4, 8, 4);
    const col = mix(T, B, Math.min(1, Math.max(0, y / 256 + v * 0.4)));
    const k = (y * 512 + x) * 4;
    img.data[k] = col[0]; img.data[k + 1] = col[1]; img.data[k + 2] = col[2]; img.data[k + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return tex(c, true);
}
