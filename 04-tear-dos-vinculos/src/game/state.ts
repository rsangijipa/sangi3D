// Estado serializável da aplicação. Nenhum objeto Three.js entra aqui.
import {
  INITIAL_CONFIGS,
  YARN_IDS,
  thicknessById,
  type Crossing,
  type ModeId,
  type PatternId,
  type ThicknessId,
  type ToolId,
} from './content.ts';

export const STATE_VERSION = 1 as const;
export const MAX_ROWS = 72;
/** fator de compactação da trama após a batida do pente */
export const PACKING = 0.74;

export type Participant = 'A' | 'B';

export interface RowEntity {
  kind: 'row';
  id: string;
  yarnId: string;
  thickness: ThicknessId;
  /** cruzamentos na ordem em que a lançadeira passou */
  crossings: Crossing[];
  /** 1 = da esquerda para a direita; -1 = da direita para a esquerda */
  direction: 1 | -1;
  /** 0 = frouxo, 1 = muito tenso */
  tension: number;
  participant: Participant | null;
}

export interface GapEntity {
  kind: 'gap';
  id: string;
  /** altura deixada pelo trecho cortado, em metros */
  height: number;
  removedRowIds: string[];
}

export type FabricEntity = RowEntity | GapEntity;

export type EndState = 'solta' | 'presa' | 'atada';

export interface LooseEnd {
  id: string;
  rowId: string;
  side: 'left' | 'right';
  state: EndState;
  yarnId: string;
  /** entidade cuja criação gerou esta ponta (passada iniciada ou corte) */
  originId: string;
}

export interface ActiveRow {
  id: string;
  yarnId: string;
  thickness: ThicknessId;
  crossings: Crossing[];
  direction: 1 | -1;
  tension: number;
  participant: Participant | null;
}

export interface RowSelection {
  fromId: string;
  toId: string | null;
}

export interface SceneState {
  warpCount: number;
  fabric: FabricEntity[];
  active: ActiveRow | null;
  ends: LooseEnd[];
  selectedYarn: string;
  thickness: ThicknessId;
  /** tensão aplicada à passada ativa e às próximas */
  tension: number;
  assist: PatternId;
  selection: RowSelection | null;
  /** fileira escolhida para ajuste de tensão; null = passada ativa */
  focusRowId: string | null;
  /** nomes opcionais dos fios (mapa de vínculos); só em memória por padrão */
  names: Record<string, string>;
  shared: boolean;
  turn: Participant;
  nextId: number;
}

export type QualityId = 'auto' | 'cinema' | 'equilibrada' | 'leve';
export type InstructionId = 'texto' | 'demonstracao' | 'modelo';

export interface Settings {
  quality: QualityId;
  sound: boolean;
  volume: number;
  reducedMotion: boolean;
  /** 0 = sem pistas; 3 = pista mais forte */
  hintLevel: number;
  configId: string;
  instruction: InstructionId;
  opportunities: number;
}

export type Phase = 'entrada' | 'demonstracao' | 'tecendo' | 'revisao';

export type ObservationResult = 'independente' | 'com_ajuda' | 'nao_realizada' | 'recusada';

export interface Observation {
  id: string;
  /** segundos desde o início da sessão */
  t: number;
  opportunity: number;
  step: string;
  result: ObservationResult;
}

export interface HistoryState {
  past: SceneState[];
  future: SceneState[];
}

export interface AppState {
  version: typeof STATE_VERSION;
  seed: number;
  mode: ModeId;
  phase: Phase;
  tool: ToolId;
  paused: boolean;
  settings: Settings;
  sceneState: SceneState;
  history: HistoryState;
  observations: Observation[];
}

export function defaultSettings(): Settings {
  return {
    quality: 'auto',
    sound: false,
    volume: 0.6,
    reducedMotion: false,
    hintLevel: 1,
    configId: INITIAL_CONFIGS[1].id,
    instruction: 'texto',
    opportunities: 5,
  };
}

export function createScene(warpCount = 18, opts: Partial<SceneState> = {}): SceneState {
  return {
    warpCount: clampInt(warpCount, 8, 32),
    fabric: [],
    active: null,
    ends: [],
    selectedYarn: 'salvia',
    thickness: 'media',
    tension: 0.55,
    assist: 'livre',
    selection: null,
    focusRowId: null,
    names: {},
    shared: false,
    turn: 'A',
    nextId: 1,
    ...opts,
  };
}

export function createAppState(seed = 4021): AppState {
  return {
    version: STATE_VERSION,
    seed,
    mode: 'livre',
    phase: 'entrada',
    tool: 'fio',
    paused: false,
    settings: defaultSettings(),
    sceneState: createScene(18),
    history: { past: [], future: [] },
    observations: [],
  };
}

/** Altura ocupada por uma fileira já batida pelo pente. */
export function rowPitch(thickness: ThicknessId): number {
  return thicknessById(thickness).raio * 2 * PACKING;
}

export function entityHeight(e: FabricEntity): number {
  return e.kind === 'row' ? rowPitch(e.thickness) : e.height;
}

export function fabricHeight(s: SceneState): number {
  let h = 0;
  for (const e of s.fabric) h += entityHeight(e);
  return h;
}

export function rowCount(s: SceneState): number {
  let n = 0;
  for (const e of s.fabric) if (e.kind === 'row') n++;
  return n;
}

export function lastRow(s: SceneState): RowEntity | null {
  for (let i = s.fabric.length - 1; i >= 0; i--) {
    const e = s.fabric[i];
    if (e.kind === 'row') return e;
  }
  return null;
}

/** Fio de urdidura (0 = esquerda) atravessado no i-ésimo cruzamento. */
export function warpIndexAt(direction: 1 | -1, i: number, warpCount: number): number {
  return direction === 1 ? i : warpCount - 1 - i;
}

/** Cruzamento no fio de urdidura `w`, ou null se ainda não atravessado. */
export function crossingAtWarp(row: { crossings: Crossing[]; direction: 1 | -1 }, w: number, warpCount: number): Crossing | null {
  const i = row.direction === 1 ? w : warpCount - 1 - w;
  return i < row.crossings.length ? row.crossings[i] : null;
}

export function cloneScene(s: SceneState): SceneState {
  return structuredClone(s);
}

function clampInt(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, Math.round(Number.isFinite(v) ? v : a)));
}

// ---------- Serialização ----------

export interface SavedCreation {
  version: typeof STATE_VERSION;
  savedAt: string;
  title: string;
  seed: number;
  mode: ModeId;
  sceneState: SceneState;
}

export function serializeScene(app: AppState, title: string, includeNames: boolean): SavedCreation {
  const scene = cloneScene(app.sceneState);
  if (!includeNames) scene.names = {};
  scene.selection = null;
  return { version: STATE_VERSION, savedAt: new Date().toISOString(), title, seed: app.seed, mode: app.mode, sceneState: scene };
}

/** Valida uma criação vinda de armazenamento ou arquivo. Lança erro descritivo se inválida. */
export function validateScene(raw: unknown): SceneState {
  if (!raw || typeof raw !== 'object') throw new Error('Estado ausente.');
  const s = raw as SceneState;
  if (!Number.isInteger(s.warpCount) || s.warpCount < 8 || s.warpCount > 32) throw new Error('Número de fios de urdidura inválido.');
  if (!Array.isArray(s.fabric)) throw new Error('Tecido inválido.');
  for (const e of s.fabric) {
    if (e.kind === 'row') {
      if (!YARN_IDS.includes(e.yarnId)) throw new Error('Fio desconhecido.');
      if (!Array.isArray(e.crossings) || e.crossings.length !== s.warpCount) throw new Error('Fileira incompleta no tecido.');
      if (!e.crossings.every((c) => c === 'over' || c === 'under')) throw new Error('Cruzamento inválido.');
      if (e.direction !== 1 && e.direction !== -1) throw new Error('Direção inválida.');
      if (!(e.tension >= 0 && e.tension <= 1)) throw new Error('Tensão inválida.');
    } else if (e.kind === 'gap') {
      if (!(e.height > 0 && e.height < 2)) throw new Error('Trecho cortado inválido.');
    } else throw new Error('Entidade desconhecida.');
  }
  if (s.active) {
    if (s.active.crossings.length >= s.warpCount) throw new Error('Passada ativa inválida.');
  }
  if (!Array.isArray(s.ends)) throw new Error('Pontas inválidas.');
  if (!Number.isInteger(s.nextId) || s.nextId < 1) throw new Error('Contador inválido.');
  return cloneScene(s);
}
