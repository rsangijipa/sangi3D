/**
 * Porto das Decisões — Estado Serializável e FSM
 * Arquitetura de Estado Determinística e Reducer Puro
 */

export type GameMode = 'livre' | 'guiado' | 'acompanhado';

export type GameStep = 
  | 'setup'            // Escolha de missão e barco
  | 'routing'          // Traçando a rota e gerenciando carga
  | 'simulating'       // Visualizando simulação preditiva
  | 'sim_ready'        // Simulação concluída com sucesso, pronto para confirmar viagem
  | 'confirmed_voyage' // Viagem real e descarregamento
  | 'review';          // Conclusão e reflexão

export interface CargoItem {
  id: string;
  name: string;
  destinationNodeId: string;
  weight: number;
  icon?: string;
}

export interface BoatConfig {
  id: 'blue' | 'green' | 'red';
  name: string;
  capacity: number;
  speed: number;
  colorHex: string;
  hullColor: string;
  description: string;
  specialty: string;
}

export interface SimulationResult {
  valid: boolean;
  canExecute: boolean;
  totalDistance: number;
  estimatedTimeSec: number;
  unvisitedDestinations: string[];
  capacityExceeded: boolean;
  excessCratesCount: number;
  deliveries: Array<{
    nodeId: string;
    nodeName: string;
    unloadedCargo: CargoItem[];
  }>;
  explanation: string;
  alternativeRoutePossible: boolean;
  alternativeRoutePath?: string[];
}

export interface GameState {
  version: string;
  seed: number;
  mode: GameMode;
  step: GameStep;
  missionId: string;
  selectedBoatId: 'blue' | 'green' | 'red';
  cargoOnboard: CargoItem[];
  availableCargo: CargoItem[];
  deliveredCargo: CargoItem[];
  route: string[]; // Node IDs em sequência
  undoStack: string[][];
  simResult: SimulationResult | null;
  isSimulating: boolean;
  isVoyaging: boolean;
  simProgress: number; // 0.0 a 1.0
  activeWaypointIndex: number;
  feedbackMessage: {
    type: 'info' | 'warning' | 'success';
    text: string;
  } | null;
  metrics: {
    routesTested: number;
    voyagesCompleted: number;
    totalCratesDelivered: number;
    activeDurationSec: number;
    lastRouteAlternativeCompared: boolean;
  };
  audioMuted: boolean;
  quality: 'cinema' | 'equilibrada' | 'leve';
  activeModal: 'cargo' | 'mission' | 'reflection' | 'settings' | null;
  timestamp: number;
}

export type GameAction =
  | { type: 'SET_MODE'; payload: GameMode }
  | { type: 'SET_MISSION'; payload: string }
  | { type: 'SELECT_BOAT'; payload: 'blue' | 'green' | 'red' }
  | { type: 'LOAD_CARGO'; payload: CargoItem }
  | { type: 'UNLOAD_CARGO'; payload: string } // Cargo ID
  | { type: 'ADD_NODE_TO_ROUTE'; payload: string } // Node ID
  | { type: 'UNDO_LAST_NODE' }
  | { type: 'CLEAR_ROUTE' }
  | { type: 'START_SIMULATION'; payload: SimulationResult }
  | { type: 'STEP_SIMULATION_PROGRESS'; payload: number }
  | { type: 'END_SIMULATION' }
  | { type: 'APPLY_ALTERNATIVE_ROUTE'; payload: string[] }
  | { type: 'DELIVER_CARGO_AT_NODE'; payload: { nodeId: string } }
  | { type: 'CONFIRM_VOYAGE' }
  | { type: 'STEP_VOYAGE_PROGRESS'; payload: { progress: number; waypointIndex: number } }
  | { type: 'COMPLETE_VOYAGE'; payload: { delivered: CargoItem[] } }
  | { type: 'RESET_MISSION' }
  | { type: 'SET_MODAL'; payload: 'cargo' | 'mission' | 'reflection' | 'settings' | null }
  | { type: 'SET_FEEDBACK'; payload: { type: 'info' | 'warning' | 'success'; text: string } | null }
  | { type: 'TOGGLE_AUDIO' }
  | { type: 'SET_QUALITY'; payload: 'cinema' | 'equilibrada' | 'leve' }
  | { type: 'TICK_TIME'; payload: number };

export function createInitialState(missionId: string = 'm1', seed: number = 42): GameState {
  return {
    version: '1.0.0',
    seed,
    mode: 'guiado',
    step: 'routing',
    missionId,
    selectedBoatId: 'blue',
    cargoOnboard: [],
    availableCargo: [],
    deliveredCargo: [],
    route: ['node_harbor'], // Começa ancorado no Cais do Porto
    undoStack: [],
    simResult: null,
    isSimulating: false,
    isVoyaging: false,
    simProgress: 0,
    activeWaypointIndex: 0,
    feedbackMessage: null,
    metrics: {
      routesTested: 0,
      voyagesCompleted: 0,
      totalCratesDelivered: 0,
      activeDurationSec: 0,
      lastRouteAlternativeCompared: false
    },
    audioMuted: false,
    quality: 'equilibrada',
    activeModal: null,
    timestamp: Date.now()
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload
      };

    case 'SET_MISSION':
      return {
        ...state,
        missionId: action.payload,
        step: 'routing',
        route: ['node_harbor'],
        undoStack: [],
        simResult: null,
        isSimulating: false,
        isVoyaging: false,
        simProgress: 0,
        activeWaypointIndex: 0,
        cargoOnboard: [],
        deliveredCargo: [],
        activeModal: null,
        feedbackMessage: {
          type: 'info',
          text: 'Nova missão selecionada. Ajuste as caixas no barco e trace a melhor rota pelos cais.'
        }
      };

    case 'SELECT_BOAT':
      return {
        ...state,
        selectedBoatId: action.payload,
        // Limpar simulações anteriores para revalidar com nova capacidade
        simResult: null
      };

    case 'LOAD_CARGO': {
      // Evitar duplicatas de ID
      if (state.cargoOnboard.some(c => c.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        cargoOnboard: [...state.cargoOnboard, action.payload],
        availableCargo: state.availableCargo.filter(c => c.id !== action.payload.id),
        simResult: null // Necessário reavaliar simulação
      };
    }

    case 'UNLOAD_CARGO': {
      const itemToRemove = state.cargoOnboard.find(c => c.id === action.payload);
      if (!itemToRemove) return state;
      return {
        ...state,
        cargoOnboard: state.cargoOnboard.filter(c => c.id !== action.payload),
        availableCargo: [...state.availableCargo, itemToRemove],
        simResult: null
      };
    }

    case 'ADD_NODE_TO_ROUTE': {
      if (state.isSimulating || state.isVoyaging) return state;
      const lastNode = state.route[state.route.length - 1];
      if (lastNode === action.payload) return state; // Não duplicar consecutivo

      return {
        ...state,
        undoStack: [...state.undoStack, [...state.route]],
        route: [...state.route, action.payload],
        simResult: null,
        feedbackMessage: null
      };
    }

    case 'UNDO_LAST_NODE': {
      if (state.isSimulating || state.isVoyaging) return state;
      if (state.route.length <= 1) return state; // Manter nó inicial

      const previousRoute = state.undoStack.length > 0 
        ? state.undoStack[state.undoStack.length - 1]
        : state.route.slice(0, state.route.length - 1);

      return {
        ...state,
        route: previousRoute,
        undoStack: state.undoStack.slice(0, Math.max(0, state.undoStack.length - 1)),
        simResult: null
      };
    }

    case 'CLEAR_ROUTE': {
      if (state.isSimulating || state.isVoyaging) return state;
      return {
        ...state,
        undoStack: [...state.undoStack, [...state.route]],
        route: ['node_harbor'],
        simResult: null
      };
    }

    case 'START_SIMULATION': {
      const canSail = action.payload.canExecute;
      return {
        ...state,
        step: canSail ? 'simulating' : 'routing',
        isSimulating: canSail,
        simProgress: 0,
        activeWaypointIndex: 0,
        simResult: action.payload,
        metrics: {
          ...state.metrics,
          routesTested: state.metrics.routesTested + 1
        },
        feedbackMessage: action.payload.valid
          ? { type: 'success', text: 'Simulando percurso náutico... Observe tempo e entregas previstas.' }
          : { type: 'warning', text: action.payload.explanation }
      };
    }

    case 'STEP_SIMULATION_PROGRESS': {
      return {
        ...state,
        simProgress: Math.min(1, Math.max(0, action.payload))
      };
    }

    case 'END_SIMULATION': {
      return {
        ...state,
        step: state.simResult?.canExecute ? 'sim_ready' : 'routing',
        isSimulating: false,
        simProgress: 1,
        activeWaypointIndex: 0
      };
    }

    case 'APPLY_ALTERNATIVE_ROUTE': {
      if (state.isSimulating || state.isVoyaging) return state;
      return {
        ...state,
        undoStack: [...state.undoStack, [...state.route]],
        route: [...action.payload],
        step: 'routing',
        simResult: null,
        metrics: {
          ...state.metrics,
          lastRouteAlternativeCompared: true
        },
        feedbackMessage: {
          type: 'info',
          text: 'Rota alternativa carregada! Clique em Simular para avaliar novo percurso.'
        }
      };
    }

    case 'DELIVER_CARGO_AT_NODE': {
      const atNode = action.payload.nodeId;
      const toDeliver = state.cargoOnboard.filter(c => c.destinationNodeId === atNode);
      if (toDeliver.length === 0) return state;
      return {
        ...state,
        cargoOnboard: state.cargoOnboard.filter(c => c.destinationNodeId !== atNode),
        deliveredCargo: [...state.deliveredCargo, ...toDeliver],
        metrics: {
          ...state.metrics,
          totalCratesDelivered: state.metrics.totalCratesDelivered + toDeliver.length
        }
      };
    }

    case 'CONFIRM_VOYAGE': {
      if (!state.simResult || !state.simResult.canExecute) return state;
      return {
        ...state,
        step: 'confirmed_voyage',
        isVoyaging: true,
        isSimulating: false,
        simProgress: 0,
        activeWaypointIndex: 0,
        feedbackMessage: {
          type: 'info',
          text: 'Viagem oficial iniciada! O barco está navegando pelos cais planejados.'
        }
      };
    }

    case 'STEP_VOYAGE_PROGRESS': {
      return {
        ...state,
        simProgress: action.payload.progress,
        activeWaypointIndex: action.payload.waypointIndex
      };
    }

    case 'COMPLETE_VOYAGE': {
      const newlyDelivered = action.payload.delivered.filter(
        d => !state.deliveredCargo.some(existing => existing.id === d.id)
      );
      const totalDelivered = [...state.deliveredCargo, ...newlyDelivered];
      return {
        ...state,
        step: 'review',
        isVoyaging: false,
        simProgress: 1,
        deliveredCargo: totalDelivered,
        cargoOnboard: state.cargoOnboard.filter(
          c => !action.payload.delivered.some(d => d.id === c.id)
        ),
        metrics: {
          ...state.metrics,
          voyagesCompleted: state.metrics.voyagesCompleted + 1,
          totalCratesDelivered: state.metrics.totalCratesDelivered + newlyDelivered.length
        },
        feedbackMessage: {
          type: 'success',
          text: `Viagem concluída com sucesso! ${totalDelivered.length} caixa(s) descarregadas nos destinos corretos.`
        }
      };
    }

    case 'RESET_MISSION': {
      return {
        ...state,
        step: 'routing',
        route: ['node_harbor'],
        undoStack: [],
        simResult: null,
        isSimulating: false,
        isVoyaging: false,
        simProgress: 0,
        activeWaypointIndex: 0,
        deliveredCargo: [],
        feedbackMessage: {
          type: 'info',
          text: 'Missão reiniciada. Monte uma nova estratégia de rota e capacidade.'
        }
      };
    }

    case 'SET_MODAL':
      return {
        ...state,
        activeModal: action.payload
      };

    case 'SET_FEEDBACK':
      return {
        ...state,
        feedbackMessage: action.payload
      };

    case 'TOGGLE_AUDIO':
      return {
        ...state,
        audioMuted: !state.audioMuted
      };

    case 'SET_QUALITY':
      return {
        ...state,
        quality: action.payload
      };

    case 'TICK_TIME':
      return {
        ...state,
        metrics: {
          ...state.metrics,
          activeDurationSec: state.metrics.activeDurationSec + action.payload
        }
      };

    default:
      return state;
  }
}
