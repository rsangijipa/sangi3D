export type Context = 'market' | 'library' | 'backpack'
export type CarrierType = 'cart' | 'basket'
export type WaypointId = 'entrance' | 'produce' | 'pantry' | 'bakery' | 'checkout'
export type Quality = 'auto' | 'light' | 'balanced' | 'cinema'
export type Observation = 'Independente' | 'Com ajuda' | 'Não realizada' | 'Recusada'

export interface ProductItem {
  id: string
  name: string
  category: 'fruit' | 'grain' | 'bakery' | 'dairy' | 'hygiene' | 'study'
  color: string
  waypoint: WaypointId
  description: string
  icon: string
  position: [number, number, number] // [x, y, z] in market space
  scale?: number
}

export interface Mission {
  id: string
  title: string
  context: Context
  subtitle: string
  description: string
  requiredItemIds: string[]
  alternatives?: Record<string, string> // e.g. 'soap' -> 'soap_liquid'
  targetCarrier: CarrierType
}

export interface GameSettings {
  quality: Quality
  sound: boolean
  brightness: number // 0.7 to 1.3
  reducedMotion: boolean
  opportunities: number
}

export interface SavedSnapshot {
  currentWaypoint: WaypointId
  carrier: CarrierType
  inventory: string[]
  helpCount: number
  activeHelpMessage: string | null
  activeHighlightId: string | null
  lowStimulation: boolean
}

export interface GameState {
  version: 1
  seed: number
  phase: 'entry' | 'work' | 'checkout' | 'review' | 'paused' | 'exit'
  currentMissionId: string
  carrier: CarrierType
  currentWaypoint: WaypointId
  inventory: string[] // item IDs currently in cart
  helpCount: number
  activeHelpMessage: string | null
  activeHighlightId: string | null
  lowStimulation: boolean
  settings: GameSettings
  history: SavedSnapshot[]
  future: SavedSnapshot[]
  observations: { opportunity: number; action: string; result: Observation }[]
}

export function initial(reducedMotion = false): GameState {
  return {
    version: 1,
    seed: Date.now(),
    phase: 'entry',
    currentMissionId: 'market_snack',
    carrier: 'cart',
    currentWaypoint: 'entrance',
    inventory: [],
    helpCount: 0,
    activeHelpMessage: null,
    activeHighlightId: null,
    lowStimulation: false,
    settings: {
      quality: 'auto',
      sound: false,
      brightness: 1.0,
      reducedMotion,
      opportunities: 5
    },
    history: [],
    future: [],
    observations: []
  }
}
