// Geometria de trama sem Three.js: calcula o caminho de cada passada sobre/sob a urdidura.
// A tensão altera a curvatura (ondulação vertical e afundamento das ourelas) de forma limitada.
import { WARP_RADIUS, thicknessById, type Crossing, type ThicknessId } from '../game/content.ts';

export interface LoomLayout {
  /** largura útil da urdidura em metros */
  width: number;
  /** x do primeiro fio de urdidura (esquerda) */
  x0: number;
  warpCount: number;
}

export function makeLayout(warpCount: number, width = 0.88): LoomLayout {
  return { width, x0: -width / 2, warpCount };
}

/** Centro do grupo de urdidura `w` (cada fio lógico é um grupo de fios físicos). */
export function warpX(layout: LoomLayout, w: number): number {
  return layout.x0 + (layout.width * (w + 0.5)) / Math.max(1, layout.warpCount);
}

/** Fios físicos por grupo: mantém a urdidura densa (~48–54 fios) em qualquer configuração. */
export function threadsPerWarp(warpCount: number): number {
  return Math.max(2, Math.min(4, Math.round(60 / Math.max(1, warpCount))));
}

/** Meia largura do grupo (do centro ao fio físico mais externo). */
export function groupHalf(layout: LoomLayout): number {
  const k = threadsPerWarp(layout.warpCount);
  const pitch = layout.width / (layout.warpCount * k);
  return ((k - 1) / 2) * pitch;
}

export interface PathInput {
  crossings: Crossing[];
  direction: 1 | -1;
  thickness: ThicknessId;
  tension: number;
  /** y da linha central da passada */
  y: number;
  /** semente estável por fileira para pequenas variações artesanais */
  seed: number;
}

export interface PathPoint { x: number; y: number; z: number }

const SAMPLES_PER_WARP = 7;

/**
 * Pontos da passada, sempre da esquerda para a direita no espaço do tear.
 * Inclui a volta na ourela (laçada) quando `withTurns` é verdadeiro.
 */
export function weftPath(layout: LoomLayout, row: PathInput, upTo = row.crossings.length): PathPoint[] {
  const n = layout.warpCount;
  const r = thicknessById(row.thickness).raio;
  // Trama batida (face de trama): a passada fica quase no plano e cobre a urdidura.
  const amp = (WARP_RADIUS + r) * 0.58;
  const t = clamp01(row.tension);
  // Tensão alta: ourelas puxadas para dentro (draw-in) e trama mais reta.
  const drawIn = 0.002 + t * t * 0.012;
  const wave = (1 - t) * r * 1.6;
  const pts: PathPoint[] = [];
  const crossedWarps = new Array<boolean>(n).fill(false);
  const cross = new Array<Crossing | null>(n).fill(null);
  for (let i = 0; i < Math.min(upTo, n); i++) {
    const w = row.direction === 1 ? i : n - 1 - i;
    crossedWarps[w] = true;
    cross[w] = row.crossings[i];
  }
  let wMin = n, wMax = -1;
  for (let w = 0; w < n; w++) if (crossedWarps[w]) { wMin = Math.min(wMin, w); wMax = Math.max(wMax, w); }
  if (wMax < 0) return pts;
  const rnd = mulberry(row.seed);
  const jitter: number[] = [];
  for (let w = 0; w < n; w++) jitter.push((rnd() - 0.5) * r * 0.35);
  for (let w = wMin; w <= wMax; w++) {
    const c = cross[w]!;
    const zc = c === 'over' ? amp : -amp;
    const xw = warpX(layout, w);
    const edge = edgeFactor(w, n);
    const x = xw + (w < n / 2 ? drawIn : -drawIn) * edge;
    const next = w < wMax ? cross[w + 1]! : c;
    const zn = next === 'over' ? amp : -amp;
    const xn = w < wMax ? warpX(layout, w + 1) + ((w + 1) < n / 2 ? drawIn : -drawIn) * edgeFactor(w + 1, n) : x;
    const samples = w < wMax ? SAMPLES_PER_WARP : 1;
    for (let s = 0; s < samples; s++) {
      const u = s / SAMPLES_PER_WARP;
      // Patamar sobre o grupo e mergulho no intervalo — a trama "abraça" os fios.
      const uu = Math.min(1, Math.max(0, (u - 0.28) / 0.44));
      const k = uu * uu * (3 - 2 * uu);
      const zz = zc + (zn - zc) * k;
      const xx = x + (xn - x) * u;
      const phase = (w + u) / Math.max(1, n - 1);
      const yy = row.y + Math.sin(phase * Math.PI * 2 * 1.5 + row.seed) * wave * 0.5 + jitter[w] * (1 - u) + (jitter[w + 1] ?? 0) * u;
      pts.push({ x: xx, y: yy, z: zz });
    }
  }
  return pts;
}

/** 1 nas ourelas, 0 no centro: o puxão da tensão concentra-se nas bordas. */
function edgeFactor(w: number, n: number): number {
  const d = Math.min(w, n - 1 - w) / Math.max(1, (n - 1) / 2);
  return Math.max(0, 1 - d * 3);
}

/** Curvatura média (variação de z e y entre amostras) — usada nos testes de tensão. */
export function pathCurvature(pts: PathPoint[]): number {
  if (pts.length < 3) return 0;
  let sum = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1], b = pts[i], c = pts[i + 1];
    const ddy = a.y - 2 * b.y + c.y;
    sum += Math.abs(ddy);
  }
  return sum / (pts.length - 2);
}

export function mulberry(seed: number): () => number {
  let a = (seed * 2654435761) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function clamp01(v: number): number { return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0.5; }
