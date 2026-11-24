// Conteúdo estático: fios, espessuras, padrões de apoio, configurações iniciais e textos.
// Nenhum desses dados recebe escore; os significados dos fios pertencem a quem tece.

export type Crossing = 'over' | 'under';
export type ThicknessId = 'fina' | 'media' | 'grossa';
export type PatternId = 'livre' | 'tafeta' | 'sarja' | 'cesto' | 'losango';
export type ModeId = 'livre' | 'demonstrado' | 'compartilhado' | 'tensao' | 'mapa' | 'acompanhado';
export type ToolId = 'fio' | 'entrelacar' | 'tensionar' | 'separar' | 'tecido';

export interface Yarn {
  id: string;
  nome: string;
  /** cor sRGB em hex */
  cor: string;
  /** cor do brilho de fibra (sheen) */
  brilho: string;
}

export const YARNS: readonly Yarn[] = [
  { id: 'linho', nome: 'Linho cru', cor: '#E9DFC9', brilho: '#FFF6E6' },
  { id: 'telha', nome: 'Telha', cor: '#AA584D', brilho: '#E08A76' },
  { id: 'mostarda', nome: 'Mostarda', cor: '#D7A94A', brilho: '#F4D58A' },
  { id: 'salvia', nome: 'Sálvia profunda', cor: '#3F6F69', brilho: '#7FB3AA' },
  { id: 'lavanda', nome: 'Lavanda', cor: '#8A6AA8', brilho: '#C2A9DC' },
  { id: 'areia', nome: 'Areia', cor: '#B9A58D', brilho: '#E3D3BD' },
] as const;

export const YARN_IDS = YARNS.map((y) => y.id);

export function yarnById(id: string): Yarn {
  return YARNS.find((y) => y.id === id) ?? YARNS[0];
}

export interface Thickness {
  id: ThicknessId;
  nome: string;
  /** raio do fio de trama em metros */
  raio: number;
}

export const THICKNESSES: readonly Thickness[] = [
  { id: 'fina', nome: 'Fina', raio: 0.0042 },
  { id: 'media', nome: 'Média', raio: 0.0062 },
  { id: 'grossa', nome: 'Grossa', raio: 0.0088 },
] as const;

export function thicknessById(id: ThicknessId): Thickness {
  return THICKNESSES.find((t) => t.id === id) ?? THICKNESSES[1];
}

/** Raio dos fios de urdidura (linho). */
export const WARP_RADIUS = 0.0021;

export interface PatternDef {
  id: PatternId;
  nome: string;
  descricao: string;
}

export const PATTERNS: readonly PatternDef[] = [
  { id: 'livre', nome: 'Livre', descricao: 'Cada cruzamento é escolhido por você.' },
  { id: 'tafeta', nome: 'Tafetá', descricao: 'Alterna por cima e por baixo, um a um.' },
  { id: 'sarja', nome: 'Sarja', descricao: 'Dois por cima, dois por baixo, deslocando a cada passada.' },
  { id: 'cesto', nome: 'Cesto', descricao: 'Pares de passadas iguais, como trama de cesto.' },
  { id: 'losango', nome: 'Losango', descricao: 'Desenho em losangos que se abre e fecha.' },
] as const;

/**
 * Cruzamento sugerido por um padrão de apoio para a passada `row` no fio de urdidura `warp`.
 * Determinístico: a mesma entrada produz sempre a mesma sugestão.
 */
export function patternCrossing(pattern: PatternId, row: number, warp: number, warpCount: number): Crossing {
  switch (pattern) {
    case 'sarja':
      return ((warp + row) % 4) < 2 ? 'over' : 'under';
    case 'cesto':
      return ((Math.floor(warp / 2) + Math.floor(row / 2)) % 2) === 0 ? 'over' : 'under';
    case 'losango': {
      const period = 8;
      const center = Math.floor(warpCount / 2);
      const d = Math.abs(warp - center) % period;
      const r = row % period;
      const k = Math.abs(r - period / 2);
      return Math.abs(d - k) <= 1 ? 'over' : (((warp + row) % 2) === 0 ? 'over' : 'under');
    }
    case 'tafeta':
    case 'livre':
    default:
      return ((warp + row) % 2) === 0 ? 'over' : 'under';
  }
}

export interface InitialConfig {
  id: string;
  nome: string;
  descricao: string;
  warpCount: number;
  pattern: PatternId;
  yarns: string[];
  thickness: ThicknessId;
  /** passadas sugeridas para a atividade estruturada */
  rowsGoal: number;
}

/** Três configurações iniciais realmente distintas para os modos estruturados. */
export const INITIAL_CONFIGS: readonly InitialConfig[] = [
  {
    id: 'faixa-simples',
    nome: 'Faixa simples',
    descricao: '12 fios de urdidura, tafetá, fio grosso. Poucas decisões por passada.',
    warpCount: 12,
    pattern: 'tafeta',
    yarns: ['telha', 'linho'],
    thickness: 'grossa',
    rowsGoal: 4,
  },
  {
    id: 'listras-de-vinculo',
    nome: 'Listras de vínculo',
    descricao: '18 fios, sarja, quatro cores. Troca de fio, prender ponta e nó.',
    warpCount: 18,
    pattern: 'sarja',
    yarns: ['salvia', 'mostarda', 'telha', 'linho'],
    thickness: 'media',
    rowsGoal: 8,
  },
  {
    id: 'losangos',
    nome: 'Losangos',
    descricao: '24 fios, desenho em losango, fio médio. Sequência longa de cruzamentos.',
    warpCount: 24,
    pattern: 'losango',
    yarns: ['mostarda', 'linho', 'salvia'],
    thickness: 'media',
    rowsGoal: 10,
  },
] as const;

export interface ModeDef {
  id: ModeId;
  nome: string;
  descricao: string;
}

export const MODES: readonly ModeDef[] = [
  { id: 'livre', nome: 'Livre', descricao: 'Tecer sem etapas nem metas.' },
  { id: 'demonstrado', nome: 'Padrão demonstrado', descricao: 'Demonstração pulável e pistas graduais.' },
  { id: 'compartilhado', nome: 'Tecelagem compartilhada', descricao: 'Duas pessoas alternam passadas.' },
  { id: 'tensao', nome: 'Experimentar tensão', descricao: 'Comparar fileiras com tensões diferentes.' },
  { id: 'mapa', nome: 'Mapa de vínculos', descricao: 'Dar nomes opcionais aos fios.' },
  { id: 'acompanhado', nome: 'Acompanhado', descricao: 'Configuração e registro por profissional.' },
] as const;

/** Convites abertos e fenomenológicos. Nenhum interpreta escolhas. */
export const INVITES: readonly string[] = [
  'O que você percebe quando experimenta outra forma de entrelaçar?',
  'Como fica o fio quando você aperta ou solta a tensão?',
  'Que fio você quer trazer para perto agora?',
  'Há algum trecho que você quer separar ou reconectar?',
  'O que muda quando duas mãos tecem a mesma peça?',
] as const;

export const TOOL_LABELS: Record<ToolId, string> = {
  fio: 'Escolher fio',
  entrelacar: 'Entrelaçar',
  tensionar: 'Tensionar',
  separar: 'Separar',
  tecido: 'Ver tecido',
};

export const HELP: Record<ToolId, string> = {
  fio: 'Toque em um novelo na cesta ou na barra inferior para escolher a cor. Escolha também a espessura. A troca vale para a próxima passada.',
  entrelacar: 'Arraste a lançadeira pela urdidura ou use os botões “Por cima” e “Por baixo” (setas ↑ e ↓). As setas ao lado do próximo fio também funcionam. Ao completar a passada, o pente aperta a fileira.',
  tensionar: 'Arraste a roldana para cima ou para baixo, use o controle deslizante ou as teclas + e −. Tensão alta deixa o fio reto e estreita a borda; tensão baixa deixa ondas.',
  separar: 'Toque em duas fileiras do tecido para marcar um trecho. “Cortar trecho” pede confirmação e remove só o trecho marcado. Depois use “Reconectar”. “Desfazer cruzamento” volta um passo da passada atual. “Prender ponta” e “Dar nó” cuidam das pontas soltas.',
  tecido: 'Veja o tecido de perto. Você pode revisar a construção, exportar a imagem, salvar no navegador se quiser, ou começar de novo.',
};
