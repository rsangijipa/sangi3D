/**
 * Meteorologia das Emocoes — estado de sessao serializavel e redutor/FSM.
 * Estado nunca contem objetos Three. Um comando por interacao.
 */

export type WeatherKind = 'sun' | 'cloud' | 'rain' | 'wind';

export type Weather = {
  sun: number;   // 0..4
  cloud: number; // 0..4
  rain: number;  // 0..4
  wind: number;  // 0..4
};

export const WEATHER_KINDS: WeatherKind[] = ['sun', 'cloud', 'rain', 'wind'];

export const INITIAL_WEATHER: Weather = { sun: 2, cloud: 2, rain: 0, wind: 0 };

export type EmotionTag = 'animado' | 'cansado' | 'confuso' | 'outro';

export const EMOTION_TAGS: EmotionTag[] = ['animado', 'cansado', 'confuso', 'outro'];

export type Snapshot = {
  id: string;
  createdAt: number;
  weather: Weather;
  emotionTags: EmotionTag[];
  bulletin: string;
  label: string;
};

export type AudioCfg = { rain: boolean; wind: boolean; master: boolean };

export type Step =
  | 'start'
  | 'choose-mode'
  | 'demo'
  | 'compose'
  | 'review'
  | 'summary'
  | 'exit';

export type Counters = {
  pauses: number;
  skips: number;
  resets: number;
  activeSeconds: number;
};

export type GameState = {
  version: string;
  seed: number;
  mode: 'free' | 'guided' | 'accompanied';
  step: Step;
  weather: Weather;
  emotionTags: EmotionTag[];
  bulletin: string;
  snapshots: Snapshot[];
  audio: AudioCfg;
  counters: Counters;
  startedAt: number | null;
  completedAt: number | null;
  lastAction: string | null;
};

export const STATE_VERSION = '1.0.0';

export const createState = (seed = Date.now()): GameState => ({
  version: STATE_VERSION,
  seed,
  mode: 'free',
  step: 'start',
  weather: { ...INITIAL_WEATHER },
  emotionTags: [],
  bulletin: '',
  snapshots: [],
  audio: { rain: false, wind: false, master: true },
  counters: { pauses: 0, skips: 0, resets: 0, activeSeconds: 0 },
  startedAt: null,
  completedAt: null,
  lastAction: null,
});


// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export type Action =
  | { type: 'SET_MODE'; mode: 'free' | 'guided' | 'accompanied' }
  | { type: 'START_SESSION' }
  | { type: 'SET_WEATHER'; kind: WeatherKind; value: number }
  | { type: 'SET_WEATHER_ALL'; weather: Weather }
  | { type: 'ADD_TAG'; tag: EmotionTag }
  | { type: 'REMOVE_TAG'; tag: EmotionTag }
  | { type: 'SET_BULLETIN'; text: string }
  | { type: 'CLEAR_BULLETIN' }
  | { type: 'SAVE_SNAPSHOT'; label: string }
  | { type: 'DELETE_SNAPSHOT'; id: string }
  | { type: 'RESET_SESSION'; confirmed: boolean }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'TOGGLE_STEP'; step: Step }
  | { type: 'TOGGLE_AUDIO'; kind: 'rain' | 'wind' | 'master' }
  | { type: 'TICK'; dt: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'SKIP' };

// ---------------------------------------------------------------------------
// Reducer (pure)
// ---------------------------------------------------------------------------

export function reducer(state: GameState, action: Action): GameState {
  const now = Date.now();
  const s = { ...state, lastAction: action.type };

  switch (action.type) {
    case 'SET_MODE':
      return { ...s, mode: action.mode };

    case 'START_SESSION':
      return { ...s, step: 'choose-mode', startedAt: now };

    case 'SET_WEATHER': {
      const weather = { ...s.weather, [action.kind]: clamp(action.value) };
      return { ...s, weather };
    }

    case 'SET_WEATHER_ALL':
      return { ...s, weather: clampWeather(action.weather) };

    case 'ADD_TAG': {
      if (s.emotionTags.includes(action.tag)) return s;
      return { ...s, emotionTags: [...s.emotionTags, action.tag] };
    }

    case 'REMOVE_TAG':
      return { ...s, emotionTags: s.emotionTags.filter((t) => t !== action.tag) };

    case 'SET_BULLETIN':
      return { ...s, bulletin: action.text.slice(0, 500) };

    case 'CLEAR_BULLETIN':
      return { ...s, bulletin: '' };

    case 'SAVE_SNAPSHOT': {
      const snapshot: Snapshot = {
        id: `snap-${now}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: now,
        weather: { ...s.weather },
        emotionTags: [...s.emotionTags],
        bulletin: s.bulletin,
        label: action.label || `Composicao ${s.snapshots.length + 1}`,
      };
      return { ...s, snapshots: [...s.snapshots, snapshot] };
    }

    case 'DELETE_SNAPSHOT':
      return { ...s, snapshots: s.snapshots.filter((x) => x.id !== action.id) };

    case 'RESET_SESSION':
      if (!action.confirmed) return s;
      return {
        ...s,
        ...createState(s.seed),
        mode: s.mode,
        counters: { ...s.counters, resets: s.counters.resets + 1 },
        startedAt: now,
      };

    case 'NEXT_STEP':
      return { ...s, step: nextStep(s.step) };

    case 'PREV_STEP':
      return { ...s, step: prevStep(s.step) };

    case 'TOGGLE_STEP':
      return { ...s, step: action.step };

    case 'TOGGLE_AUDIO':
      return { ...s, audio: { ...s.audio, [action.kind]: !s.audio[action.kind] } };

    case 'TICK':
      if (s.step === 'exit') return s;
      return { ...s, counters: { ...s.counters, activeSeconds: s.counters.activeSeconds + action.dt } };

    case 'PAUSE':
      return { ...s, counters: { ...s.counters, pauses: s.counters.pauses + 1 } };

    case 'RESUME':
      return s;

    case 'SKIP':
      return { ...s, counters: { ...s.counters, skips: s.counters.skips + 1 } };

    default:
      return s;
  }
}

function clamp(v: number): number {
  return Math.min(4, Math.max(0, Math.round(v)));
}

function clampWeather(w: Weather): Weather {
  return {
    sun: clamp(w.sun),
    cloud: clamp(w.cloud),
    rain: clamp(w.rain),
    wind: clamp(w.wind),
  };
}

const STEP_ORDER: Step[] = ['start', 'choose-mode', 'demo', 'compose', 'review', 'summary', 'exit'];

function nextStep(step: Step): Step {
  const i = STEP_ORDER.indexOf(step);
  return STEP_ORDER[Math.min(i + 1, STEP_ORDER.length - 1)];
}

function prevStep(step: Step): Step {
  const i = STEP_ORDER.indexOf(step);
  return STEP_ORDER[Math.max(i - 1, 0)];
}

// ---------------------------------------------------------------------------
// Serialization
// ---------------------------------------------------------------------------

export function serialize(state: GameState): string {
  return JSON.stringify(state);
}

export function deserialize(json: string, fallbackSeed = Date.now()): GameState {
  try {
    const parsed = JSON.parse(json) as Partial<GameState>;
    const base = createState(fallbackSeed);
    return {
      ...base,
      ...parsed,
      weather: clampWeather({ ...INITIAL_WEATHER, ...parsed.weather }),
      emotionTags: parsed.emotionTags?.filter((t: unknown) => EMOTION_TAGS.includes(t as EmotionTag)) ?? [],
      snapshots: Array.isArray(parsed.snapshots) ? parsed.snapshots : [],
      audio: { ...base.audio, ...parsed.audio },
      counters: { ...base.counters, ...parsed.counters },
    };
  } catch {
    return createState(fallbackSeed);
  }
}

export function isDefaultState(state: GameState): boolean {
  const d = createState(state.seed);
  return (
    state.step === d.step &&
    JSON.stringify(state.weather) === JSON.stringify(d.weather) &&
    state.emotionTags.length === 0 &&
    state.bulletin === '' &&
    state.snapshots.length === 0
  );
}


