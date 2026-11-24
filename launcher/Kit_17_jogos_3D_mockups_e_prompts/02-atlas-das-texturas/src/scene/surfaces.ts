import { clamp01, fbmT, hash, lerp, ridgedT, smoothstep, valueT, worleyT, type CellSample } from '../core/noise';
import type { TexSample } from '../core/pbr';

/**
 * Amostradores de superfície próprios do Atlas das Texturas.
 * Cada um devolve cor (sRGB), altura (vira normal map) e rugosidade.
 * Todos são periódicos (u,v em [0,1) repetem sem emenda), exceto a folha, que usa o UV da própria folha.
 */

type RGB = [number, number, number];
function hex(h: string): RGB {
  const v = parseInt(h.replace('#', ''), 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}
const mix = (a: RGB, b: RGB, t: number): RGB => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const scale = (a: RGB, k: number): RGB => [a[0] * k, a[1] * k, a[2] * k];
function put(s: TexSample, c: RGB, h: number, rough: number) {
  s.r = c[0];
  s.g = c[1];
  s.b = c[2];
  s.h = h;
  s.rough = rough;
}

/** Cortiça: poros escuros, lenticelas alongadas, grão fino e manchas de tom. */
export function corkSampler(seed = 41) {
  const L = hex('#c98a52');
  const M = hex('#a5683a');
  const D = hex('#5e3319');
  const cell: CellSample = { f1: 0, f2: 0, id: 0 };
  const len: CellSample = { f1: 0, f2: 0, id: 0 };
  return (u: number, v: number, s: TexSample) => {
    const tone = fbmT(u * 5, v * 5, 5, 4, seed);
    worleyT(u * 46, v * 46, 46, seed + 3, cell);
    const pore = smoothstep(0.32, 0.08, cell.f1) * (cell.id > 0.35 ? 1 : 0.35);
    // lenticelas: poros alongados (coordenada esticada em u)
    worleyT(u * 10, v * 34, 10, seed + 9, len);
    const lent = smoothstep(0.22, 0.05, len.f1) * (len.id > 0.72 ? 1 : 0);
    const grain = valueT(u * 260, v * 260, 260, seed + 5);
    const grain2 = valueT(u * 520, v * 520, 520, seed + 6);
    let c = mix(M, L, smoothstep(0.25, 0.8, tone + (grain - 0.5) * 0.35));
    c = mix(c, scale(D, 1.1), pore * 0.85);
    c = mix(c, D, lent * 0.9);
    c = scale(c, 0.9 + grain2 * 0.18);
    const h = 0.55 + (grain - 0.5) * 0.35 + (grain2 - 0.5) * 0.2 - pore * 0.55 - lent * 0.7 + tone * 0.15;
    put(s, c, h, 0.86 + pore * 0.1 - grain * 0.06);
  };
}

/** Feltro: fibras curtas emaranhadas, sem trama, totalmente fosco. */
export function feltSampler(color: string, seed = 17) {
  const C = hex(color);
  return (u: number, v: number, s: TexSample) => {
    const a = ridgedT(u * 64 + 0.3, v * 64, 64, 3, seed);
    const b = ridgedT(v * 64 + 0.7, u * 64, 64, 3, seed + 4);
    const fuzz = valueT(u * 384, v * 384, 384, seed + 2);
    const mottle = fbmT(u * 6, v * 6, 6, 4, seed + 8);
    const t = 0.82 + (a * 0.5 + b * 0.5 - 0.4) * 0.22 + (fuzz - 0.5) * 0.12 + (mottle - 0.5) * 0.14;
    put(s, scale(C, t), a * 0.4 + b * 0.4 + fuzz * 0.25, 0.97);
  };
}

/** Lã: fibras longas e onduladas ao longo de v, com brilho quente nas pontas. */
export function woolSampler(seed = 23) {
  const A = hex('#efe4cf');
  const B = hex('#cdbb98');
  return (u: number, v: number, s: TexSample) => {
    const wave = Math.sin((v * 18 + fbmT(u * 6, v * 2, 6, 3, seed) * 3) * Math.PI * 2) * 0.012;
    const strand = ridgedT((u + wave) * 90, v * 6, 90, 3, seed + 2);
    const fine = valueT((u + wave) * 400, v * 30, 400, seed + 3);
    const dirt = fbmT(u * 4, v * 4, 4, 4, seed + 5);
    let c = mix(B, A, clamp01(strand * 0.8 + fine * 0.3));
    c = mix(c, scale(B, 0.8), smoothstep(0.55, 0.8, dirt) * 0.35);
    put(s, c, strand * 0.7 + fine * 0.3, 0.9 - strand * 0.08);
  };
}

/** Ardósia: clivagem em lâminas finas, riscos claros e mica discreta. */
export function slateSampler(seed = 29) {
  const L = hex('#5b6064');
  const D = hex('#2b2e31');
  const cell: CellSample = { f1: 0, f2: 0, id: 0 };
  return (u: number, v: number, s: TexSample) => {
    const warp = fbmT(u * 3, v * 3, 3, 4, seed) * 0.4;
    const cleave = ridgedT(u * 2 + warp, v * 40 + warp * 6, 2, 4, seed + 1);
    const tone = fbmT(u * 7, v * 7, 7, 5, seed + 2);
    worleyT(u * 9, v * 9, 9, seed + 4, cell);
    const chip = smoothstep(0.05, 0.0, cell.f2 - cell.f1);
    const mica = hash(Math.floor(u * 900), Math.floor(v * 900), seed + 7) > 0.985 ? 1 : 0;
    const scratch = smoothstep(0.985, 1, Math.sin((u * 0.8 + v * 3.1 + fbmT(u * 2, v * 2, 2, 2, seed + 9) * 0.6) * Math.PI * 14) * 0.5 + 0.5) * 0.4;
    let c = mix(D, L, clamp01(tone * 0.9 + cleave * 0.25 - 0.2));
    c = mix(c, hex('#8a8f92'), scratch);
    c = mix(c, scale(c, 0.6), chip);
    c = mix(c, [0.75, 0.76, 0.78], mica * 0.6);
    put(s, c, cleave * 0.45 + tone * 0.3 - chip * 0.35, 0.62 - mica * 0.3 + tone * 0.12);
  };
}

/** Linho cru: trama aberta (tafetá) com fios irregulares e pequenos vãos. */
export function linenSampler(seed = 31, threads = 36) {
  const C = hex('#dccfb2');
  const G = hex('#7f725b');
  return (u: number, v: number, s: TexSample) => {
    const slubU = fbmT(u * 8, v * 0.5 + 0.2, 8, 3, seed) - 0.5;
    const slubV = fbmT(v * 8, u * 0.5 + 0.7, 8, 3, seed + 3) - 0.5;
    const fu = u * threads + slubV * 0.25;
    const fv = v * threads + slubU * 0.25;
    const iu = Math.floor(fu);
    const iv = Math.floor(fv);
    const lu = fu - iu;
    const lv = fv - iv;
    // fio vertical (warp) e horizontal (weft) com seção arredondada
    const warp = Math.max(0, 1 - Math.abs(lu - 0.5) * 2.6);
    const weft = Math.max(0, 1 - Math.abs(lv - 0.5) * 2.6);
    const overWarp = (iu + iv) % 2 === 0;
    const hWarp = Math.sqrt(warp) * (overWarp ? 1 : 0.55);
    const hWeft = Math.sqrt(weft) * (overWarp ? 0.55 : 1);
    const h = Math.max(hWarp, hWeft);
    const gap = h < 0.05 ? 1 : 0;
    const fib = valueT(u * 512, v * 512, 512, seed + 5);
    const tone = 0.88 + (fbmT(u * 5, v * 5, 5, 4, seed + 9) - 0.5) * 0.18 + hash(iu, 1, seed) * 0.06 + (fib - 0.5) * 0.08;
    const c = gap ? G : scale(C, tone * (0.78 + h * 0.25));
    put(s, c, h * 0.9 + fib * 0.08, 0.93);
  };
}

/**
 * Folha (UV da própria folha: u através, v ao longo da nervura central).
 * Nervura central, nervuras secundárias arqueadas e terciárias reticuladas.
 */
export function leafVeins(u: number, v: number) {
  const x = (u - 0.5) * 2; // -1..1
  const ax = Math.abs(x);
  const mid = smoothstep(0.045, 0.0, ax) * (1 - v * 0.6);
  // nervuras secundárias: linhas inclinadas que partem da central
  const k = (v - ax * 0.42) * 9;
  const sec = smoothstep(0.1, 0.0, Math.abs(k - Math.round(k)) - 0.0) * smoothstep(0.98, 0.15, ax) * (0.55 + 0.45 * (1 - v));
  return { mid, sec };
}

export function leafSampler(seed = 37) {
  const A = hex('#5f8a3c');
  const B = hex('#3f6a2a');
  const Y = hex('#a7b96a');
  const cell: CellSample = { f1: 0, f2: 0, id: 0 };
  return (u: number, v: number, s: TexSample) => {
    const { mid, sec } = leafVeins(u, v);
    worleyT(u * 40, v * 70, 40, seed, cell);
    const ter = smoothstep(0.06, 0.0, cell.f2 - cell.f1);
    const tone = fbmT(u * 4, v * 4, 4, 4, seed + 2);
    let c = mix(B, A, tone);
    c = mix(c, Y, Math.max(mid, sec * 0.65) * 0.75 + ter * 0.12);
    const edge = smoothstep(0.82, 1, Math.abs(u - 0.5) * 2);
    c = mix(c, scale(B, 0.8), edge * 0.4);
    put(s, c, mid * 0.9 + sec * 0.55 + ter * 0.12 - tone * 0.05, 0.55 + tone * 0.15 - mid * 0.1);
  };
}

/** Esmalte cerâmico (celadon) com craquelado fino e poças de cor mais intensa. */
export function glazeSampler(seed = 43) {
  const A = hex('#9fbfae');
  const B = hex('#6f9a88');
  const cell: CellSample = { f1: 0, f2: 0, id: 0 };
  const big: CellSample = { f1: 0, f2: 0, id: 0 };
  return (u: number, v: number, s: TexSample) => {
    worleyT(u * 26, v * 26, 26, seed, cell);
    worleyT(u * 7, v * 7, 7, seed + 2, big);
    const crack = Math.max(smoothstep(0.035, 0.0, cell.f2 - cell.f1) * 0.7, smoothstep(0.03, 0.0, big.f2 - big.f1));
    const pool = fbmT(u * 3, v * 3, 3, 4, seed + 4);
    const pin = hash(Math.floor(u * 700), Math.floor(v * 700), seed + 6) > 0.993 ? 1 : 0;
    let c = mix(A, B, smoothstep(0.35, 0.75, pool));
    c = mix(c, hex('#4b5f55'), crack * 0.55);
    c = mix(c, scale(c, 0.7), pin);
    put(s, c, -crack * 0.25 - pin * 0.3 + pool * 0.05, 0.12 + crack * 0.2 + pin * 0.4);
  };
}

/** Barro cozido (borda quebrada do caco). */
export function terracottaSampler(seed = 47) {
  const A = hex('#b86a45');
  const B = hex('#8a4a2e');
  return (u: number, v: number, s: TexSample) => {
    const n = fbmT(u * 10, v * 10, 10, 4, seed);
    const g = valueT(u * 300, v * 300, 300, seed + 1);
    put(s, mix(B, A, n * 0.8 + g * 0.2), n * 0.5 + g * 0.5, 0.92);
  };
}

/** Arenito: grãos de quartzo visíveis, cimento ferruginoso e faixas de sedimento ao longo de v. */
export function sandstoneSampler(seed = 53) {
  const A = hex('#d7b689');
  const B = hex('#b98d5e');
  const R = hex('#9c6a44');
  const cell: CellSample = { f1: 0, f2: 0, id: 0 };
  return (u: number, v: number, s: TexSample) => {
    worleyT(u * 160, v * 160, 160, seed, cell);
    const grain = smoothstep(0.55, 0.15, cell.f1);
    const band = Math.sin((v * 7 + fbmT(u * 3, v * 3, 3, 4, seed + 2) * 1.4) * Math.PI * 2) * 0.5 + 0.5;
    const tone = fbmT(u * 6, v * 6, 6, 4, seed + 3);
    const quartz = cell.id > 0.9 ? 1 : 0;
    let c = mix(B, A, clamp01(band * 0.55 + tone * 0.45));
    c = mix(c, R, smoothstep(0.7, 0.9, band) * 0.35);
    c = scale(c, 0.86 + cell.id * 0.24);
    c = mix(c, [0.93, 0.91, 0.86], quartz * 0.45);
    put(s, c, grain * 0.7 + band * 0.12 + tone * 0.1, 0.9 - quartz * 0.25);
  };
}

/** Metal escovado (aço da luminária): riscos finos numa direção, leve variação de tom. */
export function brushedSampler(color: string, seed = 59) {
  const C = hex(color);
  return (u: number, v: number, s: TexSample) => {
    const streak = valueT(u * 2, v * 700, 2, seed);
    const streak2 = valueT(u * 4, v * 1400, 4, seed + 1);
    const smudge = fbmT(u * 5, v * 5, 5, 4, seed + 2);
    const t = 0.88 + (streak - 0.5) * 0.08 + (streak2 - 0.5) * 0.05 + (smudge - 0.5) * 0.08;
    put(s, scale(C, t), streak * 0.5 + streak2 * 0.3, 0.3 + (streak - 0.5) * 0.1 + smudge * 0.12);
  };
}

/** Gesso quente com marcas de espátula (parede do ateliê). */
export function troweledSampler(color: string, seed = 61) {
  const C = hex(color);
  const cell: CellSample = { f1: 0, f2: 0, id: 0 };
  return (u: number, v: number, s: TexSample) => {
    worleyT(u * 6, v * 6, 6, seed, cell);
    const swipe = smoothstep(0.0, 0.5, cell.f1) * 0.5 + cell.id * 0.5;
    const fine = valueT(u * 300, v * 300, 300, seed + 1);
    const big = fbmT(u * 2, v * 2, 2, 4, seed + 2);
    const t = 0.9 + (swipe - 0.5) * 0.08 + (fine - 0.5) * 0.04 + (big - 0.5) * 0.1;
    put(s, scale(C, t), swipe * 0.5 + fine * 0.15, 0.9);
  };
}

/** Papel creme com fibras discretas e manchas leves (quadro botânico, etiquetas). */
export function creamPaperSampler(seed = 67) {
  const C = hex('#f2e6cc');
  return (u: number, v: number, s: TexSample) => {
    const fib = ridgedT(u * 22, v * 5, 22, 3, seed) * ridgedT(v * 18, u * 6, 18, 3, seed + 1);
    const n = fbmT(u * 5, v * 5, 5, 4, seed + 2);
    put(s, scale(C, 0.92 + n * 0.08 - fib * 0.05), fib * 0.3 + n * 0.1, 0.95);
  };
}
