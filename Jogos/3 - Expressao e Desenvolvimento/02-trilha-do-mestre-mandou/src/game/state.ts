/**
 * Máquina de Estados e Regras do Mestre Mandou
 * Projeto: 02. Trilha do Mestre Mandou
 */

import { type TrailTarget, DEFAULT_TRAIL_SEQUENCE, TARGETS_CATALOG } from './content.ts';

export type GameMode = 'mestre' | 'propor' | 'livre';

export interface GameMetrics {
  completedStepsCount: number;
  helpsRequested: number;
  repeatsRequested: number;
  timesFallenSafely: number;
  timeActiveSeconds: number;
}

export interface GameState {
  mode: GameMode;
  sequence: TrailTarget[];
  currentStepIndex: number;
  isPaused: boolean;
  isHelpOpen: boolean;
  isProposeOpen: boolean;
  isCompleted: boolean;
  feedbackText: string;
  feedbackTone: 'info' | 'success' | 'encourage';
  safeCheckpoint: [number, number, number];
  cameraMode: 'follow' | 'isometric';
  metrics: GameMetrics;
}

export class GameStateManager {
  private state: GameState;
  private listeners: Array<(state: GameState) => void> = [];

  constructor() {
    this.state = {
      mode: 'mestre',
      sequence: [...DEFAULT_TRAIL_SEQUENCE],
      currentStepIndex: 1, // Começa na Etapa 2 de 4 conforme mockup ("Toque no sino azul / Etapa 2 de 4")
      isPaused: false,
      isHelpOpen: false,
      isProposeOpen: false,
      isCompleted: false,
      feedbackText: 'O Mestre Mandou: Toque no sino azul!',
      feedbackTone: 'info',
      safeCheckpoint: [0.0, 0.5, 0.0],
      cameraMode: 'follow',
      metrics: {
        completedStepsCount: 1,
        helpsRequested: 0,
        repeatsRequested: 0,
        timesFallenSafely: 0,
        timeActiveSeconds: 0
      }
    };
  }

  getState(): Readonly<GameState> {
    return this.state;
  }

  subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  getCurrentTarget(): TrailTarget | null {
    if (this.state.mode === 'livre') return null;
    return this.state.sequence[this.state.currentStepIndex] || null;
  }

  // Ações do Jogador e Mestre
  checkProximity(playerPos: [number, number, number]): boolean {
    if (this.state.isPaused || this.state.isCompleted || this.state.mode === 'livre') return false;

    const target = this.getCurrentTarget();
    if (!target) return false;

    const dx = playerPos[0] - target.pos[0];
    const dy = playerPos[1] - target.pos[1];
    const dz = playerPos[2] - target.pos[2];
    const dist = Math.hypot(dx, dy * 0.5, dz); // tolerância vertical maior para desníveis

    if (dist <= target.radius) {
      this.completeCurrentStep();
      return true;
    }
    return false;
  }

  completeCurrentStep() {
    const current = this.getCurrentTarget();
    if (!current) return;

    this.state.metrics.completedStepsCount++;

    if (this.state.currentStepIndex + 1 < this.state.sequence.length) {
      this.state.currentStepIndex++;
      const next = this.getCurrentTarget()!;
      this.state.feedbackText = `Muito bem! Agora o Mestre Mandou: ${next.command}!`;
      this.state.feedbackTone = 'success';
      // Salva o checkpoint atual
      this.state.safeCheckpoint = [current.pos[0], current.pos[1] + 0.2, current.pos[2]];
    } else {
      this.state.isCompleted = true;
      this.state.feedbackText = 'Maravilha! Você completou toda a trilha! Deseja repetir ou propor um percurso?';
      this.state.feedbackTone = 'success';
    }
    this.notify();
  }

  repeatInstruction() {
    this.state.metrics.repeatsRequested++;
    const target = this.getCurrentTarget();
    if (target) {
      this.state.feedbackText = `Lembrando: ${target.command}!`;
      this.state.feedbackTone = 'info';
    } else {
      this.state.feedbackText = 'Explore livremente o parque ou escolha "Minha vez de propor"!';
    }
    this.notify();
  }

  toggleHelp(open?: boolean) {
    this.state.isHelpOpen = open !== undefined ? open : !this.state.isHelpOpen;
    if (this.state.isHelpOpen) {
      this.state.metrics.helpsRequested++;
    }
    this.notify();
  }

  togglePause(paused?: boolean) {
    this.state.isPaused = paused !== undefined ? paused : !this.state.isPaused;
    this.notify();
  }

  toggleProposeMode(open?: boolean) {
    this.state.isProposeOpen = open !== undefined ? open : !this.state.isProposeOpen;
    this.notify();
  }

  setCustomSequence(targetIds: string[]) {
    const newSeq = targetIds.map(id => TARGETS_CATALOG[id]).filter(Boolean);
    if (newSeq.length > 0) {
      this.state.sequence = newSeq;
      this.state.currentStepIndex = 0;
      this.state.isCompleted = false;
      this.state.mode = 'propor';
      this.state.isProposeOpen = false;
      const target = this.getCurrentTarget()!;
      this.state.feedbackText = `Sua vez de mestre! Primeiro objetivo: ${target.command}!`;
      this.state.feedbackTone = 'encourage';
      this.notify();
    }
  }

  setFreeMode() {
    this.state.mode = 'livre';
    this.state.feedbackText = 'Modo livre ativo: percorra passarelas, pontes e clareiras no seu próprio ritmo.';
    this.state.feedbackTone = 'info';
    this.notify();
  }

  setMasterMode() {
    this.state.mode = 'mestre';
    this.state.sequence = [...DEFAULT_TRAIL_SEQUENCE];
    this.state.currentStepIndex = 1; // Etapa 2 de 4 conforme mockup
    this.state.isCompleted = false;
    this.state.feedbackText = 'O Mestre Mandou: Toque no sino azul!';
    this.state.feedbackTone = 'info';
    this.notify();
  }

  toggleCameraMode() {
    this.state.cameraMode = this.state.cameraMode === 'follow' ? 'isometric' : 'follow';
    this.notify();
  }

  returnToSafeCheckpoint(): [number, number, number] {
    this.state.metrics.timesFallenSafely++;
    this.state.feedbackText = 'De volta à trilha segura! Respire e continue.';
    this.state.feedbackTone = 'info';
    this.notify();
    return this.state.safeCheckpoint;
  }

  updateTime(dt: number) {
    if (!this.state.isPaused) {
      this.state.metrics.timeActiveSeconds += dt;
    }
  }
}
