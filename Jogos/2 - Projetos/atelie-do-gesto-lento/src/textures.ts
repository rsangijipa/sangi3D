// Texturas procedurais (canvas) — sem downloads, tudo gerado no carregamento.
import * as THREE from 'three';

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Ruído de valor 2D periódico (tileável).
function makeNoise(size: number, cells: number, seed: number) {
  const r = rng(seed);
  const g = new Float32Array(cells * cells).map(() => r());
  const at = (x: number, y: number) => g[((y % cells) + cells) % cells * cells + (((x % cells) + cells) % cells)];
  return (u: number, v: number) => {
    const x = u * cells, y = v * cells;
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const sx = xf * xf * (3 - 2 * xf), sy = yf * yf * (3 - 2 * yf);
    const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1);
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
  };
}

function fbm(size: number, seed: number, octaves = 5, base = 4) {
  const ns = Array.from({ length: octaves }, (_, i) => makeNoise(size, base << i, seed + i * 101));
  return (u: number, v: number) => {
    let sum = 0, amp = 0.5, norm = 0;
    for (const n of ns) { sum += n(u, v) * amp; norm += amp; amp *= 0.5; }
    return sum / norm;
  };
}

function canvasTex(size: number, paint: (img: ImageData) => void, srgb: boolean, repeat = 1) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  paint(img);
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 8;
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.needsUpdate = true;
  return t;
}

// Converte um campo de altura em normal map.
function heightToNormal(h: Float32Array, size: number, strength: number) {
  return canvasTex(size, (img) => {
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const l = h[y * size + ((x - 1 + size) % size)], r = h[y * size + ((x + 1) % size)];
      const u = h[((y - 1 + size) % size) * size + x], d = h[((y + 1) % size) * size + x];
      let nx = (l - r) * strength, ny = (u - d) * strength, nz = 1;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len; ny /= len; nz /= len;
      const i = (y * size + x) * 4;
      img.data[i] = (nx * 0.5 + 0.5) * 255;
      img.data[i + 1] = (ny * 0.5 + 0.5) * 255;
      img.data[i + 2] = (nz * 0.5 + 0.5) * 255;
      img.data[i + 3] = 255;
    }
  }, false);
}

function field(size: number, f: (u: number, v: number) => number) {
  const h = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) h[y * size + x] = f(x / size, y / size);
  return h;
}

function fromField(size: number, h: Float32Array, color: (v: number, i: number) => [number, number, number], srgb = true) {
  return canvasTex(size, (img) => {
    for (let i = 0; i < size * size; i++) {
      const [r, g, b] = color(h[i], i);
      img.data[i * 4] = r; img.data[i * 4 + 1] = g; img.data[i * 4 + 2] = b; img.data[i * 4 + 3] = 255;
    }
  }, srgb);
}

export interface PBRSet { map?: THREE.Texture; normalMap: THREE.Texture; roughnessMap?: THREE.Texture }

export function clayDetail(size = 256): PBRSet {
  const n = fbm(size, 7, 5, 8);
  const pores = makeNoise(size, 96, 33);
  const h = field(size, (u, v) => n(u, v) * 0.7 + Math.pow(Math.max(0, pores(u, v) - 0.72), 2) * -3);
  // Estrias horizontais de torno (giro) bem discretas.
  for (let y = 0; y < size; y++) {
    const s = Math.sin(y / size * Math.PI * 2 * 38) * 0.04;
    for (let x = 0; x < size; x++) h[y * size + x] += s;
  }
  const rough = fromField(size, h, (v) => { const k = 150 + v * 80; return [k, k, k]; }, false);
  return { normalMap: heightToNormal(h, size, 2.2), roughnessMap: rough };
}

export function oakWood(size = 512): PBRSet {
  const n = fbm(size, 11, 4, 4);
  const fine = makeNoise(size, 128, 5);
  const h = field(size, (u, v) => {
    const w = n(u * 0.25, v) * 6;
    const ring = Math.sin((u * 22 + w) * Math.PI);
    return ring * 0.5 + 0.5 + fine(u * 0.2, v) * 0.25;
  });
  const map = fromField(size, h, (v) => {
    const t = Math.min(1, Math.max(0, v));
    return [150 + t * 55, 104 + t * 40, 62 + t * 28];
  });
  const rough = fromField(size, h, (v) => { const k = 170 - v * 50; return [k, k, k]; }, false);
  return { map, normalMap: heightToNormal(h, size, 1.2), roughnessMap: rough };
}

export function plaster(size = 512): PBRSet {
  const n = fbm(size, 21, 6, 4);
  const h = field(size, (u, v) => n(u, v));
  const map = fromField(size, h, (v) => [212 + v * 30, 198 + v * 28, 172 + v * 24]);
  return { map, normalMap: heightToNormal(h, size, 3) };
}

export function floorTiles(size = 512): PBRSet {
  const n = fbm(size, 41, 5, 4);
  const tiles = 4;
  const h = field(size, (u, v) => {
    const fu = (u * tiles) % 1, fv = (v * tiles) % 1;
    const edge = Math.min(fu, fv, 1 - fu, 1 - fv);
    const grout = edge < 0.025 ? -0.6 : 0;
    return n(u, v) * 0.6 + grout;
  });
  const tileTint = rng(9);
  const tint = Array.from({ length: tiles * tiles }, () => tileTint() * 0.12);
  const map = fromField(size, h, (v, i) => {
    const x = i % size, y = Math.floor(i / size);
    const ti = Math.floor(y / size * tiles) * tiles + Math.floor(x / size * tiles);
    if (v < -0.2) return [96, 82, 70];
    const k = tint[ti];
    return [168 - k * 120 + v * 30, 98 - k * 60 + v * 20, 70 - k * 40 + v * 14];
  });
  const rough = fromField(size, h, (v) => { const k = v < -0.2 ? 250 : 175 - v * 40; return [k, k, k]; }, false);
  return { map, normalMap: heightToNormal(h, size, 2.5), roughnessMap: rough };
}

export function linen(size = 256): PBRSet {
  const n = makeNoise(size, 64, 4);
  const h = field(size, (u, v) => {
    const a = Math.sin(u * Math.PI * 2 * 64) * 0.5 + 0.5;
    const b = Math.sin(v * Math.PI * 2 * 64) * 0.5 + 0.5;
    return (a * b) * 0.6 + n(u, v) * 0.4;
  });
  const map = fromField(size, h, (v) => [196 + v * 30, 182 + v * 28, 156 + v * 24]);
  return { map, normalMap: heightToNormal(h, size, 1.5) };
}

export function sponge(size = 256): PBRSet {
  const n = makeNoise(size, 40, 77);
  const n2 = makeNoise(size, 90, 78);
  const h = field(size, (u, v) => {
    const p = n(u, v) * 0.6 + n2(u, v) * 0.4;
    return p < 0.42 ? -1 : p;
  });
  const map = fromField(size, h, (v) => v < 0 ? [150, 110, 30] : [226 + v * 20, 186 + v * 25, 74 + v * 20]);
  return { map, normalMap: heightToNormal(h, size, 2) };
}

// Gradiente suave para o céu da janela.
export function skyGradient(top: string, bottom: string) {
  const c = document.createElement('canvas');
  c.width = 4; c.height = 256;
  const g = c.getContext('2d')!;
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, top); grad.addColorStop(1, bottom);
  g.fillStyle = grad; g.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function softDot() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,240,215,1)');
  grad.addColorStop(0.4, 'rgba(255,230,200,0.35)');
  grad.addColorStop(1, 'rgba(255,220,190,0)');
  g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
