/**
 * js/state.js
 * Estado serializável para # 072 — Museu das Memórias.
 * Objetos simbólicos genéricos, legendas móveis, importação estritamente local
 * opcional em molduras e modo Acervo Fictício vs Exposição Pessoal.
 */

export const SEED = 7208;

export const OBJECT_CATALOG = [
  { id: 'bussola',   label: 'Bússola de Latão' },
  { id: 'chave',     label: 'Chave Antiga' },
  { id: 'ampulheta', label: 'Ampulheta' },
  { id: 'barco',     label: 'Barco de Papel' },
  { id: 'xicara',    label: 'Xícara Cerâmica' },
  { id: 'livreto',   label: 'Livreto Encadernado' },
];

// 4 pedestais com vitrine + 3 molduras de parede
export const GALLERY_SLOTS = [
  { id: 0, kind: 'pedestal', label: 'Pedestal Oeste',   x: -2.6, y: 1.04, z: -0.9 },
  { id: 1, kind: 'pedestal', label: 'Pedestal Centro',  x: -0.8, y: 1.04, z: -1.8 },
  { id: 2, kind: 'pedestal', label: 'Pedestal Norte',   x: 1.0,  y: 1.04, z: -1.8 },
  { id: 3, kind: 'pedestal', label: 'Pedestal Leste',   x: 2.6,  y: 1.04, z: -0.9 },
  { id: 4, kind: 'frame',    label: 'Moldura Esquerda', x: -2.2, y: 2.15, z: -4.28 },
  { id: 5, kind: 'frame',    label: 'Moldura Central',  x: 0.0,  y: 2.15, z: -4.28 },
  { id: 6, kind: 'frame',    label: 'Moldura Direita',  x: 2.2,  y: 2.15, z: -4.28 },
];

export const FICTIONAL_DEMO_ITEMS = {
  0: { type: 'bussola',   caption: 'Mapa sem destino fixo', localImageUrl: null },
  1: { type: 'ampulheta', caption: 'Tempo medido sem pressa', localImageUrl: null },
  2: { type: 'barco',     caption: 'Travessia de papel', localImageUrl: null },
  5: { type: 'foto',      caption: 'Horizonte em branco', localImageUrl: null },
};

export const CAMERA_MODES = {
  walk: { id: 'walk', label: 'Caminhada',  pos: [0.0, 1.65, 3.65], mobilePos: [0.0, 1.72, 4.45], target: [0.0, 1.45, -2.0] },
  iso:  { id: 'iso',  label: 'Isométrica', pos: [4.8, 5.2,  4.8],  mobilePos: [5.6, 6.0,  5.8],  target: [0.0, 1.0,  -1.4] },
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
    roomMode: 'personal',     // 'personal' (vazia por padrão) | 'fictional'
    cameraMode: 'walk',       // 'walk' | 'iso'
    selectedSlotId: 0,
    moveSourceSlotId: null,   // quando usuário clica "Mover" para outro suporte
    items: {},                // slotId -> { type, caption, localImageUrl }

    soundEnabled: false,
    muted: false,
    volume: 0.40,
    reducedMotion: prefersReduced,
    qualityMode: 'auto',
    resolvedQuality: isSmall ? 'medium' : 'high',
    paused: false,
    contemplative: false,
    settingsOpen: false,
    privacyOpen: false,
    simTime: 0,
  };
}
