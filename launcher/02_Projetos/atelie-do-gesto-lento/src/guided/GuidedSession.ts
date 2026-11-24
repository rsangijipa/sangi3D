import { GuidedState, DurationChoice, GuidedStepContent } from '../types';

export class GuidedSession {
  public state: GuidedState = 'IDLE';
  public previousState: GuidedState = 'IDLE';
  public durationChoice: DurationChoice = 'brief';
  public currentStepIndex: number = 0; // 0 to 4
  public isSpeechEnabled: boolean = false;
  public reducedInstructions: boolean = false;

  private stepStartTime: number = 0;
  private totalElapsedMs: number = 0;
  private hasMadeFirstGestureInStep2: boolean = false;

  private onStateChangeCallback?: (state: GuidedState, stepContent?: GuidedStepContent) => void;
  private onSuggestedAdvanceCallback?: () => void;

  public readonly steps: GuidedStepContent[] = [
    {
      step: 1,
      title: 'Chegar',
      primaryText: 'Antes de fazer alguma coisa, encontre um jeito confortável de ficar. Olhe a luz, a bancada e a argila.',
      auxiliaryText: 'Se quiser, perceba o apoio dos pés e das mãos onde você está.',
      primaryActionLabel: 'Me aproximar da argila',
      secondaryActionLabel: 'Seguir sem aproximação',
      suggestedDurationSeconds: { brief: 20, timed: 45 }
    },
    {
      step: 2,
      title: 'Encontrar o gesto',
      primaryText: 'Faça um gesto pequeno. Veja o que muda e o que continua.',
      auxiliaryText: 'Arraste para a direita para abrir; para a esquerda para estreitar. Você pode desfazer.',
      suggestedTool: 'modelar',
      suggestedScope: 'ring',
      primaryActionLabel: 'Seguir',
      secondaryActionLabel: 'Pular este convite',
      suggestedDurationSeconds: { brief: 35, timed: 80 }
    },
    {
      step: 3,
      title: 'Experimentar',
      primaryText: 'Escolha uma região para alisar ou uma marca para deixar. Não é preciso resolver a peça inteira.',
      auxiliaryText: 'Você pode trocar de ferramenta e mudar de ideia.',
      suggestedTool: 'alisar',
      primaryActionLabel: 'Seguir',
      secondaryActionLabel: 'Pular este convite',
      suggestedDurationSeconds: { brief: 55, timed: 140 }
    },
    {
      step: 4,
      title: 'Olhar de novo',
      primaryText: 'Pare por um instante e olhe o que ficou. Há alguma parte que você quer manter assim?',
      auxiliaryText: 'Você pode girar a peça, continuar criando ou apenas observar.',
      primaryActionLabel: 'Seguir',
      secondaryActionLabel: 'Pular este convite',
      suggestedDurationSeconds: { brief: 40, timed: 90 }
    },
    {
      step: 5,
      title: 'Deixar por hoje',
      primaryText: 'Por hoje, pode ser assim. Você pode continuar outra hora.',
      auxiliaryText: 'Como foi criar sem precisar chegar a uma forma certa?',
      primaryActionLabel: 'Guardar e encerrar',
      secondaryActionLabel: 'Continuar criando',
      suggestedDurationSeconds: { brief: 30, timed: 65 }
    }
  ];

  public setCallbacks(
    onStateChange: (state: GuidedState, stepContent?: GuidedStepContent) => void,
    onSuggestedAdvance?: () => void
  ): void {
    this.onStateChangeCallback = onStateChange;
    this.onSuggestedAdvanceCallback = onSuggestedAdvance;
  }

  public startSetup(): void {
    this.state = 'SETUP';
    this.notifyState();
  }

  public beginPractice(duration: DurationChoice): void {
    this.durationChoice = duration;
    this.currentStepIndex = 0;
    this.hasMadeFirstGestureInStep2 = false;
    this.goToStep('ARRIVE');
  }

  public nextStep(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      const states: GuidedState[] = ['ARRIVE', 'TOUCH', 'EXPERIMENT', 'OBSERVE', 'CLOSE'];
      this.goToStep(states[this.currentStepIndex]);
    } else {
      this.state = 'FINISHED';
      this.notifyState();
    }
  }

  public previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      const states: GuidedState[] = ['ARRIVE', 'TOUCH', 'EXPERIMENT', 'OBSERVE', 'CLOSE'];
      this.goToStep(states[this.currentStepIndex]);
    }
  }

  public skipStep(): void {
    this.nextStep();
  }

  public pause(): void {
    if (this.state === 'PAUSED') return;
    this.previousState = this.state;
    this.state = 'PAUSED';
    this.cancelSpeech();
    this.notifyState();
  }

  public resume(): void {
    if (this.state !== 'PAUSED') return;
    this.state = this.previousState;
    this.stepStartTime = performance.now();
    this.notifyState();
  }

  public exitToFreeMode(): void {
    this.state = 'IDLE';
    this.cancelSpeech();
    this.notifyState();
  }

  public getCurrentStepContent(): GuidedStepContent {
    return this.steps[this.currentStepIndex];
  }

  public onSculptAction(): void {
    if (this.state === 'TOUCH' && !this.hasMadeFirstGestureInStep2) {
      this.hasMadeFirstGestureInStep2 = true;
    }
  }

  public updateTime(): void {
    if (this.state === 'IDLE' || this.state === 'SETUP' || this.state === 'PAUSED' || this.state === 'FINISHED') {
      return;
    }
    if (this.durationChoice === 'timeless') return;

    const elapsedSec = (performance.now() - this.stepStartTime) / 1000;
    const currentStep = this.getCurrentStepContent();
    const suggestedSec =
      this.durationChoice === 'brief'
        ? currentStep.suggestedDurationSeconds.brief
        : currentStep.suggestedDurationSeconds.timed;

    if (elapsedSec >= suggestedSec && this.onSuggestedAdvanceCallback) {
      this.onSuggestedAdvanceCallback();
    }
  }

  private goToStep(newState: GuidedState): void {
    this.state = newState;
    this.stepStartTime = performance.now();
    this.cancelSpeech();

    const content = this.getCurrentStepContent();
    this.notifyState();

    if (this.isSpeechEnabled) {
      this.speakText(content.primaryText);
    }
  }

  private notifyState(): void {
    if (this.onStateChangeCallback) {
      const content =
        this.state !== 'IDLE' && this.state !== 'SETUP' && this.state !== 'FINISHED'
          ? this.getCurrentStepContent()
          : undefined;
      this.onStateChangeCallback(this.state, content);
    }
  }

  public toggleSpeech(): boolean {
    this.isSpeechEnabled = !this.isSpeechEnabled;
    if (!this.isSpeechEnabled) {
      this.cancelSpeech();
    } else if (this.state !== 'IDLE' && this.state !== 'SETUP') {
      this.speakText(this.getCurrentStepContent().primaryText);
    }
    return this.isSpeechEnabled;
  }

  private speakText(text: string): void {
    if (!('speechSynthesis' in window)) return;
    this.cancelSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.92; // Serene relaxed reading pace
    utterance.pitch = 1.0;

    // Pick a natural pt-BR voice if available
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt_BR'));
    if (ptVoice) utterance.voice = ptVoice;

    window.speechSynthesis.speak(utterance);
  }

  private cancelSpeech(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
