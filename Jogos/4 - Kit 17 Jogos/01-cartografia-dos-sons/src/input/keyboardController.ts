// src/input/keyboardController.ts
// Navegação acessível completa por teclado (WCAG 2.1 AA)

export interface KeyboardActions {
  onMoveToken: (deltaX: number, deltaZ: number) => void;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onSelectTool: (toolIndex: 1 | 2 | 3) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onTogglePause: () => void;
}

export class KeyboardController {
  private actions: KeyboardActions;
  private isEnabled = true;

  constructor(actions: KeyboardActions) {
    this.actions = actions;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (!this.isEnabled) return;

    // Se estiver digitando em um input de texto, ignorar
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
      return;
    }

    const MOVE_STEP = 0.25; // Snap de 0.25 m conforme especificação

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        this.actions.onMoveToken(0, -MOVE_STEP);
        break;

      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault();
        this.actions.onMoveToken(0, MOVE_STEP);
        break;

      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault();
        this.actions.onMoveToken(-MOVE_STEP, 0);
        break;

      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault();
        this.actions.onMoveToken(MOVE_STEP, 0);
        break;

      case ' ': // Barra de espaço
        e.preventDefault();
        this.actions.onTogglePlay();
        break;

      case 'm':
      case 'M':
        e.preventDefault();
        this.actions.onToggleMute();
        break;

      case '1':
        this.actions.onSelectTool(1);
        break;

      case '2':
        this.actions.onSelectTool(2);
        break;

      case '3':
        this.actions.onSelectTool(3);
        break;

      case 'PageDown':
      case 'n':
      case 'N':
        this.actions.onNextStep();
        break;

      case 'PageUp':
      case 'p':
      case 'P':
        this.actions.onPrevStep();
        break;

      case 'Escape':
        this.actions.onTogglePause();
        break;
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public dispose() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }
}
