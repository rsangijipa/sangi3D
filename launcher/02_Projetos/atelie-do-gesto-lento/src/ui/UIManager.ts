import { ToolType, ScopeType, GuidedStepContent, GuidedState } from '../types';
import { PointerController } from '../interaction/PointerController';
import { ClaySolver } from '../clay/ClaySolver';
import { ClayGeometry } from '../clay/ClayGeometry';
import { ClayHistory } from '../clay/ClayHistory';
import { WorkshopScene } from '../scene/WorkshopScene';
import { MaterialAudio } from '../audio/MaterialAudio';
import { GuidedSession } from '../guided/GuidedSession';
import { SessionStore } from '../session/SessionStore';

export class UIManager {
  private scene: WorkshopScene;
  private solver: ClaySolver;
  private geometry: ClayGeometry;
  private history: ClayHistory;
  private pointerCtrl: PointerController;
  private audio: MaterialAudio;
  private guided: GuidedSession;
  private store: SessionStore;

  private toastTimeout: number | null = null;

  constructor(
    scene: WorkshopScene,
    solver: ClaySolver,
    geometry: ClayGeometry,
    history: ClayHistory,
    pointerCtrl: PointerController,
    audio: MaterialAudio,
    guided: GuidedSession,
    store: SessionStore
  ) {
    this.scene = scene;
    this.solver = solver;
    this.geometry = geometry;
    this.history = history;
    this.pointerCtrl = pointerCtrl;
    this.audio = audio;
    this.guided = guided;
    this.store = store;

    this.bindEvents();
    this.updateUndoRedoButtons();
  }

  private bindEvents(): void {
    // 1. Tool Selection
    document.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.getAttribute('data-tool') as ToolType;
        this.selectTool(tool);
      });
    });

    // 2. Undo / Redo
    document.getElementById('btn-undo')?.addEventListener('click', () => this.handleUndo());
    document.getElementById('btn-redo')?.addEventListener('click', () => this.handleRedo());

    // 3. Audio Master Toggle
    document.getElementById('btn-audio-toggle')?.addEventListener('click', () => {
      const active = this.audio.toggle();
      const label = document.getElementById('audio-label');
      if (label) label.textContent = active ? 'Som ativado' : 'Som desligado';
      this.showToast(active ? 'Sons da argila ativados' : 'Sons desligados');
    });

    // 4. Volume Slider
    const volSlider = document.getElementById('slider-volume') as HTMLInputElement | null;
    if (volSlider) {
      volSlider.addEventListener('input', e => {
        const val = parseFloat((e.target as HTMLInputElement).value) / 100;
        this.audio.setVolume(val);
      });
    }

    // 5. Camera Views
    document.querySelectorAll<HTMLButtonElement>('[data-cam]').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-cam');
        if (view) {
          this.scene.setCameraView(view);
          document.querySelectorAll('[data-cam]').forEach(b => b.classList.remove('active-view'));
          btn.classList.add('active-view');
        }
      });
    });

    // 6. Wheel Rotation Slider
    const wheelSlider = document.getElementById('slider-wheel') as HTMLInputElement | null;
    if (wheelSlider) {
      wheelSlider.addEventListener('input', e => {
        const angleDeg = parseFloat((e.target as HTMLInputElement).value);
        const rad = (angleDeg * Math.PI) / 180;
        this.solver.rotation = rad;
        this.scene.props.setWheelRotation(rad);
      });
    }

    // 7. Piece Height Slider
    const heightSlider = document.getElementById('slider-height') as HTMLInputElement | null;
    if (heightSlider) {
      heightSlider.addEventListener('input', e => {
        const newH = parseFloat((e.target as HTMLInputElement).value) / 100;
        this.solver.setHeight(newH);
        this.geometry.updatePositions(
          this.solver.radii,
          this.solver.thickness,
          this.solver.marks,
          this.solver.height
        );
        const valDisplay = document.getElementById('height-value');
        if (valDisplay) valDisplay.textContent = `${Math.round(newH * 100)} cm`;
      });
    }

    // 8. Scope Selector (Faixa inteira vs. Toque local)
    document.querySelectorAll<HTMLInputElement>('input[name="scope"]').forEach(radio => {
      radio.addEventListener('change', e => {
        this.pointerCtrl.activeScope = (e.target as HTMLInputElement).value as ScopeType;
      });
    });

    // 9. Brush Size & Sensitivity Sliders
    const brushSlider = document.getElementById('slider-brush') as HTMLInputElement | null;
    if (brushSlider) {
      brushSlider.addEventListener('input', e => {
        const val = parseFloat((e.target as HTMLInputElement).value);
        this.pointerCtrl.brushRadius = 0.012 + (val / 100) * (0.055 - 0.012);
      });
    }

    const sensSlider = document.getElementById('slider-sens') as HTMLInputElement | null;
    if (sensSlider) {
      sensSlider.addEventListener('input', e => {
        this.pointerCtrl.sensitivity = parseFloat((e.target as HTMLInputElement).value) / 100;
      });
    }

    // 10. Side Panel Toggle ("Seu gesto")
    const btnToggleSettings = document.getElementById('btn-toggle-settings');
    const settingsPanel = document.getElementById('settings-panel');
    btnToggleSettings?.addEventListener('click', () => {
      const isHidden = settingsPanel?.classList.contains('hidden');
      if (isHidden) {
        settingsPanel?.classList.remove('hidden');
        btnToggleSettings.setAttribute('aria-expanded', 'true');
      } else {
        settingsPanel?.classList.add('hidden');
        btnToggleSettings?.setAttribute('aria-expanded', 'false');
      }
    });

    // 11. Presets Selector
    document.querySelectorAll<HTMLButtonElement>('[data-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.getAttribute('data-preset') as 'bloco' | 'tigela' | 'vaso';
        this.solver.loadPreset(preset);
        this.geometry.updatePositions(
          this.solver.radii,
          this.solver.thickness,
          this.solver.marks,
          this.solver.height
        );
        this.history.clear();
        this.updateUndoRedoButtons();
        this.showToast(`Forma inicial: ${preset.charAt(0).toUpperCase() + preset.slice(1)}`);
      });
    });

    // 12. Guided Practice Setup & Triggers
    document.getElementById('btn-open-guided')?.addEventListener('click', () => {
      this.openModal('modal-guided-setup');
    });

    document.querySelectorAll<HTMLButtonElement>('[data-duration]').forEach(btn => {
      btn.addEventListener('click', () => {
        const duration = btn.getAttribute('data-duration') as 'brief' | 'timed' | 'timeless';
        this.closeModal('modal-guided-setup');
        this.guided.beginPractice(duration);
      });
    });

    document.getElementById('btn-pause-guided')?.addEventListener('click', () => {
      this.guided.pause();
    });

    document.getElementById('btn-resume-guided')?.addEventListener('click', () => {
      this.closeModal('modal-guided-pause');
      this.guided.resume();
    });

    document.getElementById('btn-exit-guided')?.addEventListener('click', () => {
      this.closeModal('modal-guided-pause');
      this.guided.exitToFreeMode();
    });

    // 13. Export PNG and JSON
    document.getElementById('btn-export-img')?.addEventListener('click', () => {
      const dataUrl = this.scene.exportImage(false);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `atelie_gesto_lento_${Date.now()}.png`;
      a.click();
      this.showToast('Imagem preparada para salvar');
    });

    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      const sessionData = this.buildSessionData();
      const url = this.store.exportJSON(sessionData);
      const a = document.createElement('a');
      a.href = url;
      a.download = `atelie_gesto_lento_${Date.now()}.json`;
      a.click();
      this.showToast('Arquivo editável exportado');
    });

    // 14. Keyboard Shortcuts
    window.addEventListener('keydown', e => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.target && (e.target as HTMLElement).tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          this.handleRedo();
        } else {
          this.handleUndo();
        }
      } else if (key === '1') {
        this.selectTool('modelar');
      } else if (key === '2') {
        this.selectTool('alisar');
      } else if (key === '3') {
        this.selectTool('marcar');
      } else if (key === 'escape') {
        this.closeAllModals();
      }
    });

    // 15. Precision Keyboard Adjustment Controls
    document.querySelectorAll<HTMLButtonElement>('[data-adjust-band]').forEach(btn => {
      btn.addEventListener('click', () => {
        const band = btn.getAttribute('data-adjust-band'); // 'base' | 'meio' | 'colo' | 'borda'
        const action = btn.getAttribute('data-adjust-action'); // 'expand' | 'narrow'
        this.applyPrecisionAdjustment(band, action);
      });
    });

    document.getElementById('btn-open-precision')?.addEventListener('click', () => {
      this.openModal('modal-precision');
    });

    // Guided State Listener
    this.guided.setCallbacks(
      (state, content) => this.renderGuidedState(state, content),
      () => this.highlightAdvancePrompt()
    );

    // Limit warning
    this.pointerCtrl.setCallbacks(
      () => this.updateUndoRedoButtons(),
      () => this.showToast('Aqui a argila já está bem fina. Experimente outra região.')
    );
  }

  public selectTool(tool: ToolType): void {
    this.pointerCtrl.activeTool = tool;
    document.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach(b => {
      if (b.getAttribute('data-tool') === tool) {
        b.classList.add('active-tool');
        b.setAttribute('aria-pressed', 'true');
      } else {
        b.classList.remove('active-tool');
        b.setAttribute('aria-pressed', 'false');
      }
    });

    const guidance = document.getElementById('tool-guidance');
    if (guidance) {
      if (tool === 'modelar') guidance.textContent = 'Abra ou estreite a forma no seu ritmo.';
      else if (tool === 'alisar') guidance.textContent = 'Passe pela superfície. Algumas marcas podem continuar.';
      else if (tool === 'marcar') guidance.textContent = 'Desenhe uma linha, um ponto ou um caminho.';
    }
  }

  public handleUndo(): void {
    const curSnap = {
      timestamp: Date.now(),
      height: this.solver.height,
      rotation: this.solver.rotation,
      radii: this.solver.radii,
      thickness: this.solver.thickness,
      marks: this.solver.marks
    };

    const prev = this.history.undo(curSnap);
    if (prev) {
      this.solver.restoreFromSnapshot(prev.radii, prev.thickness, prev.marks, prev.height, prev.rotation);
      this.geometry.updatePositions(this.solver.radii, this.solver.thickness, this.solver.marks, this.solver.height);
      this.updateUndoRedoButtons();
      this.showToast('Ação desfeita');
    }
  }

  public handleRedo(): void {
    const curSnap = {
      timestamp: Date.now(),
      height: this.solver.height,
      rotation: this.solver.rotation,
      radii: this.solver.radii,
      thickness: this.solver.thickness,
      marks: this.solver.marks
    };

    const next = this.history.redo(curSnap);
    if (next) {
      this.solver.restoreFromSnapshot(next.radii, next.thickness, next.marks, next.height, next.rotation);
      this.geometry.updatePositions(this.solver.radii, this.solver.thickness, this.solver.marks, this.solver.height);
      this.updateUndoRedoButtons();
      this.showToast('Ação refeita');
    }
  }

  public updateUndoRedoButtons(): void {
    const btnUndo = document.getElementById('btn-undo') as HTMLButtonElement | null;
    const btnRedo = document.getElementById('btn-redo') as HTMLButtonElement | null;

    if (btnUndo) btnUndo.disabled = !this.history.canUndo();
    if (btnRedo) btnRedo.disabled = !this.history.canRedo();
  }

  private renderGuidedState(state: GuidedState, content?: GuidedStepContent): void {
    const card = document.getElementById('guidance-card');
    const freeCard = document.getElementById('free-guidance');
    const pauseBtn = document.getElementById('btn-pause-guided');

    if (state === 'IDLE') {
      if (card) card.classList.add('hidden');
      if (freeCard) freeCard.classList.remove('hidden');
      if (pauseBtn) pauseBtn.classList.add('hidden');
      return;
    }

    if (state === 'PAUSED') {
      this.openModal('modal-guided-pause');
      return;
    }

    if (state === 'FINISHED') {
      this.openModal('modal-guided-finish');
      return;
    }

    // Active invitation step
    if (card && content) {
      card.classList.remove('hidden');
      if (freeCard) freeCard.classList.add('hidden');
      if (pauseBtn) pauseBtn.classList.remove('hidden');

      const stepBadge = document.getElementById('guided-step-badge');
      const stepTitle = document.getElementById('guided-step-title');
      const primaryText = document.getElementById('guided-primary-text');
      const auxText = document.getElementById('guided-aux-text');
      const btnPrimary = document.getElementById('btn-guided-primary');
      const btnSkip = document.getElementById('btn-guided-skip');

      if (stepBadge) stepBadge.textContent = `Convite ${content.step} de 5`;
      if (stepTitle) stepTitle.textContent = content.title;
      if (primaryText) primaryText.textContent = content.primaryText;
      if (auxText) auxText.textContent = content.auxiliaryText;

      if (btnPrimary) {
        btnPrimary.textContent = content.primaryActionLabel;
        btnPrimary.onclick = () => {
          if (content.step === 1 && content.primaryActionLabel === 'Me aproximar da argila') {
            this.scene.setCameraView('detalhe');
          }
          this.guided.nextStep();
        };
      }

      if (btnSkip) {
        if (content.secondaryActionLabel) {
          btnSkip.textContent = content.secondaryActionLabel;
          btnSkip.classList.remove('hidden');
          btnSkip.onclick = () => this.guided.skipStep();
        } else {
          btnSkip.classList.add('hidden');
        }
      }

      if (content.suggestedTool) {
        this.selectTool(content.suggestedTool);
      }
    }
  }

  private highlightAdvancePrompt(): void {
    const btn = document.getElementById('btn-guided-primary');
    if (btn) {
      btn.classList.add('highlight-advance');
      btn.title = 'Seguir quando quiser';
    }
  }

  private applyPrecisionAdjustment(band: string | null, action: string | null): void {
    if (!band || !action) return;
    const M = this.solver.config.rings;
    const N = this.solver.config.segments;

    let startJ = 2;
    let endJ = Math.floor(M * 0.35);

    if (band === 'meio') {
      startJ = Math.floor(M * 0.3);
      endJ = Math.floor(M * 0.65);
    } else if (band === 'colo') {
      startJ = Math.floor(M * 0.6);
      endJ = Math.floor(M * 0.85);
    } else if (band === 'borda') {
      startJ = Math.floor(M * 0.8);
      endJ = M - 1;
    }

    const deltaR = action === 'expand' ? 0.0035 : -0.0035;

    for (let j = startJ; j <= endJ; j++) {
      const mid = (startJ + endJ) * 0.5;
      const weight = Math.cos(((j - mid) / (endJ - startJ)) * Math.PI * 0.5);
      for (let i = 0; i < N; i++) {
        const idx = j * N + i;
        this.solver.radii[idx] = Math.max(
          this.solver.config.minRadius,
          Math.min(this.solver.config.maxRadius, this.solver.radii[idx] + deltaR * weight)
        );
      }
    }

    this.geometry.updatePositions(this.solver.radii, this.solver.thickness, this.solver.marks, this.solver.height);
    this.showToast(`Região ${band}: ${action === 'expand' ? 'ampliada' : 'estreitada'}`);
  }

  public showToast(message: string): void {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove('opacity-0', 'translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');

    if (this.toastTimeout !== null) window.clearTimeout(this.toastTimeout);
    this.toastTimeout = window.setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-2');
    }, 2400);
  }

  public openModal(modalId: string): void {
    const m = document.getElementById(modalId);
    if (m) m.classList.remove('hidden');
  }

  public closeModal(modalId: string): void {
    const m = document.getElementById(modalId);
    if (m) m.classList.add('hidden');
  }

  public closeAllModals(): void {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
  }

  public buildSessionData(): any {
    return {
      version: 1,
      timestamp: Date.now(),
      rings: this.solver.config.rings,
      segments: this.solver.config.segments,
      height: this.solver.height,
      rotation: this.solver.rotation,
      radii: Array.from(this.solver.radii),
      thickness: Array.from(this.solver.thickness),
      marks: Array.from(this.solver.marks),
      preferences: {
        audioEnabled: this.audio.isEnabled,
        volume: this.audio.volume,
        speechEnabled: this.guided.isSpeechEnabled,
        reducedMotion: false,
        quality: 'high'
      }
    };
  }
}
