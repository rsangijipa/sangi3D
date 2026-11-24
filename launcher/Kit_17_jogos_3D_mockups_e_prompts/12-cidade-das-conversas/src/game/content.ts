import type { LocationId, Scenario } from './state.ts'

export interface LocationInfo {
  id: LocationId
  name: string
  icon: string
  description: string
  badge: string
}

export const LOCATIONS: Record<LocationId, LocationInfo> = {
  padaria: {
    id: 'padaria',
    name: 'Padaria Artesanal',
    icon: '🥖',
    description: 'Balcão de pães e bolos com a simpática padeira.',
    badge: 'Comércio Local'
  },
  escola: {
    id: 'escola',
    name: 'Escola do Bairro',
    icon: '🏫',
    description: 'Pátio e sala de aula para pedir materiais e tirar dúvidas.',
    badge: 'Ambiente Escolar'
  },
  biblioteca: {
    id: 'biblioteca',
    name: 'Canto dos Livros',
    icon: '📚',
    description: 'Espaço calmo para encontrar histórias e respeitar o silêncio.',
    badge: 'Leitura & Estudo'
  },
  praca: {
    id: 'praca',
    name: 'Praça das Crianças',
    icon: '🌳',
    description: 'Baloiços, bancos e conversas leves entre vizinhos.',
    badge: 'Lazer & Recreio'
  },
  ponto_onibus: {
    id: 'ponto_onibus',
    name: 'Ponto do Ônibus',
    icon: '🚏',
    description: 'Abrigo de madeira com rotas e orientações de viagem.',
    badge: 'Transporte Cotidiano'
  }
}

export const SCENARIOS: Record<string, Scenario> = {
  // ==========================================
  // 1. PADARIA (3 cenários)
  // ==========================================
  padaria_pao: {
    id: 'padaria_pao',
    locationId: 'padaria',
    title: 'Comprar Pão Francês',
    subtitle: 'Pedir com clareza e perguntar da fornada',
    description: 'A atendente pergunta como pode ajudar. Você pode pedir pães, perguntar se saíram agora ou pedir um tempo.',
    initialNodeId: 'node_1',
    nodes: {
      node_1: {
        id: 'node_1',
        speaker: 'npc',
        npcName: 'Padeira Helena',
        text: 'Posso te ajudar?',
        stage: 1,
        totalStages: 4,
        choices: [
          { id: 'c_ask', label: 'Quero perguntar', icon: 'speech', nextId: 'node_ask', effect: 'ask' },
          { id: 'c_wait', label: 'Preciso de um tempo', icon: 'hourglass', nextId: 'node_wait', effect: 'wait' },
          { id: 'c_exit', label: 'Prefiro sair', icon: 'exit', nextId: 'node_exit', effect: 'exit' }
        ]
      },
      node_ask: {
        id: 'node_ask',
        speaker: 'npc',
        npcName: 'Padeira Helena',
        text: 'Com certeza! Que tipo de pão você gostaria hoje?',
        stage: 2,
        totalStages: 4,
        choices: [
          { id: 'c_french', label: 'Tem pão francês quentinho?', icon: 'speech', nextId: 'node_pao_sim', effect: 'normal' },
          { id: 'c_sweet', label: 'Gostaria de ver as opções de bolo', icon: 'speech', nextId: 'node_bolo', effect: 'normal' },
          { id: 'c_wait2', label: 'Deixa eu pensar um minutinho', icon: 'hourglass', nextId: 'node_wait', effect: 'wait' }
        ]
      },
      node_pao_sim: {
        id: 'node_pao_sim',
        speaker: 'npc',
        npcName: 'Padeira Helena',
        text: 'Acabou de sair uma fornada crocante! Quantos você gostaria de levar no saquinho?',
        stage: 3,
        totalStages: 4,
        choices: [
          { id: 'c_two', label: 'Pode colocar dois pãezinhos, por favor', icon: 'speech', nextId: 'node_concluir', effect: 'normal' },
          { id: 'c_four', label: 'Quatro pães para o lanche da família', icon: 'speech', nextId: 'node_concluir', effect: 'normal' },
          { id: 'c_exit2', label: 'Mudei de ideia, volto mais tarde', icon: 'exit', nextId: 'node_exit', effect: 'exit' }
        ]
      },
      node_bolo: {
        id: 'node_bolo',
        speaker: 'npc',
        npcName: 'Padeira Helena',
        text: 'Temos bolo de fubá fofinho e bolo de cenoura com chocolate na vitrine.',
        stage: 3,
        totalStages: 4,
        choices: [
          { id: 'c_slice', label: 'Uma fatia de bolo de cenoura, por favor!', icon: 'speech', nextId: 'node_concluir', effect: 'normal' },
          { id: 'c_fuba', label: 'Vou levar um pedaço de fubá', icon: 'speech', nextId: 'node_concluir', effect: 'normal' },
          { id: 'c_wait3', label: 'Preciso de um instante para decidir', icon: 'hourglass', nextId: 'node_wait', effect: 'wait' }
        ]
      },
      node_concluir: {
        id: 'node_concluir',
        speaker: 'npc',
        npcName: 'Padeira Helena',
        text: 'Aqui está bem embalado e cheiroso! Muito obrigada pela visita e tenha um ótimo dia!',
        stage: 4,
        totalStages: 4,
        isTerminal: true,
        choices: [
          { id: 'c_thanks', label: 'Obrigado! Até logo', icon: 'speech', nextId: null, effect: 'normal' }
        ]
      },
      node_wait: {
        id: 'node_wait',
        speaker: 'npc',
        npcName: 'Padeira Helena',
        text: 'Sem pressa nenhuma! Respire com calma. Ficarei aqui arrumando a vitrine até você estar pronto.',
        stage: 2,
        totalStages: 4,
        choices: [
          { id: 'c_resume', label: 'Agora estou pronto para escolher', icon: 'speech', nextId: 'node_ask', effect: 'normal' },
          { id: 'c_leave_calm', label: 'Acho melhor voltar em outro momento', icon: 'exit', nextId: 'node_exit', effect: 'exit' }
        ]
      },
      node_exit: {
        id: 'node_exit',
        speaker: 'npc',
        npcName: 'Padeira Helena',
        text: 'Tudo bem! Foi um prazer te ver. As portas da padaria estão sempre abertas para você!',
        stage: 4,
        totalStages: 4,
        isTerminal: true,
        choices: [
          { id: 'c_bye', label: 'Tchau, até a próxima!', icon: 'speech', nextId: null, effect: 'normal' }
        ]
      }
    }
  },

  padaria_preco: {
    id: 'padaria_preco',
    locationId: 'padaria',
    title: 'Consultar o Preço',
    subtitle: 'Perguntar valor e conferir moedas',
    description: 'Praticar perguntar quanto custa um item e decidir tranquilamente se cabe no bolso.',
    initialNodeId: 'node_1',
    nodes: {
      node_1: {
        id: 'node_1',
        speaker: 'npc',
        npcName: 'Padeira Helena',
        text: 'Olá! Posso te informar o valor de algum dos nossos quitutes?',
        stage: 1,
        totalStages: 3,
        choices: [
          { id: 'c_price', label: 'Quanto custa a broa de milho?', icon: 'speech', nextId: 'node_valor', effect: 'ask' },
          { id: 'c_wait', label: 'Preciso contar minhas moedas primeiro', icon: 'hourglass', nextId: 'node_contar', effect: 'wait' },
          { id: 'c_exit', label: 'Só estava dando uma olhadinha, obrigado', icon: 'exit', nextId: 'node_exit', effect: 'exit' }
        ]
      },
      node_valor: {
        id: 'node_valor',
        speaker: 'npc',
        npcName: 'Padeira Helena',
        text: 'A broa artesanal custa cinco reais cada uma. Deseja levar uma?',
        stage: 2,
        totalStages: 3,
        choices: [
          { id: 'c_take', label: 'Sim, vou levar uma, obrigado!', icon: 'speech', nextId: 'node_final', effect: 'normal' },
          { id: 'c_decline', label: 'Hoje não vai dar, mas obrigado por avisar', icon: 'exit', nextId: 'node_exit', effect: 'exit' },
          { id: 'c_wait2', label: 'Um instante, vou conferir meu dinheiro', icon: 'hourglass', nextId: 'node_contar', effect: 'wait' }
        ]
      },
      node_contar: {
        id: 'node_contar',
        speaker: 'npc',
        npcName: 'Padeira Helena',
        text: 'Fique à vontade! Conte no seu tempo, sem nenhuma corrida.',
        stage: 2,
        totalStages: 3,
        choices: [
          { id: 'c_have', label: 'Tenho o suficiente! Vou levar a broa', icon: 'speech', nextId: 'node_final', effect: 'normal' },
          { id: 'c_exit3', label: 'Prefiro guardar as moedas hoje', icon: 'exit', nextId: 'node_exit', effect: 'exit' }
        ]
      },
      node_final: {
        id: 'node_final',
        speaker: 'npc',
        npcName: 'Padeira Helena',
        text: 'Perfeito! Aqui está sua broa fresquinha. Bom apetite!',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_ok', label: 'Obrigado e boa tarde!', icon: 'speech', nextId: null, effect: 'normal' }]
      },
      node_exit: {
        id: 'node_exit',
        speaker: 'npc',
        npcName: 'Padeira Helena',
        text: 'Claro! Saber perguntar e pesquisar é super importante. Até mais!',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_ok2', label: 'Até logo!', icon: 'speech', nextId: null, effect: 'normal' }]
      }
    }
  },

  padaria_falta: {
    id: 'padaria_falta',
    locationId: 'padaria',
    title: 'Item Indisponível',
    subtitle: 'Lidar com a falta e escolher substituto',
    description: 'Quando o croissant de chocolate acabou, você pode escolher outro item, esperar a próxima fornada ou se retirar.',
    initialNodeId: 'node_1',
    nodes: {
      node_1: {
        id: 'node_1',
        speaker: 'npc',
        npcName: 'Padeira Helena',
        text: 'Puxa, hoje os croissants de chocolate acabaram bem cedinho.',
        stage: 1,
        totalStages: 3,
        choices: [
          { id: 'c_sub', label: 'Você tem outro doce parecido?', icon: 'speech', nextId: 'node_sub', effect: 'ask' },
          { id: 'c_wait', label: 'Fiquei frustrado, preciso de um tempo para pensar', icon: 'hourglass', nextId: 'node_time', effect: 'wait' },
          { id: 'c_exit', label: 'Tudo bem, prefiro voltar amanhã', icon: 'exit', nextId: 'node_end_exit', effect: 'exit' }
        ]
      },
      node_sub: {
        id: 'node_sub',
        speaker: 'npc',
        npcName: 'Padeira Helena',
        text: 'Temos rosquinhas de canela e tortinhas de maçã! São deliciosas também.',
        stage: 2,
        totalStages: 3,
        choices: [
          { id: 'c_apple', label: 'Vou experimentar a tortinha de maçã', icon: 'speech', nextId: 'node_pack', effect: 'normal' },
          { id: 'c_exit2', label: 'Hoje eu queria só o croissant mesmo, obrigado', icon: 'exit', nextId: 'node_end_exit', effect: 'exit' }
        ]
      },
      node_time: {
        id: 'node_time',
        speaker: 'npc',
        npcName: 'Padeira Helena',
        text: 'É super normal ficar chateado quando o que queremos acabou. Fique tranquilo.',
        stage: 2,
        totalStages: 3,
        choices: [
          { id: 'c_ok_now', label: 'Já me acalmei, vou ver outro doce', icon: 'speech', nextId: 'node_sub', effect: 'normal' },
          { id: 'c_leave_calm', label: 'Vou dar uma volta na praça primeiro', icon: 'exit', nextId: 'node_end_exit', effect: 'exit' }
        ]
      },
      node_pack: {
        id: 'node_pack',
        speaker: 'npc',
        npcName: 'Padeira Helena',
        text: 'Embaladinho com carinho para você! Espero que goste da tortinha.',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_thanks', label: 'Muito obrigado pela sugestão!', icon: 'speech', nextId: null, effect: 'normal' }]
      },
      node_end_exit: {
        id: 'node_end_exit',
        speaker: 'npc',
        npcName: 'Padeira Helena',
        text: 'Com certeza! Amanhã vou guardar um croissant especialmente cedo. Até já!',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_bye', label: 'Combinado, até amanhã!', icon: 'speech', nextId: null, effect: 'normal' }]
      }
    }
  },

  // ==========================================
  // 2. ESCOLA (3 cenários)
  // ==========================================
  escola_material: {
    id: 'escola_material',
    locationId: 'escola',
    title: 'Pedir Material Emprestado',
    subtitle: 'Comunicação respeitosa com colega',
    description: 'Você esqueceu o lápis de cor verde e precisa para o desenho.',
    initialNodeId: 'node_1',
    nodes: {
      node_1: {
        id: 'node_1',
        speaker: 'npc',
        npcName: 'Colega Lucas',
        text: 'Oi! Você está precisando de alguma cor de lápis?',
        stage: 1,
        totalStages: 3,
        choices: [
          { id: 'c_ask', label: 'Pode me emprestar o lápis verde?', icon: 'speech', nextId: 'node_share', effect: 'ask' },
          { id: 'c_wait', label: 'Preciso de um instante para ver meu estojo', icon: 'hourglass', nextId: 'node_wait', effect: 'wait' },
          { id: 'c_exit', label: 'Vou pintar com outra cor mesmo, obrigado', icon: 'exit', nextId: 'node_exit', effect: 'exit' }
        ]
      },
      node_share: {
        id: 'node_share',
        speaker: 'npc',
        npcName: 'Colega Lucas',
        text: 'Claro! Aqui está. Pode usar e me devolver quando terminar a árvore!',
        stage: 2,
        totalStages: 3,
        choices: [
          { id: 'c_thank', label: 'Obrigado! Vou cuidar bem dele', icon: 'speech', nextId: 'node_done', effect: 'normal' },
          { id: 'c_return', label: 'Já pintei! Muito obrigado por emprestar', icon: 'speech', nextId: 'node_done', effect: 'normal' }
        ]
      },
      node_wait: {
        id: 'node_wait',
        speaker: 'npc',
        npcName: 'Colega Lucas',
        text: 'Sem problemas, olhe sua mochila com calma!',
        stage: 2,
        totalStages: 3,
        choices: [
          { id: 'c_found', label: 'Achei o meu lápis aqui no fundo!', icon: 'speech', nextId: 'node_exit', effect: 'normal' },
          { id: 'c_need', label: 'Realmente esqueci, pode emprestar?', icon: 'speech', nextId: 'node_share', effect: 'ask' }
        ]
      },
      node_done: {
        id: 'node_done',
        speaker: 'npc',
        npcName: 'Colega Lucas',
        text: 'De nada! Sempre que precisar de material pode contar comigo.',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_end', label: 'Valeu, Lucas!', icon: 'speech', nextId: null, effect: 'normal' }]
      },
      node_exit: {
        id: 'node_exit',
        speaker: 'npc',
        npcName: 'Colega Lucas',
        text: 'Tranquilo! Bom desenho pra você!',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_end2', label: 'Para você também!', icon: 'speech', nextId: null, effect: 'normal' }]
      }
    }
  },

  escola_duvida: {
    id: 'escola_duvida',
    locationId: 'escola',
    title: 'Tirar Dúvida com a Professora',
    subtitle: 'Pedir explicação em etapas claras',
    description: 'A explicação da tarefa foi rápida e você quer entender o passo a passo.',
    initialNodeId: 'node_1',
    nodes: {
      node_1: {
        id: 'node_1',
        speaker: 'npc',
        npcName: 'Professora Marina',
        text: 'Olá! Você gostaria que eu repetisse alguma instrução da atividade?',
        stage: 1,
        totalStages: 3,
        choices: [
          { id: 'c_step', label: 'Pode me explicar a primeira etapa devagar?', icon: 'speech', nextId: 'node_step', effect: 'ask' },
          { id: 'c_time', label: 'Preciso de um momento para reler a folha', icon: 'hourglass', nextId: 'node_reler', effect: 'wait' },
          { id: 'c_exit', label: 'Já consegui entender sozinho, obrigada', icon: 'exit', nextId: 'node_exit', effect: 'exit' }
        ]
      },
      node_step: {
        id: 'node_step',
        speaker: 'npc',
        npcName: 'Professora Marina',
        text: 'Com certeza. Primeiro vamos recortar os círculos e depois colá-los por ordem de tamanho.',
        stage: 2,
        totalStages: 3,
        choices: [
          { id: 'c_got_it', label: 'Entendi perfeitamente agora!', icon: 'speech', nextId: 'node_concluir', effect: 'normal' },
          { id: 'c_more', label: 'Pode me mostrar um exemplo pronto?', icon: 'speech', nextId: 'node_concluir', effect: 'ask' }
        ]
      },
      node_reler: {
        id: 'node_reler',
        speaker: 'npc',
        npcName: 'Professora Marina',
        text: 'Leia com seu tempo. Estarei aqui na mesa quando quiser me chamar.',
        stage: 2,
        totalStages: 3,
        choices: [
          { id: 'c_ready', label: 'Já reli e agora sei por onde começar', icon: 'speech', nextId: 'node_concluir', effect: 'normal' },
          { id: 'c_ask_now', label: 'Ainda tenho dúvida na colagem', icon: 'speech', nextId: 'node_step', effect: 'ask' }
        ]
      },
      node_concluir: {
        id: 'node_concluir',
        speaker: 'npc',
        npcName: 'Professora Marina',
        text: 'Muito bom! Fazer perguntas quando temos dúvidas é uma grande qualidade.',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_thanks', label: 'Obrigado pelo apoio!', icon: 'speech', nextId: null, effect: 'normal' }]
      },
      node_exit: {
        id: 'node_exit',
        speaker: 'npc',
        npcName: 'Professora Marina',
        text: 'Ótimo trabalho! Qualquer coisa estou por aqui.',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_bye', label: 'Combinado, professora!', icon: 'speech', nextId: null, effect: 'normal' }]
      }
    }
  },

  escola_intervalo: {
    id: 'escola_intervalo',
    locationId: 'escola',
    title: 'Pausa no Recreio',
    subtitle: 'Expressar se quer companhia ou silêncio',
    description: 'No intervalo você pode escolher se quer brincar junto ou ficar num cantinho calmo.',
    initialNodeId: 'node_1',
    nodes: {
      node_1: {
        id: 'node_1',
        speaker: 'npc',
        npcName: 'Monitor Gabriel',
        text: 'Oi! O recreio começou. Como você prefere passar este intervalo?',
        stage: 1,
        totalStages: 3,
        choices: [
          { id: 'c_play', label: 'Quero brincar de roda ou bola', icon: 'speech', nextId: 'node_play', effect: 'normal' },
          { id: 'c_quiet', label: 'O pátio está barulhento, quero um canto calmo', icon: 'hourglass', nextId: 'node_quiet', effect: 'wait' },
          { id: 'c_exit', label: 'Vou sentar no banquinho e comer meu lanche', icon: 'exit', nextId: 'node_exit', effect: 'exit' }
        ]
      },
      node_play: {
        id: 'node_play',
        speaker: 'npc',
        npcName: 'Monitor Gabriel',
        text: 'Legal! O grupo está perto da árvore jogando queimada leve. Pode ir até lá!',
        stage: 2,
        totalStages: 3,
        choices: [
          { id: 'c_go', label: 'Vou lá me juntar a eles!', icon: 'speech', nextId: 'node_done', effect: 'normal' },
          { id: 'c_watch', label: 'Prefiro só assistir de perto primeiro', icon: 'speech', nextId: 'node_done', effect: 'normal' }
        ]
      },
      node_quiet: {
        id: 'node_quiet',
        speaker: 'npc',
        npcName: 'Monitor Gabriel',
        text: 'Entendo perfeitamente. O banco sob a pérgula de trepadeiras é bem silencioso e fresco.',
        stage: 2,
        totalStages: 3,
        choices: [
          { id: 'c_bench', label: 'Vou para lá relaxar um pouco', icon: 'speech', nextId: 'node_done', effect: 'normal' },
          { id: 'c_thanks', label: 'Obrigado por entender', icon: 'speech', nextId: 'node_done', effect: 'normal' }
        ]
      },
      node_done: {
        id: 'node_done',
        speaker: 'npc',
        npcName: 'Monitor Gabriel',
        text: 'Aproveite seu recreio do seu jeito! Respeitar o próprio ritmo faz muito bem.',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_ok', label: 'Valeu, Gabriel!', icon: 'speech', nextId: null, effect: 'normal' }]
      },
      node_exit: {
        id: 'node_exit',
        speaker: 'npc',
        npcName: 'Monitor Gabriel',
        text: 'Bom apetite e bom descanso no banco!',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_bye', label: 'Obrigado!', icon: 'speech', nextId: null, effect: 'normal' }]
      }
    }
  },

  // ==========================================
  // 3. BIBLIOTECA (3 cenários)
  // ==========================================
  biblioteca_livro: {
    id: 'biblioteca_livro',
    locationId: 'biblioteca',
    title: 'Procurar Livro de Animais',
    subtitle: 'Pedir auxílio sobre seções da estante',
    description: 'Encontrar um livro ilustrado com a ajuda do bibliotecário.',
    initialNodeId: 'node_1',
    nodes: {
      node_1: {
        id: 'node_1',
        speaker: 'npc',
        npcName: 'Bibliotecário Carlos',
        text: '(sussurrando) Olá! Posso te ajudar a encontrar algum título ou autor?',
        stage: 1,
        totalStages: 3,
        choices: [
          { id: 'c_ask', label: 'Onde ficam os livros ilustrados de animais?', icon: 'speech', nextId: 'node_animals', effect: 'ask' },
          { id: 'c_browse', label: 'Gostaria de passear pelos corredores sozinho', icon: 'hourglass', nextId: 'node_browse', effect: 'wait' },
          { id: 'c_exit', label: 'Só vim devolver um livro rápido', icon: 'exit', nextId: 'node_return', effect: 'exit' }
        ]
      },
      node_animals: {
        id: 'node_animals',
        speaker: 'npc',
        npcName: 'Bibliotecário Carlos',
        text: 'Ficam na terceira prateleira de madeira clara, logo à direita da janela verde.',
        stage: 2,
        totalStages: 3,
        choices: [
          { id: 'c_found', label: 'Obrigado, vou olhar lá agora mesmo!', icon: 'speech', nextId: 'node_end', effect: 'normal' },
          { id: 'c_show', label: 'Pode me apontar de onde estamos?', icon: 'speech', nextId: 'node_end', effect: 'ask' }
        ]
      },
      node_browse: {
        id: 'node_browse',
        speaker: 'npc',
        npcName: 'Bibliotecário Carlos',
        text: 'Fique à vontade! O silêncio da biblioteca é seu amigo para explorar.',
        stage: 2,
        totalStages: 3,
        choices: [
          { id: 'c_thanks', label: 'Obrigado pelo espaço', icon: 'speech', nextId: 'node_end', effect: 'normal' }
        ]
      },
      node_return: {
        id: 'node_return',
        speaker: 'npc',
        npcName: 'Bibliotecário Carlos',
        text: 'Pode colocar aqui na caixa de devoluções. Tudo certo com o registro!',
        stage: 2,
        totalStages: 3,
        choices: [
          { id: 'c_end_ret', label: 'Obrigado e bom dia!', icon: 'speech', nextId: 'node_end', effect: 'normal' }
        ]
      },
      node_end: {
        id: 'node_end',
        speaker: 'npc',
        npcName: 'Bibliotecário Carlos',
        text: 'Boa leitura e aproveite as histórias da nossa cidade!',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_bye', label: 'Até logo!', icon: 'speech', nextId: null, effect: 'normal' }]
      }
    }
  },

  biblioteca_silencio: {
    id: 'biblioteca_silencio',
    locationId: 'biblioteca',
    title: 'Ajustar o Tom de Voz',
    subtitle: 'Compreender o ambiente de leitura',
    description: 'Um lembrete gentil para falar baixo sem sensação de bronca.',
    initialNodeId: 'node_1',
    nodes: {
      node_1: {
        id: 'node_1',
        speaker: 'npc',
        npcName: 'Bibliotecário Carlos',
        text: 'Psiu, amigo! Aqui dentro usamos a voz de sussurro para não assustar quem está lendo.',
        stage: 1,
        totalStages: 3,
        choices: [
          { id: 'c_ok', label: 'Desculpe, vou falar bem baixinho', icon: 'speech', nextId: 'node_calm', effect: 'normal' },
          { id: 'c_cards', label: 'Posso apontar nos cartões sem falar?', icon: 'speech', nextId: 'node_cards', effect: 'ask' },
          { id: 'c_exit', label: 'Prefiro sair para o pátio para conversar', icon: 'exit', nextId: 'node_exit', effect: 'exit' }
        ]
      },
      node_calm: {
        id: 'node_calm',
        speaker: 'npc',
        npcName: 'Bibliotecário Carlos',
        text: 'Sem problemas nenhum, obrigado pela colaboração!',
        stage: 2,
        totalStages: 3,
        choices: [{ id: 'c_done', label: 'Tudo bem!', icon: 'speech', nextId: 'node_end', effect: 'normal' }]
      },
      node_cards: {
        id: 'node_cards',
        speaker: 'npc',
        npcName: 'Bibliotecário Carlos',
        text: 'Excelente ideia! Apontar nos cartões é uma ótima forma de se comunicar aqui.',
        stage: 2,
        totalStages: 3,
        choices: [{ id: 'c_done2', label: 'Legal!', icon: 'speech', nextId: 'node_end', effect: 'normal' }]
      },
      node_end: {
        id: 'node_end',
        speaker: 'npc',
        npcName: 'Bibliotecário Carlos',
        text: 'Tenha uma leitura tranquila e agradável!',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_bye', label: 'Obrigado!', icon: 'speech', nextId: null, effect: 'normal' }]
      },
      node_exit: {
        id: 'node_exit',
        speaker: 'npc',
        npcName: 'Bibliotecário Carlos',
        text: 'Claro, no jardim lá fora o som é livre! Até mais.',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_bye2', label: 'Até mais!', icon: 'speech', nextId: null, effect: 'normal' }]
      }
    }
  },

  biblioteca_devolucao: {
    id: 'biblioteca_devolucao',
    locationId: 'biblioteca',
    title: 'Renovar Empréstimo',
    subtitle: 'Pedir mais dias para terminar a história',
    description: 'Você ainda não acabou de ler o livro e gostaria de renovar.',
    initialNodeId: 'node_1',
    nodes: {
      node_1: {
        id: 'node_1',
        speaker: 'npc',
        npcName: 'Bibliotecário Carlos',
        text: 'Olá! Você veio devolver ou precisa de mais tempo com o livro?',
        stage: 1,
        totalStages: 3,
        choices: [
          { id: 'c_renew', label: 'Gostaria de renovar por mais uma semana', icon: 'speech', nextId: 'node_renewed', effect: 'ask' },
          { id: 'c_done', label: 'Já terminei de ler e vim devolver', icon: 'speech', nextId: 'node_returned', effect: 'normal' },
          { id: 'c_exit', label: 'Vim apenas acompanhar um amigo', icon: 'exit', nextId: 'node_exit', effect: 'exit' }
        ]
      },
      node_renewed: {
        id: 'node_renewed',
        speaker: 'npc',
        npcName: 'Bibliotecário Carlos',
        text: 'Prontinho! Renovado no sistema por mais 7 dias com carimbo novo.',
        stage: 2,
        totalStages: 3,
        choices: [{ id: 'c_thanks', label: 'Que bom, vou terminar a leitura com calma', icon: 'speech', nextId: 'node_end', effect: 'normal' }]
      },
      node_returned: {
        id: 'node_returned',
        speaker: 'npc',
        npcName: 'Bibliotecário Carlos',
        text: 'Muito obrigado! O livro está em perfeito estado.',
        stage: 2,
        totalStages: 3,
        choices: [{ id: 'c_next', label: 'Adorei a história!', icon: 'speech', nextId: 'node_end', effect: 'normal' }]
      },
      node_end: {
        id: 'node_end',
        speaker: 'npc',
        npcName: 'Bibliotecário Carlos',
        text: 'Até a próxima visita à biblioteca!',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_bye', label: 'Até logo!', icon: 'speech', nextId: null, effect: 'normal' }]
      },
      node_exit: {
        id: 'node_exit',
        speaker: 'npc',
        npcName: 'Bibliotecário Carlos',
        text: 'Sejam bem-vindos! Os sofás do canto são ótimos para esperar.',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_bye2', label: 'Obrigado!', icon: 'speech', nextId: null, effect: 'normal' }]
      }
    }
  },

  // ==========================================
  // 4. PRAÇA (3 cenários)
  // ==========================================
  praca_balanco: {
    id: 'praca_balanco',
    locationId: 'praca',
    title: 'Pedir Vez no Balanço',
    subtitle: 'Combinar revezamento amigável',
    description: 'O balanço de madeira da pracinha está ocupado e você quer andar também.',
    initialNodeId: 'node_1',
    nodes: {
      node_1: {
        id: 'node_1',
        speaker: 'npc',
        npcName: 'Amiga Sofia',
        text: 'Oi! Você também quer brincar no balanço?',
        stage: 1,
        totalStages: 3,
        choices: [
          { id: 'c_ask', label: 'Posso ir depois de você?', icon: 'speech', nextId: 'node_share', effect: 'ask' },
          { id: 'c_wait', label: 'Vou sentar no banquinho e esperar você terminar', icon: 'hourglass', nextId: 'node_bench', effect: 'wait' },
          { id: 'c_exit', label: 'Vou ver outro brinquedo no parquinho', icon: 'exit', nextId: 'node_exit', effect: 'exit' }
        ]
      },
      node_share: {
        id: 'node_share',
        speaker: 'npc',
        npcName: 'Amiga Sofia',
        text: 'Claro! Vou dar mais cinco impulsos e te passo o balanço.',
        stage: 2,
        totalStages: 3,
        choices: [
          { id: 'c_count', label: 'Combinado! Vou contar com você', icon: 'speech', nextId: 'node_turn', effect: 'normal' },
          { id: 'c_wait2', label: 'Pode ir sem pressa!', icon: 'hourglass', nextId: 'node_turn', effect: 'wait' }
        ]
      },
      node_bench: {
        id: 'node_bench',
        speaker: 'npc',
        npcName: 'Amiga Sofia',
        text: 'Obrigada pela paciência! Quando eu sair eu te chamo.',
        stage: 2,
        totalStages: 3,
        choices: [{ id: 'c_ok', label: 'Valeu, Sofia!', icon: 'speech', nextId: 'node_turn', effect: 'normal' }]
      },
      node_turn: {
        id: 'node_turn',
        speaker: 'npc',
        npcName: 'Amiga Sofia',
        text: 'Prontinho, agora é sua vez de voar alto!',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_thanks', label: 'Eba, muito obrigado!', icon: 'speech', nextId: null, effect: 'normal' }]
      },
      node_exit: {
        id: 'node_exit',
        speaker: 'npc',
        npcName: 'Amiga Sofia',
        text: 'A caixa de areia está livre também! Boa diversão.',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_bye', label: 'Obrigado!', icon: 'speech', nextId: null, effect: 'normal' }]
      }
    }
  },

  praca_amigo: {
    id: 'praca_amigo',
    locationId: 'praca',
    title: 'Conversar com o Vizinho',
    subtitle: 'Pequenos diálogos do cotidiano',
    description: 'O senhor Antônio passeia com seu cachorrinho na calçada de pedra.',
    initialNodeId: 'node_1',
    nodes: {
      node_1: {
        id: 'node_1',
        speaker: 'npc',
        npcName: 'Vizinho Seu Antônio',
        text: 'Bom dia, jovem! Belo dia de sol para passear na praça, não acha?',
        stage: 1,
        totalStages: 3,
        choices: [
          { id: 'c_dog', label: 'Bom dia! Qual o nome do seu cachorrinho?', icon: 'speech', nextId: 'node_dog', effect: 'ask' },
          { id: 'c_nod', label: 'Bom dia! Sim, o sol está gostoso', icon: 'speech', nextId: 'node_sun', effect: 'normal' },
          { id: 'c_exit', label: 'Bom dia! Estou a caminho de casa', icon: 'exit', nextId: 'node_exit', effect: 'exit' }
        ]
      },
      node_dog: {
        id: 'node_dog',
        speaker: 'npc',
        npcName: 'Vizinho Seu Antônio',
        text: 'Esse é o Pipoca! Ele é muito mansinho e adora receber carinho na orelha.',
        stage: 2,
        totalStages: 3,
        choices: [
          { id: 'c_pet', label: 'Posso fazer um carinho nele?', icon: 'speech', nextId: 'node_friendly', effect: 'ask' },
          { id: 'c_look', label: 'Que fofo! Prefiro só olhar de longe', icon: 'speech', nextId: 'node_friendly', effect: 'normal' }
        ]
      },
      node_sun: {
        id: 'node_sun',
        speaker: 'npc',
        npcName: 'Vizinho Seu Antônio',
        text: 'Os passarinhos estão cantando nas árvores hoje. É uma paz!',
        stage: 2,
        totalStages: 3,
        choices: [{ id: 'c_peace', label: 'É verdade, adoro o som deles', icon: 'speech', nextId: 'node_friendly', effect: 'normal' }]
      },
      node_friendly: {
        id: 'node_friendly',
        speaker: 'npc',
        npcName: 'Vizinho Seu Antônio',
        text: 'Foi um prazer papear com você! Tenha um excelente dia no bairro.',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_bye', label: 'O senhor também, tchau Pipoca!', icon: 'speech', nextId: null, effect: 'normal' }]
      },
      node_exit: {
        id: 'node_exit',
        speaker: 'npc',
        npcName: 'Vizinho Seu Antônio',
        text: 'Vá com calma e mande um abraço para sua família!',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_bye2', label: 'Pode deixar, até logo!', icon: 'speech', nextId: null, effect: 'normal' }]
      }
    }
  },

  praca_tempo: {
    id: 'praca_tempo',
    locationId: 'praca',
    title: 'Momento de Descanso',
    subtitle: 'Reconhecer cansaço e recarregar',
    description: 'Quando as brincadeiras cansam, você pode parar sem ter que dar satisfações longas.',
    initialNodeId: 'node_1',
    nodes: {
      node_1: {
        id: 'node_1',
        speaker: 'npc',
        npcName: 'Amiga Sofia',
        text: 'Quer correr mais uma volta no gramado?',
        stage: 1,
        totalStages: 3,
        choices: [
          { id: 'c_tired', label: 'Estou cansado, preciso sentar no banco', icon: 'hourglass', nextId: 'node_rest', effect: 'wait' },
          { id: 'c_water', label: 'Vou beber um pouco de água primeiro', icon: 'speech', nextId: 'node_water', effect: 'normal' },
          { id: 'c_exit', label: 'Para mim já deu por hoje, vou para casa', icon: 'exit', nextId: 'node_exit', effect: 'exit' }
        ]
      },
      node_rest: {
        id: 'node_rest',
        speaker: 'npc',
        npcName: 'Amiga Sofia',
        text: 'Descansar é ótimo. Vou sentar com você um pouco em silêncio.',
        stage: 2,
        totalStages: 3,
        choices: [{ id: 'c_rest_ok', label: 'Obrigado pela companhia calma', icon: 'speech', nextId: 'node_end', effect: 'normal' }]
      },
      node_water: {
        id: 'node_water',
        speaker: 'npc',
        npcName: 'Amiga Sofia',
        text: 'Boa ideia! Hidratar faz bem.',
        stage: 2,
        totalStages: 3,
        choices: [{ id: 'c_water_ok', label: 'Pronto, água fresca!', icon: 'speech', nextId: 'node_end', effect: 'normal' }]
      },
      node_end: {
        id: 'node_end',
        speaker: 'npc',
        npcName: 'Amiga Sofia',
        text: 'Que tarde boa na pracinha!',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_bye', label: 'Foi muito boa mesmo!', icon: 'speech', nextId: null, effect: 'normal' }]
      },
      node_exit: {
        id: 'node_exit',
        speaker: 'npc',
        npcName: 'Amiga Sofia',
        text: 'Até amanhã então! Tchauzinho!',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_bye2', label: 'Até amanhã!', icon: 'speech', nextId: null, effect: 'normal' }]
      }
    }
  },

  // ==========================================
  // 5. PONTO DE ÔNIBUS (3 cenários)
  // ==========================================
  onibus_linha: {
    id: 'onibus_linha',
    locationId: 'ponto_onibus',
    title: 'Perguntar a Rota',
    subtitle: 'Saber se o ônibus passa no destino',
    description: 'Conferir se o ônibus que vem ali passa perto da escola ou do centro.',
    initialNodeId: 'node_1',
    nodes: {
      node_1: {
        id: 'node_1',
        speaker: 'npc',
        npcName: 'Passageira Dona Rosa',
        text: 'Olá! Você está esperando qual linha de ônibus?',
        stage: 1,
        totalStages: 3,
        choices: [
          { id: 'c_school', label: 'A linha Centro passa perto da escola?', icon: 'speech', nextId: 'node_route', effect: 'ask' },
          { id: 'c_board', label: 'Preciso olhar a placa de horários no poste', icon: 'hourglass', nextId: 'node_look', effect: 'wait' },
          { id: 'c_exit', label: 'Vou a pé mesmo, é pertinho', icon: 'exit', nextId: 'node_exit', effect: 'exit' }
        ]
      },
      node_route: {
        id: 'node_route',
        speaker: 'npc',
        npcName: 'Passageira Dona Rosa',
        text: 'Passa sim! Ele para bem em frente ao portão do sino.',
        stage: 2,
        totalStages: 3,
        choices: [
          { id: 'c_thanks', label: 'Que alívio, muito obrigado!', icon: 'speech', nextId: 'node_end', effect: 'normal' },
          { id: 'c_soon', label: 'Ele costuma demorar muito?', icon: 'speech', nextId: 'node_end', effect: 'ask' }
        ]
      },
      node_look: {
        id: 'node_look',
        speaker: 'npc',
        npcName: 'Passageira Dona Rosa',
        text: 'A tabela mostra que ele passa a cada quinze minutos.',
        stage: 2,
        totalStages: 3,
        choices: [{ id: 'c_ok', label: 'Entendi, já deve estar chegando', icon: 'speech', nextId: 'node_end', effect: 'normal' }]
      },
      node_end: {
        id: 'node_end',
        speaker: 'npc',
        npcName: 'Passageira Dona Rosa',
        text: 'Olha o ônibus apontando na esquina! Boa viagem para você.',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_bye', label: 'Boa viagem para a senhora também!', icon: 'speech', nextId: null, effect: 'normal' }]
      },
      node_exit: {
        id: 'node_exit',
        speaker: 'npc',
        npcName: 'Passageira Dona Rosa',
        text: 'Caminhar no ar fresco faz muito bem! Bom passeio.',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_bye2', label: 'Obrigado, até mais!', icon: 'speech', nextId: null, effect: 'normal' }]
      }
    }
  },

  onibus_troco: {
    id: 'onibus_troco',
    locationId: 'ponto_onibus',
    title: 'Forma de Pagamento',
    subtitle: 'Tirar dúvida sobre cartão e dinheiro',
    description: 'Saber como pagar a passagem antes de subir na catraca.',
    initialNodeId: 'node_1',
    nodes: {
      node_1: {
        id: 'node_1',
        speaker: 'npc',
        npcName: 'Passageira Dona Rosa',
        text: 'Você já separou o cartão do ônibus ou vai pagar em moedas?',
        stage: 1,
        totalStages: 3,
        choices: [
          { id: 'c_card', label: 'Aceita cartão eletrônico de estudante?', icon: 'speech', nextId: 'node_card', effect: 'ask' },
          { id: 'c_wait', label: 'Deixa eu conferir no bolso onde guardei', icon: 'hourglass', nextId: 'node_check', effect: 'wait' },
          { id: 'c_exit', label: 'Prefiro esperar meu responsável chegar', icon: 'exit', nextId: 'node_exit', effect: 'exit' }
        ]
      },
      node_card: {
        id: 'node_card',
        speaker: 'npc',
        npcName: 'Passageira Dona Rosa',
        text: 'Aceita sim, é só aproximar na maquininha vermelha ao entrar.',
        stage: 2,
        totalStages: 3,
        choices: [{ id: 'c_got', label: 'Ótimo, já está fácil na mão!', icon: 'speech', nextId: 'node_end', effect: 'normal' }]
      },
      node_check: {
        id: 'node_check',
        speaker: 'npc',
        npcName: 'Passageira Dona Rosa',
        text: 'Procure com calma no bolso da mochila.',
        stage: 2,
        totalStages: 3,
        choices: [{ id: 'c_found', label: 'Achei o cartão no zíper da frente!', icon: 'speech', nextId: 'node_end', effect: 'normal' }]
      },
      node_end: {
        id: 'node_end',
        speaker: 'npc',
        npcName: 'Passageira Dona Rosa',
        text: 'Tudo pronto para embarcar com segurança!',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_bye', label: 'Obrigado pela ajuda!', icon: 'speech', nextId: null, effect: 'normal' }]
      },
      node_exit: {
        id: 'node_exit',
        speaker: 'npc',
        npcName: 'Passageira Dona Rosa',
        text: 'Muito prudente esperar junto de quem cuida de você. Fique no banco.',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_bye2', label: 'Combinado!', icon: 'speech', nextId: null, effect: 'normal' }]
      }
    }
  },

  onibus_espera: {
    id: 'onibus_espera',
    locationId: 'ponto_onibus',
    title: 'Aguardar com Tranquilidade',
    subtitle: 'Lidar com atraso ou espera',
    description: 'Quando o transporte demora um pouco mais do que o esperado.',
    initialNodeId: 'node_1',
    nodes: {
      node_1: {
        id: 'node_1',
        speaker: 'npc',
        npcName: 'Passageira Dona Rosa',
        text: 'O trânsito parece um pouquinho lento hoje na avenida.',
        stage: 1,
        totalStages: 3,
        choices: [
          { id: 'c_calm', label: 'Vou observar as folhas das árvores balançando', icon: 'hourglass', nextId: 'node_nature', effect: 'wait' },
          { id: 'c_ask', label: 'Será que ele demora mais de dez minutos?', icon: 'speech', nextId: 'node_delay', effect: 'ask' },
          { id: 'c_exit', label: 'Prefiro chamar uma carona ou ir andando', icon: 'exit', nextId: 'node_exit', effect: 'exit' }
        ]
      },
      node_nature: {
        id: 'node_nature',
        speaker: 'npc',
        npcName: 'Passageira Dona Rosa',
        text: 'Uma ótima ideia! Respirar fundo faz a espera passar mais rápido.',
        stage: 2,
        totalStages: 3,
        choices: [{ id: 'c_peace', label: 'Sim, o vento está fresco aqui no abrigo', icon: 'speech', nextId: 'node_end', effect: 'normal' }]
      },
      node_delay: {
        id: 'node_delay',
        speaker: 'npc',
        npcName: 'Passageira Dona Rosa',
        text: 'Acho que em cinco minutinhos já vemos o farol dele dobrando a rua.',
        stage: 2,
        totalStages: 3,
        choices: [{ id: 'c_ok', label: 'Cinco minutos é tranquilo de esperar', icon: 'speech', nextId: 'node_end', effect: 'normal' }]
      },
      node_end: {
        id: 'node_end',
        speaker: 'npc',
        npcName: 'Passageira Dona Rosa',
        text: 'Aí vem ele! Valeu a pena aguardar.',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_bye', label: 'Vamos lá!', icon: 'speech', nextId: null, effect: 'normal' }]
      },
      node_exit: {
        id: 'node_exit',
        speaker: 'npc',
        npcName: 'Passageira Dona Rosa',
        text: 'Boa caminhada! Se cuide no caminho.',
        stage: 3,
        totalStages: 3,
        isTerminal: true,
        choices: [{ id: 'c_bye2', label: 'Obrigado!', icon: 'speech', nextId: null, effect: 'normal' }]
      }
    }
  }
}
