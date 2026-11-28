import {
  ABAConfig,
  ExperienceMode,
  ObservableEvent,
  ParticipantId,
  QualityPreset,
  ResponseType,
  SessionState,
  StationId,
  ToolDef
} from '../types';

export const STATION_META: Record<StationId, { label: string; subtitle: string; icon: string }> = {
  pintura: { label: 'Pintura', subtitle: 'Pintura gestual em camadas', icon: '🖌️' },
  argila: { label: 'Argila', subtitle: 'Escultura colaborativa', icon: '🏺' },
  areia: { label: 'Areia', subtitle: 'Desenho na areia fina', icon: '〰️' },
  fitas: { label: 'Fitas', subtitle: 'Gestos suspensos no ar', icon: '🎀' },
  ritmo: { label: 'Ritmo', subtitle: 'Ritmo compartilhado', icon: '🥁' }
};

export const MODE_META: Record<ExperienceMode, { label: string; desc: string }> = {
  exploracao_livre: {
    label: 'Exploração livre',
    desc: 'Todos os materiais disponíveis para experimentar no seu próprio ritmo.'
  },
  imitacao: {
    label: 'Imitação',
    desc: 'Um gesto de referência é demonstrado com pista visual opcional.'
  },
  criacao_compartilhada: {
    label: 'Criação compartilhada',
    desc: 'Participantes alternam turnos acrescentando elementos à mesma obra.'
  },
  complete_meu_gesto: {
    label: 'Complete meu gesto',
    desc: 'Um participante inicia uma forma ou som e o outro decide como continuar.'
  },
  espelhamento: {
    label: 'Espelhamento',
    desc: 'Movimentos são reproduzidos simetricamente na superfície ativa.'
  },
  experimentacao_terapeutica: {
    label: 'Experimentação terapêutica',
    desc: 'Convites abertos de percepção sobre o processo criativo, sem julgamento.'
  }
};

export const THERAPEUTIC_PROMPTS = [
  'O que chamou sua atenção primeiro ao tocar este material?',
  'Como você percebe a diferença entre um gesto rápido e um gesto lento aqui?',
  'Se este traço ou som tivesse um ritmo de respiração, como ele seria?',
  'O que mudou quando vocês compartilharam o mesmo espaço de criação?',
  'Qual textura ou cor trouxe mais conforto neste momento?'
];

export const TOOLS_BY_STATION: Record<StationId, ToolDef[]> = {
  pintura: [
    { id: 'pincel_fino', label: 'Pincel Fino', station: 'pintura', icon: '✒️', size: 12, description: 'Traço preciso com marcas suaves de cerdas' },
    { id: 'pincel_largo', label: 'Pincel Largo', station: 'pintura', icon: '🖌️', size: 28, description: 'Pincelada ampla com mistura de pigmentos' },
    { id: 'espatula', label: 'Espátula', station: 'pintura', icon: '🔪', size: 34, description: 'Camada espessa e arrasto texturizado' },
    { id: 'esponja', label: 'Misturador', station: 'pintura', icon: '🧽', size: 36, description: 'Suaviza e funde pigmentos sobrepostos' }
  ],
  argila: [
    { id: 'pressionar', label: 'Pressionar', station: 'argila', icon: '👇', size: 16, description: 'Afunda a argila criando relevo ao redor' },
    { id: 'puxar', label: 'Puxar', station: 'argila', icon: '☝️', size: 16, description: 'Eleva e modela volumes orgânicos' },
    { id: 'acrescentar', label: 'Acrescentar', station: 'argila', icon: '➕', size: 18, description: 'Adiciona massa de argila nova' },
    { id: 'remover', label: 'Remover', station: 'argila', icon: '➖', size: 15, description: 'Escava e retira material' },
    { id: 'achatar', label: 'Achatar', station: 'argila', icon: '🪵', size: 22, description: 'Planifica com o rolo de madeira' },
    { id: 'alisar', label: 'Alisar', station: 'argila', icon: '💧', size: 20, description: 'Alisa a superfície com água' }
  ],
  areia: [
    { id: 'rastelo_fino', label: 'Rastelo Fino', station: 'areia', icon: '🔱', size: 18, description: 'Sulcos delicados e paralelos na areia' },
    { id: 'rastelo_largo', label: 'Rastelo Largo', station: 'areia', icon: '🧹', size: 28, description: 'Ondas amplas com deslocamento lateral' },
    { id: 'pedra', label: 'Pedra', station: 'areia', icon: '🪨', size: 16, description: 'Marca de pressão circular com borda' },
    { id: 'pincel_areia', label: 'Pincel', station: 'areia', icon: '🖌️', size: 14, description: 'Desenho livre e contínuo na areia' },
    { id: 'nivelar', label: 'Nivelar', station: 'areia', icon: '📏', size: 30, description: 'Restaura a superfície plana e lisa' }
  ],
  fitas: [
    { id: 'impulso_suave', label: 'Brisa Suave', station: 'fitas', icon: '🌬️', size: 18, description: 'Conduz as fitas de seda com leveza' },
    { id: 'onda_ampla', label: 'Onda Ampla', station: 'fitas', icon: '〰️', size: 28, description: 'Gera trajetórias amplas no ar' },
    { id: 'espiral', label: 'Espiral', station: 'fitas', icon: '🌀', size: 24, description: 'Impulso circular nas fitas suspensas' }
  ],
  ritmo: [
    { id: 'baqueta_madeira', label: 'Baqueta', station: 'ritmo', icon: '🥢', size: 16, description: 'Toque direto nos instrumentos' },
    { id: 'sequenciador', label: 'Padrão Guiado', station: 'ritmo', icon: '🎵', size: 20, description: 'Toca ou imita uma sequência rítmica' }
  ]
};

export const DEFAULT_ABA_CONFIG: ABAConfig = {
  stepsCount: 3,
  complexity: 'simples',
  visualCues: true,
  demonstrationLoop: false,
  responseTimeNoPressure: true,
  turnAlternation: true,
  materialsCount: 6,
  recordObservations: false,
  targetSkills: {
    imitacao: true,
    atencaoCompartilhada: true,
    alternanciaTurnos: true,
    seguimentoInstrucoes: false,
    comunicacaoFuncional: false,
    brincadeiraColaborativa: true
  }
};

export const STORAGE_KEY = 'oficina_gestos_compartilhados_v1';

export function createInitialState(): SessionState {
  return {
    activeStation: 'pintura',
    activeMode: 'criacao_compartilhada',
    activeParticipant: 'A',
    quality: 'equilibrada',
    muted: false,
    volume: 0.75,
    reducedMotion: false,
    cameraPreset: 'estacao',
    activeToolByStation: {
      pintura: 'pincel_largo',
      argila: 'pressionar',
      areia: 'rastelo_fino',
      fitas: 'impulso_suave',
      ritmo: 'baqueta_madeira'
    },
    activeColorIndex: 0,
    stepProgress: 0,
    aba: JSON.parse(JSON.stringify(DEFAULT_ABA_CONFIG)) as ABAConfig,
    observations: [],
    therapeuticPromptIndex: 0,
    mirrorEnabled: false
  };
}

export class SessionStore {
  public state: SessionState;
  private listeners: Array<(state: SessionState) => void> = [];

  constructor() {
    this.state = createInitialState();
    this.loadFromStorage();
  }

  public subscribe(fn: (state: SessionState) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  public emit(): void {
    for (const fn of this.listeners) fn(this.state);
  }

  public setStation(station: StationId): void {
    this.state.activeStation = station;
    this.emit();
  }

  public setMode(mode: ExperienceMode): void {
    this.state.activeMode = mode;
    this.state.mirrorEnabled = mode === 'espelhamento';
    this.state.stepProgress = 0;
    this.emit();
  }

  public toggleParticipant(): ParticipantId {
    this.state.activeParticipant = this.state.activeParticipant === 'A' ? 'B' : 'A';
    this.emit();
    return this.state.activeParticipant;
  }

  public setQuality(q: QualityPreset): void {
    this.state.quality = q;
    this.emit();
  }

  public setTool(station: StationId, toolId: string): void {
    this.state.activeToolByStation[station] = toolId;
    this.emit();
  }

  public recordAction(action: string, responseType: ResponseType = 'independente'): void {
    if (this.state.aba.recordObservations) {
      const evt: ObservableEvent = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toISOString(),
        station: this.state.activeStation,
        mode: this.state.activeMode,
        participant: this.state.activeParticipant,
        action,
        responseType,
        stepIndex: this.state.stepProgress + 1
      };
      this.state.observations.push(evt);
      if (this.state.observations.length > 200) {
        this.state.observations.shift();
      }
    }

    if (
      this.state.activeMode === 'criacao_compartilhada' ||
      this.state.activeMode === 'complete_meu_gesto' ||
      this.state.aba.turnAlternation
    ) {
      if (this.state.activeMode === 'criacao_compartilhada' || this.state.activeMode === 'complete_meu_gesto') {
        this.state.stepProgress = (this.state.stepProgress + 1) % Math.max(1, this.state.aba.stepsCount);
      }
    }
    this.emit();
  }

  public saveToStorage(extraData?: Record<string, unknown>): boolean {
    try {
      const payload = {
        savedAt: new Date().toISOString(),
        state: this.state,
        extra: extraData ?? null
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      return true;
    } catch {
      return false;
    }
  }

  public loadFromStorage(): boolean {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.state) {
        this.state = {
          ...createInitialState(),
          ...parsed.state,
          aba: {
            ...DEFAULT_ABA_CONFIG,
            ...(parsed.state.aba || {}),
            targetSkills: {
              ...DEFAULT_ABA_CONFIG.targetSkills,
              ...(parsed.state.aba?.targetSkills || {})
            }
          }
        };
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
