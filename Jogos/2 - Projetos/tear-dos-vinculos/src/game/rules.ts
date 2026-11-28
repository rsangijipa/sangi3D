// Regras de domínio: comandos puros, idempotentes e validados.
// Cada comando recebe um SceneState e devolve um novo estado ou uma recusa descritiva.
import { YARN_IDS, patternCrossing, type Crossing, type PatternId, type ThicknessId } from './content.ts';
import {
  MAX_ROWS,
  cloneScene,
  createScene,
  entityHeight,
  lastRow,
  rowCount,
  type ActiveRow,
  type GapEntity,
  type LooseEnd,
  type RowEntity,
  type SceneState,
} from './state.ts';

export type Command =
  | { type: 'chooseYarn'; yarnId: string }
  | { type: 'chooseThickness'; thickness: ThicknessId }
  | { type: 'cross'; index: number; crossing: Crossing }
  | { type: 'unweave'; index: number }
  | { type: 'setTension'; target: 'active' | string; value: number }
  | { type: 'setAssist'; pattern: PatternId }
  | { type: 'fillRow' }
  | { type: 'secureEnd'; endId: string }
  | { type: 'tieKnot'; endId: string }
  | { type: 'selectRow'; rowId: string }
  | { type: 'clearSelection' }
  | { type: 'focusRow'; rowId: string | null }
  | { type: 'cutSelection'; fromId: string; toId: string; confirmed: boolean }
  | { type: 'reconnect'; gapId: string }
  | { type: 'setName'; yarnId: string; name: string }
  | { type: 'setShared'; shared: boolean }
  | { type: 'reset'; warpCount: number; confirmed: boolean };

export type DomainEvent =
  | { kind: 'none' }
  | { kind: 'yarnChosen'; yarnId: string }
  | { kind: 'thicknessChosen' }
  | { kind: 'rowStarted'; rowId: string }
  | { kind: 'crossed'; rowId: string; index: number; crossing: Crossing; warp: number }
  | { kind: 'rowCompleted'; rowId: string }
  | { kind: 'unwoven'; rowId: string; index: number; reopened: boolean }
  | { kind: 'tension'; target: string; value: number }
  | { kind: 'endSecured'; endId: string }
  | { kind: 'knotTied'; endId: string }
  | { kind: 'selection' }
  | { kind: 'cut'; gapId: string; removed: string[] }
  | { kind: 'reconnected'; gapId: string }
  | { kind: 'named' }
  | { kind: 'reset' }
  | { kind: 'assist' };

export type RejectCode =
  | 'invalid'
  | 'needConfirm'
  | 'noActive'
  | 'outOfOrder'
  | 'full'
  | 'notFound'
  | 'wrongState'
  | 'noSelection';

export type CommandResult =
  | { ok: true; state: SceneState; changed: boolean; event: DomainEvent }
  | { ok: false; code: RejectCode; reason: string };

const reject = (code: RejectCode, reason: string): CommandResult => ({ ok: false, code, reason });
const same = (state: SceneState): CommandResult => ({ ok: true, state, changed: false, event: { kind: 'none' } });
const done = (state: SceneState, event: DomainEvent): CommandResult => ({ ok: true, state, changed: true, event });

function newId(s: SceneState, prefix: string): string {
  const id = `${prefix}${s.nextId}`;
  s.nextId += 1;
  return id;
}

export function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0.5;
  return Math.max(0, Math.min(1, v));
}

/** Índice (contando só fileiras) da próxima passada; usado pelos padrões de apoio. */
export function nextRowNumber(s: SceneState): number {
  return rowCount(s);
}

export function suggestedCrossing(s: SceneState): Crossing | null {
  const idx = s.active ? s.active.crossings.length : 0;
  if (idx >= s.warpCount) return null;
  const dir = s.active ? s.active.direction : nextDirection(s);
  const warp = dir === 1 ? idx : s.warpCount - 1 - idx;
  return patternCrossing(s.assist === 'livre' ? 'tafeta' : s.assist, nextRowNumber(s), warp, s.warpCount);
}

export function nextDirection(s: SceneState): 1 | -1 {
  const prev = lastRow(s);
  return prev ? (prev.direction === 1 ? -1 : 1) : 1;
}

function startRow(s: SceneState): ActiveRow {
  const direction = nextDirection(s);
  const id = newId(s, 'r');
  const prev = lastRow(s);
  const row: ActiveRow = {
    id,
    yarnId: s.selectedYarn,
    thickness: s.thickness,
    crossings: [],
    direction,
    tension: s.tension,
    participant: s.shared ? s.turn : null,
  };
  // Troca de fio (ou primeira passada) deixa pontas soltas para prender e atar.
  if (!prev || prev.yarnId !== row.yarnId) {
    if (prev) {
      const prevSide = prev.direction === 1 ? 'right' : 'left';
      if (!s.ends.some((e) => e.rowId === prev.id && e.side === prevSide)) {
        s.ends.push({ id: newId(s, 'p'), rowId: prev.id, side: prevSide, state: 'solta', yarnId: prev.yarnId, originId: id });
      }
    }
    s.ends.push({ id: newId(s, 'p'), rowId: id, side: direction === 1 ? 'left' : 'right', state: 'solta', yarnId: row.yarnId, originId: id });
  }
  return row;
}

export function applyCommand(state: SceneState, cmd: Command): CommandResult {
  switch (cmd.type) {
    case 'chooseYarn': {
      if (!YARN_IDS.includes(cmd.yarnId)) return reject('invalid', 'Fio desconhecido.');
      if (state.selectedYarn === cmd.yarnId) return same(state);
      const s = cloneScene(state);
      s.selectedYarn = cmd.yarnId;
      return done(s, { kind: 'yarnChosen', yarnId: cmd.yarnId });
    }
    case 'chooseThickness': {
      if (!['fina', 'media', 'grossa'].includes(cmd.thickness)) return reject('invalid', 'Espessura desconhecida.');
      if (state.thickness === cmd.thickness) return same(state);
      const s = cloneScene(state);
      s.thickness = cmd.thickness;
      return done(s, { kind: 'thicknessChosen' });
    }
    case 'cross': {
      if (cmd.crossing !== 'over' && cmd.crossing !== 'under') return reject('invalid', 'Cruzamento inválido.');
      const len = state.active ? state.active.crossings.length : 0;
      // Idempotência: repetir o mesmo cruzamento já registrado não duplica.
      if (state.active && cmd.index < len) {
        return state.active.crossings[cmd.index] === cmd.crossing ? same(state) : reject('outOfOrder', 'Este cruzamento já foi feito. Desfaça para mudar.');
      }
      if (cmd.index !== len) return reject('outOfOrder', 'Os cruzamentos seguem a ordem da lançadeira.');
      if (!state.active && rowCount(state) >= MAX_ROWS) return reject('full', 'O tear está cheio. Separe um trecho ou comece outro tecido.');
      const s = cloneScene(state);
      let started = false;
      if (!s.active) { s.active = startRow(s); started = true; }
      const a = s.active!;
      a.crossings.push(cmd.crossing);
      const warp = a.direction === 1 ? cmd.index : s.warpCount - 1 - cmd.index;
      if (a.crossings.length === s.warpCount) {
        const row: RowEntity = { kind: 'row', ...a, crossings: [...a.crossings] };
        s.fabric.push(row);
        s.active = null;
        if (s.shared) s.turn = s.turn === 'A' ? 'B' : 'A';
        return done(s, { kind: 'rowCompleted', rowId: row.id });
      }
      if (started) return { ok: true, state: s, changed: true, event: { kind: 'crossed', rowId: a.id, index: cmd.index, crossing: cmd.crossing, warp } };
      return done(s, { kind: 'crossed', rowId: a.id, index: cmd.index, crossing: cmd.crossing, warp });
    }
    case 'unweave': {
      const s = cloneScene(state);
      let reopened = false;
      if (!s.active) {
        // Reabre a última fileira completa, se o topo do tecido for uma fileira.
        const top = s.fabric[s.fabric.length - 1];
        if (!top || top.kind !== 'row') return reject('noActive', 'Não há cruzamentos para desfazer aqui.');
        if (cmd.index !== s.warpCount - 1) return reject('outOfOrder', 'Desfaça a partir do último cruzamento.');
        s.fabric.pop();
        const { kind: _k, ...rest } = top;
        void _k;
        s.active = { ...rest, crossings: [...top.crossings] };
        if (s.shared) s.turn = s.turn === 'A' ? 'B' : 'A';
        reopened = true;
      } else if (cmd.index !== s.active.crossings.length - 1) {
        return cmd.index >= s.active.crossings.length ? same(state) : reject('outOfOrder', 'Desfaça a partir do último cruzamento.');
      }
      const a = s.active!;
      a.crossings.pop();
      const rowId = a.id;
      if (a.crossings.length === 0) {
        s.ends = s.ends.filter((e) => e.originId !== a.id);
        s.active = null;
      }
      return done(s, { kind: 'unwoven', rowId, index: cmd.index, reopened });
    }
    case 'setTension': {
      const v = clamp01(cmd.value);
      const s = cloneScene(state);
      if (cmd.target === 'active') {
        if (Math.abs(s.tension - v) < 1e-6 && (!s.active || Math.abs(s.active.tension - v) < 1e-6)) return same(state);
        s.tension = v;
        if (s.active) s.active.tension = v;
      } else {
        const row = s.fabric.find((e): e is RowEntity => e.kind === 'row' && e.id === cmd.target);
        if (!row) return reject('notFound', 'Fileira não encontrada.');
        if (Math.abs(row.tension - v) < 1e-6) return same(state);
        row.tension = v;
      }
      return done(s, { kind: 'tension', target: cmd.target, value: v });
    }
    case 'setAssist': {
      if (state.assist === cmd.pattern) return same(state);
      const s = cloneScene(state);
      s.assist = cmd.pattern;
      return done(s, { kind: 'assist' });
    }
    case 'fillRow': {
      if (state.assist === 'livre') return reject('wrongState', 'Escolha um padrão de apoio para completar a passada.');
      let s = state;
      let last: CommandResult = same(state);
      for (let guard = 0; guard < 64; guard++) {
        const c = suggestedCrossing(s);
        const idx = s.active ? s.active.crossings.length : 0;
        if (!c) break;
        last = applyCommand(s, { type: 'cross', index: idx, crossing: c });
        if (!last.ok) return last;
        s = last.state;
        if (last.event.kind === 'rowCompleted') break;
      }
      return last;
    }
    case 'secureEnd': {
      const end = state.ends.find((e) => e.id === cmd.endId);
      if (!end) return reject('notFound', 'Ponta não encontrada.');
      if (end.state !== 'solta') return same(state);
      const s = cloneScene(state);
      s.ends.find((e) => e.id === cmd.endId)!.state = 'presa';
      return done(s, { kind: 'endSecured', endId: cmd.endId });
    }
    case 'tieKnot': {
      const end = state.ends.find((e) => e.id === cmd.endId);
      if (!end) return reject('notFound', 'Ponta não encontrada.');
      if (end.state === 'atada') return same(state);
      if (end.state !== 'presa') return reject('wrongState', 'Prenda a ponta antes de dar o nó.');
      const s = cloneScene(state);
      s.ends.find((e) => e.id === cmd.endId)!.state = 'atada';
      return done(s, { kind: 'knotTied', endId: cmd.endId });
    }
    case 'selectRow': {
      const row = state.fabric.find((e) => e.kind === 'row' && e.id === cmd.rowId);
      if (!row) return reject('notFound', 'Fileira não encontrada.');
      const s = cloneScene(state);
      if (!s.selection || s.selection.toId !== null) s.selection = { fromId: cmd.rowId, toId: null };
      else s.selection.toId = cmd.rowId;
      s.focusRowId = cmd.rowId;
      return done(s, { kind: 'selection' });
    }
    case 'clearSelection': {
      if (!state.selection && !state.focusRowId) return same(state);
      const s = cloneScene(state);
      s.selection = null;
      s.focusRowId = null;
      return done(s, { kind: 'selection' });
    }
    case 'focusRow': {
      if (cmd.rowId !== null && !state.fabric.some((e) => e.kind === 'row' && e.id === cmd.rowId)) return reject('notFound', 'Fileira não encontrada.');
      if (state.focusRowId === cmd.rowId) return same(state);
      const s = cloneScene(state);
      s.focusRowId = cmd.rowId;
      return done(s, { kind: 'selection' });
    }
    case 'cutSelection': {
      if (!cmd.confirmed) return reject('needConfirm', 'O corte precisa de confirmação.');
      const i0 = state.fabric.findIndex((e) => e.id === cmd.fromId);
      const i1 = state.fabric.findIndex((e) => e.id === cmd.toId);
      if (i0 < 0 || i1 < 0) return reject('noSelection', 'Marque o trecho no tecido antes de cortar.');
      const a = Math.min(i0, i1);
      const b = Math.max(i0, i1);
      const s = cloneScene(state);
      const removed = s.fabric.slice(a, b + 1);
      const removedRows = removed.filter((e): e is RowEntity => e.kind === 'row').map((e) => e.id);
      const priorGaps = removed.filter((e): e is GapEntity => e.kind === 'gap');
      let height = 0;
      for (const e of removed) height += entityHeight(e);
      const gap: GapEntity = {
        kind: 'gap',
        id: newId(s, 'g'),
        height,
        removedRowIds: [...priorGaps.flatMap((g) => g.removedRowIds), ...removedRows],
      };
      s.fabric.splice(a, b - a + 1, gap);
      const removedSet = new Set(removedRows);
      const removedGapSet = new Set(priorGaps.map((g) => g.id));
      s.ends = s.ends.filter((e) => !removedSet.has(e.rowId) && !removedGapSet.has(e.originId));
      // Pontas soltas nos dois lados do corte.
      const below = s.fabric[a - 1];
      const above = s.fabric[a + 1];
      const addEnd = (row: RowEntity | undefined) => {
        if (!row || row.kind !== 'row') return;
        const ends: LooseEnd = { id: newId(s, 'p'), rowId: row.id, side: 'left', state: 'solta', yarnId: row.yarnId, originId: gap.id };
        s.ends.push(ends);
      };
      addEnd(below?.kind === 'row' ? below : undefined);
      addEnd(above?.kind === 'row' ? above : undefined);
      s.selection = null;
      s.focusRowId = null;
      return done(s, { kind: 'cut', gapId: gap.id, removed: gap.removedRowIds });
    }
    case 'reconnect': {
      const idx = state.fabric.findIndex((e) => e.kind === 'gap' && e.id === cmd.gapId);
      if (idx < 0) return reject('notFound', 'Não há trecho cortado para reconectar.');
      const s = cloneScene(state);
      s.fabric.splice(idx, 1);
      for (const e of s.ends) if (e.originId === cmd.gapId) e.state = 'atada';
      return done(s, { kind: 'reconnected', gapId: cmd.gapId });
    }
    case 'setName': {
      if (!YARN_IDS.includes(cmd.yarnId)) return reject('invalid', 'Fio desconhecido.');
      const name = cmd.name.trim().slice(0, 32);
      if ((state.names[cmd.yarnId] ?? '') === name) return same(state);
      const s = cloneScene(state);
      if (name) s.names[cmd.yarnId] = name;
      else delete s.names[cmd.yarnId];
      return done(s, { kind: 'named' });
    }
    case 'setShared': {
      if (state.shared === cmd.shared) return same(state);
      const s = cloneScene(state);
      s.shared = cmd.shared;
      s.turn = 'A';
      return done(s, { kind: 'none' });
    }
    case 'reset': {
      if (!cmd.confirmed) return reject('needConfirm', 'Recomeçar apaga o tecido atual. Confirme para continuar.');
      const s = createScene(cmd.warpCount, {
        selectedYarn: state.selectedYarn,
        thickness: state.thickness,
        tension: state.tension,
        assist: state.assist,
        names: { ...state.names },
        shared: state.shared,
      });
      return done(s, { kind: 'reset' });
    }
    default:
      return reject('invalid', 'Comando desconhecido.');
  }
}

/** Primeira ponta em um dado estado, útil para botões contextuais. */
export function firstEnd(s: SceneState, st: LooseEnd['state']): LooseEnd | undefined {
  return s.ends.find((e) => e.state === st);
}

/** Lacunas (trechos cortados) ainda abertas. */
export function openGaps(s: SceneState): GapEntity[] {
  return s.fabric.filter((e): e is GapEntity => e.kind === 'gap');
}
