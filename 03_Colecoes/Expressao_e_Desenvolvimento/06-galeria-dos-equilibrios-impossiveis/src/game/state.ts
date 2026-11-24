export type Mode = 'free' | 'challenge' | 'asymmetry' | 'partner'
export type Quality = 'auto' | 'light' | 'balanced' | 'cinema'
export type Tool = 'add-weight' | 'move-fulcrum' | 'observe' | 'free-balance'
export type View = 'panoramic' | 'fulcrum' | 'top' | 'weights'
export type Observation = 'Independente' | 'Com ajuda' | 'Não realizada' | 'Recusada'

export type WeightType = 'terracotta' | 'fluted' | 'glass' | 'ring' | 'crackle' | 'cylinder'
export type SubBeamType = 'brass' | 'wood'

export interface AttachedWeight {
  id: string
  type: WeightType
  slot: number // position along beam in cm (-40 to +40)
  subBeamId?: string // if attached to a sub-beam
  subSlot?: 'left' | 'right'
}

export interface AttachedSubBeam {
  id: string
  type: SubBeamType
  slot: number // attachment slot on main beam in cm
  angle: number // tilt angle of the sub-beam
}

export interface MobileSceneState {
  fulcrumPosition: number // cm along main beam, typically -30 to +30, default 0
  mainAngle: number // degrees, current physics angle
  targetAngle: number // degrees, static target angle
  angularVelocity: number // rad/s for dynamic oscillation
  weights: AttachedWeight[]
  subBeams: AttachedSubBeam[]
  rulerVisible: boolean
  dynamometerVisible: boolean
  observations: { opportunity: number; result: Observation }[]
}

export interface Settings {
  quality: Quality
  reduced: boolean
  tolerance: number // angle tolerance for equilibrium challenge, e.g. 0.5 degrees
  sound: boolean
  opportunities: number
  instruction: 'both' | 'visual' | 'verbal'
}

export interface GameState {
  version: 1
  seed: number
  mode: Mode
  phase: 'entry' | 'work' | 'paused' | 'review' | 'exit'
  settings: Settings
  sceneState: MobileSceneState
  history: MobileSceneState[]
  future: MobileSceneState[]
}

export function initial(reducedMotion = false): GameState {
  return {
    version: 1,
    seed: Date.now(),
    mode: 'free',
    phase: 'entry',
    settings: {
      quality: 'auto',
      reduced: reducedMotion,
      tolerance: 0.8,
      sound: false,
      opportunities: 5,
      instruction: 'both'
    },
    sceneState: {
      fulcrumPosition: 0,
      mainAngle: 7.4,
      targetAngle: 7.4,
      angularVelocity: 0,
      weights: [
        { id: 'w1', type: 'terracotta', slot: -35 },
        { id: 'w2', type: 'glass', slot: -20 },
        { id: 'w3', type: 'fluted', slot: -10, subBeamId: 'sub-brass', subSlot: 'left' },
        { id: 'w4', type: 'cylinder', slot: -10, subBeamId: 'sub-brass', subSlot: 'right' },
        { id: 'w5', type: 'ring', slot: 20, subBeamId: 'sub-wood', subSlot: 'left' },
        { id: 'w6', type: 'crackle', slot: 20, subBeamId: 'sub-wood', subSlot: 'right' },
        { id: 'w7', type: 'cylinder', slot: 35 }
      ],
      subBeams: [
        { id: 'sub-brass', type: 'brass', slot: -10, angle: -3.5 },
        { id: 'sub-wood', type: 'wood', slot: 20, angle: 2.1 }
      ],
      rulerVisible: true,
      dynamometerVisible: true,
      observations: []
    },
    history: [],
    future: []
  }
}
