// Store único: aplica comandos, mantém histórico (undo/redo) e notifica ouvintes.
import { applyCommand, type Command, type CommandResult, type DomainEvent } from './rules.ts';
import { cloneScene, createAppState, type AppState, type Observation, type ObservationResult, type SceneState } from './state.ts';

const HISTORY_LIMIT = 240;

export type StoreListener = (app: AppState, event: DomainEvent | { kind: 'history'; dir: 'undo' | 'redo' } | { kind: 'meta' }) => void;

/** Comandos que não entram no histórico de desfazer (seleção, nomes de etiqueta). */
const TRANSIENT = new Set<Command['type']>(['selectRow', 'clearSelection', 'focusRow']);

export class Store {
  app: AppState;
  private listeners = new Set<StoreListener>();
  private startedAt = Date.now();

  constructor(app: AppState = createAppState()) {
    this.app = app;
  }

  get scene(): SceneState {
    return this.app.sceneState;
  }

  subscribe(fn: StoreListener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit(e: Parameters<StoreListener>[1]): void {
    for (const fn of this.listeners) {
      // Uma falha de apresentação não pode corromper o estado nem bloquear outros ouvintes.
      try { fn(this.app, e); } catch (err) { console.error('Falha ao atualizar a apresentação:', err); }
    }
  }

  dispatch(cmd: Command): CommandResult {
    const res = applyCommand(this.app.sceneState, cmd);
    if (!res.ok || !res.changed) return res;
    if (!TRANSIENT.has(cmd.type)) {
      this.app.history.past.push(this.app.sceneState);
      if (this.app.history.past.length > HISTORY_LIMIT) this.app.history.past.shift();
      this.app.history.future = [];
    }
    this.app.sceneState = res.state;
    this.emit(res.event);
    return res;
  }

  canUndo(): boolean { return this.app.history.past.length > 0; }
  canRedo(): boolean { return this.app.history.future.length > 0; }

  undo(): boolean {
    const prev = this.app.history.past.pop();
    if (!prev) return false;
    this.app.history.future.push(this.app.sceneState);
    this.app.sceneState = prev;
    this.emit({ kind: 'history', dir: 'undo' });
    return true;
  }

  redo(): boolean {
    const next = this.app.history.future.pop();
    if (!next) return false;
    this.app.history.past.push(this.app.sceneState);
    this.app.sceneState = next;
    this.emit({ kind: 'history', dir: 'redo' });
    return true;
  }

  /** Substitui a cena inteira (carregar criação, replay). Mantém histórico se `keepHistory`. */
  replaceScene(s: SceneState, keepHistory = false): void {
    if (keepHistory) {
      this.app.history.past.push(this.app.sceneState);
      this.app.history.future = [];
    } else {
      this.app.history = { past: [], future: [] };
    }
    this.app.sceneState = cloneScene(s);
    this.emit({ kind: 'history', dir: 'redo' });
  }

  /** Mudanças de modo, fase, ferramenta ou ajustes: não alteram o tecido. */
  patch(p: Partial<Pick<AppState, 'mode' | 'phase' | 'tool' | 'paused'>> & { settings?: Partial<AppState['settings']> }): void {
    const { settings, ...rest } = p;
    Object.assign(this.app, rest);
    if (settings) this.app.settings = { ...this.app.settings, ...settings };
    this.emit({ kind: 'meta' });
  }

  observe(step: string, result: ObservationResult, opportunity: number): Observation {
    const o: Observation = {
      id: `o${this.app.observations.length + 1}`,
      t: Math.round((Date.now() - this.startedAt) / 1000),
      opportunity,
      step,
      result,
    };
    this.app.observations.push(o);
    this.emit({ kind: 'meta' });
    return o;
  }

  removeObservation(id: string): void {
    this.app.observations = this.app.observations.filter((o) => o.id !== id);
    this.emit({ kind: 'meta' });
  }

  /** Sequência de estados desde o início, para revisão/replay. */
  timeline(): SceneState[] {
    return [...this.app.history.past, this.app.sceneState];
  }
}
