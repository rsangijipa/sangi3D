// src/game/state.ts
// Estado puramente serializável e máquina de estados finitos (FSM / Reducer)
import { SOUND_SOURCES, GAME_STEPS } from './content';
import { Vec3, snapToStreetNetwork, snapPointToGrid, clampToBoardBounds } from './rules';

export type GameTool = 'listen' | 'move' | 'compare';
export type GameStep = 1 | 2 | 3 | 4 | 5;
export type GameMode = 'free' | 'guided' | 'assisted';
export type ComparisonChoice = 'closer' | 'further' | 'similar' | 'dont_know';

export interface SoundSourceRuntimeState {
  id: string;
  name: string;
  shortName: string;
  description: string;
  captionText: string;
  areaId: string;
  icon: string;
  colorHex: string;
  position: Vec3;
  gain: number;
  muted: boolean;
  isPlaying: boolean;
  explored: boolean;
}

export interface ComparisonState {
  sourceAId: string | null;
  sourceBId: string | null;
  activePlaying: 'A' | 'B' | null;
  userChoice: ComparisonChoice | null;
  evaluatedRelationship: 'A_closer' | 'B_closer' | 'similar' | null;
}

export interface AssistedSettings {
  maxGainLimit: number; // 0.1 to 1.0
  visualAudioEnhancement: boolean;
  selectedSources: string[];
}

export interface GameObservations {
  exploredSourcesCount: number;
  comparisonsCount: number;
  hintsCount: number;
  compositionCompleted: boolean;
  notes: string[];
  durationSeconds: number;
}

export interface GameState {
  version: string;
  seed: number;
  mode: GameMode;
  step: GameStep;
  activeTool: GameTool;
  selectedSourceId: string;
  listenerPos: Vec3;
  busPos: Vec3;
  globalMuted: boolean;
  masterVolume: number;
  sources: SoundSourceRuntimeState[];
  comparison: ComparisonState;
  compositionSourceIds: string[];
  assistedSettings: AssistedSettings;
  observations: GameObservations;
  audioUnlocked: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  isTransitioning: boolean;
  captionsEnabled: boolean;
  currentMessage: string | null;
}

export type GameAction =
  | { type: 'SELECT_TOOL'; tool: GameTool }
  | { type: 'SET_STEP'; step: GameStep }
  | { type: 'SELECT_SOURCE'; sourceId: string }
  | { type: 'TOGGLE_PLAY_SOURCE'; sourceId: string }
  | { type: 'SET_SOURCE_PLAYING'; sourceId: string; isPlaying: boolean }
  | { type: 'TOGGLE_MUTE_GLOBAL' }
  | { type: 'SET_GLOBAL_MUTED'; muted: boolean }
  | { type: 'SET_MASTER_VOLUME'; volume: number }
  | { type: 'SET_SOURCE_VOLUME'; sourceId: string; gain: number }
  | { type: 'MOVE_LISTENER'; position: Vec3 }
  | { type: 'MOVE_BUS'; position: Vec3 }
  | { type: 'SET_COMPARE_SOURCE_A'; sourceId: string }
  | { type: 'SET_COMPARE_SOURCE_B'; sourceId: string }
  | { type: 'PLAY_COMPARE_SIDE'; side: 'A' | 'B' | null }
  | { type: 'SUBMIT_COMPARE_CHOICE'; choice: ComparisonChoice; evaluated: 'A_closer' | 'B_closer' | 'similar' }
  | { type: 'TOGGLE_COMPOSITION_SOURCE'; sourceId: string }
  | { type: 'REQUEST_HINT' }
  | { type: 'SET_MODE'; mode: GameMode }
  | { type: 'UPDATE_ASSISTED_SETTINGS'; settings: Partial<AssistedSettings> }
  | { type: 'UNLOCK_AUDIO' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'SET_PAUSED'; paused: boolean }
  | { type: 'COMPLETE_EXPERIENCE' }
  | { type: 'RESET_EXPERIENCE' }
  | { type: 'TICK_TIME'; deltaSeconds: number }
  | { type: 'SET_CAPTIONS_ENABLED'; enabled: boolean }
  | { type: 'SET_MESSAGE'; message: string | null }
  | { type: 'FINISH_TRANSITION' };

export function createInitialState(mode: GameMode = 'guided', seed = 42): GameState {
  const sources: SoundSourceRuntimeState[] = SOUND_SOURCES.map((s) => ({
    id: s.id,
    name: s.name,
    shortName: s.shortName,
    description: s.description,
    captionText: s.captionText,
    areaId: s.areaId,
    icon: s.icon,
    colorHex: s.colorHex,
    position: [...s.initialPos] as Vec3,
    gain: 0.8,
    muted: false,
    isPlaying: false,
    explored: false
  }));

  // Initial bus position directly matches mockup (-0.6, 0.2, 1.2)
  const busInitial: Vec3 = [-0.6, 0.2, 1.2];
  // Initial listener position near the bakery/plaza border
  const listenerInitial: Vec3 = [-0.8, 0.1, 0.2];

  return {
    version: '1.0.0',
    seed,
    mode,
    step: 3, // Initial step is 3/5 ("Mover e comparar"), as showcased in mockup!
    activeTool: 'move', // Active tool is "Mover" in the mockup
    selectedSourceId: 'bus',
    listenerPos: listenerInitial,
    busPos: busInitial,
    globalMuted: false,
    masterVolume: 0.85,
    sources,
    comparison: {
      sourceAId: 'bus',
      sourceBId: 'fountain',
      activePlaying: null,
      userChoice: null,
      evaluatedRelationship: null
    },
    compositionSourceIds: ['bus', 'fountain'],
    assistedSettings: {
      maxGainLimit: 1.0,
      visualAudioEnhancement: true,
      selectedSources: ['bus', 'fountain', 'birds', 'bell', 'footsteps']
    },
    observations: {
      exploredSourcesCount: 1,
      comparisonsCount: 0,
      hintsCount: 0,
      compositionCompleted: false,
      notes: [],
      durationSeconds: 0
    },
    audioUnlocked: false,
    isPaused: false,
    isCompleted: false,
    isTransitioning: false,
    captionsEnabled: true,
    currentMessage: null
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_TOOL':
      return {
        ...state,
        activeTool: action.tool
      };

    case 'SET_STEP': {
      const stepIndex = action.step;
      const stepDef = GAME_STEPS.find((s) => s.step === stepIndex);
      return {
        ...state,
        step: action.step,
        activeTool: stepDef ? stepDef.defaultTool : state.activeTool,
        isTransitioning: true
      };
    }

    case 'SELECT_SOURCE': {
      const updatedSources = state.sources.map((s) =>
        s.id === action.sourceId ? { ...s, explored: true } : s
      );
      const newlyExplored = updatedSources.filter((s) => s.explored).length;

      return {
        ...state,
        selectedSourceId: action.sourceId,
        sources: updatedSources,
        observations: {
          ...state.observations,
          exploredSourcesCount: Math.max(state.observations.exploredSourcesCount, newlyExplored)
        }
      };
    }

    case 'TOGGLE_PLAY_SOURCE': {
      const source = state.sources.find((s) => s.id === action.sourceId);
      if (!source) return state;

      const newIsPlaying = !source.isPlaying;
      return {
        ...state,
        selectedSourceId: action.sourceId,
        sources: state.sources.map((s) => {
          if (s.id === action.sourceId) {
            return { ...s, isPlaying: newIsPlaying, explored: true };
          }
          // No modo etapa 1 ou 3, tocar uma fonte isolada desliga as outras para evitar loops concorrentes
          if (state.step <= 4 && newIsPlaying) {
            return { ...s, isPlaying: false };
          }
          return s;
        })
      };
    }

    case 'SET_SOURCE_PLAYING':
      return {
        ...state,
        sources: state.sources.map((s) =>
          s.id === action.sourceId ? { ...s, isPlaying: action.isPlaying } : s
        )
      };

    case 'TOGGLE_MUTE_GLOBAL':
      return {
        ...state,
        globalMuted: !state.globalMuted
      };

    case 'SET_GLOBAL_MUTED':
      return {
        ...state,
        globalMuted: action.muted
      };

    case 'SET_MASTER_VOLUME':
      return {
        ...state,
        masterVolume: Math.max(0, Math.min(1, action.volume))
      };

    case 'SET_SOURCE_VOLUME':
      return {
        ...state,
        sources: state.sources.map((s) =>
          s.id === action.sourceId ? { ...s, gain: Math.max(0, Math.min(1, action.gain)) } : s
        )
      };

    case 'MOVE_LISTENER': {
      const clamped = clampToBoardBounds(action.position);
      const snapped = snapPointToGrid(clamped);
      return {
        ...state,
        listenerPos: snapped
      };
    }

    case 'MOVE_BUS': {
      // O ônibus é travado deterministicamente à malha viária
      const snappedToStreet = snapToStreetNetwork(action.position);
      return {
        ...state,
        busPos: snappedToStreet,
        sources: state.sources.map((s) =>
          s.id === 'bus' ? { ...s, position: snappedToStreet } : s
        )
      };
    }

    case 'SET_COMPARE_SOURCE_A':
      return {
        ...state,
        comparison: {
          ...state.comparison,
          sourceAId: action.sourceId,
          userChoice: null,
          evaluatedRelationship: null
        }
      };

    case 'SET_COMPARE_SOURCE_B':
      return {
        ...state,
        comparison: {
          ...state.comparison,
          sourceBId: action.sourceId,
          userChoice: null,
          evaluatedRelationship: null
        }
      };

    case 'PLAY_COMPARE_SIDE': {
      const side = action.side;
      const targetId =
        side === 'A'
          ? state.comparison.sourceAId
          : side === 'B'
          ? state.comparison.sourceBId
          : null;

      return {
        ...state,
        comparison: {
          ...state.comparison,
          activePlaying: side
        },
        sources: state.sources.map((s) => ({
          ...s,
          isPlaying: targetId !== null && s.id === targetId
        }))
      };
    }

    case 'SUBMIT_COMPARE_CHOICE': {
      const choiceNote = `Comparação entre fontes: opção "${action.choice}" registrada (relação objetiva: ${action.evaluated}).`;
      return {
        ...state,
        comparison: {
          ...state.comparison,
          userChoice: action.choice,
          evaluatedRelationship: action.evaluated
        },
        observations: {
          ...state.observations,
          comparisonsCount: state.observations.comparisonsCount + 1,
          notes: [...state.observations.notes, choiceNote]
        }
      };
    }

    case 'TOGGLE_COMPOSITION_SOURCE': {
      const sid = action.sourceId;
      const current = state.compositionSourceIds;
      let next: string[];

      if (current.includes(sid)) {
        next = current.filter((id) => id !== sid);
      } else {
        if (current.length >= 3) {
          // Máximo de 3 fontes simultâneas conforme especificação
          next = [...current.slice(1), sid];
        } else {
          next = [...current, sid];
        }
      }

      return {
        ...state,
        compositionSourceIds: next,
        sources: state.sources.map((s) => ({
          ...s,
          isPlaying: next.includes(s.id)
        })),
        observations: {
          ...state.observations,
          compositionCompleted: next.length > 0
        }
      };
    }

    case 'REQUEST_HINT': {
      const currentStepDef = GAME_STEPS.find((s) => s.step === state.step);
      const hintMsg = currentStepDef ? currentStepDef.hint : 'Explore livremente o mapa!';
      return {
        ...state,
        currentMessage: hintMsg,
        observations: {
          ...state.observations,
          hintsCount: state.observations.hintsCount + 1
        }
      };
    }

    case 'SET_MODE':
      return {
        ...state,
        mode: action.mode
      };

    case 'UPDATE_ASSISTED_SETTINGS':
      return {
        ...state,
        assistedSettings: {
          ...state.assistedSettings,
          ...action.settings
        }
      };

    case 'UNLOCK_AUDIO':
      return {
        ...state,
        audioUnlocked: true
      };

    case 'TOGGLE_PAUSE':
      return {
        ...state,
        isPaused: !state.isPaused
      };

    case 'SET_PAUSED':
      return {
        ...state,
        isPaused: action.paused
      };

    case 'COMPLETE_EXPERIENCE':
      return {
        ...state,
        isCompleted: true,
        // Ao concluir, parar os loops contínuos
        sources: state.sources.map((s) => ({ ...s, isPlaying: false }))
      };

    case 'RESET_EXPERIENCE':
      return createInitialState(state.mode, state.seed + 1);

    case 'TICK_TIME':
      return {
        ...state,
        observations: {
          ...state.observations,
          durationSeconds: state.observations.durationSeconds + action.deltaSeconds
        }
      };

    case 'SET_CAPTIONS_ENABLED':
      return {
        ...state,
        captionsEnabled: action.enabled
      };

    case 'SET_MESSAGE':
      return {
        ...state,
        currentMessage: action.message
      };

    case 'FINISH_TRANSITION':
      return {
        ...state,
        isTransitioning: false
      };

    default:
      return state;
  }
}
