export type LocationId = 'padaria' | 'escola' | 'biblioteca' | 'praca' | 'ponto_onibus'
export type ChoiceEffect = 'ask' | 'wait' | 'exit' | 'custom' | 'normal'
export type ObservationType = 'Independente' | 'Com apoio' | 'Tempo solicitado' | 'Saída respeitada'

export interface Choice {
  id: string
  label: string
  icon?: string // 'speech' | 'hourglass' | 'exit' | 'edit'
  nextId: string | null // null means terminal node
  effect?: ChoiceEffect
}

export interface DialogueNode {
  id: string
  speaker: 'npc' | 'player'
  npcName: string
  text: string
  stage: number // e.g. 1, 2, 3...
  totalStages: number
  choices: Choice[]
  isTerminal?: boolean
}

export interface Scenario {
  id: string
  locationId: LocationId
  title: string
  subtitle: string
  description: string
  initialNodeId: string
  nodes: Record<string, DialogueNode>
}

export interface DialogueStepRecord {
  nodeId: string
  choiceId: string
  choiceLabel: string
  effect?: ChoiceEffect
}

export interface SavedHistorySnapshot {
  currentNodeId: string
  stage: number
  waitingTime: boolean
  isFinished: boolean
  history: DialogueStepRecord[]
}

export interface GameSettings {
  sound: boolean
  lowStimulation: boolean
  reducedMotion: boolean
  quality: 'auto' | 'light' | 'balanced' | 'cinema'
}

export interface GameState {
  version: 1
  seed: number
  phase: 'intro' | 'dialogue' | 'waiting' | 'review'
  currentLocationId: LocationId
  currentScenarioId: string
  currentNodeId: string
  stage: number
  totalStages: number
  waitingTime: boolean
  isFinished: boolean
  customInputDraft: string
  history: DialogueStepRecord[]
  undoStack: SavedHistorySnapshot[]
  redoStack: SavedHistorySnapshot[]
  observations: {
    opportunity: number
    scenarioId: string
    result: ObservationType
    notes: string
    timestamp: number
  }[]
  settings: GameSettings
}

export function initial(reducedMotion = false): GameState {
  return {
    version: 1,
    seed: Date.now(),
    phase: 'dialogue',
    currentLocationId: 'padaria',
    currentScenarioId: 'padaria_pao',
    currentNodeId: 'node_1',
    stage: 1,
    totalStages: 4,
    waitingTime: false,
    isFinished: false,
    customInputDraft: '',
    history: [],
    undoStack: [],
    redoStack: [],
    observations: [],
    settings: {
      sound: true,
      lowStimulation: false,
      reducedMotion,
      quality: 'auto'
    }
  }
}
