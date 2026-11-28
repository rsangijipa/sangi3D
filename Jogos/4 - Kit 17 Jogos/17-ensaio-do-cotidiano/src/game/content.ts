import type { Mission, ProductItem, WaypointId } from './state.ts'

export const PRODUCTS: Record<string, ProductItem> = {
  apple: {
    id: 'apple',
    name: 'Maçã Vermelha',
    category: 'fruit',
    color: '#B93226',
    waypoint: 'produce',
    description: 'Maçã gala madura, fresca e crocante da banca de frutas.',
    icon: '🍎',
    position: [-1.35, 0.95, 1.45]
  },
  apple_green: {
    id: 'apple_green',
    name: 'Maçã Verde',
    category: 'fruit',
    color: '#659C35',
    waypoint: 'produce',
    description: 'Maçã verde ácida e refrescante, colhida no sítio.',
    icon: '🍏',
    position: [-1.35, 0.95, 1.25]
  },
  banana: {
    id: 'banana',
    name: 'Penca de Bananas',
    category: 'fruit',
    color: '#D8AE36',
    waypoint: 'produce',
    description: 'Penca de banana prata doce em cesto de palha.',
    icon: '🍌',
    position: [-1.35, 0.95, 0.85]
  },
  orange: {
    id: 'orange',
    name: 'Laranjas Frescas',
    category: 'fruit',
    color: '#E06D1A',
    waypoint: 'produce',
    description: 'Laranjas doces para suco em caixote de ripas de madeira.',
    icon: '🍊',
    position: [-1.35, 0.95, 0.55]
  },
  rice: {
    id: 'rice',
    name: 'Arroz Branco',
    category: 'grain',
    color: '#F4EFE6',
    waypoint: 'pantry',
    description: 'Pacote de 1 kg de arroz branco tipo 1 em papel kraft costurado.',
    icon: '🌾',
    position: [1.35, 1.15, 0.95]
  },
  beans: {
    id: 'beans',
    name: 'Feijão Preto',
    category: 'grain',
    color: '#342D28',
    waypoint: 'pantry',
    description: 'Pote hermético de vidro com feijão selecionado para caldo.',
    icon: '🫘',
    position: [1.35, 1.15, 0.65]
  },
  bread: {
    id: 'bread',
    name: 'Pão Caseiro Rústico',
    category: 'bakery',
    color: '#A86A3D',
    waypoint: 'bakery',
    description: 'Pão rústico de fermentação lenta com crosta dourada.',
    icon: '🍞',
    position: [1.35, 1.05, -0.95]
  },
  milk: {
    id: 'milk',
    name: 'Leite Fresco',
    category: 'dairy',
    color: '#FFFFFF',
    waypoint: 'bakery',
    description: 'Garrafa de vidro tradicional de leite integral da fazenda.',
    icon: '🥛',
    position: [1.35, 0.85, -1.25]
  },
  soap: {
    id: 'soap',
    name: 'Sabonete de Oliva',
    category: 'hygiene',
    color: '#849669',
    waypoint: 'pantry',
    description: 'Barra de sabonete artesanal perfumado embrulhado em linho.',
    icon: '🧼',
    position: [1.35, 0.85, 0.35]
  },
  soap_liquid: {
    id: 'soap_liquid',
    name: 'Sabonete Líquido Neutro',
    category: 'hygiene',
    color: '#C6D4C0',
    waypoint: 'pantry',
    description: 'Frasco de sabonete líquido suave para as mãos (alternativa recomendada).',
    icon: '🧴',
    position: [1.35, 0.85, 0.15]
  },
  book_history: {
    id: 'book_history',
    name: 'Livro de História',
    category: 'study',
    color: '#26425A',
    waypoint: 'pantry',
    description: 'Volume encapado em tecido azul sobre cidades antigas.',
    icon: '📖',
    position: [1.35, 1.45, 0.55]
  },
  notebook: {
    id: 'notebook',
    name: 'Caderno de Anotações',
    category: 'study',
    color: '#B57448',
    waypoint: 'pantry',
    description: 'Caderno espiral com capa de papel kraft pautado.',
    icon: '📓',
    position: [1.35, 1.45, 0.25]
  },
  pencil: {
    id: 'pencil',
    name: 'Estojo com Lápis',
    category: 'study',
    color: '#E2B855',
    waypoint: 'bakery',
    description: 'Estojo de feltro com lápis apontados e borracha macia.',
    icon: '✏️',
    position: [1.35, 1.45, -0.85]
  },
  water_bottle: {
    id: 'water_bottle',
    name: 'Garrafa Térmica',
    category: 'study',
    color: '#497566',
    waypoint: 'produce',
    description: 'Garrafa reutilizável de alumínio verde musgo com alça.',
    icon: '🍶',
    position: [-1.35, 1.35, 0.4]
  }
}

export const MISSIONS: Record<string, Mission> = {
  market_snack: {
    id: 'market_snack',
    title: 'Lanche da Tarde',
    context: 'market',
    subtitle: 'Mercadinho Acolhedor · 3 itens',
    description: 'Encontre 1 maçã vermelha, 1 pacote de arroz e 1 pão rústico para o lanche.',
    requiredItemIds: ['apple', 'rice', 'bread'],
    targetCarrier: 'cart'
  },
  market_dinner: {
    id: 'market_dinner',
    title: 'Jantar em Família',
    context: 'market',
    subtitle: 'Mercadinho Acolhedor · 5 itens',
    description: 'Reúna arroz, feijão, laranjas, pão fresco e leite para a refeição da noite.',
    requiredItemIds: ['rice', 'beans', 'orange', 'bread', 'milk'],
    targetCarrier: 'cart'
  },
  market_hygiene: {
    id: 'market_hygiene',
    title: 'Cuidados e Lanche',
    context: 'market',
    subtitle: 'Mercadinho Acolhedor · com alternativa',
    description: 'Busque sabonete, maçã e leite. Se a barra de sabonete estiver em falta, substitua pelo sabonete líquido.',
    requiredItemIds: ['soap', 'apple', 'milk'],
    alternatives: { soap: 'soap_liquid' },
    targetCarrier: 'basket'
  },
  library_research: {
    id: 'library_research',
    title: 'Pesquisa Escolar',
    context: 'library',
    subtitle: 'Canto dos Livros · 3 itens',
    description: 'Localize o livro de história, o caderno de anotações e o estojo com lápis.',
    requiredItemIds: ['book_history', 'notebook', 'pencil'],
    targetCarrier: 'basket'
  },
  backpack_morning: {
    id: 'backpack_morning',
    title: 'Organizar a Mochila',
    context: 'backpack',
    subtitle: 'Preparação Matinal · 4 itens',
    description: 'Separe caderno, estojo, garrafa térmica e uma fruta antes de sair.',
    requiredItemIds: ['notebook', 'pencil', 'water_bottle', 'apple'],
    targetCarrier: 'basket'
  },
  market_free: {
    id: 'market_free',
    title: 'Exploração Livre',
    context: 'market',
    subtitle: 'Sem lista obrigatória',
    description: 'Caminhe livremente pelos corredores, toque a campainha do caixa e monte sua própria cesta.',
    requiredItemIds: [],
    targetCarrier: 'cart'
  }
}

export interface WaypointData {
  id: WaypointId
  label: string
  cameraPos: [number, number, number]
  cameraLook: [number, number, number]
  cartPos: [number, number, number]
}

export const WAYPOINTS: Record<WaypointId, WaypointData> = {
  entrance: {
    id: 'entrance',
    label: 'Entrada do Mercadinho',
    cameraPos: [0, 1.48, 2.9],
    cameraLook: [0, 1.35, 0],
    cartPos: [0.38, 0, 2.3]
  },
  produce: {
    id: 'produce',
    label: 'Banca de Frutas',
    cameraPos: [-0.65, 1.38, 1.3],
    cameraLook: [-1.4, 1.05, 1.0],
    cartPos: [-0.25, 0, 1.1]
  },
  pantry: {
    id: 'pantry',
    label: 'Estante de Mantimentos',
    cameraPos: [0.65, 1.38, 0.7],
    cameraLook: [1.4, 1.15, 0.5],
    cartPos: [0.22, 0, 0.6]
  },
  bakery: {
    id: 'bakery',
    label: 'Padaria e Laticínios',
    cameraPos: [0.6, 1.38, -0.9],
    cameraLook: [1.35, 1.15, -1.15],
    cartPos: [0.18, 0, -0.85]
  },
  checkout: {
    id: 'checkout',
    label: 'Balcão do Caixa',
    cameraPos: [-0.6, 1.38, -1.35],
    cameraLook: [-1.35, 1.25, -1.55],
    cartPos: [-0.2, 0, -1.3]
  }
}

export const NPC_DIALOGS: Record<string, string> = {
  rice: 'O arroz branco fica logo ali na segunda prateleira da estante de mantimentos, à sua direita!',
  apple: 'As maçãs mais doces e frescas estão na primeira banca de frutas, à sua esquerda!',
  bread: 'O pão caseiro quentinho fica no cesto de vime, perto dos laticínios no fundo da loja.',
  soap: 'Os sabonetes artesanais estão na prateleira baixa de mantimentos. Temos em barra e líquido!',
  time: 'Sem pressa nenhuma! Respire com calma e olhe o mercadinho no seu tempo.',
  not_found: 'Não se preocupe: se não encontrar exatamente o mesmo item, você pode levar um substituto equivalente.'
}
