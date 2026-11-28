export type SeedId = 'camomila' | 'lavanda' | 'salvia' | 'samambaia';

export type GrowthStageId =
  | 'semente'
  | 'broto'
  | 'muda'
  | 'crescimento'
  | 'florescimento'
  | 'recolhimento';

export type SeasonId = 'primavera' | 'verao' | 'outono' | 'inverno';

export type TimeSpeedId = 'pausado' | 'lento' | 'contemplativo';

export type PanelTabId = 'plantar' | 'regar' | 'luz' | 'estacao' | 'registro' | null;

export type CarePropId =
  | 'regador'
  | 'borrifador'
  | 'tigela'
  | 'caderno'
  | 'pano'
  | 'pedras'
  | 'etiquetas';

export interface SeedSpec {
  id: SeedId;
  name: string;
  latinName: string;
  description: string;
  seedColor: string;
  leafColor: string;
  leafHighlight: string;
  blossomColor: string;
  blossomCenter: string;
  stemColor: string;
  seedScale: [number, number, number];
}

export interface StageSpec {
  id: GrowthStageId;
  label: string;
  shortNote: string;
  minProgress: number;
  maxProgress: number;
}

export interface SeasonSpec {
  id: SeasonId;
  label: string;
  description: string;
  sunTint: string;
  ambientTint: string;
  fogColor: string;
  sunElevationOffset: number;
  particleColor: string;
  glassFrost: number;
  dryLeafAccent: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  note: string;
  createdAt: string;
  seedId: SeedId;
  stageId: GrowthStageId;
  seasonId: SeasonId;
}

export interface PropLayout {
  position: [number, number, number];
  rotationY: number;
}

export const SEEDS: Record<SeedId, SeedSpec> = {
  camomila: {
    id: 'camomila',
    name: 'Camomila Silvestre',
    latinName: 'Matricaria recutita',
    description: 'Folhas rendadas, pétalas claras e centro dourado voltado para a luz suave.',
    seedColor: '#b58e52',
    leafColor: '#4c6e3b',
    leafHighlight: '#7da259',
    blossomColor: '#f6f1e4',
    blossomCenter: '#d89b2b',
    stemColor: '#567542',
    seedScale: [0.018, 0.032, 0.014],
  },
  lavanda: {
    id: 'lavanda',
    name: 'Lavanda de Estufa',
    latinName: 'Lavandula angustifolia',
    description: 'Hastes esguias de verde-prateado que se abrem em espigas violáceas serenas.',
    seedColor: '#3f322c',
    leafColor: '#586e5c',
    leafHighlight: '#839b86',
    blossomColor: '#8d75b0',
    blossomCenter: '#5c467e',
    stemColor: '#5c6e5b',
    seedScale: [0.016, 0.028, 0.015],
  },
  salvia: {
    id: 'salvia',
    name: 'Sálvia Dourada',
    latinName: 'Salvia officinalis',
    description: 'Folhas aveludadas de nervuras marcadas e flores em tons quentes de terracota e âmbar.',
    seedColor: '#7a593d',
    leafColor: '#4b654a',
    leafHighlight: '#7c936d',
    blossomColor: '#cf7452',
    blossomCenter: '#e2b45a',
    stemColor: '#58684b',
    seedScale: [0.021, 0.024, 0.021],
  },
  samambaia: {
    id: 'samambaia',
    name: 'Samambaia de Orvalho',
    latinName: 'Adiantum raddianum',
    description: 'Frondes arqueadas que se desenrolam devagar e retêm gotículas translúcidas no contraluz.',
    seedColor: '#5d6b43',
    leafColor: '#3d6834',
    leafHighlight: '#76a454',
    blossomColor: '#d9c27a',
    blossomCenter: '#b89b4f',
    stemColor: '#3e4d31',
    seedScale: [0.019, 0.022, 0.019],
  },
};

export const GROWTH_STAGES: StageSpec[] = [
  {
    id: 'semente',
    label: 'Semente',
    shortNote: 'Repouso silencioso sob a terra úmida.',
    minProgress: 0,
    maxProgress: 0.16,
  },
  {
    id: 'broto',
    label: 'Broto',
    shortNote: 'As primeiras folhas rompem devagar a superfície.',
    minProgress: 0.16,
    maxProgress: 0.34,
  },
  {
    id: 'muda',
    label: 'Muda',
    shortNote: 'Caules firmes se inclinam em direção à claridade.',
    minProgress: 0.34,
    maxProgress: 0.54,
  },
  {
    id: 'crescimento',
    label: 'Crescimento',
    shortNote: 'Ramos se multiplicam e botões começam a se formar.',
    minProgress: 0.54,
    maxProgress: 0.74,
  },
  {
    id: 'florescimento',
    label: 'Florescimento',
    shortNote: 'Pétalas e frondes se abrem na luz dourada da estufa.',
    minProgress: 0.74,
    maxProgress: 0.9,
  },
  {
    id: 'recolhimento',
    label: 'Recolhimento',
    shortNote: 'Tons de âmbar e pausa suave antes de um novo ciclo.',
    minProgress: 0.9,
    maxProgress: 1.0,
  },
];

export const SEASONS: Record<SeasonId, SeasonSpec> = {
  primavera: {
    id: 'primavera',
    label: 'Primavera',
    description: 'Claridade macia, ar úmido e folhas frescas em abertura.',
    sunTint: '#ffe8bd',
    ambientTint: '#cfe0cf',
    fogColor: '#d9d5c8',
    sunElevationOffset: 0.06,
    particleColor: '#f8efd4',
    glassFrost: 0.12,
    dryLeafAccent: 0.08,
  },
  verao: {
    id: 'verao',
    label: 'Verão',
    description: 'Luz dourada longa e intensa atravessando os vidros antigos.',
    sunTint: '#ffd699',
    ambientTint: '#dcd2bd',
    fogColor: '#dcd0be',
    sunElevationOffset: 0.14,
    particleColor: '#ffebc2',
    glassFrost: 0.05,
    dryLeafAccent: 0.14,
  },
  outono: {
    id: 'outono',
    label: 'Outono',
    description: 'Âmbar baixo de fim de tarde, terra acolhedora e folhas secas.',
    sunTint: '#ffb978',
    ambientTint: '#cbb6a0',
    fogColor: '#cdbca9',
    sunElevationOffset: -0.06,
    particleColor: '#f5cfa0',
    glassFrost: 0.16,
    dryLeafAccent: 0.65,
  },
  inverno: {
    id: 'inverno',
    label: 'Inverno',
    description: 'Luz oblíqua pálida, vidro levemente embaçado e quietude.',
    sunTint: '#e3e8f2',
    ambientTint: '#b8c4cf',
    fogColor: '#c3c8cc',
    sunElevationOffset: -0.1,
    particleColor: '#eef2f7',
    glassFrost: 0.42,
    dryLeafAccent: 0.35,
  },
};

export function getStageFromProgress(progress: number): StageSpec {
  const clamped = Math.max(0, Math.min(1, progress));
  for (let i = GROWTH_STAGES.length - 1; i >= 0; i--) {
    if (clamped >= GROWTH_STAGES[i].minProgress) {
      return GROWTH_STAGES[i];
    }
  }
  return GROWTH_STAGES[0];
}

export const INITIAL_PROP_LAYOUTS: Record<CarePropId, PropLayout[]> = {
  regador: [
    { position: [0.86, 0, -0.14], rotationY: -2.42 },
    { position: [0.88, 0, 0.2], rotationY: -2.12 },
    { position: [-0.94, 0, -0.18], rotationY: 0.65 },
  ],
  borrifador: [
    { position: [0.72, 0, 0.36], rotationY: -0.85 },
    { position: [0.56, 0, -0.38], rotationY: -1.35 },
    { position: [-0.66, 0, -0.36], rotationY: 0.48 },
  ],
  tigela: [
    { position: [-0.56, 0, 0.32], rotationY: 0.35 },
    { position: [-0.54, 0, 0.42], rotationY: 1.2 },
    { position: [0.56, 0, 0.42], rotationY: -0.6 },
  ],
  caderno: [
    { position: [-0.84, 0, -0.22], rotationY: 0.28 },
    { position: [-1.02, 0, -0.12], rotationY: 0.42 },
    { position: [1.06, 0, 0.22], rotationY: -0.34 },
  ],
  pano: [
    { position: [-0.96, 0, 0.28], rotationY: 0.16 },
    { position: [0.96, 0, 0.28], rotationY: -0.2 },
    { position: [-0.98, 0, 0.34], rotationY: 0.36 },
  ],
  pedras: [
    { position: [0.45, 0, 0.36], rotationY: 0.1 },
    { position: [-0.44, 0, 0.44], rotationY: 1.4 },
    { position: [0.5, 0, -0.3], rotationY: 2.3 },
  ],
  etiquetas: [
    { position: [-0.44, 0, -0.34], rotationY: 0.45 },
    { position: [0.38, 0, 0.48], rotationY: -0.55 },
    { position: [-0.36, 0, 0.48], rotationY: 0.12 },
  ],
};

export const PROP_LABELS: Record<CarePropId, string> = {
  regador: 'Regador de cobre',
  borrifador: 'Borrifador de vidro',
  tigela: 'Tigela de sementes',
  caderno: 'Caderno de registros',
  pano: 'Pano de linho',
  pedras: 'Pedras e musgo',
  etiquetas: 'Etiquetas de madeira',
};

/**
 * Vitalidade da planta (0–1): melhor com umidade entre 40% e 75%.
 * Terra seca ou encharcada reduz o vigor e desacelera o crescimento.
 */
export function computeVitality(moisture: number, lightCycle: number): number {
  const m = Math.min(1, Math.max(0, moisture));
  let water: number;
  if (m < 0.32) water = 0.3 + (m / 0.32) * 0.5;
  else if (m < 0.4) water = 0.8 + ((m - 0.32) / 0.08) * 0.2;
  else if (m <= 0.75) water = 1;
  else water = 1 - ((m - 0.75) / 0.25) * 0.45;
  const light = 0.82 + Math.sin(Math.min(1, Math.max(0, lightCycle)) * Math.PI) * 0.18;
  return Math.min(1, Math.max(0, water * light));
}

export function vitalityLabel(v: number): string {
  if (v >= 0.85) return 'Vigorosa';
  if (v >= 0.65) return 'Saudável';
  if (v >= 0.45) return 'Pedindo cuidado';
  return 'Frágil';
}
