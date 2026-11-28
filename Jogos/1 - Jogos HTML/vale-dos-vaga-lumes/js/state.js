/**
 * js/state.js
 * Estado serializável, gerador determinístico (Mulberry32) e marcos da trilha.
 */

export const INITIAL_SEED = 95042;
export const MAX_FIREFLIES = 360;

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

export const WAYPOINTS = [
  {
    id: 'poste',
    name: 'Mirante do Lampião',
    hint: 'Enquadramento clássico junto ao poste de madeira, riacho e lua cheia.',
    pos: { x: -1.65, y: 1.88, z: 6.75 },
    look: { x: 1.15, y: 1.72, z: -10.5 },
  },
  {
    id: 'riacho',
    name: 'Margem do Riacho',
    hint: 'Visão próxima das corredeiras, musgo úmido e reflexos lunares.',
    pos: { x: 0.55, y: 1.32, z: 1.4 },
    look: { x: 2.45, y: 0.92, z: -12.0 },
  },
  {
    id: 'clareira',
    name: 'Trilha da Clareira',
    hint: 'Posto avançado da trilha cercado pelos enxames sincronizados.',
    pos: { x: -1.75, y: 1.72, z: -10.5 },
    look: { x: 0.75, y: 1.85, z: -26.0 },
  },
  {
    id: 'vale',
    name: 'Vista Panorâmica',
    hint: 'Observatório elevado abrangendo todo o vale, a lua e o meandro.',
    pos: { x: -4.2, y: 4.35, z: 11.2 },
    look: { x: 0.8, y: 1.8, z: -14.0 },
  },
];

export const QUALITY_PROFILES = {
  low:    { label: 'Baixo',  dprCap: 0.9,  shadowMap: 0,    shadows: false, grassCount: 1600, pebbleCount: 220, starCount: 450 },
  medium: { label: 'Médio',  dprCap: 1.0,  shadowMap: 512,  shadows: true,  grassCount: 2800, pebbleCount: 380, starCount: 700 },
  high:   { label: 'Alto',   dprCap: 1.35, shadowMap: 1024, shadows: true,  grassCount: 4200, pebbleCount: 520, starCount: 950 },
};

export function createDefaultState() {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmallScreen =
    typeof window !== 'undefined' && window.innerWidth < 900;

  return {
    activeTool: 'brilho',         // 'brilho' | 'hora' | 'som' | 'fotografia'
    brightness: 0.78,             // [0..1] intensidade de vaga-lumes e lampiões
    hour: 22.0,                   // [18.5..28.5] => 18h30 .. 04h30
    density: 220,                 // [20..360] vaga-lumes ativos (T01)
    syncCoupling: 1.35,           // [0..3.5 rad/s] acoplamento de fase Kuramoto
    reducedMotion: prefersReduced,
    soundEnabled: false,
    muted: false,
    volume: 0.62,                 // [0..1]
    qualityMode: 'auto',          // 'auto' | 'low' | 'medium' | 'high'
    resolvedQuality: isSmallScreen ? 'low' : 'medium',
    paused: false,
    settingsOpen: false,
    journalOpen: false,
    cameraMode: 'walk',           // 'walk' | 'orbit'
    waypointId: 'poste',
    simTime: 0,
    measuredOrderR: 0,
    measuredMeanHz: 0.55,
    observedRecords: [],
    photosTaken: 0,
  };
}

export function formatNightHour(hourVal) {
  const wrapped = ((hourVal % 24) + 24) % 24;
  const h = Math.floor(wrapped);
  const m = Math.round((wrapped - h) * 60) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function getNightPhaseInfo(hourVal) {
  const h = ((hourVal % 24) + 24) % 24;
  if (h >= 18 && h < 20.2) return { label: 'Crepúsculo', emergence: 0.55 + (h - 18) * 0.2 };
  if (h >= 20.2 || h < 1.5) return { label: 'Noite Estrelada', emergence: 1.0 };
  if (h >= 1.5 && h < 3.6) return { label: 'Madrugada Serena', emergence: 0.72 };
  return { label: 'Alvorada Azul', emergence: 0.35 };
}
