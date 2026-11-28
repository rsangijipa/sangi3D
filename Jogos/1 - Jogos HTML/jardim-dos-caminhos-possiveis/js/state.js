/**
 * js/state.js
 * Estado serializável para # 073 — Jardim dos Caminhos Possíveis.
 * Grafo de bifurcações editável com retorno sem perda (T01),
 * alternativas neutras sem avaliação automática (T02) e notas apagáveis (T03).
 */

export const SEED = 7305;

export function createInitialNodes() {
  return [
    { id: 0, parentId: null, x: 0.0,  z: 5.2,  title: 'Entrada do Jardim', note: '' },
    { id: 1, parentId: 0,    x: -3.2, z: 0.6,  title: 'Ponte do Riacho',   note: '' },
    { id: 2, parentId: 0,    x: 3.2,  z: 0.6,  title: 'Clareira das Pedras', note: '' },
    { id: 3, parentId: 1,    x: -4.8, z: -4.2, title: 'Banco do Salgueiro', note: '' },
    { id: 4, parentId: 2,    x: 4.8,  z: -4.2, title: 'Mirante Norte',     note: '' },
  ];
}

export const CAMERA_MODES = {
  elevated: { id: 'elevated', label: 'Elevada',   offset: [0.0, 9.2, 8.8], mobileOffset: [0.0, 11.4, 10.6] },
  walk:     { id: 'walk',     label: 'Caminhada', offset: [0.0, 2.1, 3.8], mobileOffset: [0.0, 2.4,  4.4] },
};

export const QUALITY_PROFILES = {
  low:    { label: 'Leve',  dprCap: 1.0,  shadowMap: 1024, shadows: true },
  medium: { label: 'Média', dprCap: 1.35, shadowMap: 2048, shadows: true },
  high:   { label: 'Alta',  dprCap: 1.75, shadowMap: 2048, shadows: true },
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
    nodes: createInitialNodes(),
    currentNodeId: 0,
    visitedIds: [0],
    cameraMode: 'elevated',       // 'elevated' | 'walk'
    sessionMode: 'free',          // 'free' | 'mediated'
    travelerPos: { x: 0.0, z: 5.2 },
    travelGoal: null,

    soundEnabled: false,
    muted: false,
    volume: 0.45,
    reducedMotion: prefersReduced,
    qualityMode: 'auto',
    resolvedQuality: isSmall ? 'medium' : 'high',
    paused: false,
    contemplative: false,
    settingsOpen: false,
    notesOpen: false,
    simTime: 0,
  };
}
