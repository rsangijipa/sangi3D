import { MISSIONS, PRODUCTS, NPC_DIALOGS } from './content.ts'
import type { GameState, WaypointId, CarrierType, Observation } from './state.ts'

export type Action =
  | { type: 'start'; missionId?: string; carrier?: CarrierType }
  | { type: 'move-waypoint'; waypoint: WaypointId }
  | { type: 'add-to-cart'; itemId: string }
  | { type: 'remove-from-cart'; itemId: string }
  | { type: 'ask-help'; topic: string }
  | { type: 'dismiss-help' }
  | { type: 'toggle-low-stim' }
  | { type: 'set-carrier'; carrier: CarrierType }
  | { type: 'checkout' }
  | { type: 'confirm-purchase' }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'reset' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'exit' }
  | { type: 'observe'; opportunity: number; actionName: string; result: Observation }

export interface ValidationResult {
  missionTitle: string
  totalRequired: number
  foundCount: number
  isComplete: boolean
  missingItems: string[]
  hasValidSubstitutes: boolean
}

export function validateCheckout(state: GameState): ValidationResult {
  const mission = MISSIONS[state.currentMissionId] || MISSIONS.market_snack
  const required = mission.requiredItemIds
  if (required.length === 0) {
    return {
      missionTitle: mission.title,
      totalRequired: state.inventory.length,
      foundCount: state.inventory.length,
      isComplete: true,
      missingItems: [],
      hasValidSubstitutes: false
    }
  }

  let foundCount = 0
  const missingItems: string[] = []
  let hasValidSubstitutes = false

  for (const reqId of required) {
    const hasDirect = state.inventory.includes(reqId)
    const altId = mission.alternatives?.[reqId]
    const hasAlt = altId && state.inventory.includes(altId)

    if (hasDirect) {
      foundCount++
    } else if (hasAlt) {
      foundCount++
      hasValidSubstitutes = true
    } else {
      missingItems.push(reqId)
    }
  }

  return {
    missionTitle: mission.title,
    totalRequired: required.length,
    foundCount,
    isComplete: foundCount >= required.length,
    missingItems,
    hasValidSubstitutes
  }
}

export function dispatch(state: GameState, action: Action): string {
  const isRecordable =
    action.type === 'add-to-cart' ||
    action.type === 'remove-from-cart' ||
    action.type === 'move-waypoint' ||
    action.type === 'reset'

  if (isRecordable) {
    state.history.push({
      currentWaypoint: state.currentWaypoint,
      carrier: state.carrier,
      inventory: [...state.inventory],
      helpCount: state.helpCount,
      activeHelpMessage: state.activeHelpMessage,
      activeHighlightId: state.activeHighlightId,
      lowStimulation: state.lowStimulation
    })
    if (state.history.length > 25) state.history.shift()
    state.future = []
  }

  switch (action.type) {
    case 'start': {
      state.phase = 'work'
      if (action.missionId) state.currentMissionId = action.missionId
      if (action.carrier) state.carrier = action.carrier
      state.inventory = []
      state.currentWaypoint = 'entrance'
      state.helpCount = 0
      state.activeHelpMessage = null
      state.activeHighlightId = null
      const mission = MISSIONS[state.currentMissionId] || MISSIONS.market_snack
      return `Missão "${mission.title}" iniciada. Siga pelo corredor do mercadinho.`
    }
    case 'move-waypoint': {
      state.currentWaypoint = action.waypoint
      state.activeHelpMessage = null
      state.activeHighlightId = null
      return `Você agora está em: ${action.waypoint}.`
    }
    case 'add-to-cart': {
      const prod = PRODUCTS[action.itemId]
      if (!prod) return 'Produto não encontrado.'
      if (state.inventory.includes(action.itemId)) {
        return `${prod.name} já está no seu ${state.carrier === 'cart' ? 'carrinho' : 'cesta'}.`
      }
      state.inventory.push(action.itemId)
      state.activeHighlightId = null
      const check = validateCheckout(state)
      return `${prod.name} colocado no ${state.carrier === 'cart' ? 'carrinho' : 'cesta'}. (${check.foundCount}/${check.totalRequired})`
    }
    case 'remove-from-cart': {
      const idx = state.inventory.indexOf(action.itemId)
      if (idx !== -1) {
        state.inventory.splice(idx, 1)
        const prod = PRODUCTS[action.itemId]
        return `${prod ? prod.name : 'Item'} retirado.`
      }
      return 'Item não estava no carrinho.'
    }
    case 'ask-help': {
      state.helpCount++
      const reply = NPC_DIALOGS[action.topic] || NPC_DIALOGS.not_found
      state.activeHelpMessage = reply

      // If topic is an item, highlight it in the scene
      if (PRODUCTS[action.topic]) {
        state.activeHighlightId = action.topic
      } else {
        state.activeHighlightId = null
      }
      return `Atendente: "${reply}"`
    }
    case 'dismiss-help': {
      state.activeHelpMessage = null
      state.activeHighlightId = null
      return 'Ajuda concluída.'
    }
    case 'toggle-low-stim': {
      state.lowStimulation = !state.lowStimulation
      return state.lowStimulation ? 'Modo de baixa estimulação ativado.' : 'Modo normal ativado.'
    }
    case 'set-carrier': {
      state.carrier = action.carrier
      return `Usando agora: ${action.carrier === 'cart' ? 'carrinho de compras' : 'cesta de mão'}.`
    }
    case 'checkout': {
      state.phase = 'checkout'
      state.currentWaypoint = 'checkout'
      return 'No balcão do caixa para conferência da compra.'
    }
    case 'confirm-purchase': {
      state.phase = 'review'
      return 'Compra finalizada com sucesso no caixa!'
    }
    case 'undo': {
      if (!state.history.length) return 'Nada a desfazer.'
      state.future.push({
        currentWaypoint: state.currentWaypoint,
        carrier: state.carrier,
        inventory: [...state.inventory],
        helpCount: state.helpCount,
        activeHelpMessage: state.activeHelpMessage,
        activeHighlightId: state.activeHighlightId,
        lowStimulation: state.lowStimulation
      })
      const prev = state.history.pop()!
      state.currentWaypoint = prev.currentWaypoint
      state.carrier = prev.carrier
      state.inventory = prev.inventory
      state.helpCount = prev.helpCount
      state.activeHelpMessage = prev.activeHelpMessage
      state.activeHighlightId = prev.activeHighlightId
      state.lowStimulation = prev.lowStimulation
      return 'Última ação desfeita.'
    }
    case 'redo': {
      if (!state.future.length) return 'Nada a refazer.'
      state.history.push({
        currentWaypoint: state.currentWaypoint,
        carrier: state.carrier,
        inventory: [...state.inventory],
        helpCount: state.helpCount,
        activeHelpMessage: state.activeHelpMessage,
        activeHighlightId: state.activeHighlightId,
        lowStimulation: state.lowStimulation
      })
      const next = state.future.pop()!
      state.currentWaypoint = next.currentWaypoint
      state.carrier = next.carrier
      state.inventory = next.inventory
      state.helpCount = next.helpCount
      state.activeHelpMessage = next.activeHelpMessage
      state.activeHighlightId = next.activeHighlightId
      state.lowStimulation = next.lowStimulation
      return 'Ação refeita.'
    }
    case 'reset': {
      state.inventory = []
      state.helpCount = 0
      state.activeHelpMessage = null
      state.activeHighlightId = null
      state.currentWaypoint = 'entrance'
      return 'Lista e carrinho reiniciados.'
    }
    case 'pause': {
      state.phase = 'paused'
      return 'Sessão pausada.'
    }
    case 'resume': {
      state.phase = 'work'
      return 'Sessão retomada.'
    }
    case 'exit': {
      state.phase = 'entry'
      return 'Retorno à entrada principal.'
    }
    case 'observe': {
      state.observations.push({
        opportunity: action.opportunity,
        action: action.actionName,
        result: action.result
      })
      return `Oportunidade ${action.opportunity} registrada: ${action.result}.`
    }
  }
}
