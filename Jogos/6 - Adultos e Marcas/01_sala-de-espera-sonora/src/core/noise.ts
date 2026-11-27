/**
 * Ruídos procedurais (CPU) usados para gerar texturas PBR sem nenhum arquivo externo.
 * Todas as funções "T" são periódicas (tileable): a textura se repete sem emenda visível.
 */

export function hash(x: number, y: number, seed = 0): number {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 982451653)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

const wrap = (v: number, p: number) => ((v % p) + p) % p;
const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/** Ruído de valor periódico em [0,1]. `period` em células inteiras. */
export function valueT(x: number, y: number, period: number, seed = 0): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const u = smooth(x - xi);
  const v = smooth(y - yi);
  const x0 = wrap(xi, period);
  const y0 = wrap(yi, period);
  const x1 = wrap(xi + 1, period);
  const y1 = wrap(yi + 1, period);
  const a = hash(x0, y0, seed);
  const b = hash(x1, y0, seed);
  const c = hash(x0, y1, seed);
  const d = hash(x1, y1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/** fBm periódico: cada oitava dobra a frequência e o período, preservando a repetição. */
export function fbmT(x: number, y: number, period: number, octaves = 5, seed = 0, gain = 0.5): number {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  let f = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueT(x * f, y * f, period * f, seed + i * 17);
    norm += amp;
    amp *= gain;
    f *= 2;
  }
  return sum / norm;
}

/** Ruído "ridged" (cristas) útil para casca de árvore, pedra e veios. */
export function ridgedT(x: number, y: number, period: number, octaves = 4, seed = 0): number {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  let f = 1;
  for (let i = 0; i < octaves; i++) {
    const n = 1 - Math.abs(valueT(x * f, y * f, period * f, seed + i * 31) * 2 - 1);
    sum += amp * n * n;
    norm += amp;
    amp *= 0.5;
    f *= 2;
  }
  return sum / norm;
}

export interface CellSample {
  f1: number;
  f2: number;
  id: number;
}

/** Ruído celular (Worley) periódico: f1/f2 = distâncias ao 1º/2º ponto mais próximo. */
export function worleyT(x: number, y: number, period: number, seed = 0, out: CellSample = { f1: 0, f2: 0, id: 0 }): CellSample {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  let f1 = 9;
  let f2 = 9;
  let id = 0;
  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      const cx = xi + i;
      const cy = yi + j;
      const wx = wrap(cx, period);
      const wy = wrap(cy, period);
      const px = cx + hash(wx, wy, seed);
      const py = cy + hash(wx, wy, seed + 7);
      const dx = px - x;
      const dy = py - y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < f1) {
        f2 = f1;
        f1 = d;
        id = hash(wx, wy, seed + 13);
      } else if (d < f2) {
        f2 = d;
      }
    }
  }
  out.f1 = f1;
  out.f2 = f2;
  out.id = id;
  return out;
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/** PRNG determinístico (mulberry32) para posicionamento reprodutível de objetos. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
