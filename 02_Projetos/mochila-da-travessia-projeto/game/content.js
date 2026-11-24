// Mochila da Travessia — Conteúdo, Catálogo de Assets e Configurações de Jornada
// Coleção: ACT · Verbo central: escolher e carregar

export const VERSION = '2.0.0';

export const PALETTE = {
  canvasGreen: '#556B57',
  leatherWarm: '#A67D52',
  parchment: '#C8BA9E',
  alpineSlate: '#48677C',
  terracotta: '#B56B4E',
  cabinWood: '#4A2F1E',
  lanternGlow: '#FFB85C',
  hudBg: '#1C261F',
  hudSurface: '#26332A',
  hudBorder: '#8D7B61',
  textLight: '#F3ECE0',
  textMuted: '#C8BA9E',
  highlightValid: '#7CE89A',
  highlightInvalid: '#E87C6A'
};

export const PHASES = [
  { id: 'escolher', label: 'Escolher objetos', short: 'Escolher', icon: 'pack' },
  { id: 'organizar', label: 'Organizar mochila', short: 'Organizar', icon: 'layers' },
  { id: 'revisar', label: 'Revisar', short: 'Revisar', icon: 'check' },
  { id: 'seguir', label: 'Seguir viagem', short: 'Seguir', icon: 'mountain' }
];

export const MODES = [
  {
    id: 'livre',
    label: 'Livre',
    desc: 'Explore a mesa e a mochila no seu ritmo, sem etapas obrigatórias nem restrições rígidas.',
    strictPhysics: true,
    maxMassKg: null,
    guidedHints: false,
    accompanied: false
  },
  {
    id: 'desafio_organizacao',
    label: 'Desafio de organização',
    desc: 'Acomode os itens de viagem na grade interna respeitando volume, encaixe e equilíbrio do centro de massa.',
    strictPhysics: true,
    maxMassKg: 3.5,
    guidedHints: true,
    accompanied: false
  },
  {
    id: 'preparacao_rotina',
    label: 'Preparação de rotina',
    desc: 'Sequência prática para selecionar essenciais, organizar por bolso e revisar antes de sair.',
    strictPhysics: true,
    maxMassKg: 4.0,
    guidedHints: true,
    accompanied: false
  },
  {
    id: 'travessia_simbolica',
    label: 'Travessia simbólica',
    desc: 'Experimente escolher objetos práticos e lembranças simbólicas — levar ou deixar na mesa, sem peso emocional imposto.',
    strictPhysics: true,
    maxMassKg: null,
    guidedHints: false,
    accompanied: false
  },
  {
    id: 'revisao_acompanhada',
    label: 'Revisão acompanhada',
    desc: 'Modo mediado com ajustes de complexidade e registro exclusivo de observáveis, respeitando pausa e recusa.',
    strictPhysics: true,
    maxMassKg: null,
    guidedHints: true,
    accompanied: true
  }
];

export const JOURNEYS = [
  {
    id: 'trilha_manha',
    name: 'Trilha da Manhã',
    subtitle: 'Caminhada leve até o mirante de neve',
    prompt: 'O que faz sentido levar consigo para uma travessia curta de manhã?',
    routePoints: [
      { x: 0.16, y: 0.78 },
      { x: 0.34, y: 0.62 },
      { x: 0.56, y: 0.48 },
      { x: 0.78, y: 0.24 }
    ],
    initialPacked: {
      casaco: { pocket: 'principal', col: 0, row: 0, rotation: 0 },
      livro: { pocket: 'principal', col: 3, row: 0, rotation: 0 },
      lanterna: { pocket: 'principal', col: 0, row: 2, rotation: 0 },
      bussola: { pocket: 'principal', col: 3, row: 2, rotation: 0 },
      corda: { pocket: 'principal', col: 2, row: 3, rotation: 0 }
    }
  },
  {
    id: 'travessia_montanha',
    name: 'Travessia de Montanha',
    subtitle: 'Percurso completo entre vales e abrigo',
    prompt: 'Como distribuir o volume e o equilíbrio quando o caminho pede mais preparo?',
    routePoints: [
      { x: 0.12, y: 0.84 },
      { x: 0.28, y: 0.55 },
      { x: 0.52, y: 0.60 },
      { x: 0.68, y: 0.34 },
      { x: 0.86, y: 0.18 }
    ],
    initialPacked: {
      casaco: { pocket: 'principal', col: 0, row: 0, rotation: 0 },
      corda: { pocket: 'principal', col: 2, row: 3, rotation: 0 }
    }
  },
  {
    id: 'rotina_cuidado',
    name: 'Preparação de Rotina',
    subtitle: 'Mesa aberta para organizar desde o início',
    prompt: 'O que você percebe quando experimenta outra forma de escolher e carregar?',
    routePoints: [
      { x: 0.20, y: 0.72 },
      { x: 0.48, y: 0.50 },
      { x: 0.74, y: 0.30 }
    ],
    initialPacked: {}
  },
  {
    id: 'cabana_silencio',
    name: 'Cabana de Inverno',
    subtitle: 'Foco em escolhas simbólicas e essenciais',
    prompt: 'Algumas lembranças podem ir na mochila e outras podem ficar sobre a mesa. O que escolhe agora?',
    routePoints: [
      { x: 0.18, y: 0.80 },
      { x: 0.42, y: 0.66 },
      { x: 0.62, y: 0.40 },
      { x: 0.82, y: 0.28 }
    ],
    initialPacked: {
      livro: { pocket: 'principal', col: 3, row: 0, rotation: 0 },
      bussola: { pocket: 'principal', col: 3, row: 2, rotation: 0 }
    }
  }
];

export const POCKETS = {
  principal: {
    id: 'principal',
    name: 'Compartimento Principal',
    shortName: 'Principal',
    cols: 5,
    rows: 4,
    // World-space center & extents inside backpack interior (meters)
    bounds: { xMin: -0.22, xMax: 0.22, zMin: -0.20, zMax: 0.16, yBase: 0.08 }
  },
  frontal: {
    id: 'frontal',
    name: 'Bolso Frontal',
    shortName: 'Frontal',
    cols: 3,
    rows: 1,
    bounds: { xMin: -0.15, xMax: 0.15, zMin: 0.20, zMax: 0.28, yBase: 0.055 }
  }
};

// All 9 packable objects (+ hero container mochila_com_compartimentos_e_fivelas = 10 required assets)
export const ITEMS = [
  {
    id: 'cantil',
    assetId: 'cantil',
    name: 'Cantil',
    category: 'pratico',
    symbolic: false,
    massKg: 0.85,
    volumeL: 1.0,
    gridW: 2,
    gridH: 1,
    allowedPockets: ['principal'],
    tablePos: [-0.54, 0.055, 0.06],
    tableRotY: 0.35,
    description: 'Cantil de alumínio revestido em lona verde-oliva com alças de couro e tampa rosqueável.',
    reflectionPrompt: 'O que sustenta seu ritmo ao longo do percurso?'
  },
  {
    id: 'livro',
    assetId: 'livro',
    name: 'Livro de Campo',
    category: 'pratico',
    symbolic: false,
    massKg: 0.55,
    volumeL: 1.2,
    gridW: 2,
    gridH: 2,
    allowedPockets: ['principal'],
    tablePos: [0.56, 0.025, -0.16],
    tableRotY: -0.28,
    description: 'Caderno encadernado em couro gravado com folha botânica e páginas costuradas.',
    reflectionPrompt: 'Que anotações ou memórias vale ter por perto?'
  },
  {
    id: 'pedra',
    assetId: 'pedra',
    name: 'Pedra da Montanha',
    category: 'simbolico',
    symbolic: true,
    // Symbolic items never add automatic emotional weight; optional physical mass is 0 in symbolic decoupling
    massKg: 0.0,
    physicalReferenceKg: 0.35,
    volumeL: 0.4,
    gridW: 1,
    gridH: 1,
    allowedPockets: ['principal', 'frontal'],
    tablePos: [0.58, 0.032, 0.08],
    tableRotY: 0.52,
    description: 'Pedra de granito alpino trazida de uma caminhada anterior. Objeto simbólico: levar ou deixar na mesa não altera o peso emocional.',
    reflectionPrompt: 'Você prefere carregar esta lembrança na mochila ou deixá-la descansar sobre a mesa?'
  },
  {
    id: 'lanterna',
    assetId: 'lanterna',
    name: 'Lanterna',
    category: 'pratico',
    symbolic: false,
    massKg: 0.32,
    volumeL: 0.6,
    gridW: 2,
    gridH: 1,
    allowedPockets: ['principal', 'frontal'],
    tablePos: [-0.48, 0.032, -0.18],
    tableRotY: 0.18,
    description: 'Lanterna metálica anodizada com aro de latão e foco ajustável. Pode ser acesa durante a inspeção.',
    reflectionPrompt: 'O que ajuda a enxergar o próximo passo quando escurece?'
  },
  {
    id: 'bussola',
    assetId: 'bussola',
    name: 'Bússola',
    category: 'pratico',
    symbolic: false,
    massKg: 0.14,
    volumeL: 0.3,
    gridW: 1,
    gridH: 1,
    allowedPockets: ['principal', 'frontal'],
    tablePos: [-0.42, 0.018, 0.24],
    tableRotY: -0.15,
    description: 'Bússola de bolso em latão envelhecido com rosa dos ventos e agulha magnética funcional.',
    reflectionPrompt: 'Que direção importa para você nesta etapa?'
  },
  {
    id: 'corda',
    assetId: 'corda',
    name: 'Corda Trançada',
    category: 'pratico',
    symbolic: false,
    massKg: 0.72,
    volumeL: 1.4,
    gridW: 2,
    gridH: 1,
    allowedPockets: ['principal'],
    tablePos: [0.46, 0.04, 0.25],
    tableRotY: -0.4,
    description: 'Corda de cânhamo trançada em espiral firme, presa com laço central.',
    reflectionPrompt: 'Quais apoios práticos dão firmeza à travessia?'
  },
  {
    id: 'casaco',
    assetId: 'casaco',
    name: 'Casaco de Montanha',
    category: 'pratico',
    symbolic: false,
    massKg: 0.68,
    volumeL: 2.2,
    gridW: 2,
    gridH: 2,
    allowedPockets: ['principal'],
    tablePos: [-0.62, 0.055, -0.34],
    tableRotY: 0.22,
    description: 'Casaco acolchoado azul-ardósia com acabamento terracota, dobrado para ocupar menos espaço.',
    reflectionPrompt: 'Como você se protege quando o clima muda de repente?'
  },
  {
    id: 'cartoes_semanticos',
    assetId: 'cartoes_semanticos',
    name: 'Cartões Semânticos',
    category: 'simbolico',
    symbolic: true,
    massKg: 0.0,
    physicalReferenceKg: 0.04,
    volumeL: 0.2,
    gridW: 1,
    gridH: 1,
    allowedPockets: ['principal', 'frontal'],
    tablePos: [0.62, 0.006, -0.05],
    tableRotY: -0.18,
    cards: [
      { id: 'montanha', title: 'Montanha', motif: 'Presença e passo firme' },
      { id: 'rosa', title: 'Direção', motif: 'Valores que orientam' },
      { id: 'broto', title: 'Cuidado', motif: 'Cultivo diário' },
      { id: 'fogueira', title: 'Abrigo', motif: 'Calor e descanso' }
    ],
    description: 'Conjunto de 4 cartões ilustrados em papel encorpado. Objeto simbólico livre de escore ou peso automático.',
    reflectionPrompt: 'Qual imagem conversa com o que importa para você hoje?'
  },
  {
    id: 'mapa',
    assetId: 'mapa',
    name: 'Mapa da Travessia',
    category: 'pratico',
    symbolic: false,
    massKg: 0.08,
    volumeL: 0.3,
    gridW: 2,
    gridH: 1,
    allowedPockets: ['principal', 'frontal'],
    tablePos: [-0.52, 0.004, 0.14],
    tableRotY: -0.22,
    description: 'Mapa topográfico dobrável com curvas de nível, rota pontilhada e rosa dos ventos.',
    reflectionPrompt: 'Prefere deixar o mapa aberto na mesa ou levá-lo dobrado no bolso frontal?'
  }
];

export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((item) => [item.id, item]));

export const CAMERA_PRESETS = [
  { id: 'mesa', label: 'Mesa e Mochila', pos: [0.02, 0.96, 1.06], target: [0.02, 0.10, 0.02] },
  { id: 'grade', label: 'Interior / Grade', pos: [0.04, 0.88, 0.42], target: [0.04, 0.10, -0.01] },
  { id: 'cabana', label: 'Cabana e Janela', pos: [0.58, 0.72, 1.38], target: [-0.14, 0.24, -0.12] },
  { id: 'simbolicos', label: 'Lembranças', pos: [0.68, 0.56, 0.56], target: [0.56, 0.05, 0.04] }
];
