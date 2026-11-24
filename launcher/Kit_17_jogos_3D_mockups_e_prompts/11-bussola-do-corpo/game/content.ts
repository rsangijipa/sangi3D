export const regions = {
  head: 'Cabeça', neck: 'Pescoço', chest: 'Tórax', belly: 'Abdômen', back: 'Costas',
  upperR: 'Braço direito', upperL: 'Braço esquerdo',
  foreR: 'Antebraço direito', foreL: 'Antebraço esquerdo',
  handR: 'Mão direita', handL: 'Mão esquerda',
  legR: 'Perna direita', legL: 'Perna esquerda', footR: 'Pé direito', footL: 'Pé esquerdo',
  unknown: 'Não sei onde',
} as const;
export const sensations = {
  energy: ['Expansão / energia', 'sun'], cold: ['Frio', 'snowflake'],
  waves: ['Ondas', 'waves'], tingle: ['Formigamento', 'grip'],
  weight: ['Peso', 'weight'], sharp: ['Pontadas', 'zap'],
  heat: ['Calor', 'flame'], lightness: ['Leveza', 'feather'],
} as const;
export const stages = ['Chegada', 'Região', 'Sensação', 'Intensidade', 'Revisão'];
export const modes = { free: 'Livre', guided: 'Guiado', accompanied: 'Acompanhado' } as const;
export type Region = keyof typeof regions;
export type Sensation = keyof typeof sensations;
export type Mode = keyof typeof modes;
export type Intensity = 0 | 1 | 2 | 3 | 4 | 'unknown' | null;
export const storageKey = 'bussola-do-corpo:registro:v1';
