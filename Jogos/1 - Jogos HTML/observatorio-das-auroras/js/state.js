/**
 * js/state.js
 * Estado serializável, perfis de aurora, enquadramentos de câmera e presets de qualidade.
 */

export const SEED = 5408;

export const AURORA_PATTERNS = {
  crown: {
    id: 'crown',
    label: 'Coroa Verde-Violeta',
    short: 'Coroa',
    waveAmp: 1.35,
    waveFreq: 1.15,
    violetMix: 0.58,
    curtainSpread: 1.0,
  },
  arc: {
    id: 'arc',
    label: 'Arco Clássico',
    short: 'Arco',
    waveAmp: 0.72,
    waveFreq: 0.75,
    violetMix: 0.28,
    curtainSpread: 0.75,
  },
  storm: {
    id: 'storm',
    label: 'Tempestade Solar',
    short: 'Tempestade',
    waveAmp: 2.05,
    waveFreq: 1.65,
    violetMix: 0.85,
    curtainSpread: 1.25,
  },
};

export const VIEW_MODES = {
  veranda: {
    id: 'veranda',
    label: 'Varanda',
    pos: [-5.4, 2.25, 5.2],
    mobilePos: [-5.8, 2.55, 6.6],
    target: [0.6, 3.6, -12.0],
  },
  interior: {
    id: 'interior',
    label: 'Interior',
    pos: [0.35, 1.85, 1.35],
    mobilePos: [0.35, 1.90, 1.65],
    target: [0.2, 4.6, -10.5],
  },
  sky: {
    id: 'sky',
    label: 'Celeste',
    pos: [0.0, 5.4, 14.5],
    mobilePos: [0.0, 6.2, 16.5],
    target: [0.0, 5.2, -16.0],
  },
};

export const QUALITY_PROFILES = {
  low:    { label: 'Leve',   dprCap: 1.0,  shadowMap: 1024, shadows: true,  snowCount: 55,  starAlpha: 0.88 },
  medium: { label: 'Média',  dprCap: 1.35, shadowMap: 2048, shadows: true,  snowCount: 110, starAlpha: 0.96 },
  high:   { label: 'Alta',   dprCap: 1.75, shadowMap: 2048, shadows: true,  snowCount: 160, starAlpha: 1.0 },
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
    viewMode: 'veranda',          // 'veranda' | 'interior' | 'sky'
    auroraPattern: 'crown',       // 'crown' | 'arc' | 'storm'
    hourNorm: 0.52,               // 0 = 20h crepúsculo .. 0.5 = 00h meia-noite .. 1 = 04h madrugada
    intensity: 0.82,              // [0..1] intensidade de emissão das auroras (0 = sem emissão)
    soundEnabled: false,
    muted: false,
    volume: 0.55,
    reducedMotion: prefersReduced,
    qualityMode: 'auto',
    resolvedQuality: isSmall ? 'medium' : 'high',
    paused: false,
    contemplative: false,
    settingsOpen: false,
    albumOpen: false,
    photos: [],                   // [{ id, url, timestamp, label }]
    simTime: 0,
    curtainPhase: 0,
    gustSpeed: 0.35,
  };
}
