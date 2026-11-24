/**
 * Laboratório de Camadas Sonoras — Conteúdo, Canais e Desafios Auditivos
 * Textos em pt-BR com fundamentação fenomenológica e convite à exploração sensorial
 */

import { ChannelId } from './state';

export interface SoundChannelInfo {
  id: ChannelId;
  name: string;
  shortLabel: string;
  iconName: string;
  clocheIndex: number;
  description: string;
  frequencyRange: string;
  character: string;
}

export interface AudioChallenge {
  id: string;
  title: string;
  difficulty: 'Fácil' | 'Médio' | 'Avançado';
  description: string;
  targetId: ChannelId;
  backgroundChannels: Array<{ id: ChannelId; level: number }>;
  hints: string[];
  reflection: string;
}

export const CHANNELS_CATALOG: SoundChannelInfo[] = [
  {
    id: 'speech',
    name: 'Vozes / Conversa',
    shortLabel: 'Fala',
    iconName: 'speech',
    clocheIndex: 0,
    description: 'Murmúrios confortáveis de conversas distantes sem palavras identificáveis.',
    frequencyRange: 'Médios (300 Hz – 3.4 kHz)',
    character: 'Orgânico e rítmico'
  },
  {
    id: 'footsteps',
    name: 'Passos / Tênis',
    shortLabel: 'Passos',
    iconName: 'shoe',
    clocheIndex: 1,
    description: 'Passadas firmes com tênis macio sobre assoalho de carvalho.',
    frequencyRange: 'Graves e Médios-graves (80 Hz – 500 Hz)',
    character: 'Pulsado e cadenciado'
  },
  {
    id: 'fan',
    name: 'Ventilador / Brisa',
    shortLabel: 'Ventilador',
    iconName: 'fan',
    clocheIndex: 2,
    description: 'Zumbido mecânico suave de motor elétrico com deslocamento de ar contínuo.',
    frequencyRange: 'Ruído broadband com pico em 120 Hz',
    character: 'Contínuo e hipnótico'
  },
  {
    id: 'city',
    name: 'Cidade / Trânsito',
    shortLabel: 'Cidade',
    iconName: 'city',
    clocheIndex: 3,
    description: 'Paisagem sonora urbana distante com tráfego leve e espaço aberto.',
    frequencyRange: 'Sub-graves e agudos difusos',
    character: 'Amplo e difuso'
  },
  {
    id: 'music',
    name: 'Melodia Suave',
    shortLabel: 'Música',
    iconName: 'music',
    clocheIndex: 4,
    description: 'Sequência harmônica calma em teclado Rhodes e vibrafone suave.',
    frequencyRange: 'Espectro melódico harmônico (261 Hz – 2 kHz)',
    character: 'Lírico e relaxante'
  }
];

export const AUDIO_CHALLENGES: AudioChallenge[] = [
  {
    id: 'c1',
    title: '1. Passos no Assoalho',
    difficulty: 'Fácil',
    description: 'Uma caminhada está acontecendo em meio ao movimento da cidade. Use os faders ou o botão fone para encontrar os passos.',
    targetId: 'footsteps',
    backgroundChannels: [
      { id: 'city', level: 0.5 },
      { id: 'footsteps', level: 0.4 }
    ],
    hints: [
      'Preste atenção no ritmo regular de batidas no chão.',
      'Você pode silenciar a cidade para isolar a batida dos passos.'
    ],
    reflection: 'Como você percebeu a transição da batida rítmica dos passos em relação ao ruído contínuo?'
  },
  {
    id: 'c2',
    title: '2. Conversa em Primeiro Plano',
    difficulty: 'Fácil',
    description: 'Vozes suaves estão ao fundo de uma música instrumental. Encontre o canal de fala.',
    targetId: 'speech',
    backgroundChannels: [
      { id: 'music', level: 0.6 },
      { id: 'speech', level: 0.35 }
    ],
    hints: [
      'Procure as variações de entonação e pausas características da fala.',
      'Toque no botão de fone do canal correspondente para confirmar.'
    ],
    reflection: 'O que mudou na sua atenção quando as vozes ficaram isoladas da música?'
  },
  {
    id: 'c3',
    title: '3. A Brisa do Ventilador',
    difficulty: 'Médio',
    description: 'O zumbido mecânico do ventilador está misturado à cidade e à música. Localize a fonte de vento.',
    targetId: 'fan',
    backgroundChannels: [
      { id: 'city', level: 0.4 },
      { id: 'music', level: 0.4 },
      { id: 'fan', level: 0.4 }
    ],
    hints: [
      'O ventilador tem um ronco estável e um sopro contínuo de ar.',
      'Observe o movimento das pás na redoma central ao elevar o volume.'
    ],
    reflection: 'Sons contínuos tendem a ser esquecidos pelo cérebro com facilidade. Como foi focar conscientemente nele?'
  },
  {
    id: 'c4',
    title: '4. Harmonia Urbana',
    difficulty: 'Médio',
    description: 'Em meio a 4 camadas ativas, identifique qual delas carrega as notas musicais.',
    targetId: 'music',
    backgroundChannels: [
      { id: 'speech', level: 0.3 },
      { id: 'fan', level: 0.3 },
      { id: 'city', level: 0.3 },
      { id: 'music', level: 0.4 }
    ],
    hints: [
      'A melodia se destaca pela altura tonal bem definida.',
      'Experimente diminuir o fader do ventilador primeiro.'
    ],
    reflection: 'Qual camada foi a primeira que você sentiu vontade de atenuar para poder ouvir melhor?'
  },
  {
    id: 'c5',
    title: '5. O Eco da Metrópole',
    difficulty: 'Avançado',
    description: 'Diferencie a ambiência da cidade dos murmúrios de conversa e da brisa mecânica.',
    targetId: 'city',
    backgroundChannels: [
      { id: 'speech', level: 0.4 },
      { id: 'fan', level: 0.4 },
      { id: 'city', level: 0.35 }
    ],
    hints: [
      'A cidade tem sons graves amplos e ressonâncias distantes.',
      'Experimente o botão "Isolar" para confirmar.'
    ],
    reflection: 'O espaço da cidade soa mais "amplo" do que o espaço da sala do ventilador?'
  },
  {
    id: 'c6',
    title: '6. Escuta Plena — Todas as Camadas',
    difficulty: 'Avançado',
    description: 'Todos os 5 canais estão presentes na mixagem. Encontre a camada de tênis/passos.',
    targetId: 'footsteps',
    backgroundChannels: [
      { id: 'speech', level: 0.3 },
      { id: 'footsteps', level: 0.35 },
      { id: 'fan', level: 0.3 },
      { id: 'city', level: 0.3 },
      { id: 'music', level: 0.3 }
    ],
    hints: [
      'Com 5 camadas simultâneas, nossa atenção precisa de uma âncora rítmica.',
      'Use o solo para conferir se o som coincide com a redoma do tênis verde.'
    ],
    reflection: 'Quando todas as camadas tocam juntas, o que predomina na sua experiência?'
  }
];

export function getChannelInfo(id: ChannelId): SoundChannelInfo {
  return CHANNELS_CATALOG.find(c => c.id === id) || CHANNELS_CATALOG[0];
}
