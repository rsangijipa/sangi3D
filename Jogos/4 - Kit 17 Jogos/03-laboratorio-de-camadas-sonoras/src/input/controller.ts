/**
 * Laboratório de Camadas Sonoras — Controlador de Teclado e Ações Acessíveis
 * Passo de fader de 5%, alternância de canais (1-5), solo (S), mute (M) e A/B
 */

import { ChannelId, GameAction, GameState } from '../game/state';
import { CHANNELS_CATALOG } from '../game/content';

export interface InputCallbacks {
  dispatch: (action: GameAction) => void;
  getState: () => GameState;
  onSoloToggle: (channelId: ChannelId) => void;
  onMuteToggle: () => void;
  onStartAudio: () => void;
}

export class InputController {
  private callbacks: InputCallbacks;
  private isDestroyed: boolean = false;

  constructor(callbacks: InputCallbacks) {
    this.callbacks = callbacks;
    this.bindKeyboard();
  }

  private bindKeyboard(): void {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (this.isDestroyed) return;

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

      case '1':
      case '2':
      case '3':
      case '4':
      case '5': {
        const idx = parseInt(e.key, 10) - 1;
        if (idx >= 0 && idx < CHANNELS_CATALOG.length) {
          const targetId = CHANNELS_CATALOG[idx].id;
          this.callbacks.dispatch({ type: 'SET_FOCUS_CHANNEL', payload: targetId });
        }
        break;
      }

      case 's':
      case 'S':
        this.callbacks.onSoloToggle(state.focusedChannelId);
        break;

      case 'm':
      case 'M':
        this.callbacks.onMuteToggle();
        break;

      case 'ArrowUp':
      case 'ArrowRight': {
        e.preventDefault();
        const currentCh = state.channels.find(c => c.id === state.focusedChannelId);
        if (currentCh) {
          const newLevel = Math.min(1.0, currentCh.level + 0.05);
          this.callbacks.dispatch({
            type: 'SET_CHANNEL_LEVEL',
            payload: { id: state.focusedChannelId, level: newLevel }
          });
        }
        break;
      }

      case 'ArrowDown':
      case 'ArrowLeft': {
        e.preventDefault();
        const currentCh = state.channels.find(c => c.id === state.focusedChannelId);
        if (currentCh) {
          const newLevel = Math.max(0.0, currentCh.level - 0.05);
          this.callbacks.dispatch({
            type: 'SET_CHANNEL_LEVEL',
            payload: { id: state.focusedChannelId, level: newLevel }
          });
        }
        break;
      }

      case 'a':
      case 'A':
        this.callbacks.dispatch({ type: 'LOAD_MIX_SNAPSHOT', payload: 'A' });
        break;

      case 'b':
      case 'B':
        this.callbacks.dispatch({ type: 'LOAD_MIX_SNAPSHOT', payload: 'B' });
        break;

      case ' ':
        e.preventDefault();
        if (!state.audioStarted) {
          this.callbacks.onStartAudio();
        } else {
          this.callbacks.onMuteToggle();
        }
        break;
    }
  };

  public dispose(): void {
    this.isDestroyed = true;
    window.removeEventListener('keydown', this.handleKeyDown);
  }
}
