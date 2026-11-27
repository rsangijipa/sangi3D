import { presets, type Mode, type Vessel } from './content.ts'

export type Quality = 'auto' | 'light' | 'balanced' | 'cinema'
export type Tool = 'fit' | 'lacquer' | 'finish' | 'orbit'
export type Observation = 'Independente' | 'Com ajuda' | 'Não realizada' | 'Recusada'
export interface Fragment { angle: number; slot: number | null }
export interface Joint { lacquer: number; gold: number }
export interface Creation {
  vessel: Vessel
  count: number
  fragments: Fragment[]
  joints: Joint[]
  observations: { opportunity: number; result: Observation }[]
}
export interface Atelier {
  version: 1
  seed: number
  mode: Mode
  phase: 'entry' | 'work' | 'paused' | 'review' | 'exit'
  settings: { tolerance: number; discrete: boolean; reduced: boolean; quality: Quality; opportunities: number; instruction: 'visual' | 'verbal' | 'both' }
  sceneState: Creation
  history: Creation[]
  future: Creation[]
}
export function creation(vessel: Vessel, count = presets[vessel].count as number, alternate = false): Creation {
  count = Number.isFinite(count) ? Math.max(3, Math.min(7, Math.round(count))) : presets[vessel].count
  return {
    vessel, count,
    fragments: Array.from({length:count}, (_, id) => ({angle: startingAngle(id,alternate), slot: id < 2 ? id : null})),
    joints: Array.from({length:count}, () => ({lacquer:0, gold:0})),
    observations: [],
  }
}
export const startingAngle = (id:number, alternate:boolean) => alternate || id < 2 ? 0 : (id % 2 ? -1 : 1) * (12 + id * 4)
export function initial(reduced = false): Atelier {
  return {version:1, seed:405, mode:'free', phase:'entry', settings:{tolerance:16, discrete:false, reduced, quality:'auto', opportunities:3, instruction:'both'}, sceneState:creation('bowl'), history:[], future:[]}
}
