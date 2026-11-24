/**
 * Meteorologia das Emocoes — conteudo e textos em pt-BR.
 * Nenhuma escolha subjetiva e classificada como certa ou errada.
 */

export type ModeInfo = {
  id: 'free' | 'guided' | 'accompanied';
  title: string;
  description: string;
};

export const MODES: ModeInfo[] = [
  {
    id: 'free',
    title: 'Livre',
    description: 'Explore os quatro mostradores no seu ritmo, sem avaliacao.',
  },
  {
    id: 'guided',
    title: 'Guiada',
    description: 'Pistas graduais sugerem ajustes, mas voce decide o clima.',
  },
  {
    id: 'accompanied',
    title: 'Acompanhada',
    description: 'Um adulto define os parametros; nao se presume diagnostico.',
  },
];

export type WeatherLabel = {
  kind: 'sun' | 'cloud' | 'rain' | 'wind';
  title: string;
  aria: string;
  hint: string;
};

export const WEATHER_LABELS: WeatherLabel[] = [
  {
    kind: 'sun',
    title: 'Sol',
    aria: 'Mostrador do sol',
    hint: 'Clareia a iluminacao e aquece tons da cena.',
  },
  {
    kind: 'cloud',
    title: 'Nuven',
    aria: 'Mostrador das nuvens',
    hint: 'Altera a opacidade das camadas de nuvens.',
  },
  {
    kind: 'rain',
    title: 'Chuva',
    aria: 'Mostrador da chuva',
    hint: 'Particulas do lado de fora do vidro e gotas na janela.',
  },
  {
    kind: 'wind',
    title: 'Vento',
    aria: 'Mostrador do vento',
    hint: 'Move folhas suavemente e inclina a chuva.',
  },
];

export const WEATHER_INTENSITY_LABELS = ['Nenhum', 'Pouco', 'Medio', 'Forte', 'Muito forte'];

export const STEP_TITLES: Record<string, string> = {
  start: 'Bem-vindo',
  'choose-mode': 'Como voce quer começar?',
  demo: 'Demonstracao opcional',
  compose: 'Compor o clima',
  review: 'Revisar composicao',
  summary: 'Concluir',
  exit: 'Sair',
};

export const BULLETIN_PLACEHOLDER = 'Hoje meu clima está...';

export const BULLETIN_HINT = 'Voce pode deixar em branco, usar icones ou escrever livremente.';

export const TAG_LABELS: Record<EmotionTag, string> = {
  animado: 'Animado',
  cansado: 'Cansado',
  confuso: 'Confuso',
  outro: 'Outro',
};

export const TEXTS = {
  appTitle: 'Meteorologia das Emocoes',
  composePanel: 'Compor o clima',
  btnWriteBulletin: 'Escrever boletim',
  btnRestart: 'Recomeçar',
  btnSaveSnapshot: 'Guardar composicao',
  btnCompare: 'Comparar versões',
  btnDelete: 'Apagar',
  btnExport: 'Exportar resumo (JSON)',
  btnStart: 'Começar sessão',
  btnSkip: 'Pular',
  btnBack: 'Voltar',
  btnContinue: 'Continuar',
  btnFinish: 'Concluir',
  btnExit: 'Sair',
  btnConfirmReset: 'Sim, recomeçar',
  btnCancel: 'Cancelar',
  btnToggleAudioRain: 'Ativar/desativar som de chuva',
  btnToggleAudioWind: 'Ativar/desativar som de vento',
  btnMute: 'Silenciar audio',
  lblYourName: 'Seu nome',
  lblGoal: 'Objetivo da sessao em uma frase',
  lblStep: 'Etapa',
  lblOf: 'de',
  confirmResetTitle: 'Recomecar?',
  confirmResetBody:
    'Isso apaga a composicao atual, o boletim e as comparacoes. Essa acao nao pode ser desfeita.',
  sharedDeviceNotice:
    'Em dispositivo compartilhado, nao guarde textos pessoais. Vode apagar o resumo a qualquer momento.',
  noClinicalPromise:
    'Este jogo nao diagnostica nem promete beneficio clinico. As escolhas sao subjetivas.',
  loaded: 'Carregado com sucesso.',
  errorLoad: 'Falha ao carregar. Tente recarregar a pagina.',
  ariaLiveRegion: 'Avisos do jogo',
} as const;

export type EmotionTag = 'animado' | 'cansado' | 'confuso' | 'outro';

export const EMOTION_TAGS: EmotionTag[] = ['animado', 'cansado', 'confuso', 'outro'];
