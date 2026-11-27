import type { Mode, WeightType, SubBeamType, GameState } from './state.ts'

export interface WeightDef {
  type: WeightType
  name: string
  mass: number // kg
  description: string
  color: string
}

export interface SubBeamDef {
  type: SubBeamType
  name: string
  mass: number // kg
  halfSpan: number // cm
  description: string
}

export const WEIGHTS: Record<WeightType, WeightDef> = {
  terracotta: {
    type: 'terracotta',
    name: 'Vaso de terracota',
    mass: 5.0,
    description: 'Cerâmica artesanal com relevos ondulados horizontais e alça de latão.',
    color: '#A44D40'
  },
  fluted: {
    type: 'fluted',
    name: 'Esfera canelada verde',
    mass: 2.0,
    description: 'Cerâmica esmaltada verde-oliva com estrias verticais e argola superior.',
    color: '#596F69'
  },
  glass: {
    type: 'glass',
    name: 'Esfera de vidro',
    mass: 3.0,
    description: 'Vidro translúcido maciço com refração e suspensão pontual.',
    color: '#DCE4E3'
  },
  ring: {
    type: 'ring',
    name: 'Anel de pedra',
    mass: 1.5,
    description: 'Toróide em travertino claro pontilhado com engate em latão.',
    color: '#DBCDB5'
  },
  crackle: {
    type: 'crackle',
    name: 'Cúpula craquelada',
    mass: 2.5,
    description: 'Cúpula em cerâmica celadon com craqueluras sutis e borda terracota.',
    color: '#7D958B'
  },
  cylinder: {
    type: 'cylinder',
    name: 'Peso de latão',
    mass: 4.0,
    description: 'Cilindro maciço em latão acetinado com olhal usinado.',
    color: '#9D814A'
  }
}

export const SUB_BEAMS: Record<SubBeamType, SubBeamDef> = {
  brass: {
    type: 'brass',
    name: 'Braço secundário de latão',
    mass: 1.2,
    halfSpan: 15, // slots at -15cm and +15cm from its center
    description: 'Barra perfurada proporcional em latão para níveis encadeados de móbile.'
  },
  wood: {
    type: 'wood',
    name: 'Braço secundário de madeira',
    mass: 0.8,
    halfSpan: 16, // slots at -16cm and +16cm from its center
    description: 'Barra esculpida em carvalho claro com ganchos de latão polido.'
  }
}

export const MODES: Record<Mode, { title: string; subtitle: string; description: string }> = {
  free: {
    title: 'Escultura livre',
    subtitle: 'Composição aberta',
    description: 'Explore o móbile cinético, adicione pesos e sub-barras sem restrições ou pontuação.'
  },
  challenge: {
    title: 'Desafio de equilíbrio',
    subtitle: 'Busca pela linha horizontal',
    description: 'Posicione as massas ou desloque o fulcro para alcançar o ângulo de 0,0°.'
  },
  asymmetry: {
    title: 'Assimetria intencional',
    subtitle: 'Tensão poética e peso visual',
    description: 'Crie composições desbalanceadas estáveis que expressem contrastes materiais.'
  },
  partner: {
    title: 'Composição em parceria',
    subtitle: 'Alternância de turnos',
    description: 'Duas pessoas interagem em turnos alternados, equilibrando ou transformando a escultura.'
  }
}

export const PRESETS: Record<string, { label: string; description: string; setup: (state: GameState) => void }> = {
  mockup: {
    label: 'Galeria Original (Mockup)',
    description: 'Composição clássica da galeria com vaso de terracota, esferas e níveis encadeados.',
    setup: state => {
      state.sceneState.fulcrumPosition = 0
      state.sceneState.subBeams = [
        { id: 'sub-brass', type: 'brass', slot: -10, angle: -3.5 },
        { id: 'sub-wood', type: 'wood', slot: 20, angle: 2.1 }
      ]
      state.sceneState.weights = [
        { id: 'w1', type: 'terracotta', slot: -35 },
        { id: 'w2', type: 'glass', slot: -20 },
        { id: 'w3', type: 'fluted', slot: -10, subBeamId: 'sub-brass', subSlot: 'left' },
        { id: 'w4', type: 'cylinder', slot: -10, subBeamId: 'sub-brass', subSlot: 'right' },
        { id: 'w5', type: 'ring', slot: 20, subBeamId: 'sub-wood', subSlot: 'left' },
        { id: 'w6', type: 'crackle', slot: 20, subBeamId: 'sub-wood', subSlot: 'right' },
        { id: 'w7', type: 'cylinder', slot: 35 }
      ]
    }
  },
  symmetric: {
    label: 'Equilíbrio Puro (0,0°)',
    description: 'Massas simétricas a distâncias iguais resultando em linha de nível perfeita.',
    setup: state => {
      state.sceneState.fulcrumPosition = 0
      state.sceneState.subBeams = []
      state.sceneState.weights = [
        { id: 'w1', type: 'cylinder', slot: -30 },
        { id: 'w2', type: 'fluted', slot: -15 },
        { id: 'w3', type: 'fluted', slot: 15 },
        { id: 'w4', type: 'cylinder', slot: 30 }
      ]
    }
  },
  calder: {
    label: 'Cascata de Calder',
    description: 'Três níveis sobrepostos encadeados com anéis e esferas em balanço sutil.',
    setup: state => {
      state.sceneState.fulcrumPosition = -5
      state.sceneState.subBeams = [
        { id: 'sub-brass', type: 'brass', slot: -25, angle: 0 },
        { id: 'sub-wood', type: 'wood', slot: 25, angle: 0 }
      ]
      state.sceneState.weights = [
        { id: 'w1', type: 'ring', slot: -25, subBeamId: 'sub-brass', subSlot: 'left' },
        { id: 'w2', type: 'crackle', slot: -25, subBeamId: 'sub-brass', subSlot: 'right' },
        { id: 'w3', type: 'fluted', slot: 25, subBeamId: 'sub-wood', subSlot: 'left' },
        { id: 'w4', type: 'glass', slot: 25, subBeamId: 'sub-wood', subSlot: 'right' }
      ]
    }
  }
}
