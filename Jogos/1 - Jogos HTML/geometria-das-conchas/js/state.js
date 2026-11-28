/**
 * js/state.js
 * Estado serializável para # 025 — Geometria das Conchas.
 * Parâmetros paramétricos contínuos (espiral, abertura, escala, textura),
 * modo de corte anatômico, fotografia macro e catálogo de 3 formas comparáveis.
 */

export const SEED = 2509;

export const TEXTURE_STYLES = {
  nacre:  { id: 'nacre',  label: 'Nacarado Liso',    short: 'Nacarado', ribAmp: 0.008, ribFreq: 16 },
  ribbed: { id: 'ribbed', label: 'Costelas Radiais', short: 'Costelas', ribAmp: 0.045, ribFreq: 26 },
  banded: { id: 'banded', label: 'Listras Náutilo',  short: 'Náutilo',  ribAmp: 0.015, ribFreq: 12 },
};

export const PHOTO_FRAMINGS = {
  table: { id: 'table', label: 'Bancada', pos: [2.35, 2.05, 3.05], mobilePos: [2.75, 2.55, 3.85], target: [0.0, 0.25, 0.0] },
  cut:   { id: 'cut',   label: 'Corte',   pos: [0.15, 2.85, 1.75], mobilePos: [0.18, 3.45, 2.15], target: [0.0, 0.18, 0.0] },
  macro: { id: 'macro', label: 'Macro',   pos: [1.25, 1.15, 1.62], mobilePos: [1.45, 1.35, 2.05], target: [0.05, 0.24, 0.0] },
};

export const QUALITY_PROFILES = {
  low:    { label: 'Leve',  dprCap: 1.0,  shadowMap: 1024, shadows: true,  segU: 76,  segV: 22, dustCount: 18 },
  medium: { label: 'Média', dprCap: 1.35, shadowMap: 2048, shadows: true,  segU: 108, segV: 28, dustCount: 36 },
  high:   { label: 'Alta',  dprCap: 1.75, shadowMap: 2048, shadows: true,  segU: 136, segV: 34, dustCount: 60 },
};

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createDefaultState() {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmall = typeof window !== 'undefined' && window.innerWidth < 768;

  return {
    // Parâmetros geométricos limitados em faixa contínua segura (T01)
    spiralTurns: 3.15,        // [1.8 .. 4.6] voltas logarítmicas
    aperture: 0.62,           // [0.30 .. 0.95] abertura / expansão radial
    scaleRatio: 1.0,          // [0.68 .. 1.38] escala / alongamento axial
    textureStyle: 'banded',   // 'nacre' | 'ribbed' | 'banded'
    cutaway: true,            // true = corte anatômico revelando câmaras (T02)
    spirePitch: 0.22,         // helicidade suave (0 = náutilo planar, >0 = caracol)

    // Fotografia macro & acessibilidade
    photoMode: false,
    dofEnabled: !prefersReduced,
    focusDist: 0.45,          // [0..1] foco macro
    exposure: 1.12,           // [0.70 .. 1.60] exposição fotográfica
    framing: 'table',

    // Catálogo de 3 formas comparáveis + álbum PNG
    catalog: [],              // até 3 espécimes catalogados { id, name, spiralTurns, aperture, scaleRatio, textureStyle, cutaway, ratioWH, chamberCount, thumbUrl }
    compareOpen: false,

    // Áudio e sistema
    soundEnabled: false,
    muted: false,
    volume: 0.48,
    reducedMotion: prefersReduced,
    qualityMode: 'auto',
    resolvedQuality: isSmall ? 'medium' : 'high',
    paused: false,
    contemplative: false,
    settingsOpen: false,
    simTime: 0,
  };
}
