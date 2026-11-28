import { SCENARIOS } from './content.ts'
import type { GameState, Scenario, ObservationType, ChoiceEffect } from './state.ts'

export type Action =
  | { type: 'start-scenario'; scenarioId: string }
  | { type: 'choose-option'; choiceId: string }
  | { type: 'request-time' }
  | { type: 'resume-from-time' }
  | { type: 'exit-scenario' }
  | { type: 'custom-text'; text: string }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'reset' }
  | { type: 'observe'; opportunity: number; result: ObservationType; notes: string }

export interface ValidationReport {
  valid: boolean
  errors: string[]
}

/**
 * Validates that all scenario nodes and choice links are declarative, valid,
 * without broken references or dangling nextIds.
 */
export function validateScenario(scenario: Scenario): ValidationReport {
  const errors: string[] = []

  if (!scenario.initialNodeId || !scenario.nodes[scenario.initialNodeId]) {
    errors.push(`Scenario "${scenario.id}" has invalid or missing initialNodeId: "${scenario.initialNodeId}"`)
  }

  for (const [nodeId, node] of Object.entries(scenario.nodes)) {
    if (node.id !== nodeId) {
      errors.push(`Node key "${nodeId}" does not match internal node.id "${node.id}"`)
    }
    if (!node.text || node.text.trim().length === 0) {
      errors.push(`Node "${nodeId}" has empty text`)
    }

    if (!node.isTerminal && (!node.choices || node.choices.length === 0)) {
      errors.push(`Non-terminal node "${nodeId}" has no choices`)
    }

    if (node.choices) {
      for (const choice of node.choices) {
        if (choice.nextId !== null) {
          if (!scenario.nodes[choice.nextId]) {
            errors.push(`Choice "${choice.id}" in node "${nodeId}" references non-existent node "${choice.nextId}"`)
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validates all 15 predefined scenarios
 */
export function validateAllScenarios(): Record<string, ValidationReport> {
  const reports: Record<string, ValidationReport> = {}
  for (const [id, scenario] of Object.entries(SCENARIOS)) {
    reports[id] = validateScenario(scenario)
  }
  return reports
}

/**
 * State machine dispatcher for dialogues and actions
 */
export function dispatch(state: GameState, action: Action): { message: string; effect?: ChoiceEffect } {
  const currentScenario = SCENARIOS[state.currentScenarioId] || SCENARIOS.padaria_pao

  switch (action.type) {
    case 'start-scenario': {
      const scenario = SCENARIOS[action.scenarioId]
      if (!scenario) return { message: 'Cenário não encontrado.' }

      state.currentScenarioId = scenario.id
      state.currentLocationId = scenario.locationId
      state.currentNodeId = scenario.initialNodeId
      const initialNode = scenario.nodes[scenario.initialNodeId]
      state.stage = initialNode?.stage || 1
      state.totalStages = initialNode?.totalStages || 3
      state.waitingTime = false
      state.isFinished = false
      state.customInputDraft = ''
      state.history = []
      state.undoStack = []
      state.redoStack = []
      state.phase = 'dialogue'

      return { message: `Iniciado cenário: "${scenario.title}" em ${scenario.locationId}.` }
    }

    case 'choose-option': {
      const node = currentScenario.nodes[state.currentNodeId]
      if (!node) return { message: 'Nó atual inválido.' }

      const choice = node.choices.find(c => c.id === action.choiceId)
      if (!choice) return { message: 'Opção inválida.' }

      // Save to undo stack
      state.undoStack.push({
        currentNodeId: state.currentNodeId,
        stage: state.stage,
        waitingTime: state.waitingTime,
        isFinished: state.isFinished,
        history: [...state.history]
      })
      if (state.undoStack.length > 20) state.undoStack.shift()
      state.redoStack = []

      // Record step in history
      state.history.push({
        nodeId: state.currentNodeId,
        choiceId: choice.id,
        choiceLabel: choice.label,
        effect: choice.effect
      })

      if (choice.effect === 'wait') {
        state.waitingTime = true
      } else {
        state.waitingTime = false
      }

      if (choice.nextId === null) {
        state.isFinished = true
        state.phase = 'review'
        return { message: 'Diálogo concluído com respeito ao seu tempo.', effect: choice.effect }
      }

      const nextNode = currentScenario.nodes[choice.nextId]
      if (nextNode) {
        state.currentNodeId = nextNode.id
        state.stage = nextNode.stage
        state.totalStages = nextNode.totalStages
        if (nextNode.isTerminal) {
          state.isFinished = true
        }
        return { message: `Avançou para estágio ${state.stage}.`, effect: choice.effect }
      }

      return { message: 'Transição efetuada.' }
    }

    case 'request-time': {
      state.waitingTime = true
      return { message: 'Pausa solicitada. Respire com calma.', effect: 'wait' }
    }

    case 'resume-from-time': {
      state.waitingTime = false
      return { message: 'Retomando a conversa no seu ritmo.', effect: 'normal' }
    }

    case 'exit-scenario': {
      state.isFinished = true
      state.waitingTime = false
      state.phase = 'review'
      return { message: 'Saída respeitada e sem cobrança.', effect: 'exit' }
    }

    case 'custom-text': {
      if (!action.text.trim()) return { message: 'Texto vazio.' }

      state.undoStack.push({
        currentNodeId: state.currentNodeId,
        stage: state.stage,
        waitingTime: state.waitingTime,
        isFinished: state.isFinished,
        history: [...state.history]
      })

      state.customInputDraft = action.text
      state.history.push({
        nodeId: state.currentNodeId,
        choiceId: 'custom_input',
        choiceLabel: action.text,
        effect: 'custom'
      })

      return { message: 'Sua expressão foi acolhida com respeito pelo interlocutor.', effect: 'custom' }
    }

    case 'undo': {
      const previous = state.undoStack.pop()
      if (!previous) return { message: 'Nada para desfazer.' }

      state.redoStack.push({
        currentNodeId: state.currentNodeId,
        stage: state.stage,
        waitingTime: state.waitingTime,
        isFinished: state.isFinished,
        history: [...state.history]
      })

      state.currentNodeId = previous.currentNodeId
      state.stage = previous.stage
      state.waitingTime = previous.waitingTime
      state.isFinished = previous.isFinished
      state.history = [...previous.history]
      state.phase = previous.isFinished ? 'review' : 'dialogue'

      return { message: 'Última escolha desfeita.' }
    }

    case 'redo': {
      const next = state.redoStack.pop()
      if (!next) return { message: 'Nada para refazer.' }

      state.undoStack.push({
        currentNodeId: state.currentNodeId,
        stage: state.stage,
        waitingTime: state.waitingTime,
        isFinished: state.isFinished,
        history: [...state.history]
      })

      state.currentNodeId = next.currentNodeId
      state.stage = next.stage
      state.waitingTime = next.waitingTime
      state.isFinished = next.isFinished
      state.history = [...next.history]
      state.phase = next.isFinished ? 'review' : 'dialogue'

      return { message: 'Escolha refeita.' }
    }

    case 'reset': {
      const scenario = SCENARIOS[state.currentScenarioId] || SCENARIOS.padaria_pao
      state.currentNodeId = scenario.initialNodeId
      const node = scenario.nodes[scenario.initialNodeId]
      state.stage = node?.stage || 1
      state.waitingTime = false
      state.isFinished = false
      state.history = []
      state.undoStack = []
      state.redoStack = []
      state.phase = 'dialogue'

      return { message: 'Cenário reiniciado do ponto de partida.' }
    }

    case 'observe': {
      state.observations.push({
        opportunity: action.opportunity,
        scenarioId: state.currentScenarioId,
        result: action.result,
        notes: action.notes,
        timestamp: Date.now()
      })
      return { message: 'Observação registrada com sucesso.' }
    }

    default:
      return { message: 'Ação não reconhecida.' }
  }
}
