import { WEIGHTS, SUB_BEAMS } from './content.ts'
import type { GameState, MobileSceneState, Mode, Observation, WeightType, SubBeamType } from './state.ts'

export const MAIN_BEAM_MASS = 2.0 // kg
export const HOLE_SLOTS = [-40, -35, -30, -25, -20, -15, -10, -5, 5, 10, 15, 20, 25, 30, 35, 40]

export type Action =
  | { type: 'start'; mode?: Mode; preset?: string }
  | { type: 'resume' }
  | { type: 'pause' }
  | { type: 'review' }
  | { type: 'exit' }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'reset' }
  | { type: 'move-fulcrum'; position: number }
  | { type: 'add-weight'; weightType: WeightType; slot: number; subBeamId?: string; subSlot?: 'left' | 'right' }
  | { type: 'remove-weight'; weightId: string }
  | { type: 'move-weight'; weightId: string; newSlot: number }
  | { type: 'add-subbeam'; beamType: SubBeamType; slot: number }
  | { type: 'remove-subbeam'; subBeamId: string }
  | { type: 'toggle-ruler' }
  | { type: 'toggle-dynamometer' }
  | { type: 'observe'; opportunity: number; result: Observation }

export interface PhysicsMetrics {
  totalMass: number // kg
  dynamometerTension: number // Newtons
  netTorque: number // N*m
  targetAngle: number // degrees (-35 to +35)
  isEquilibrated: boolean // abs(angle) <= tolerance
}

/**
 * Calculates torque, total load, and static equilibrium angle of the kinetic mobile.
 */
export function calculatePhysics(sceneState: MobileSceneState, tolerance = 0.8): PhysicsMetrics {
  const g = 9.81
  const xf = sceneState.fulcrumPosition / 100 // convert cm to meters

  // Torque of main beam due to fulcrum offset
  // Center of mass of main beam is at 0
  let netTorque = MAIN_BEAM_MASS * g * (0 - xf)
  let totalMass = MAIN_BEAM_MASS

  // Compute load and torque for direct weights
  for (const w of sceneState.weights) {
    if (!w.subBeamId) {
      const mass = WEIGHTS[w.type].mass
      const pos = w.slot / 100 // meters
      netTorque += mass * g * (pos - xf)
      totalMass += mass
    }
  }

  // Compute load and torque for sub-beams
  for (const sb of sceneState.subBeams) {
    const sbDef = SUB_BEAMS[sb.type]
    let sbMass = sbDef.mass
    let sbTorqueInternal = 0

    const subWeights = sceneState.weights.filter(w => w.subBeamId === sb.id)
    for (const sw of subWeights) {
      const wMass = WEIGHTS[sw.type].mass
      sbMass += wMass
      const offset = (sw.subSlot === 'left' ? -sbDef.halfSpan : sbDef.halfSpan) / 100 // meters
      sbTorqueInternal += wMass * g * offset
    }

    // Sub-beam internal angle
    const internalAngle = Math.max(-25, Math.min(25, (sbTorqueInternal / (sbMass * g * 0.08 + 0.1)) * (180 / Math.PI)))
    sb.angle = Number(internalAngle.toFixed(1))

    // Total sub-beam acts at attachment slot on main beam
    const sbPos = sb.slot / 100
    netTorque += sbMass * g * (sbPos - xf)
    totalMass += sbMass
  }

  // Total force on dynamometer: Total mass * g
  // In our visual scale, 0 to 20 N (or scaled for pedagogical clarity)
  const dynamometerTension = Number((totalMass * g * 0.1).toFixed(1)) // scaled so 20kg ~ 19.6N

  // Target tilt angle of main beam
  // Restoring torque from suspension geometry h ~ 0.06m plus pivot friction/damping
  const restoringFactor = totalMass * g * 0.06 + 0.8
  const rawAngle = (netTorque / restoringFactor) * (180 / Math.PI)
  const targetAngle = Number(Math.max(-35, Math.min(35, rawAngle)).toFixed(1))
  const isEquilibrated = Math.abs(targetAngle) <= tolerance

  return {
    totalMass: Number(totalMass.toFixed(2)),
    dynamometerTension,
    netTorque: Number(netTorque.toFixed(2)),
    targetAngle,
    isEquilibrated
  }
}

/**
 * Step dynamic oscillation physics towards target angle
 */
export function stepPhysics(sceneState: MobileSceneState, dt: number, reducedMotion = false): void {
  const metrics = calculatePhysics(sceneState)
  sceneState.targetAngle = metrics.targetAngle

  if (reducedMotion) {
    sceneState.mainAngle = sceneState.targetAngle
    sceneState.angularVelocity = 0
    return
  }

  // Second-order damped oscillator
  // d²θ/dt² + 2*zeta*omega*(dθ/dt) + omega²*(θ - target) = 0
  const omega = 3.5 // natural frequency
  const zeta = 0.45 // damping ratio
  const error = sceneState.mainAngle - sceneState.targetAngle

  const angularAcc = -2 * zeta * omega * sceneState.angularVelocity - omega * omega * (error * (Math.PI / 180))
  sceneState.angularVelocity += angularAcc * dt
  sceneState.mainAngle += sceneState.angularVelocity * (180 / Math.PI) * dt

  // Physical angular stop limits (-35° to +35°)
  if (sceneState.mainAngle > 35) {
    sceneState.mainAngle = 35
    sceneState.angularVelocity = Math.min(0, sceneState.angularVelocity)
  } else if (sceneState.mainAngle < -35) {
    sceneState.mainAngle = -35
    sceneState.angularVelocity = Math.max(0, sceneState.angularVelocity)
  }

  if (Math.abs(sceneState.mainAngle - sceneState.targetAngle) < 0.02 && Math.abs(sceneState.angularVelocity) < 0.01) {
    sceneState.mainAngle = sceneState.targetAngle
    sceneState.angularVelocity = 0
  }
}

/**
 * Mutates state based on action, preserving history for undo/redo
 */
export function dispatch(state: GameState, action: Action): string {
  const isRecordable =
    action.type === 'move-fulcrum' ||
    action.type === 'add-weight' ||
    action.type === 'remove-weight' ||
    action.type === 'move-weight' ||
    action.type === 'add-subbeam' ||
    action.type === 'remove-subbeam' ||
    action.type === 'reset'

  if (isRecordable) {
    state.history.push(JSON.parse(JSON.stringify(state.sceneState)))
    if (state.history.length > 30) state.history.shift()
    state.future = []
  }

  switch (action.type) {
    case 'start': {
      state.phase = 'work'
      if (action.mode) state.mode = action.mode
      const metrics = calculatePhysics(state.sceneState, state.settings.tolerance)
      state.sceneState.targetAngle = metrics.targetAngle
      state.sceneState.mainAngle = metrics.targetAngle
      return `Modo ${state.mode} iniciado. Inclinação: ${metrics.targetAngle}°`
    }
    case 'pause': {
      state.phase = 'paused'
      return 'Galeria em pausa.'
    }
    case 'resume': {
      state.phase = 'work'
      return 'Interação retomada.'
    }
    case 'review': {
      state.phase = 'review'
      return 'Revisão da escultura.'
    }
    case 'exit': {
      state.phase = 'entry'
      return 'Retorno à entrada da galeria.'
    }
    case 'undo': {
      if (!state.history.length) return 'Nada a desfazer.'
      state.future.push(JSON.parse(JSON.stringify(state.sceneState)))
      state.sceneState = state.history.pop()!
      const metrics = calculatePhysics(state.sceneState, state.settings.tolerance)
      return `Ação desfeita. Inclinação: ${metrics.targetAngle}°`
    }
    case 'redo': {
      if (!state.future.length) return 'Nada a refazer.'
      state.history.push(JSON.parse(JSON.stringify(state.sceneState)))
      state.sceneState = state.future.pop()!
      const metrics = calculatePhysics(state.sceneState, state.settings.tolerance)
      return `Ação refeita. Inclinação: ${metrics.targetAngle}°`
    }
    case 'reset': {
      state.sceneState.fulcrumPosition = 0
      state.sceneState.weights = []
      state.sceneState.subBeams = []
      const metrics = calculatePhysics(state.sceneState, state.settings.tolerance)
      state.sceneState.targetAngle = metrics.targetAngle
      state.sceneState.mainAngle = metrics.targetAngle
      return 'Móbile reiniciado.'
    }
    case 'move-fulcrum': {
      const clamped = Math.max(-30, Math.min(30, Math.round(action.position / 5) * 5))
      state.sceneState.fulcrumPosition = clamped
      const metrics = calculatePhysics(state.sceneState, state.settings.tolerance)
      state.sceneState.targetAngle = metrics.targetAngle
      return `Fulcro ajustado em ${clamped > 0 ? '+' : ''}${clamped} cm. Inclinação: ${metrics.targetAngle}°`
    }
    case 'add-weight': {
      const newWeight = {
        id: 'w_' + Math.random().toString(36).slice(2, 8),
        type: action.weightType,
        slot: action.slot,
        subBeamId: action.subBeamId,
        subSlot: action.subSlot
      }
      state.sceneState.weights.push(newWeight)
      const metrics = calculatePhysics(state.sceneState, state.settings.tolerance)
      state.sceneState.targetAngle = metrics.targetAngle
      return `${WEIGHTS[action.weightType].name} adicionado em ${action.slot} cm. Inclinação: ${metrics.targetAngle}°`
    }
    case 'remove-weight': {
      const idx = state.sceneState.weights.findIndex(w => w.id === action.weightId)
      if (idx !== -1) {
        const removed = state.sceneState.weights.splice(idx, 1)[0]
        const metrics = calculatePhysics(state.sceneState, state.settings.tolerance)
        state.sceneState.targetAngle = metrics.targetAngle
        return `${WEIGHTS[removed.type].name} removido. Inclinação: ${metrics.targetAngle}°`
      }
      return 'Peso não encontrado.'
    }
    case 'move-weight': {
      const w = state.sceneState.weights.find(item => item.id === action.weightId)
      if (w) {
        w.slot = action.newSlot
        const metrics = calculatePhysics(state.sceneState, state.settings.tolerance)
        state.sceneState.targetAngle = metrics.targetAngle
        return `${WEIGHTS[w.type].name} deslocado para ${action.newSlot} cm. Inclinação: ${metrics.targetAngle}°`
      }
      return 'Peso não encontrado.'
    }
    case 'add-subbeam': {
      const newSubBeam = {
        id: 'sb_' + Math.random().toString(36).slice(2, 8),
        type: action.beamType,
        slot: action.slot,
        angle: 0
      }
      state.sceneState.subBeams.push(newSubBeam)
      const metrics = calculatePhysics(state.sceneState, state.settings.tolerance)
      state.sceneState.targetAngle = metrics.targetAngle
      return `${SUB_BEAMS[action.beamType].name} conectado em ${action.slot} cm.`
    }
    case 'remove-subbeam': {
      const idx = state.sceneState.subBeams.findIndex(sb => sb.id === action.subBeamId)
      if (idx !== -1) {
        state.sceneState.subBeams.splice(idx, 1)
        // Also remove weights attached to it
        state.sceneState.weights = state.sceneState.weights.filter(w => w.subBeamId !== action.subBeamId)
        const metrics = calculatePhysics(state.sceneState, state.settings.tolerance)
        state.sceneState.targetAngle = metrics.targetAngle
        return 'Braço secundário removido.'
      }
      return 'Braço secundário não encontrado.'
    }
    case 'toggle-ruler': {
      state.sceneState.rulerVisible = !state.sceneState.rulerVisible
      return state.sceneState.rulerVisible ? 'Régua visível.' : 'Régua oculta.'
    }
    case 'toggle-dynamometer': {
      state.sceneState.dynamometerVisible = !state.sceneState.dynamometerVisible
      return state.sceneState.dynamometerVisible ? 'Dinamômetro visível.' : 'Dinamômetro oculto.'
    }
    case 'observe': {
      const existing = state.sceneState.observations.find(o => o.opportunity === action.opportunity)
      if (existing) existing.result = action.result
      else state.sceneState.observations.push({ opportunity: action.opportunity, result: action.result })
      return `Oportunidade ${action.opportunity} registrada: ${action.result}.`
    }
  }
}
