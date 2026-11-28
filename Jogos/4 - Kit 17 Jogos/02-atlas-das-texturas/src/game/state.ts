import {
  SAMPLE_IDS,
  STEPS,
  type Descriptor,
  type LightPreset,
  type Mode,
  type Preference,
  type SampleId,
  type StepId,
  DESCRIPTORS,
} from './content';
import {
  LIMITS,
  allowedFor,
  clampLampAngle,
  clampLampElevation,
  clampMagnifier,
  clampZoom,
  fillChoice,
  normRotation,
  toggleChoice,
  validCompanionSet,
} from './rules';

/**
 * Estado de sessão serializável (sem objetos Three) e redutor puro.
 * A UI e a cena consomem o mesmo estado; cada interação gera um único comando.
 */

export const STATE_VERSION = 1;

export type Phase = 'entrada' | 'jogo' | 'resumo';
export type Tool = 'mao' | 'luz' | 'lupa';

export interface AtlasEntry {
  sampleId: SampleId;
  descriptors: Descriptor[];
  preference: Preference | null;
  /** Condição de luz no momento de guardar (observável, não interpretativa). */
  lampAngle: number;
  lampElevation: number;
  order: number;
}

export interface Counters {
  rotations: number;
  lampMoves: number;
  magnifierUses: number;
  hints: number;
  pauses: number;
  skips: number;
  backs: number;
  saves: number;
  removals: number;
  swaps: number;
  challenges: number;
  challengeMatches: number;
}

export interface SessionState {
  version: number;
  seed: number;
  phase: Phase;
  mode: Mode;
  companion: SampleId[];
  allowed: SampleId[];
  step: number;
  paused: boolean;
  chosen: SampleId[];
  sampleId: SampleId | null;
  rotation: number;
  lampOn: boolean;
  lampAngle: number;
  lampElevation: number;
  lampSweep: boolean;
  magnifierOn: boolean;
  magnifierPos: [number, number];
  zoom: number;
  tool: Tool;
  compareSwap: boolean;
  descriptors: Partial<Record<SampleId, Descriptor[]>>;
  preferences: Partial<Record<SampleId, Preference | null>>;
  collection: AtlasEntry[];
  hintLevel: number;
  lightPreset: LightPreset;
  visited: StepId[];
  counters: Counters;
  saveSerial: number;
}

export type Action =
  | { type: 'start'; mode: Mode; companion?: SampleId[] }
  | { type: 'choose'; id: SampleId }
  | { type: 'setActive'; id: SampleId }
  | { type: 'rotate'; delta: number }
  | { type: 'setRotation'; deg: number; count?: boolean }
  | { type: 'setLamp'; angle?: number; elevation?: number; count?: boolean }
  | { type: 'nudgeLamp'; dAngle?: number; dElevation?: number }
  | { type: 'setLampOn'; on: boolean }
  | { type: 'setSweep'; on: boolean }
  | { type: 'toggleMagnifier'; on?: boolean }
  | { type: 'moveMagnifier'; x: number; z: number }
  | { type: 'setZoom'; zoom: number }
  | { type: 'setTool'; tool: Tool }
  | { type: 'toggleDescriptor'; id: SampleId; descriptor: Descriptor }
  | { type: 'setPreference'; id: SampleId; preference: Preference | null }
  | { type: 'save'; id: SampleId }
  | { type: 'remove'; id: SampleId }
  | { type: 'swapCompare' }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'skip' }
  | { type: 'goto'; step: number }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'hint' }
  | { type: 'setPreset'; preset: LightPreset }
  | { type: 'challenge'; match: boolean }
  | { type: 'tryAnother' }
  | { type: 'finish' }
  | { type: 'reset' };

const zeroCounters = (): Counters => ({
  rotations: 0,
  lampMoves: 0,
  magnifierUses: 0,
  hints: 0,
  pauses: 0,
  skips: 0,
  backs: 0,
  saves: 0,
  removals: 0,
  swaps: 0,
  challenges: 0,
  challengeMatches: 0,
});

export function initialState(seed = 1, preset: LightPreset = 'sala'): SessionState {
  return {
    version: STATE_VERSION,
    seed: seed >>> 0,
    phase: 'entrada',
    mode: 'livre',
    companion: [],
    allowed: [...SAMPLE_IDS],
    step: 0,
    paused: false,
    chosen: [],
    sampleId: 'cork',
    rotation: 0,
    lampOn: true,
    lampAngle: -35,
    lampElevation: 28,
    lampSweep: false,
    magnifierOn: false,
    magnifierPos: [0, 0],
    zoom: 2,
    tool: 'mao',
    compareSwap: false,
    descriptors: {},
    preferences: {},
    collection: [],
    hintLevel: 0,
    lightPreset: preset,
    visited: [],
    counters: zeroCounters(),
    saveSerial: 0,
  };
}

export const stepId = (s: SessionState): StepId => STEPS[s.step].id;
export const LAST_STEP = STEPS.length - 1;

/** Ajustes automáticos ao entrar em cada etapa (luz difusa x rasante, lupa recolhida…). */
function enterStep(s: SessionState, step: number): SessionState {
  const id = STEPS[step].id;
  let chosen = s.chosen;
  if (step > 0 && chosen.length < LIMITS.chooseCount) chosen = fillChoice(chosen, s.allowed, s.seed + step);
  // ao sair da escolha, a primeira amostra escolhida (A) vai para a bandeja principal
  const sampleId =
    id === 'escolher' ? s.sampleId : STEPS[s.step].id === 'escolher' || !chosen.includes(s.sampleId as SampleId) ? (chosen[0] ?? s.sampleId) : s.sampleId;
  return {
    ...s,
    step,
    chosen,
    sampleId,
    hintLevel: 0,
    lampSweep: false,
    magnifierOn: id === 'rasante' ? s.magnifierOn : false,
    lampOn: id === 'observar' ? false : id === 'escolher' ? s.lampOn : true,
    tool: id === 'rasante' ? 'luz' : 'mao',
    visited: s.visited.includes(id) ? s.visited : [...s.visited, id],
  };
}

const inc = (s: SessionState, k: keyof Counters, n = 1): Counters => ({ ...s.counters, [k]: s.counters[k] + n });

export function reducer(s: SessionState, a: Action): SessionState {
  // Pausado: apenas retomar, reiniciar ou ver o resumo.
  if (s.paused && a.type !== 'resume' && a.type !== 'reset' && a.type !== 'finish') return s;

  switch (a.type) {
    case 'start': {
      const companion = a.mode === 'acompanhado' && a.companion && validCompanionSet(a.companion) ? [...a.companion] : [];
      if (a.mode === 'acompanhado' && !companion.length) return s;
      const allowed = allowedFor(a.mode, companion);
      const base: SessionState = {
        ...initialState(s.seed, s.lightPreset),
        phase: 'jogo',
        mode: a.mode,
        companion,
        allowed,
        sampleId: allowed.includes('cork') ? 'cork' : allowed[0],
      };
      return enterStep(base, 0);
    }
    case 'choose': {
      if (stepId(s) !== 'escolher' && s.mode !== 'livre') return s;
      const chosen = toggleChoice(s.chosen, a.id, s.allowed, s.mode);
      const sampleId = chosen.includes(a.id) ? a.id : (chosen[chosen.length - 1] ?? s.sampleId);
      return { ...s, chosen, sampleId };
    }
    case 'setActive': {
      if (!s.allowed.includes(a.id)) return s;
      // fora da escolha, só alterna entre as amostras escolhidas (no livre, qualquer uma entra na escolha)
      if (stepId(s) !== 'escolher' && !s.chosen.includes(a.id)) {
        if (s.mode !== 'livre') return s;
        const chosen = toggleChoice(s.chosen, a.id, s.allowed, 'livre');
        return { ...s, chosen, sampleId: a.id };
      }
      return { ...s, sampleId: a.id };
    }
    case 'rotate':
      if (!a.delta) return s;
      return { ...s, rotation: normRotation(s.rotation + a.delta), counters: inc(s, 'rotations') };
    case 'setRotation':
      return { ...s, rotation: normRotation(a.deg), counters: a.count ? inc(s, 'rotations') : s.counters };
    case 'setLamp': {
      const lampAngle = a.angle === undefined ? s.lampAngle : clampLampAngle(a.angle);
      const lampElevation = a.elevation === undefined ? s.lampElevation : clampLampElevation(a.elevation);
      if (lampAngle === s.lampAngle && lampElevation === s.lampElevation && !a.count) return s;
      return { ...s, lampAngle, lampElevation, counters: a.count ? inc(s, 'lampMoves') : s.counters };
    }
    case 'nudgeLamp': {
      const lampAngle = clampLampAngle(s.lampAngle + (a.dAngle ?? 0));
      const lampElevation = clampLampElevation(s.lampElevation + (a.dElevation ?? 0));
      if (lampAngle === s.lampAngle && lampElevation === s.lampElevation) return s;
      return { ...s, lampAngle, lampElevation, lampOn: true, counters: inc(s, 'lampMoves') };
    }
    case 'setLampOn':
      return { ...s, lampOn: a.on, lampSweep: a.on ? s.lampSweep : false };
    case 'setSweep':
      return { ...s, lampSweep: a.on, lampOn: a.on ? true : s.lampOn, counters: a.on ? inc(s, 'lampMoves') : s.counters };
    case 'toggleMagnifier': {
      const on = a.on ?? !s.magnifierOn;
      if (on === s.magnifierOn) return s;
      return { ...s, magnifierOn: on, tool: on ? 'lupa' : s.tool === 'lupa' ? 'mao' : s.tool, counters: on ? inc(s, 'magnifierUses') : s.counters };
    }
    case 'moveMagnifier': {
      const magnifierPos = clampMagnifier(a.x, a.z);
      return { ...s, magnifierPos };
    }
    case 'setZoom':
      return { ...s, zoom: clampZoom(a.zoom) };
    case 'setTool':
      if (a.tool === 'lupa') return reducer(s, { type: 'toggleMagnifier', on: true });
      // a lupa pode continuar aberta enquanto a luz gira: o arraste passa a mover a luz ou a amostra
      return { ...s, tool: a.tool };
    case 'toggleDescriptor': {
      if (!(DESCRIPTORS as readonly string[]).includes(a.descriptor) || !s.chosen.includes(a.id)) return s;
      const cur = s.descriptors[a.id] ?? [];
      const next = cur.includes(a.descriptor) ? cur.filter((d) => d !== a.descriptor) : [...cur, a.descriptor];
      return { ...s, descriptors: { ...s.descriptors, [a.id]: next } };
    }
    case 'setPreference': {
      if (!s.chosen.includes(a.id) && !s.collection.some((e) => e.sampleId === a.id)) return s;
      const preferences = { ...s.preferences, [a.id]: a.preference };
      // atualiza a entrada já guardada, sem duplicar
      const collection = s.collection.map((e) => (e.sampleId === a.id ? { ...e, preference: a.preference } : e));
      return { ...s, preferences, collection };
    }
    case 'save': {
      if (!s.chosen.includes(a.id) && !s.collection.some((e) => e.sampleId === a.id)) return s;
      const existing = s.collection.find((e) => e.sampleId === a.id);
      const entry: AtlasEntry = {
        sampleId: a.id,
        descriptors: [...(s.descriptors[a.id] ?? [])],
        preference: s.preferences[a.id] ?? null,
        lampAngle: s.lampAngle,
        lampElevation: s.lampElevation,
        order: existing ? existing.order : s.saveSerial + 1,
      };
      const collection = existing ? s.collection.map((e) => (e.sampleId === a.id ? entry : e)) : [...s.collection, entry];
      return { ...s, collection, saveSerial: existing ? s.saveSerial : s.saveSerial + 1, counters: existing ? s.counters : inc(s, 'saves') };
    }
    case 'remove': {
      if (!s.collection.some((e) => e.sampleId === a.id)) return s;
      return { ...s, collection: s.collection.filter((e) => e.sampleId !== a.id), counters: inc(s, 'removals') };
    }
    case 'swapCompare':
      return { ...s, compareSwap: !s.compareSwap, counters: inc(s, 'swaps') };
    case 'next':
      if (s.phase !== 'jogo') return s;
      if (s.step >= LAST_STEP) return reducer(s, { type: 'finish' });
      if (stepId(s) === 'escolher' && s.chosen.length < LIMITS.chooseCount) return s;
      return enterStep(s, s.step + 1);
    case 'skip':
      if (s.phase !== 'jogo') return s;
      if (s.step >= LAST_STEP) return reducer({ ...s, counters: inc(s, 'skips') }, { type: 'finish' });
      return enterStep({ ...s, counters: inc(s, 'skips') }, s.step + 1);
    case 'back':
      if (s.phase !== 'jogo' || s.step === 0) return s;
      return enterStep({ ...s, counters: inc(s, 'backs') }, s.step - 1);
    case 'goto':
      if (s.phase !== 'jogo' || a.step < 0 || a.step > LAST_STEP) return s;
      // só etapas já visitadas (ou a próxima) podem ser abertas diretamente
      if (!s.visited.includes(STEPS[a.step].id) && a.step !== s.step + 1) return s;
      if (a.step > 0 && s.chosen.length < LIMITS.chooseCount && stepId(s) === 'escolher') return s;
      return enterStep(s, a.step);
    case 'pause':
      if (s.phase !== 'jogo' || s.paused) return s;
      return { ...s, paused: true, lampSweep: false, counters: inc(s, 'pauses') };
    case 'resume':
      return s.paused ? { ...s, paused: false } : s;
    case 'hint': {
      const max = STEPS[s.step].hints.length;
      if (s.hintLevel >= max) return s;
      return { ...s, hintLevel: s.hintLevel + 1, counters: inc(s, 'hints') };
    }
    case 'setPreset':
      return { ...s, lightPreset: a.preset };
    case 'challenge':
      return { ...s, counters: { ...inc(s, 'challenges'), challengeMatches: s.counters.challengeMatches + (a.match ? 1 : 0) } };
    case 'tryAnother': {
      if (s.phase !== 'jogo') return s;
      return enterStep({ ...s, chosen: [], compareSwap: false }, 0);
    }
    case 'finish':
      if (s.phase !== 'jogo') return s;
      return { ...s, phase: 'resumo', paused: false, lampSweep: false };
    case 'reset':
      return { ...initialState(s.seed + 1, s.lightPreset) };
    default:
      return s;
  }
}

/** Amostras exibidas na comparação, na ordem esquerda→direita. */
export function compareOrder(s: SessionState): [SampleId, SampleId] | null {
  if (s.chosen.length < 2) return null;
  const [a, b] = s.chosen;
  return s.compareSwap ? [b, a] : [a, b];
}

export interface Summary {
  app: 'atlas-das-texturas';
  version: number;
  seed: number;
  mode: Mode;
  companionSet: SampleId[];
  stepsVisited: StepId[];
  activeSeconds: number;
  pauses: number;
  hintsUsed: number;
  chosen: SampleId[];
  collection: AtlasEntry[];
  interactions: Omit<Counters, 'pauses' | 'hints'>;
  lightPreset: LightPreset;
  note: string;
}

/** Resumo objetivo: só contagens, escolhas e condições. Nenhuma inferência. */
export function summarize(s: SessionState, activeMs: number): Summary {
  const { pauses, hints, ...interactions } = s.counters;
  return {
    app: 'atlas-das-texturas',
    version: s.version,
    seed: s.seed,
    mode: s.mode,
    companionSet: [...s.companion],
    stepsVisited: [...s.visited],
    activeSeconds: Math.round(activeMs / 1000),
    pauses,
    hintsUsed: hints,
    chosen: [...s.chosen],
    collection: s.collection.map((e) => ({ ...e, descriptors: [...e.descriptors] })),
    interactions,
    lightPreset: s.lightPreset,
    note: 'Registro descritivo. Não contém interpretação nem diagnóstico.',
  };
}
