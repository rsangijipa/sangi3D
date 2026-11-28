export type StationId = 'pintura' | 'argila' | 'areia' | 'fitas' | 'ritmo';

export type ExperienceMode =
  | 'exploracao_livre'
  | 'imitacao'
  | 'criacao_compartilhada'
  | 'complete_meu_gesto'
  | 'espelhamento'
  | 'experimentacao_terapeutica';

export type QualityPreset = 'cinema' | 'equilibrada' | 'leve';

export type ParticipantId = 'A' | 'B';

export type GestureComplexity = 'simples' | 'moderado' | 'composto';

export type ResponseType = 'independente' | 'com_ajuda' | 'pausa';

export interface ToolDef {
  id: string;
  label: string;
  station: StationId;
  icon: string;
  size: number;
  description: string;
}

export interface ABAConfig {
  stepsCount: number;
  complexity: GestureComplexity;
  visualCues: boolean;
  demonstrationLoop: boolean;
  responseTimeNoPressure: boolean;
  turnAlternation: boolean;
  materialsCount: number; // 2..6
  recordObservations: boolean;
  targetSkills: {
    imitacao: boolean;
    atencaoCompartilhada: boolean;
    alternanciaTurnos: boolean;
    seguimentoInstrucoes: boolean;
    comunicacaoFuncional: boolean;
    brincadeiraColaborativa: boolean;
  };
}

export interface ObservableEvent {
  id: string;
  timestamp: string;
  station: StationId;
  mode: ExperienceMode;
  participant: ParticipantId;
  action: string;
  responseType: ResponseType;
  stepIndex: number;
}

export interface SessionState {
  activeStation: StationId;
  activeMode: ExperienceMode;
  activeParticipant: ParticipantId;
  quality: QualityPreset;
  muted: boolean;
  volume: number;
  reducedMotion: boolean;
  cameraPreset: 'visao_geral' | 'estacao' | 'topo';
  activeToolByStation: Record<StationId, string>;
  activeColorIndex: number;
  stepProgress: number;
  aba: ABAConfig;
  observations: ObservableEvent[];
  therapeuticPromptIndex: number;
  mirrorEnabled: boolean;
}
