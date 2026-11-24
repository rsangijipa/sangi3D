/**
 * Porto das Decisões — Conteúdo, Missões, Grafo Náutico e Barcos
 * Definições e textos em pt-BR com tom fenomenológico e convite à experimentação
 */

import { BoatConfig, CargoItem } from './state';

export interface HarborNode {
  id: string;
  name: string;
  shortLabel: string;
  pos: [number, number, number]; // [x, y, z] em metros no Three.js
  dock: boolean;
  description: string;
}

export interface HarborEdge {
  from: string;
  to: string;
  length: number;
  condition?: string;
}

export interface MissionDefinition {
  id: string;
  title: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  targetBoxes: number;
  description: string;
  initialBoatId: 'blue' | 'green' | 'red';
  requiredDestinations: string[];
  cargoSet: CargoItem[];
  tips: string[];
  reflectionQuestions: string[];
}

export const HARBOR_NODES: HarborNode[] = [
  {
    id: 'node_harbor',
    name: 'Cais Central do Porto',
    shortLabel: 'Porto',
    pos: [-3.2, 0.08, 3.8],
    dock: true,
    description: 'Armazéns terracota com guindaste de carga e estoque de caixas.'
  },
  {
    id: 'node_channel_1',
    name: 'Boia do Canal Oeste',
    shortLabel: 'Canal Oeste',
    pos: [-0.8, 0.08, 2.6],
    dock: false,
    description: 'Águas calmas na saída da bacia principal do porto.'
  },
  {
    id: 'node_crossing',
    name: 'Encruzilhada das Águas',
    shortLabel: 'Encruzilhada',
    pos: [1.2, 0.08, 0.2],
    dock: false,
    description: 'Ponto de bifurcação entre o canal norte, a doca sul e o entreposto leste.'
  },
  {
    id: 'node_quay_south',
    name: 'Doca dos Pescadores',
    shortLabel: 'Doca Pescadores',
    pos: [2.5, 0.08, 3.4],
    dock: true,
    description: 'Trapiche artesanal com redes de pesca e estacas de madeira.'
  },
  {
    id: 'node_bay_north',
    name: 'Canal Norte das Ilhas',
    shortLabel: 'Canal Norte',
    pos: [-0.6, 0.08, -2.4],
    dock: false,
    description: 'Águas abertas ao norte com vista para o cais alto.'
  },
  {
    id: 'node_outpost_east',
    name: 'Entreposto Leste',
    shortLabel: 'Entreposto',
    pos: [3.2, 0.08, -0.6],
    dock: true,
    description: 'Terminal de intercâmbio de mercadorias e suprimentos.'
  },
  {
    id: 'node_lighthouse',
    name: 'Farol da Ponta',
    shortLabel: 'Farol',
    pos: [4.2, 0.08, -2.4],
    dock: true,
    description: 'Baliza marítima na entrada oceânica da enseada.'
  }
];

export const HARBOR_EDGES: HarborEdge[] = [
  { from: 'node_harbor', to: 'node_channel_1', length: 2.55, condition: 'Canal seguro de manobra' },
  { from: 'node_channel_1', to: 'node_crossing', length: 2.50, condition: 'Águas abrigadas' },
  { from: 'node_crossing', to: 'node_quay_south', length: 3.45, condition: 'Passagem sul' },
  { from: 'node_crossing', to: 'node_outpost_east', length: 2.15, condition: 'Canal direto leste' },
  { from: 'node_crossing', to: 'node_bay_north', length: 3.00, condition: 'Braço d’água norte' },
  { from: 'node_quay_south', to: 'node_outpost_east', length: 4.05, condition: 'Travessia costeira sudeste' },
  { from: 'node_bay_north', to: 'node_outpost_east', length: 4.20, condition: 'Descida leste' },
  { from: 'node_outpost_east', to: 'node_lighthouse', length: 2.05, condition: 'Acesso oceânico ao farol' },
  { from: 'node_bay_north', to: 'node_lighthouse', length: 4.80, condition: 'Canal externo profundo' },
  { from: 'node_harbor', to: 'node_bay_north', length: 6.70, condition: 'Canal norte direto' },
  { from: 'node_channel_1', to: 'node_quay_south', length: 3.40, condition: 'Acesso sul direto' }
];

export const BOATS_CATALOG: Record<'blue' | 'green' | 'red', BoatConfig> = {
  blue: {
    id: 'blue',
    name: 'Andorinha Azul',
    capacity: 3,
    speed: 2.2,
    colorHex: '#2563EB',
    hullColor: '#1E40AF',
    description: 'Embarcação costeira leve, ágil para viagens rápidas de até 3 caixas.',
    specialty: 'Velocidade alta, menor capacidade'
  },
  green: {
    id: 'green',
    name: 'Traineira Caiçara',
    capacity: 4,
    speed: 1.8,
    colorHex: '#16A34A',
    hullColor: '#15803D',
    description: 'Barco tradicional de pesca com convés equilibrado para até 4 caixas.',
    specialty: 'Capacidade média, estabilidade clássica'
  },
  red: {
    id: 'red',
    name: 'Rebocador Guardião',
    capacity: 5,
    speed: 1.4,
    colorHex: '#DC2626',
    hullColor: '#B91C1C',
    description: 'Forte rebocador de porto com grande convés reforçado para até 5 caixas.',
    specialty: 'Maior capacidade (5 caixas), navegação cadenciada'
  }
};

export const MISSIONS: MissionDefinition[] = [
  {
    id: 'm1',
    title: '1. Primeira Travessia — 3 de 5 Caixas',
    difficulty: 'Iniciante',
    targetBoxes: 5,
    description: 'Levar as primeiras 3 caixas de suprimentos do Cais Central para a Doca dos Pescadores.',
    initialBoatId: 'blue',
    requiredDestinations: ['node_quay_south'],
    cargoSet: [
      { id: 'c1', name: 'Rações de bordo', destinationNodeId: 'node_quay_south', weight: 1 },
      { id: 'c2', name: 'Cabos náuticos', destinationNodeId: 'node_quay_south', weight: 1 },
      { id: 'c3', name: 'Sal e conservas', destinationNodeId: 'node_quay_south', weight: 1 },
      { id: 'c4', name: 'Óleo de lanterna', destinationNodeId: 'node_quay_south', weight: 1 },
      { id: 'c5', name: 'Tecidos impermeáveis', destinationNodeId: 'node_quay_south', weight: 1 }
    ],
    tips: [
      'Selecione o barco azul e verifique se as 3 caixas cabem com folga.',
      'Trace a rota clicando nos nós: Porto → Canal Oeste → Encruzilhada → Doca dos Pescadores.',
      'Você também pode testar uma rota alternativa pelo Canal Norte!'
    ],
    reflectionQuestions: [
      'O que chamou sua atenção no trajeto percorrido?',
      'Como a previsão da simulação ajudou a ter segurança antes de confirmar?'
    ]
  },
  {
    id: 'm2',
    title: '2. Dois Destinos Costeiros — 4 Caixas',
    difficulty: 'Iniciante',
    targetBoxes: 4,
    description: 'Distribuir 4 caixas entre a Doca dos Pescadores (2 caixas) e o Entreposto Leste (2 caixas).',
    initialBoatId: 'green',
    requiredDestinations: ['node_quay_south', 'node_outpost_east'],
    cargoSet: [
      { id: 'c1', name: 'Ferramentas de convés', destinationNodeId: 'node_quay_south', weight: 1 },
      { id: 'c2', name: 'Madeira naval', destinationNodeId: 'node_quay_south', weight: 1 },
      { id: 'c3', name: 'Tecidos de lona', destinationNodeId: 'node_outpost_east', weight: 1 },
      { id: 'c4', name: 'Lâmpadas de óleo', destinationNodeId: 'node_outpost_east', weight: 1 }
    ],
    tips: [
      'A traineira verde comporta exatamente 4 caixas.',
      'Pense na ordem de visita: ir primeiro aos pescadores ou direto ao entreposto?',
      'Observe onde as caixas são descarregadas em cada parada.'
    ],
    reflectionQuestions: [
      'Qual critério você usou para decidir qual cais visitar primeiro?',
      'O que mudaria se a ordem dos destinos fosse invertida?'
    ]
  },
  {
    id: 'm3',
    title: '3. Retorno com Carga do Farol',
    difficulty: 'Intermediário',
    targetBoxes: 3,
    description: 'Levar 2 caixas de mantimentos ao Farol da Ponta e garantir que a rota termine retornando ao Porto Central.',
    initialBoatId: 'blue',
    requiredDestinations: ['node_lighthouse', 'node_harbor'],
    cargoSet: [
      { id: 'c1', name: 'Querosene do farol', destinationNodeId: 'node_lighthouse', weight: 1 },
      { id: 'c2', name: 'Peças da lente', destinationNodeId: 'node_lighthouse', weight: 1 },
      { id: 'c3', name: 'Relatórios do mar', destinationNodeId: 'node_harbor', weight: 1 }
    ],
    tips: [
      'Lembre-se de incluir o nó de retorno (Cais Central) no final da rota.',
      'O caminho de volta pode ser pelo Canal Norte ou contornando o sul.'
    ],
    reflectionQuestions: [
      'Como foi desenhar uma rota em circuito fechado?',
      'Qual percurso pareceu mais suave para a embarcação?'
    ]
  },
  {
    id: 'm4',
    title: '4. Desafio de Capacidade — 5 Caixas',
    difficulty: 'Intermediário',
    targetBoxes: 5,
    description: 'É necessário transportar 5 caixas. O Barco Azul só suporta 3 e o Verde suporta 4. Escolha o barco certo ou ajuste a carga!',
    initialBoatId: 'red',
    requiredDestinations: ['node_quay_south', 'node_outpost_east'],
    cargoSet: [
      { id: 'c1', name: 'Cesta de frutas secas', destinationNodeId: 'node_quay_south', weight: 1 },
      { id: 'c2', name: 'Peixes defumados', destinationNodeId: 'node_quay_south', weight: 1 },
      { id: 'c3', name: 'Especiarias', destinationNodeId: 'node_outpost_east', weight: 1 },
      { id: 'c4', name: 'Cerâmica esmaltada', destinationNodeId: 'node_outpost_east', weight: 1 },
      { id: 'c5', name: 'Sacos de grãos', destinationNodeId: 'node_outpost_east', weight: 1 }
    ],
    tips: [
      'O Rebocador Vermelho possui capacidade 5 para levar todas de uma vez.',
      'Se tentar usar outro barco com excesso, a simulação avisará antes da partida sem penalidade.'
    ],
    reflectionQuestions: [
      'Como a restrição de capacidade impactou sua escolha de barco?',
      'O que você sentiu ao ver o aviso de capacidade na simulação?'
    ]
  },
  {
    id: 'm5',
    title: '5. Arquipélago das Correntes — Rotas Alternativas',
    difficulty: 'Avançado',
    targetBoxes: 4,
    description: 'Entregar suprimentos no Farol da Ponta. Há pelo menos dois trajetos navegáveis viáveis com distâncias e tempos distintos.',
    initialBoatId: 'green',
    requiredDestinations: ['node_lighthouse'],
    cargoSet: [
      { id: 'c1', name: 'Painéis solares', destinationNodeId: 'node_lighthouse', weight: 1 },
      { id: 'c2', name: 'Baterias seladas', destinationNodeId: 'node_lighthouse', weight: 1 },
      { id: 'c3', name: 'Água potável', destinationNodeId: 'node_lighthouse', weight: 1 },
      { id: 'c4', name: 'Rádio transmissor', destinationNodeId: 'node_lighthouse', weight: 1 }
    ],
    tips: [
      'Rota A: via Canal Norte (menos curvas, navegação direta).',
      'Rota B: via Doca dos Pescadores e Entreposto Leste (águas calmas e pontos de abrigo).',
      'Ambas são válidas e não recebem notas inferiores.'
    ],
    reflectionQuestions: [
      'Você preferiu o caminho mais curto ou o caminho que passava pelos cais?',
      'Como você percebe a diferença entre eficiência de tempo e tranquilidade de percurso?'
    ]
  },
  {
    id: 'm6',
    title: '6. Logística Completa do Porto — 5 de 5 Caixas',
    difficulty: 'Avançado',
    targetBoxes: 5,
    description: 'Distribuição total: 1 caixa para Pescadores, 2 para Entreposto Leste e 2 para o Farol da Ponta.',
    initialBoatId: 'red',
    requiredDestinations: ['node_quay_south', 'node_outpost_east', 'node_lighthouse'],
    cargoSet: [
      { id: 'c1', name: 'Bóias de sinalização', destinationNodeId: 'node_quay_south', weight: 1 },
      { id: 'c2', name: 'Caixas de ferramentas', destinationNodeId: 'node_outpost_east', weight: 1 },
      { id: 'c3', name: 'Tecidos impermeáveis', destinationNodeId: 'node_outpost_east', weight: 1 },
      { id: 'c4', name: 'Lâmpadas reserva', destinationNodeId: 'node_lighthouse', weight: 1 },
      { id: 'c5', name: 'Kit de primeiros socorros', destinationNodeId: 'node_lighthouse', weight: 1 }
    ],
    tips: [
      'Use o Rebocador Vermelho com todas as 5 caixas carregadas.',
      'Sequencie a rota para tocar todos os três cais de destino.',
      'Use "Simular" para conferir se todas as entregas foram contempladas.'
    ],
    reflectionQuestions: [
      'Ao planejar uma entrega complexa, que parte do processo foi mais prazerosa?',
      'Como foi observar as caixas sendo descarregadas uma a uma em seus destinos?'
    ]
  }
];

export function getNodeById(id: string): HarborNode | undefined {
  return HARBOR_NODES.find(n => n.id === id);
}

export function getMissionById(id: string): MissionDefinition {
  return MISSIONS.find(m => m.id === id) || MISSIONS[0];
}
