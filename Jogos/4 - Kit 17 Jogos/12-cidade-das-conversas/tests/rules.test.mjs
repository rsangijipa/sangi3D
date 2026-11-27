import test from 'node:test'
import assert from 'node:assert/strict'
import { initial } from '../src/game/state.ts'
import { dispatch, validateAllScenarios } from '../src/game/rules.ts'
import { SCENARIOS } from '../src/game/content.ts'

test('Initial state generates correct defaults', () => {
  const state = initial(false)
  assert.equal(state.version, 1)
  assert.equal(state.phase, 'dialogue')
  assert.equal(state.currentLocationId, 'padaria')
  assert.equal(state.currentScenarioId, 'padaria_pao')
  assert.equal(state.currentNodeId, 'node_1')
  assert.equal(state.stage, 1)
  assert.equal(state.waitingTime, false)
  assert.equal(state.isFinished, false)
})

test('All 15 scenarios pass declarative tree validation', () => {
  const reports = validateAllScenarios()
  const scenarioKeys = Object.keys(reports)
  assert.equal(scenarioKeys.length, 15, 'Must have exactly 15 handcrafted scenarios')

  for (const [id, report] of Object.entries(reports)) {
    assert.equal(report.valid, true, `Scenario ${id} should be valid: ${report.errors.join('; ')}`)
    assert.equal(report.errors.length, 0)
  }
})

test('Advancing dialogue through choices updates stage and records history', () => {
  const state = initial(false)
  assert.equal(state.stage, 1)

  // Choose "Quero perguntar"
  const res1 = dispatch(state, { type: 'choose-option', choiceId: 'c_ask' })
  assert.equal(state.currentNodeId, 'node_ask')
  assert.equal(state.stage, 2)
  assert.equal(state.history.length, 1)
  assert.equal(state.history[0].choiceId, 'c_ask')
  assert.match(res1.message, /Avançou para estágio/)

  // Choose "Tem pão francês quentinho?"
  const res2 = dispatch(state, { type: 'choose-option', choiceId: 'c_french' })
  assert.equal(state.currentNodeId, 'node_pao_sim')
  assert.equal(state.stage, 3)
  assert.equal(state.history.length, 2)
})

test('Requesting time pauses dialogue respectfully and can resume', () => {
  const state = initial(false)

  // Choose "Preciso de um tempo"
  dispatch(state, { type: 'choose-option', choiceId: 'c_wait' })
  assert.equal(state.waitingTime, true)
  assert.equal(state.currentNodeId, 'node_wait')

  // Resume when ready
  dispatch(state, { type: 'choose-option', choiceId: 'c_resume' })
  assert.equal(state.waitingTime, false)
  assert.equal(state.currentNodeId, 'node_ask')
})

test('Preferring to leave is respected and leads to terminal node without penalty', () => {
  const state = initial(false)

  // Choose "Prefiro sair"
  dispatch(state, { type: 'choose-option', choiceId: 'c_exit' })
  assert.equal(state.currentNodeId, 'node_exit')

  // Final farewell
  dispatch(state, { type: 'choose-option', choiceId: 'c_bye' })
  assert.equal(state.isFinished, true)
  assert.equal(state.phase, 'review')
})

test('Undo and Redo stacks restore dialogue state', () => {
  const state = initial(false)
  dispatch(state, { type: 'choose-option', choiceId: 'c_ask' })
  assert.equal(state.currentNodeId, 'node_ask')
  assert.equal(state.history.length, 1)

  // Undo
  dispatch(state, { type: 'undo' })
  assert.equal(state.currentNodeId, 'node_1')
  assert.equal(state.history.length, 0)

  // Redo
  dispatch(state, { type: 'redo' })
  assert.equal(state.currentNodeId, 'node_ask')
  assert.equal(state.history.length, 1)
})

test('Reset restarts the current scenario to stage 1', () => {
  const state = initial(false)
  dispatch(state, { type: 'choose-option', choiceId: 'c_ask' })
  dispatch(state, { type: 'choose-option', choiceId: 'c_french' })
  assert.equal(state.stage, 3)

  dispatch(state, { type: 'reset' })
  assert.equal(state.currentNodeId, 'node_1')
  assert.equal(state.stage, 1)
  assert.equal(state.history.length, 0)
})

test('Observation recording stores accompanied assessment', () => {
  const state = initial(false)
  dispatch(state, {
    type: 'observe',
    opportunity: 1,
    result: 'Independente',
    notes: 'Comunicação clara e tranquila na padaria.'
  })

  assert.equal(state.observations.length, 1)
  assert.equal(state.observations[0].result, 'Independente')
  assert.equal(state.observations[0].notes, 'Comunicação clara e tranquila na padaria.')
})
