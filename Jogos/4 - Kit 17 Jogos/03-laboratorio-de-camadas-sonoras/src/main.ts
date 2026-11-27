/**
 * Laboratório de Camadas Sonoras — Ponto de Entrada Principal
 * Inicialização e ligação entre FSM, Cena 3D, Áudio Sintetizado, HUD e Teclado
 */

import { createInitialState, gameReducer, GameState, GameAction, ChannelId } from './game/state';
import { calculateAllEffectiveGains } from './game/rules';
import { GameScene } from './scene/gameScene';
import { SoundLayersEngine } from './audio/soundLayers';
import { GameHUD } from './ui/hud';
import { InputController } from './input/controller';
import './style.css';

class LaboratorioCamadasSonorasApp {
  private state: GameState;
  private scene: GameScene;
  private audio: SoundLayersEngine;
  private hud: GameHUD;
  private input: InputController;
  private tickIntervalId: number = 0;

  constructor() {
    // 1. Estado inicial puro
    this.state = createInitialState();

    // 2. Elementos de contêiner DOM
    const appEl = document.getElementById('app') || document.body;
    let canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer) {
      canvasContainer = document.createElement('div');
      canvasContainer.id = 'canvas-container';
      appEl.appendChild(canvasContainer);
    }

    let hudContainer = document.getElementById('hud-container');
    if (!hudContainer) {
      hudContainer = document.createElement('div');
      hudContainer.id = 'hud-container';
      appEl.appendChild(hudContainer);
    }

    // 3. Motor de Áudio Web Audio API (começa silencioso)
    this.audio = new SoundLayersEngine();

    // 4. Cena Three.js (Câmera 40°, iluminação motivada, faders e redomas)
    this.scene = new GameScene(canvasContainer, {
      onFaderDrag: (chId, level) => this.handleFaderDrag(chId, level),
      onSoloClick: (chId) => this.handleSoloToggle(chId),
      onClocheClick: (chId) => this.handleClocheClick(chId)
    });

    // 5. Interface HUD DOM
    this.hud = new GameHUD(hudContainer, {
      onDispatch: (action) => this.dispatch(action),
      onSliderChange: (chId, level) => this.handleSliderChange(chId, level),
      onSoloToggle: (chId) => this.handleSoloToggle(chId),
      onMuteAllToggle: () => this.handleMuteAllToggle(),
      onIsolateToggle: () => this.handleIsolateToggle(),
      onStartAudio: () => this.handleStartAudio()
    });

    // 6. Controlador de Entrada de Teclado
    this.input = new InputController({
      dispatch: (action) => this.dispatch(action),
      getState: () => this.state,
      onSoloToggle: (chId) => this.handleSoloToggle(chId),
      onMuteToggle: () => this.handleMuteAllToggle(),
      onStartAudio: () => this.handleStartAudio()
    });

    // 7. Intervalo de contagem de tempo ativo
    this.tickIntervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.dispatch({ type: 'TICK_TIME', payload: 1 });
      }
    }, 1000);

    // Sincronização inicial
    this.scene.syncWithState(this.state);
    this.hud.render(this.state);
  }

  public dispatch(action: GameAction): void {
    this.state = gameReducer(this.state, action);

    // Se for apenas o tick de tempo sem modal aberto, não re-renderiza o DOM inteiro
    if (action.type === 'TICK_TIME') {
      if (this.state.activeModal !== null) {
        this.hud.render(this.state);
      }
      return;
    }

    // Sincronizar ganhos de áudio reais
    if (this.state.audioStarted) {
      const gains = calculateAllEffectiveGains(this.state);
      this.audio.syncGains(gains);
      this.audio.setMasterMute(this.state.masterMute);
    }

    // Sincronizar cena 3D e HUD
    this.scene.syncWithState(this.state);
    this.hud.render(this.state);
  }

  private handleStartAudio(): void {
    this.audio.init();
    this.audio.ensureRunning();
    this.dispatch({ type: 'START_AUDIO' });
    this.audio.playClick();
  }

  private handleFaderDrag(chId: ChannelId, level: number): void {
    this.dispatch({
      type: 'SET_CHANNEL_LEVEL',
      payload: { id: chId, level }
    });
  }

  private handleSliderChange(chId: ChannelId, level: number): void {
    this.dispatch({
      type: 'SET_CHANNEL_LEVEL',
      payload: { id: chId, level }
    });
  }

  private handleSoloToggle(chId: ChannelId): void {
    this.audio.playClick();
    this.dispatch({ type: 'TOGGLE_SOLO', payload: chId });
  }

  private handleClocheClick(chId: ChannelId): void {
    this.audio.playClick();
    // Se estiver em modo de desafio, checa resposta
    if (this.state.step === 'challenge' && this.state.targetId) {
      this.dispatch({ type: 'CHECK_CHALLENGE_ANSWER', payload: chId });
    } else {
      // Foca canal e alterna solo
      this.dispatch({ type: 'SET_FOCUS_CHANNEL', payload: chId });
      this.dispatch({ type: 'TOGGLE_SOLO', payload: chId });
    }
  }

  private handleIsolateToggle(): void {
    this.audio.playClick();
    this.dispatch({ type: 'TOGGLE_SOLO', payload: this.state.focusedChannelId });
  }

  private handleMuteAllToggle(): void {
    this.audio.playClick();
    if (this.state.masterMute) {
      this.dispatch({ type: 'UNMUTE_ALL' });
    } else {
      this.dispatch({ type: 'MUTE_ALL' });
    }
  }

  public destroy(): void {
    clearInterval(this.tickIntervalId);
    this.input.dispose();
    this.scene.dispose();
    this.audio.dispose();
  }
}

// Inicializar quando o DOM estiver pronto
window.addEventListener('DOMContentLoaded', () => {
  const app = new LaboratorioCamadasSonorasApp();
  const handleDispose = () => app.destroy();
  window.addEventListener('sangi:dispose', handleDispose);
  window.addEventListener('beforeunload', handleDispose);
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'SANGI_APP_DISPOSE' || (e.data?.type === 'SANGI_COMMAND' && String(e.data?.command).toUpperCase() === 'DISPOSE')) {
      handleDispose();
    }
  });
});
