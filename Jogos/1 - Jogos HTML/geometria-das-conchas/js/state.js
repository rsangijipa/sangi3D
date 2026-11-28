/**
 * js/state.js
 * Estado global centralizado de Geometria das Conchas 2.0 — Laboratório de Morfologia Marinha.
 * Suporta 10 famílias morfológicas, 4 estações de trabalho, anatomia interna (5 modos de corte),
 * simulação de crescimento 4D, instrumentos científicos, laboratório matemático,
 * tanque de flutuabilidade, fotografia avançada e catálogo persistente.
 */

export const SEED = 2509;

export const WORKSTATIONS = {
  morphology: {
    id: 'morphology',
    name: 'Bancada de Morfologia',
    camPos: [2.35, 1.95, 2.95],
    mobilePos: [2.75, 2.45, 3.65],
    target: [0.0, 0.22, 0.0],
    desc: 'Inspeção morfológica geral, geometria, famílias e parâmetros.',
  },
  anatomy: {
    id: 'anatomy',
    name: 'Estação de Anatomia',
    camPos: [0.15, 2.75, 1.65],
    mobilePos: [0.18, 3.25, 2.05],
    target: [0.0, 0.18, 0.0],
    desc: 'Cortes seccionais, câmaras, septos, sifúnculo, raio X e vista explodida.',
  },
  microscopy: {
    id: 'microscopy',
    name: 'Laboratório de Microscopia & Medições',
    camPos: [-1.45, 1.45, 1.75],
    mobilePos: [-1.65, 1.85, 2.25],
    target: [-0.65, 0.16, 0.15],
    desc: 'Lupa ótica, paquímetro funcional, balança digital e lâminas ultraestruturais.',
  },
  photography: {
    id: 'photography',
    name: 'Estúdio de Fotografia & Luz',
    camPos: [1.85, 1.35, 2.15],
    mobilePos: [2.15, 1.65, 2.55],
    target: [0.05, 0.22, 0.0],
    desc: 'Iluminação cinematográfica, luminária articulada, DoF e captura.',
  },
  buoyancy: {
    id: 'buoyancy',
    name: 'Tanque de Flutuabilidade',
    camPos: [1.95, 1.75, -0.65],
    mobilePos: [2.45, 2.15, -0.75],
    target: [1.25, 0.28, -0.45],
    desc: 'Simulação hidrostática de Arquimedes, gás nas câmaras e equilíbrio.',
  },
};

export const LIGHT_PRESETS = {
  museum: {
    id: 'museum',
    name: 'Museu Noturno',
    keyColor: 0xffeed4,
    keyIntensity: 2.35,
    keyPos: [3.8, 5.6, 3.4],
    rimColor: 0x90b8f0,
    rimIntensity: 0.95,
    fillColor: 0xffe2c0,
    fillIntensity: 0.85,
    envIntensity: 0.72,
    exposure: 1.12,
  },
  natural: {
    id: 'natural',
    name: 'Luz Natural Difusa',
    keyColor: 0xf5f8ff,
    keyIntensity: 2.1,
    keyPos: [2.5, 6.0, 2.5],
    rimColor: 0xc8ddf5,
    rimIntensity: 0.7,
    fillColor: 0xeef4fa,
    fillIntensity: 0.9,
    envIntensity: 0.95,
    exposure: 1.05,
  },
  macro: {
    id: 'macro',
    name: 'Macrofotografia',
    keyColor: 0xfff4e5,
    keyIntensity: 2.8,
    keyPos: [1.8, 3.2, 2.2],
    rimColor: 0xa8c8ff,
    rimIntensity: 1.2,
    fillColor: 0xffffff,
    fillIntensity: 1.1,
    envIntensity: 0.85,
    exposure: 1.25,
  },
  lab: {
    id: 'lab',
    name: 'Laboratório Branco',
    keyColor: 0xffffff,
    keyIntensity: 2.5,
    keyPos: [0.0, 6.5, 2.0],
    rimColor: 0xddeeff,
    rimIntensity: 0.8,
    fillColor: 0xf0f5fa,
    fillIntensity: 1.0,
    envIntensity: 1.1,
    exposure: 1.0,
  },
  rimlight: {
    id: 'rimlight',
    name: 'Contraluz Mineral',
    keyColor: 0xffd2a0,
    keyIntensity: 1.2,
    keyPos: [1.5, 2.5, 2.0],
    rimColor: 0x9cd2ff,
    rimIntensity: 3.2,
    fillColor: 0xff9944,
    fillIntensity: 0.4,
    envIntensity: 0.45,
    exposure: 1.18,
  },
};

export const QUALITY_PROFILES = {
  low: {
    id: 'low',
    label: 'Econômica',
    dprCap: 1.0,
    shadowMap: 1024,
    shadows: true,
    segU: 72,
    segV: 22,
    dustCount: 20,
    triLimit: 60000,
    postProcessing: false,
  },
  medium: {
    id: 'medium',
    label: 'Equilibrada',
    dprCap: 1.25,
    shadowMap: 2048,
    shadows: true,
    segU: 104,
    segV: 28,
    dustCount: 50,
    triLimit: 150000,
    postProcessing: true,
  },
  high: {
    id: 'high',
    label: 'Alta',
    dprCap: 1.75,
    shadowMap: 2048,
    shadows: true,
    segU: 136,
    segV: 34,
    dustCount: 90,
    triLimit: 350000,
    postProcessing: true,
  },
  ultra: {
    id: 'ultra',
    label: 'Ultra',
    dprCap: 2.0,
    shadowMap: 4096,
    shadows: true,
    segU: 168,
    segV: 42,
    dustCount: 150,
    triLimit: 600000,
    postProcessing: true,
  },
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
    // Espécie selecionada (10 famílias)
    speciesId: 'nautilus',

    // Modo da experiência
    experienceMode: 'morphology', // 'morphology' | 'anatomy' | 'geometry' | 'photography' | 'challenges' | 'contemplation'

    // Estação ativa
    currentStation: 'morphology',

    // Parâmetros morfométricos da concha
    spiralTurns: 3.15,      // Voltas
    aperture: 0.62,         // Taxa de expansão / abertura (0.2 a 1.2)
    scaleRatio: 1.0,        // Escala geral (0.5 a 1.5)
    spirePitch: 0.0,        // Elevação helicoidal (0 planar a 1.2 agulha)
    ribsCount: 18,          // Quantidade de costelas
    ribsIntensity: 0.02,    // Amplitude das costelas / pregas
    wallThickness: 0.024,   // Espessura da parede calcificada
    spinesIntensity: 0.0,   // Espinhos (Murex)
    roughnessNoise: 0.04,   // Desgaste superficial
    iridescenceLevel: 0.85, // Intensidade do nácar interno

    // Anatomia e modos de corte
    viewMode: 'cutaway',    // 'whole' | 'cutaway' | 'progressive' | 'xray' | 'exploded'
    cutaway: true,          // Compatibilidade retroativa (true = corte)
    cutProgress: 0.5,       // [0..1] Posição do plano no corte progressivo
    explodedDistance: 0.0,  // [0..1] Separação das camadas na vista explodida
    selectedPOI: null,      // Ponto de interesse anatômico selecionado
    showAnatomyLabels: true,

    // Simulação 4D de Crescimento
    growthActive: false,
    growthProgress: 1.0,    // [0.05 .. 1.0] estágio atual de deposição
    growthSpeed: 1.0,       // 0.5x, 1x, 2x, 4x

    // Laboratório Matemático
    mathOverlayActive: false,
    mathCurveType: 'logarithmic', // 'logarithmic' | 'archimedean' | 'golden'
    showCentralSpirals: true,
    showAxes: true,
    showVectors: true,
    showCurvaturePlot: false,

    // Instrumentos científicos
    activeTool: 'caliper',  // 'none' | 'caliper' | 'scale' | 'magnifier' | 'microscope'
    caliperUnit: 'mm',      // 'mm' | 'cm'
    caliperMeasurement: 0,  // Valor lido pelo paquímetro
    scaleTare: 0,           // Tara da balança em gramas
    scaleMass: 0,           // Massa estimada da concha
    magnifierActive: false,
    microscopeZoom: 10,     // 10x, 25x, 50x, 100x

    // Tanque de Flutuabilidade
    buoyancyActive: false,
    buoyancyGasRatio: 0.62, // Fração de gás (vs líquido) nas câmaras do náutilo (0 a 1)
    waterDensity: 1.025,    // Densidade da água do mar em g/cm³

    // Manipulação física tridimensional
    isDraggingSpecimen: false,
    specimenRestOnDesk: true,
    specimenPosition: [0, 0, 0],
    specimenRotation: [0, 0, 0],

    // Estúdio Fotográfico & Iluminação
    photoMode: false,
    lightPreset: 'museum',
    dofEnabled: !prefersReduced,
    focusDist: 0.45,
    exposure: 1.12,
    framing: 'table',
    lampPos: [1.2, 1.8, 1.0],
    lampIntensity: 1.4,
    lampTemperature: 3800, // Kelvin quente

    // Modo Desafios (8 atividades educativas)
    activeChallengeIndex: null,
    challengeCompleted: [false, false, false, false, false, false, false, false],

    // Catálogo & Coleção Pessoal
    catalog: [],
    savedCollection: [],
    compareOpen: false,

    // Sistema de áudio & acessibilidade
    soundEnabled: false,
    muted: false,
    masterVolume: 0.48,
    ambientVolume: 0.5,
    effectsVolume: 0.7,
    reducedMotion: prefersReduced,
    qualityMode: 'auto',
    resolvedQuality: isSmall ? 'medium' : 'high',
    paused: false,
    contemplative: false,
    settingsOpen: false,
    simTime: 0,
  };
}
