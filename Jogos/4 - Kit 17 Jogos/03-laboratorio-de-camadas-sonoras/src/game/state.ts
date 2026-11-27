/**
 * Laboratório de Camadas Sonoras — Estado Serializável e FSM
 * Reducer puro em TypeScript para mixagem, solo, A/B e desafios perceptivos
 */

export type ChannelId = 'speech' | 'footsteps' | 'fan' | 'city' | 'music';

export interface SoundChannelState {
  id: ChannelId;
  name: string;
  icon: string;
  level: number; // 0.0 a 1.0 (nível de volume nominal do canal)
  mute: boolean; // Mute individual do canal
}

export type GameMode = 'livre' | 'guiado' | 'acompanhado';

export type GameStep = 'explore' | 'isolate' | 'challenge' | 'review';

export interface GameState {
  version: string;
  seed: number;
  mode: GameMode;
  step: GameStep;
  channels: SoundChannelState[];
  soloId: ChannelId | null; // Canal solo ativo ou null
  masterMute: boolean; // Silenciar tudo
  audioStarted: boolean; // Se o motor Web Audio já foi desbloqueado
  focusedChannelId: ChannelId; // Canal em foco visual/interativo ('footsteps' por padrão)
  mixA: Record<ChannelId, number>; // Memória de Mixagem A
  mixB: Record<ChannelId, number>; // Memória de Mixagem B
  activeMixPreset: 'A' | 'B' | 'custom';
  targetId: ChannelId | null; // Canal alvo do desafio opcional de escuta
  challengeSolved: boolean;
  reducedMotion: boolean;
  maxVolumeCeiling: number; // Teto de volume para modo acompanhado (ex: 0.8)
  activeModal: 'challenge' | 'ab' | 'settings' | 'reflection' | null;
  feedbackMessage: {
    type: 'info' | 'success' | 'warning';
    text: string;
  } | null;
  metrics: {
    adjustmentsCount: number;
    solosTested: number;
    challengesCompleted: number;
    activeDurationSec: number;
  };
  timestamp: number;
}

export type GameAction =
  | { type: 'START_AUDIO' }
  | { type: 'SET_CHANNEL_LEVEL'; payload: { id: ChannelId; level: number } }
  | { type: 'TOGGLE_SOLO'; payload: ChannelId }
  | { type: 'TOGGLE_CHANNEL_MUTE'; payload: ChannelId }
  | { type: 'SET_FOCUS_CHANNEL'; payload: ChannelId }
  | { type: 'MUTE_ALL' }
  | { type: 'UNMUTE_ALL' }
  | { type: 'SAVE_MIX_SNAPSHOT'; payload: 'A' | 'B' }
  | { type: 'LOAD_MIX_SNAPSHOT'; payload: 'A' | 'B' }
  | { type: 'SET_MODE'; payload: GameMode }
  | { type: 'START_CHALLENGE'; payload: { targetId: ChannelId } }
  | { type: 'CHECK_CHALLENGE_ANSWER'; payload: ChannelId }
  | { type: 'TOGGLE_REDUCED_MOTION' }
  | { type: 'SET_VOLUME_CEILING'; payload: number }
  | { type: 'SET_MODAL'; payload: 'challenge' | 'ab' | 'settings' | 'reflection' | null }
  | { type: 'SET_FEEDBACK'; payload: { type: 'info' | 'success' | 'warning'; text: string } | null }
  | { type: 'RESET_MIX' }
  | { type: 'TICK_TIME'; payload: number };

export const DEFAULT_CHANNELS: SoundChannelState[] = [
  { id: 'speech', name: 'Vozes / Conversa', icon: 'speech', level: 0.0, mute: false },
  { id: 'footsteps', name: 'Passos / Tênis', icon: 'shoe', level: 0.65, mute: false },
  { id: 'fan', name: 'Ventilador', icon: 'fan', level: 0.0, mute: false },
  { id: 'city', name: 'Cidade / Trânsito', icon: 'city', level: 0.0, mute: false },
  { id: 'music', name: 'Melodia Suave', icon: 'music', level: 0.0, mute: false }
];

export function createInitialState(seed: number = 42): GameState {
  const initialMix: Record<ChannelId, number> = {
    speech: 0.0,
    footsteps: 0.65,
    fan: 0.0,
    city: 0.0,
    music: 0.0
  };

  const initialMixB: Record<ChannelId, number> = {
    speech: 0.4,
    footsteps: 0.3,
    fan: 0.5,
    city: 0.2,
    music: 0.7
  };

  return {
    version: '1.0.0',
    seed,
    mode: 'guiado',
    step: 'explore',
    channels: DEFAULT_CHANNELS.map(c => ({ ...c })),
    soloId: 'footsteps', // No mockup, o canal de passos/tênis está em solo com botão fone verde ativo!
    masterMute: false,
    audioStarted: false, // Começa sempre silencioso até interação
    focusedChannelId: 'footsteps', // Foco no tênis/passos como no mockup
    mixA: { ...initialMix },
    mixB: { ...initialMixB },
    activeMixPreset: 'custom',
    targetId: null,
    challengeSolved: false,
    reducedMotion: false,
    maxVolumeCeiling: 1.0,
    activeModal: null,
    feedbackMessage: {
      type: 'info',
      text: 'Clique em "Ativar Som" para iniciar a bancada. Ajuste os faders e redomas para explorar cada camada.'
    },
    metrics: {
      adjustmentsCount: 0,
      solosTested: 0,
      challengesCompleted: 0,
      activeDurationSec: 0
    },
    timestamp: Date.now()
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_AUDIO':
      return {
        ...state,
        audioStarted: true,
        feedbackMessage: {
          type: 'success',
          text: 'Áudio ativado com sucesso! Ajuste o volume dos canais ou toque no fone para isolar.'
        }
      };

    case 'SET_CHANNEL_LEVEL': {
      const clampedLevel = Math.max(0, Math.min(state.maxVolumeCeiling, action.payload.level));
      const updatedChannels = state.channels.map(c =>
        c.id === action.payload.id ? { ...c, level: Number(clampedLevel.toFixed(2)) } : c
      );

      return {
        ...state,
        channels: updatedChannels,
        focusedChannelId: action.payload.id,
        activeMixPreset: 'custom',
        metrics: {
          ...state.metrics,
          adjustmentsCount: state.metrics.adjustmentsCount + 1
        }
      };
    }

    case 'TOGGLE_SOLO': {
      const isCurrentlySolo = state.soloId === action.payload;
      const nextSoloId = isCurrentlySolo ? null : action.payload;

      return {
        ...state,
        soloId: nextSoloId,
        focusedChannelId: action.payload,
        metrics: {
          ...state.metrics,
          solosTested: state.metrics.solosTested + 1
        },
        feedbackMessage: nextSoloId
          ? { type: 'info', text: `Canal isolado em solo: ${action.payload.toUpperCase()}. Os demais canais foram atenuados sem perder seus volumes nominais.` }
          : { type: 'info', text: 'Solo desativado. Todos os canais retornaram à mixagem nominal.' }
      };
    }

    case 'TOGGLE_CHANNEL_MUTE': {
      const updatedChannels = state.channels.map(c =>
        c.id === action.payload ? { ...c, mute: !c.mute } : c
      );
      return {
        ...state,
        channels: updatedChannels,
        focusedChannelId: action.payload
      };
    }

    case 'SET_FOCUS_CHANNEL':
      return {
        ...state,
        focusedChannelId: action.payload
      };

    case 'MUTE_ALL':
      return {
        ...state,
        masterMute: true,
        feedbackMessage: {
          type: 'info',
          text: 'Silêncio total ativado. Nenhum som está sendo emitido.'
        }
      };

    case 'UNMUTE_ALL':
      return {
        ...state,
        masterMute: false,
        feedbackMessage: null
      };

    case 'SAVE_MIX_SNAPSHOT': {
      const currentLevels: Record<ChannelId, number> = {} as Record<ChannelId, number>;
      state.channels.forEach(c => {
        currentLevels[c.id] = c.level;
      });

      if (action.payload === 'A') {
        return {
          ...state,
          mixA: currentLevels,
          activeMixPreset: 'A',
          feedbackMessage: { type: 'success', text: 'Mixagem salva no perfil A!' }
        };
      } else {
        return {
          ...state,
          mixB: currentLevels,
          activeMixPreset: 'B',
          feedbackMessage: { type: 'success', text: 'Mixagem salva no perfil B!' }
        };
      }
    }

    case 'LOAD_MIX_SNAPSHOT': {
      const targetSnapshot = action.payload === 'A' ? state.mixA : state.mixB;
      const updatedChannels = state.channels.map(c => ({
        ...c,
        level: targetSnapshot[c.id] !== undefined ? targetSnapshot[c.id] : c.level
      }));

      return {
        ...state,
        channels: updatedChannels,
        activeMixPreset: action.payload,
        feedbackMessage: {
          type: 'info',
          text: `Mixagem alternada para Perfil ${action.payload}. Compare a sensação de conforto sonoro!`
        }
      };
    }

    case 'SET_MODE':
      return {
        ...state,
        mode: action.payload
      };

    case 'START_CHALLENGE':
      return {
        ...state,
        step: 'challenge',
        targetId: action.payload.targetId,
        challengeSolved: false,
        feedbackMessage: {
          type: 'info',
          text: 'Desafio ativo: Ouça a camada destacada na mixagem e selecione a redoma correspondente.'
        }
      };

    case 'CHECK_CHALLENGE_ANSWER': {
      const correct = state.targetId === action.payload;
      return {
        ...state,
        challengeSolved: correct,
        metrics: {
          ...state.metrics,
          challengesCompleted: correct ? state.metrics.challengesCompleted + 1 : state.metrics.challengesCompleted
        },
        feedbackMessage: correct
          ? { type: 'success', text: `Excelente percepção! Você identificou corretamente a fonte sonora!` }
          : { type: 'warning', text: 'Tente usar o botão de isolar (fone) para escutar com mais clareza.' }
      };
    }

    case 'TOGGLE_REDUCED_MOTION':
      return {
        ...state,
        reducedMotion: !state.reducedMotion
      };

    case 'SET_VOLUME_CEILING': {
      const ceiling = Math.max(0.1, Math.min(1.0, action.payload));
      const clampedChannels = state.channels.map(c => ({
        ...c,
        level: Math.min(c.level, ceiling)
      }));
      return {
        ...state,
        maxVolumeCeiling: ceiling,
        channels: clampedChannels
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

    case 'RESET_MIX': {
      const resetChannels = state.channels.map(c => ({
        ...c,
        level: 0.0,
        mute: false
      }));
      return {
        ...state,
        channels: resetChannels,
        soloId: null,
        masterMute: false,
        activeMixPreset: 'custom',
        feedbackMessage: {
          type: 'info',
          text: 'Mixer zerado. Comece levantando os faders que você deseja ouvir.'
        }
      };
    }

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
