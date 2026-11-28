/**
 * js/state.js
 * Estado serializável para # 071 — Estufa dos Sentimentos.
 * Zero inferência clínica ou rótulos emocionais obrigatórios;
 * qualquer cor representa qualquer escolha pessoal; registros são locais e apagáveis.
 */

export const SEED = 7104;

export const PLANT_SPECIES = {
  samambaia: { id: 'samambaia', label: 'Samambaia',  potTone: 0xb86846 },
  girassol:  { id: 'girassol',  label: 'Girassol',   potTone: 0xc27a4e },
  lotus:     { id: 'lotus',     label: 'Lótus',      potTone: 0x5c6e78 },
  bonsai:    { id: 'bonsai',    label: 'Bonsai',     potTone: 0x4b433b },
};

export const PALETTE_SWATCHES = [
  '#5fa876', // Folhagem verde
  '#e0b44c', // Âmbar solar
  '#d97b84', // Rosa terra
  '#6c9ec4', // Azul chuva
  '#9e82c4', // Lavanda suave
  '#d88450', // Terracota viva
  '#d9d4c7', // Linho claro
  '#56626b', // Ardósia calma
];

export const WEATHER_MODES = {
  sun:    { id: 'sun',    label: 'Sol Filtrado',  sunInt: 2.35, rainRate: 0,    fogDensity: 0.015, skyHex: 0xc9d7d4 },
  rain:   { id: 'rain',   label: 'Chuva Suave',   sunInt: 1.05, rainRate: 1.0,  fogDensity: 0.032, skyHex: 0x7b8d9c },
  breeze: { id: 'breeze', label: 'Brisa Dourada', sunInt: 1.85, rainRate: 0.0,  fogDensity: 0.022, skyHex: 0xdcc5a4 },
};

export const CAMERA_MODES = {
  bench: { id: 'bench', label: 'Bancada',   pos: [2.45, 1.85, 3.15], mobilePos: [2.85, 2.25, 3.85], target: [0.0, 1.05, 0.0] },
  walk:  { id: 'walk',  label: 'Caminhada', pos: [0.0,  1.58, 4.65], mobilePos: [0.0,  1.65, 5.10], target: [0.0, 1.25, -1.5] },
};

export const QUALITY_PROFILES = {
  low:    { label: 'Leve',  dprCap: 1.0,  shadowMap: 1024, shadows: true,  rainCount: 45 },
  medium: { label: 'Média', dprCap: 1.35, shadowMap: 2048, shadows: true,  rainCount: 95 },
  high:   { label: 'Alta',  dprCap: 1.75, shadowMap: 2048, shadows: true,  rainCount: 150 },
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
    species: 'samambaia',
    colorHex: PALETTE_SWATCHES[0],
    weather: 'sun',
    sessionMode: 'free',          // 'free' | 'guided' (sem meta obrigatória)
    cameraMode: 'bench',          // 'bench' | 'walk'
    tagText: '',                  // etiqueta em branco opcional
    moisture: 0.62,               // [0..1] umidade simbólica
    growth: 0.68,                 // [0.35..1.15] crescimento simbólico reversível
    entries: [],                  // registros opcionais exclusivamente locais (apagáveis)

    soundEnabled: false,
    muted: false,
    volume: 0.45,
    reducedMotion: prefersReduced,
    qualityMode: 'auto',
    resolvedQuality: isSmall ? 'medium' : 'high',
    paused: false,
    contemplative: false,
    settingsOpen: false,
    journalOpen: false,
    simTime: 0,
    waterPulse: 0,
  };
}
