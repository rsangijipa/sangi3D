/**
 * js/state.js
 * Estado serializável, dimensões do tanque Karesansui e configuração determinística.
 */

export const SEED = 5309;
export const BASIN_W = 10.6;   // largura X em metros
export const BASIN_D = 7.0;    // profundidade Z em metros
export const GRID_NX = 192;    // resolução longitudinal
export const GRID_NZ = 128;    // resolução transversal

export const RAKE_WIDTHS = {
  fino:  { id: 'fino',  label: 'Estreito', tines: 3, spacing: 0.14, ridgeAmp: 0.030, headWidth: 0.42 },
  medio: { id: 'medio', label: 'Médio',    tines: 5, spacing: 0.15, ridgeAmp: 0.036, headWidth: 0.74 },
  largo: { id: 'largo', label: 'Largo',    tines: 7, spacing: 0.15, ridgeAmp: 0.042, headWidth: 1.06 },
};

export const INITIAL_ROCKS = [
  { id: 0, x: -2.25, z: -0.55, r: 0.72, h: 0.86, rotY: 0.4,  variant: 0, mossR: 0.96 },
  { id: 1, x: -1.38, z: -0.18, r: 0.44, h: 0.46, rotY: 1.9,  variant: 1, mossR: 0.62 },
  { id: 2, x: 2.15,  z: 0.68,  r: 0.64, h: 0.74, rotY: -0.9, variant: 2, mossR: 0.88 },
  { id: 3, x: 2.88,  z: 0.25,  r: 0.38, h: 0.40, rotY: 2.4,  variant: 3, mossR: 0.56 },
  { id: 4, x: 0.18,  z: -1.52, r: 0.50, h: 0.52, rotY: 0.9,  variant: 4, mossR: 0.70 },
];

export const QUALITY_PROFILES = {
  low:    { label: 'Baixo',  dprCap: 1.0,  shadowMap: 1024, shadows: true,  dustCount: 24 },
  medium: { label: 'Médio',  dprCap: 1.35, shadowMap: 2048, shadows: true,  dustCount: 48 },
  high:   { label: 'Alto',   dprCap: 1.75, shadowMap: 2048, shadows: true,  dustCount: 80 },
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
  const isSmall =
    typeof window !== 'undefined' && window.innerWidth < 768;

  return {
    tool: 'rastelo',          // 'rastelo' | 'pedra' | 'orbita'
    rakeWidth: 'medio',       // 'fino' | 'medio' | 'largo'
    sunAngle: 0.26,           // [0..1] ângulo solar rasante -> entardecer
    soundEnabled: false,
    muted: false,
    volume: 0.55,
    reducedMotion: prefersReduced,
    qualityMode: 'auto',
    resolvedQuality: isSmall ? 'low' : 'high',
    paused: false,
    contemplative: false,
    settingsOpen: false,
    strokeCount: 0,
    undoDepth: 0,
    blockedHits: 0,
    simTime: 0,
    rakeVelocity: 0,
    selectedRockId: null,
  };
}
