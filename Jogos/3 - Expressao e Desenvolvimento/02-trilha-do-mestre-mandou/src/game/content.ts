/**
 * Conteúdo, Metadados e Símbolos do Parque Florestal
 * Projeto: 02. Trilha do Mestre Mandou
 */

export interface TrailTarget {
  id: string;
  name: string;
  command: string;
  actionText: string;
  hint: string;
  symbol: 'sino' | 'tambor' | 'roda' | 'estrela' | 'espiral' | 'folha' | 'cabana' | 'barco';
  pos: [number, number, number];
  color: string;
  radius: number;
}

export const TARGETS_CATALOG: Record<string, TrailTarget> = {
  sino_azul: {
    id: 'sino_azul',
    name: 'Sino Azul',
    command: 'Toque no sino azul',
    actionText: 'Tocar o sino azul',
    hint: 'Siga pela ponte de madeira até o rochedo suspenso onde o sino azul de bronze está pendurado.',
    symbol: 'sino',
    pos: [14.0, 3.2, -6.0],
    color: '#5599A5',
    radius: 3.2
  },
  tambor: {
    id: 'tambor',
    name: 'Tambor da Clareira',
    command: 'Toque o tambor da clareira',
    actionText: 'Tocar o tambor',
    hint: 'Caminhe até a clareira ensolarada à direita, onde fica o tambor de tronco e couro.',
    symbol: 'tambor',
    pos: [10.0, 0.8, 12.0],
    color: '#B9634B',
    radius: 3.0
  },
  roda_dagua: {
    id: 'roda_dagua',
    name: "Roda d'Água",
    command: "Gire a roda d'água",
    actionText: "Fazer a roda d'água girar",
    hint: 'Desça até a margem do riacho onde as pás de madeira giram com a força da correnteza.',
    symbol: 'roda',
    pos: [-8.0, 0.6, -10.0],
    color: '#E5BC58',
    radius: 3.5
  },
  plataforma_estrela: {
    id: 'plataforma_estrela',
    name: 'Plataforma Estrela',
    command: 'Pise na plataforma da estrela',
    actionText: 'Alcançar a estrela',
    hint: 'Suba na passarela elevada com o símbolo dourado da estrela gravado na madeira.',
    symbol: 'estrela',
    pos: [2.0, 2.2, -8.0],
    color: '#E5BC58',
    radius: 2.8
  },
  plataforma_espiral: {
    id: 'plataforma_espiral',
    name: 'Plataforma Espiral',
    command: 'Pise na plataforma da espiral',
    actionText: 'Alcançar a espiral',
    hint: 'Vá até a plataforma circular no meio do riacho marcada com a espiral zen.',
    symbol: 'espiral',
    pos: [-4.0, 1.2, 4.0],
    color: '#81945B',
    radius: 2.8
  },
  cabana: {
    id: 'cabana',
    name: 'Cabana do Mirante',
    command: 'Visite a cabana do mirante',
    actionText: 'Entrar na cabana',
    hint: 'Siga a trilha subindo a colina até a cabana de madeira com vista para o vale.',
    symbol: 'cabana',
    pos: [-14.0, 3.8, 10.0],
    color: '#9A704A',
    radius: 3.5
  },
  barco: {
    id: 'barco',
    name: 'Barco do Remanso',
    command: 'Suba no barco do riacho',
    actionText: 'Explorar o barco',
    hint: 'Caminhe até o píer de madeira na curva calma do riacho.',
    symbol: 'barco',
    pos: [4.0, 0.4, 18.0],
    color: '#5599A5',
    radius: 3.2
  }
};

/**
 * Sequência padrão de 4 etapas do Mestre Mandou
 */
export const DEFAULT_TRAIL_SEQUENCE: TrailTarget[] = [
  TARGETS_CATALOG.plataforma_estrela,
  TARGETS_CATALOG.sino_azul,
  TARGETS_CATALOG.tambor,
  TARGETS_CATALOG.roda_dagua
];
