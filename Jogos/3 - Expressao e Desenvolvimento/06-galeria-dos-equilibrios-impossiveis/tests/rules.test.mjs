import test from 'node:test'
import assert from 'node:assert/strict'
import { initial } from '../src/game/state.ts'
import { calculatePhysics, dispatch, stepPhysics } from '../src/game/rules.ts'
import { PRESETS } from '../src/game/content.ts'

test('Pesos iguais a distâncias iguais equilibram perfeitamente com ângulo 0,0°', () => {
  const state = initial()
  dispatch(state, { type: 'reset' })

  // Place equal cylinder weights (4.0 kg each) at -25 cm and +25 cm with fulcrum at 0
  dispatch(state, { type: 'add-weight', weightType: 'cylinder', slot: -25 })
  dispatch(state, { type: 'add-weight', weightType: 'cylinder', slot: 25 })

  const metrics = calculatePhysics(state.sceneState)
  assert.equal(metrics.netTorque, 0)
  assert.equal(metrics.targetAngle, 0)
  assert.equal(metrics.isEquilibrated, true)
})

test('Mudanças de posição e deslocamento do fulcro alteram a inclinação previsivelmente', () => {
  const state = initial()
  dispatch(state, { type: 'reset' })

  // Place 4.0 kg at -20 cm and 2.0 kg at +20 cm -> left side heavier
  dispatch(state, { type: 'add-weight', weightType: 'cylinder', slot: -20 })
  dispatch(state, { type: 'add-weight', weightType: 'fluted', slot: 20 })

  let metrics = calculatePhysics(state.sceneState)
  assert.ok(metrics.targetAngle < 0, 'Braço esquerdo deve inclinar para baixo (ângulo negativo)')

  // Move fulcrum to -10 cm (closer to the heavier weight, giving the right side longer lever arm)
  dispatch(state, { type: 'move-fulcrum', position: -10 })
  metrics = calculatePhysics(state.sceneState)
  // Torque with fulcrum at -10cm:
  // Main beam (2kg): center at 0 -> arm +10cm -> +2*9.81*0.1 = +1.962 N*m
  // Left weight (4kg) at -20cm -> arm -10cm -> -4*9.81*0.1 = -3.924 N*m
  // Right weight (2kg) at +20cm -> arm +30cm -> +2*9.81*0.3 = +5.886 N*m
  // Net torque = +3.924 N*m -> tilts to right side (positive angle)
  assert.ok(metrics.targetAngle > 0, 'Fulcro deslocado para esquerda transfere alavanca para direita')
})

test('Níveis encadeados de móbile (sub-braços) agregam massas e torques sem explosão numérica', () => {
  const state = initial()
  PRESETS.calder.setup(state)

  const metrics = calculatePhysics(state.sceneState)
  assert.ok(Number.isFinite(metrics.totalMass))
  assert.ok(Number.isFinite(metrics.netTorque))
  assert.ok(Number.isFinite(metrics.targetAngle))
  assert.ok(metrics.totalMass > 5.0, 'Massa total inclui barra principal, sub-barras e pesos')

  // Step physics simulation over multiple iterations
  for (let i = 0; i < 60; i++) {
    stepPhysics(state.sceneState, 0.016, false)
    assert.ok(!Number.isNaN(state.sceneState.mainAngle), 'Ângulo não deve ser NaN')
    assert.ok(Math.abs(state.sceneState.mainAngle) <= 35, 'Ângulo deve permanecer dentro dos limites físicos')
  }
})

test('Desfazer, refazer e reinício restauram o estado físico exato', () => {
  const state = initial()
  dispatch(state, { type: 'reset' })
  assert.equal(state.sceneState.weights.length, 0)

  dispatch(state, { type: 'add-weight', weightType: 'terracotta', slot: -30 })
  assert.equal(state.sceneState.weights.length, 1)

  // Undo
  dispatch(state, { type: 'undo' })
  assert.equal(state.sceneState.weights.length, 0)

  // Redo
  dispatch(state, { type: 'redo' })
  assert.equal(state.sceneState.weights.length, 1)
  assert.equal(state.sceneState.weights[0].type, 'terracotta')

  // Full reset
  dispatch(state, { type: 'reset' })
  assert.equal(state.sceneState.weights.length, 0)
  assert.equal(state.sceneState.subBeams.length, 0)
  assert.equal(state.sceneState.fulcrumPosition, 0)
})

test('Modo acompanhado registra observações objetivas por oportunidade sem escore', () => {
  const state = initial()
  dispatch(state, { type: 'observe', opportunity: 1, result: 'Independente' })
  dispatch(state, { type: 'observe', opportunity: 2, result: 'Com ajuda' })

  assert.equal(state.sceneState.observations.length, 2)
  assert.deepEqual(state.sceneState.observations[0], { opportunity: 1, result: 'Independente' })
  assert.deepEqual(state.sceneState.observations[1], { opportunity: 2, result: 'Com ajuda' })

  // Updating existing opportunity
  dispatch(state, { type: 'observe', opportunity: 2, result: 'Recusada' })
  assert.equal(state.sceneState.observations.length, 2)
  assert.equal(state.sceneState.observations[1].result, 'Recusada')
})
