// src/game/content.ts
// Cenários, fases, textos em pt-BR e definições de conteúdo acessível

export interface SoundSourceDef {
  id: string;
  name: string;
  shortName: string;
  description: string;
  areaId: string;
  areaName: string;
  icon: string;
  colorHex: string;
  initialPos: [number, number, number];
  baseFrequency?: number;
  spatialCategory: 'vehicle' | 'water' | 'nature' | 'bell' | 'footstep';
  captionText: string;
}

export interface AreaDef {
  id: string;
  name: string;
  description: string;
  center: [number, number, number];
}

export interface StepDef {
  step: 1 | 2 | 3 | 4 | 5;
  title: string;
  subtitle: string;
  instruction: string;
  hint: string;
  defaultTool: 'listen' | 'move' | 'compare';
}

export const GAME_AREAS: AreaDef[] = [
  {
    id: 'padaria',
    name: 'Esquina da Padaria',
    description: 'Bairro acolhedor com esplanada externa, mesas de madeira e aromas de café fresco.',
    center: [-3.2, 0, 1.6]
  },
  {
    id: 'praca',
    name: 'Praça Central',
    description: 'Coração da cidade com fonte d\'água, árvores de feltro musgo, bancos e lampiões.',
    center: [1.2, 0, 0.6]
  },
  {
    id: 'escola',
    name: 'Alameda da Escola',
    description: 'Edifício cívico em tijolo vermelho com torre do relógio, bandeira e calçadas amplas.',
    center: [-1.2, 0, -2.8]
  }
];

export const SOUND_SOURCES: SoundSourceDef[] = [
  {
    id: 'bus',
    name: 'Ônibus da Linha Centro',
    shortName: 'Ônibus',
    description: 'Motor distante e constante de ônibus trafegando pelas ruas de asfalto.',
    areaId: 'praca',
    areaName: 'Praça Central / Ruas',
    icon: 'bus',
    colorHex: '#2B6CB0',
    initialPos: [-0.6, 0.2, 1.2],
    spatialCategory: 'vehicle',
    captionText: 'Motor grave de ônibus em deslocamento suave'
  },
  {
    id: 'fountain',
    name: 'Água da Fonte',
    shortName: 'Fonte',
    description: 'Gotas cristalinas e correnteza caindo suavemente nos pratos de pedra da fonte.',
    areaId: 'praca',
    areaName: 'Praça Central',
    icon: 'droplet',
    colorHex: '#0284C7',
    initialPos: [1.5, 0.2, 0.6],
    spatialCategory: 'water',
    captionText: 'Borbulhar contínuo de água cristalina'
  },
  {
    id: 'birds',
    name: 'Pássaros do Parque',
    shortName: 'Pássaros',
    description: 'Chilreios melódicos de aves cantando no topo das árvores felpudas.',
    areaId: 'praca',
    areaName: 'Praça Central',
    icon: 'bird',
    colorHex: '#2E7D32',
    initialPos: [0.6, 0.2, -1.2],
    spatialCategory: 'nature',
    captionText: 'Chilreio suave e ritmado de pássaros'
  },
  {
    id: 'bell',
    name: 'Sino da Escola',
    shortName: 'Sino',
    description: 'Badalada ressonante e quente ecoando a partir da torre do relógio.',
    areaId: 'escola',
    areaName: 'Alameda da Escola',
    icon: 'bell',
    colorHex: '#D97706',
    initialPos: [-2.6, 0.2, -2.2],
    spatialCategory: 'bell',
    captionText: 'Badalada harmônica e ressonante do sino'
  },
  {
    id: 'footsteps',
    name: 'Passos na Calçada',
    shortName: 'Passos',
    description: 'Pegadas cadenciadas de transeuntes caminhando sobre a calçada de pedra.',
    areaId: 'padaria',
    areaName: 'Esquina da Padaria',
    icon: 'footsteps',
    colorHex: '#B45309',
    initialPos: [-2.8, 0.2, 1.8],
    spatialCategory: 'footstep',
    captionText: 'Passos regulares sobre o pavimento'
  }
];

export const GAME_STEPS: StepDef[] = [
  {
    step: 1,
    title: 'Descobrir as fontes',
    subtitle: 'Exploração sensorial inicial',
    instruction: 'Clique em uma das fontes no mapa ou no painel para ouvir seu som isoladamente. Associe cada timbre à sua origem no diorama.',
    hint: 'Comece clicando na Fonte ou nos Pássaros para perceber timbres suaves.',
    defaultTool: 'listen'
  },
  {
    step: 2,
    title: 'Ponto de escuta',
    subtitle: 'Percepção espacial e distância',
    instruction: 'Mova o marcador de escuta (pino dourado) para mais perto ou mais longe das fontes sonoras e observe a atenuação de volume.',
    hint: 'Aproxime o pino do sino da escola para ouvir sua ressonância crescer.',
    defaultTool: 'move'
  },
  {
    step: 3,
    title: 'Mover e comparar',
    subtitle: 'Deslocamento sonoro no espaço',
    instruction: 'Mova o ônibus azul pela rua permitida. Ouça como o som se afasta ou se aproxima do seu ponto de escuta conforme ele viaja.',
    hint: 'Arraste o ônibus pela curva da praça ou use as setas do teclado.',
    defaultTool: 'move'
  },
  {
    step: 4,
    title: 'Comparar distâncias',
    subtitle: 'Discriminação auditiva A/B',
    instruction: 'Escolha duas fontes sonoras, escute cada uma alternadamente e indique qual soa mais próxima do seu ponto de escuta.',
    hint: 'Alterne entre Fonte A e Fonte B com os botões rápidos para comparar com clareza.',
    defaultTool: 'compare'
  },
  {
    step: 5,
    title: 'Compor paisagem',
    subtitle: 'Combinação harmoniosa e revisão',
    instruction: 'Combine até 3 fontes simultâneas para criar a sua paisagem sonora favorita da cidade. Revise suas explorações e conclua sua cartografia.',
    hint: 'Experimente misturar Água da Fonte com Pássaros e Ônibus distante.',
    defaultTool: 'listen'
  }
];

// Waypoint spline nodes for valid bus travel on the street network
export const STREET_WAYPOINTS: [number, number, number][] = [
  [-5.2, 0.2, 1.4],
  [-3.8, 0.2, 1.4],
  [-2.2, 0.2, 1.4],
  [-0.6, 0.2, 1.2],
  [0.8, 0.2, 1.6],
  [2.4, 0.2, 1.8],
  [3.6, 0.2, 1.0],
  [3.2, 0.2, -0.4],
  [1.8, 0.2, -0.8],
  [0.2, 0.2, -0.6],
  [-0.8, 0.2, -0.2],
  [-1.2, 0.2, -1.6],
  [-1.2, 0.2, -3.2]
];

export const ACCESSIBILITY_STRINGS = {
  skipIntro: 'Ir direto para exploração',
  pauseAria: 'Pausar experiência',
  resumeAria: 'Retomar experiência',
  muteAria: 'Silenciar todos os sons',
  unmuteAria: 'Restaurar reprodução dos sons',
  volumeSliderAria: 'Ajuste de volume geral',
  nextStep: 'Avançar etapa',
  prevStep: 'Etapa anterior',
  restartExperience: 'Reiniciar experiência',
  downloadMap: 'Exportar mapa sonoro',
  audioCaptionsToggle: 'Legendas sonoras visuais',
  highContrastToggle: 'Modo alto contraste'
};
