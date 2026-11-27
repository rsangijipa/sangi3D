/**
 * Porto das Decisões — Controlador de Entrada e Ações de Teclado
 * Atalhos acessíveis, navegação por teclado e mapeamento sem fio para a FSM
 */

import { GameAction, GameState } from '../game/state';
import { MISSIONS } from '../game/content';

export interface InputControllerCallbacks {
  dispatch: (action: GameAction) => void;
  onSimulate: () => void;
  onConfirmVoyage: () => void;
  onUndo: () => void;
  onToggleAudio: () => void;
  onNextNode?: () => void;
  getState: () => GameState;
}

export class InputController {
  private callbacks: InputControllerCallbacks;
  private isDestroyed: boolean = false;

  constructor(callbacks: InputControllerCallbacks) {
    this.callbacks = callbacks;
    this.bindKeyboard();
  }

  private bindKeyboard(): void {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (this.isDestroyed) return;

    // Se estiver digitando em um campo de texto ou input, ignorar atalhos globais
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      return;
    }

    const state = this.callbacks.getState();

    switch (e.key) {
      case 'Escape':
        if (state.activeModal) {
          this.callbacks.dispatch({ type: 'SET_MODAL', payload: null });
        }
        break;

      case 'Enter':
        e.preventDefault();
        if ((state.step === 'sim_ready' || state.step === 'simulating') && state.simResult?.canExecute && !state.isSimulating) {
          this.callbacks.onConfirmVoyage();
        } else if (!state.isSimulating && !state.isVoyaging) {
          this.callbacks.onSimulate();
        }
        break;

      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        if (!state.activeModal && !state.isSimulating && !state.isVoyaging) {
          if (this.callbacks.onNextNode) {
            this.callbacks.onNextNode();
          }
        }
        break;

      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        if (!state.activeModal && !state.isSimulating && !state.isVoyaging) {
          this.callbacks.onUndo();
        }
        break;

      case 's':
      case 'S':
        if (!state.activeModal && !state.isSimulating && !state.isVoyaging) {
          this.callbacks.onSimulate();
        }
        break;

      case 'u':
      case 'U':
      case 'Backspace':
        if (!state.activeModal && !state.isSimulating && !state.isVoyaging) {
          this.callbacks.onUndo();
        }
        break;

      case 'c':
      case 'C':
        // Alternar modal de carga
        this.callbacks.dispatch({
          type: 'SET_MODAL',
          payload: state.activeModal === 'cargo' ? null : 'cargo'
        });
        break;

      case 'b':
      case 'B': {
        // Ciclar barcos: blue -> green -> red
        const boatsOrder: Array<'blue' | 'green' | 'red'> = ['blue', 'green', 'red'];
        const nextIdx = (boatsOrder.indexOf(state.selectedBoatId) + 1) % boatsOrder.length;
        this.callbacks.dispatch({ type: 'SELECT_BOAT', payload: boatsOrder[nextIdx] });
        break;
      }

      case 'm':
      case 'M':
        this.callbacks.onToggleAudio();
        break;

      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6': {
        const mIndex = parseInt(e.key, 10) - 1;
        if (mIndex >= 0 && mIndex < MISSIONS.length) {
          this.callbacks.dispatch({ type: 'SET_MISSION', payload: MISSIONS[mIndex].id });
        }
        break;
      }
    }
  };

  public dispose(): void {
    this.isDestroyed = true;
    window.removeEventListener('keydown', this.handleKeyDown);
  }
}
