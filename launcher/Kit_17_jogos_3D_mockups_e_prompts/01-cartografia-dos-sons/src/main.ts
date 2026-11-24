// src/main.ts
// Ponto de entrada da aplicação, orquestração e despacho de eventos versionados
import './ui/styles.css';
import { createInitialState, gameReducer, GameAction, GameState, GameTool, GameStep, ComparisonChoice, GameMode } from './game/state';
import { GameScene } from './scene/gameScene';
import { SoundEngine } from './audio/soundEngine';
import { KeyboardController } from './input/keyboardController';
import { Hud } from './ui/hud';
import { evaluateDistanceComparison, Vec3 } from './game/rules';

class App {
  private state: GameState;
  private scene: GameScene;
  private soundEngine: SoundEngine;
  private keyboard: KeyboardController;
  private hud: Hud;
  private timerId: number | null = null;
  private hasAudioGesture = false;

  constructor() {
    this.state = createInitialState();

    const viewportEl = document.getElementById('scene-viewport') as HTMLElement;
    const overlayEl = document.getElementById('ui-overlay') as HTMLElement;

    // 1. Motor de Áudio Espacial
    this.soundEngine = new SoundEngine();

    // 2. Cena 3D
    this.scene = new GameScene(viewportEl, {
      onSelectSource: (sid) => {
        this.ensureAudioUnlocked();
        this.dispatch({ type: 'SELECT_SOURCE', sourceId: sid });
      },
      onMoveBus: (pos) => {
        this.ensureAudioUnlocked();
        this.dispatch({ type: 'MOVE_BUS', position: pos });
      },
      onMoveListener: (pos) => {
        this.ensureAudioUnlocked();
        this.dispatch({ type: 'MOVE_LISTENER', position: pos });
      }
    });

    // 3. Interface DOM
    this.hud = new Hud(overlayEl, {
      onSelectTool: (tool: GameTool) => this.dispatch({ type: 'SELECT_TOOL', tool }),
      onSetStep: (step: GameStep) => this.dispatch({ type: 'SET_STEP', step }),
      onSelectSource: (sourceId: string) => {
        this.ensureAudioUnlocked();
        this.dispatch({ type: 'SELECT_SOURCE', sourceId });
      },
      onTogglePlay: async (sourceId: string) => {
        await this.ensureAudioUnlocked();
        this.dispatch({ type: 'TOGGLE_PLAY_SOURCE', sourceId });
      },
      onToggleGlobalMute: async () => {
        await this.ensureAudioUnlocked();
        this.dispatch({ type: 'TOGGLE_MUTE_GLOBAL' });
      },
      onSetSourceVolume: (sourceId: string, gain: number) =>
        this.dispatch({ type: 'SET_SOURCE_VOLUME', sourceId, gain }),
      onCompareSelectA: (sourceId: string) => this.dispatch({ type: 'SET_COMPARE_SOURCE_A', sourceId }),
      onCompareSelectB: (sourceId: string) => this.dispatch({ type: 'SET_COMPARE_SOURCE_B', sourceId }),
      onComparePlaySide: async (side: 'A' | 'B' | null) => {
        await this.ensureAudioUnlocked();
        this.dispatch({ type: 'PLAY_COMPARE_SIDE', side });
      },
      onCompareSubmitChoice: (choice: ComparisonChoice) => {
        const sourceA = this.state.sources.find((s) => s.id === this.state.comparison.sourceAId);
        const sourceB = this.state.sources.find((s) => s.id === this.state.comparison.sourceBId);
        if (sourceA && sourceB) {
          const evalRes = evaluateDistanceComparison(sourceA.position, sourceB.position, this.state.listenerPos);
          this.dispatch({ type: 'SUBMIT_COMPARE_CHOICE', choice, evaluated: evalRes.relationship });
        }
      },
      onToggleComposition: async (sourceId: string) => {
        await this.ensureAudioUnlocked();
        this.dispatch({ type: 'TOGGLE_COMPOSITION_SOURCE', sourceId });
      },
      onRequestHint: () => this.dispatch({ type: 'REQUEST_HINT' }),
      onSelectMode: (mode: GameMode) => this.dispatch({ type: 'SET_MODE', mode }),
      onNudgeActive: (dx: number, dz: number) => {
        this.ensureAudioUnlocked();
        if (this.state.activeTool === 'move') {
          const p = this.state.busPos;
          this.dispatch({ type: 'MOVE_BUS', position: [p[0] + dx, p[1], p[2] + dz] });
        } else {
          const p = this.state.listenerPos;
          this.dispatch({ type: 'MOVE_LISTENER', position: [p[0] + dx, p[1], p[2] + dz] });
        }
      },
      onOpenReview: () => {
        this.dispatch({ type: 'COMPLETE_EXPERIENCE' });
        this.emitHostEvent('complete', {
          version: this.state.version,
          durationSeconds: this.state.observations.durationSeconds
        });
      },
      onReset: () => {
        this.dispatch({ type: 'RESET_EXPERIENCE' });
        this.emitHostEvent('resume', { reset: true });
      },
      onExportJson: () => this.exportSummaryJson()
    });

    // 4. Controlador de Teclado (WCAG 2.1 AA)
    this.keyboard = new KeyboardController({
      onMoveToken: (dx, dz) => {
        this.ensureAudioUnlocked();
        if (this.state.activeTool === 'move') {
          const currentPos = this.state.busPos;
          const targetPos: Vec3 = [currentPos[0] + dx, currentPos[1], currentPos[2] + dz];
          this.dispatch({ type: 'MOVE_BUS', position: targetPos });
        } else {
          const currentPos = this.state.listenerPos;
          const targetPos: Vec3 = [currentPos[0] + dx, currentPos[1], currentPos[2] + dz];
          this.dispatch({ type: 'MOVE_LISTENER', position: targetPos });
        }
      },
      onTogglePlay: async () => {
        await this.ensureAudioUnlocked();
        this.dispatch({ type: 'TOGGLE_PLAY_SOURCE', sourceId: this.state.selectedSourceId });
      },
      onToggleMute: async () => {
        await this.ensureAudioUnlocked();
        this.dispatch({ type: 'TOGGLE_MUTE_GLOBAL' });
      },
      onSelectTool: (toolIndex) => {
        const tools: GameTool[] = ['listen', 'move', 'compare'];
        this.dispatch({ type: 'SELECT_TOOL', tool: tools[toolIndex - 1] });
      },
      onNextStep: () => {
        if (this.state.step < 5) {
          this.dispatch({ type: 'SET_STEP', step: (this.state.step + 1) as GameStep });
        }
      },
      onPrevStep: () => {
        if (this.state.step > 1) {
          this.dispatch({ type: 'SET_STEP', step: (this.state.step - 1) as GameStep });
        }
      },
      onTogglePause: () => {
        this.dispatch({ type: 'TOGGLE_PAUSE' });
        this.emitHostEvent(this.state.isPaused ? 'pause' : 'resume', {});
      }
    });

    // 5. Ciclo de tempo de sessão
    this.timerId = window.setInterval(() => {
      if (!this.state.isPaused) {
        this.dispatch({ type: 'TICK_TIME', deltaSeconds: 1 });
      }
    }, 1000);

    // 6. Gerenciamento de Visibilidade da Aba (Pausa quando oculta)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.dispatch({ type: 'SET_PAUSED', paused: true });
        this.soundEngine.setGlobalMute(true);
        this.emitHostEvent('pause', { reason: 'visibility_hidden' });
      } else {
        this.dispatch({ type: 'SET_PAUSED', paused: false });
        this.soundEngine.setGlobalMute(this.state.globalMuted);
        this.emitHostEvent('resume', { reason: 'visibility_visible' });
      }
    });

    // 7. Ouvinte de mensagens do host
    window.addEventListener('message', (event) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.action === 'pause') {
        this.dispatch({ type: 'SET_PAUSED', paused: true });
        this.soundEngine.setGlobalMute(true);
      } else if (data.action === 'resume') {
        this.dispatch({ type: 'SET_PAUSED', paused: false });
        this.soundEngine.setGlobalMute(this.state.globalMuted);
      } else if (data.action === 'reset') {
        this.dispatch({ type: 'RESET_EXPERIENCE' });
      }
    });

    // 8. Notificar evento 'ready' versionado
    this.emitHostEvent('ready', { version: this.state.version, step: this.state.step });

    // Render inicial
    this.updateAll();
  }

  private async ensureAudioUnlocked() {
    if (!this.hasAudioGesture) {
      this.hasAudioGesture = true;
      await this.soundEngine.unlock();
      this.dispatch({ type: 'UNLOCK_AUDIO' });
    }
  }

  private dispatch(action: GameAction) {
    const prevState = this.state;
    this.state = gameReducer(this.state, action);
    this.syncAudio(prevState, this.state);
    this.updateAll();
  }

  private syncAudio(prev: GameState, next: GameState) {
    // 1. Mute global
    if (prev.globalMuted !== next.globalMuted) {
      this.soundEngine.setGlobalMute(next.globalMuted);
    }

    // 2. Ouvinte
    if (
      prev.listenerPos[0] !== next.listenerPos[0] ||
      prev.listenerPos[2] !== next.listenerPos[2]
    ) {
      this.soundEngine.updateListenerPosition(next.listenerPos);
    }

    // 3. Fontes sonoras: separa mudanças de reprodução e mudanças de posição
    for (const source of next.sources) {
      const prevSource = prev.sources.find((s) => s.id === source.id);
      const isPlayingChanged = !prevSource || prevSource.isPlaying !== source.isPlaying;
      const isPosChanged =
        !prevSource ||
        prevSource.position[0] !== source.position[0] ||
        prevSource.position[2] !== source.position[2];

      if (isPosChanged) {
        this.soundEngine.updateSourcePosition(source.id, source.position);
      }

      if (isPlayingChanged) {
        this.soundEngine.setSourcePlaying(source.id, source.isPlaying, source.position, source.gain);
      }
    }
  }

  private updateAll() {
    this.scene.updateFromState(this.state);
    this.hud.render(this.state);
  }

  private exportSummaryJson() {
    const summaryData = {
      gameId: '01-cartografia-dos-sons',
      timestamp: new Date().toISOString(),
      durationSeconds: Math.round(this.state.observations.durationSeconds),
      exploredSourcesCount: this.state.observations.exploredSourcesCount,
      comparisonsCount: this.state.observations.comparisonsCount,
      hintsCount: this.state.observations.hintsCount,
      compositionSources: this.state.compositionSourceIds,
      notes: this.state.observations.notes
    };

    const blob = new Blob([JSON.stringify(summaryData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cartografia-dos-sons-resumo-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.emitHostEvent('summary', summaryData);
  }

  private emitHostEvent(eventName: string, data: Record<string, unknown>) {
    window.parent.postMessage(
      {
        source: 'cartografia-dos-sons',
        event: eventName,
        payload: data
      },
      '*'
    );
  }

  public dispose() {
    if (this.timerId !== null) clearInterval(this.timerId);
    this.keyboard.dispose();
    this.soundEngine.dispose();
    this.scene.dispose();
    this.emitHostEvent('exit', {});
  }
}

// Inicializar aplicação
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
