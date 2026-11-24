/**
 * Conteúdo do Atlas das Texturas: amostras, etapas, descritores e textos em pt-BR.
 * Tom de convite e experimento: perguntas abertas, sem classificação de certo/errado.
 */

export const SAMPLE_IDS = ['cork', 'wool', 'slate', 'linen', 'leaf', 'smooth_wood', 'ceramic', 'sandstone'] as const;
export type SampleId = (typeof SAMPLE_IDS)[number];

export interface SampleInfo {
  id: SampleId;
  name: string;
  /** Descrição física neutra do que está na bancada (não do que se "deve" sentir). */
  detail: string;
  /** Pergunta aberta própria desta superfície. */
  question: string;
}

export const SAMPLES: Record<SampleId, SampleInfo> = {
  cork: {
    id: 'cork',
    name: 'Cortiça',
    detail: 'Pedaço irregular de casca de sobreiro, em blocos com fendas e poros.',
    question: 'Onde a luz para e onde ela entra nas fendas?',
  },
  wool: {
    id: 'wool',
    name: 'Lã',
    detail: 'Mecha de lã crua com cachos e fibras soltas.',
    question: 'Como as fibras mudam quando a luz passa rente a elas?',
  },
  slate: {
    id: 'slate',
    name: 'Ardósia',
    detail: 'Placa escura de pedra em camadas finas, com bordas lascadas.',
    question: 'O que aparece na superfície escura quando a luz desce?',
  },
  linen: {
    id: 'linen',
    name: 'Linho cru',
    detail: 'Quadrado de tecido de trama aberta, com franja desfiada.',
    question: 'Você percebe a trama antes ou depois de aproximar?',
  },
  leaf: {
    id: 'leaf',
    name: 'Folha',
    detail: 'Folha verde com nervuras salientes e borda levemente serrilhada.',
    question: 'O que muda nas nervuras quando a luz vem por trás?',
  },
  smooth_wood: {
    id: 'smooth_wood',
    name: 'Madeira lisa',
    detail: 'Bloco de madeira lixada e encerada, com veios aparentes.',
    question: 'Os veios aparecem como cor, como relevo ou como brilho?',
  },
  ceramic: {
    id: 'ceramic',
    name: 'Cerâmica',
    detail: 'Caco curvo de tigela esmaltada, com craquelado fino.',
    question: 'Como o brilho do esmalte acompanha a curva do caco?',
  },
  sandstone: {
    id: 'sandstone',
    name: 'Arenito',
    detail: 'Seixo de arenito com grãos visíveis e faixas de sedimento.',
    question: 'Os grãos parecem soltos ou presos uns aos outros?',
  },
};

export const STEP_IDS = ['escolher', 'observar', 'rasante', 'comparar', 'guardar', 'revisar'] as const;
export type StepId = (typeof STEP_IDS)[number];

export interface StepInfo {
  id: StepId;
  title: string;
  invite: string;
  /** Pistas graduais do modo guiado (uma por vez). */
  hints: string[];
}

export const STEPS: StepInfo[] = [
  {
    id: 'escolher',
    title: 'Escolher amostras',
    invite: 'Escolha duas superfícies da bancada. Qual delas chama seu olhar primeiro?',
    hints: [
      'Toque em uma bandeja ou use a lista. Cada amostra pode entrar e sair da escolha.',
      'Duas amostras bastam para comparar depois. Você pode trocar a qualquer momento.',
    ],
  },
  {
    id: 'observar',
    title: 'Observar à luz difusa',
    invite: 'Com a luz espalhada da sala, gire a amostra e aproxime. O que você percebe primeiro?',
    hints: [
      'Arraste sobre a amostra com a ferramenta Mão, ou use os botões de girar.',
      'Use “Aproximar” para chegar perto da superfície. Repare nas bordas.',
    ],
  },
  {
    id: 'rasante',
    title: 'Luz rasante',
    invite: 'Desça a luz e gire a luminária. O que aparece quando a luz passa rente?',
    hints: [
      'Toque em “Girar a luz” para um giro lento, ou ajuste ângulo e altura com os botões.',
      'Altura baixa deixa sombras longas. Compare 15° com 60°.',
      'Abra a lupa e passe sobre a superfície para ver os detalhes ampliados.',
    ],
  },
  {
    id: 'comparar',
    title: 'Comparar lado a lado',
    invite: 'As duas amostras estão sob a mesma luz e na mesma escala. Como cada uma recebe essa luz?',
    hints: [
      'Os descritores são opcionais. Escolha nenhum, um ou vários.',
      '“Não sei” também é uma observação possível.',
    ],
  },
  {
    id: 'guardar',
    title: 'Guardar no atlas',
    invite: 'Guarde as amostras no atlas. Se quiser, deixe um cartão de preferência.',
    hints: ['O cartão de preferência é opcional. Você pode guardar sem marcar nada.'],
  },
  {
    id: 'revisar',
    title: 'Revisar a coleção',
    invite: 'Folheie o atlas. O que se repete nas superfícies que você guardou?',
    hints: ['Você pode retirar uma entrada ou experimentar outras amostras.'],
  },
];

export const DESCRIPTORS = ['liso', 'rugoso', 'fibroso', 'granulado', 'outro', 'nao_sei'] as const;
export type Descriptor = (typeof DESCRIPTORS)[number];
export const DESCRIPTOR_LABEL: Record<Descriptor, string> = {
  liso: 'liso',
  rugoso: 'rugoso',
  fibroso: 'fibroso',
  granulado: 'granulado',
  outro: 'outro',
  nao_sei: 'não sei',
};

export const PREFERENCES = ['gostei', 'indiferente', 'evitar'] as const;
export type Preference = (typeof PREFERENCES)[number];
export const PREFERENCE_LABEL: Record<Preference, string> = {
  gostei: 'gostei',
  indiferente: 'indiferente',
  evitar: 'prefiro evitar',
};

export const MODES = ['livre', 'guiado', 'acompanhado'] as const;
export type Mode = (typeof MODES)[number];
export const MODE_INFO: Record<Mode, { name: string; text: string }> = {
  livre: { name: 'Livre', text: 'Explore todas as amostras e troque quando quiser, sem roteiro.' },
  guiado: { name: 'Guiado', text: 'Pistas graduais aparecem quando você pedir.' },
  acompanhado: { name: 'Acompanhado', text: 'Um adulto escolhe de 2 a 4 amostras antes de começar.' },
};

export const LIGHT_PRESETS = ['sala', 'tarde', 'noite'] as const;
export type LightPreset = (typeof LIGHT_PRESETS)[number];
export const LIGHT_PRESET_LABEL: Record<LightPreset, string> = {
  sala: 'Manhã na sala',
  tarde: 'Fim de tarde',
  noite: 'Noite com luminária',
};

export const OPEN_QUESTIONS = [
  'O que muda quando a luz desce?',
  'Como é aproximar até a superfície ocupar o olhar?',
  'Qual detalhe só apareceu na comparação?',
  'O que você percebe agora que não percebia no começo?',
];

export const DISCLAIMER = 'Apenas descrição. O significado é de quem cria.';
export const NOT_TOUCH =
  'A tela mostra luz e relevo; ela não reproduz o toque. O que você anota é o que vê.';

export const LOADING_LINES = [
  'Lixando a bancada de carvalho…',
  'Esticando o feltro na bandeja…',
  'Abrindo os poros da cortiça…',
  'Cardando a lã…',
  'Lascando a ardósia em camadas…',
  'Desfiando a franja do linho…',
  'Desenhando as nervuras da folha…',
  'Polindo o latão da luminária…',
  'Organizando as gavetas de amostras…',
];
