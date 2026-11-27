/* Editar este objeto no HTML entregue é suficiente para personalizar a sala. */
const PRESETS = {
  travessia: {
    nome: 'Espaço Travessia Psicologia',
    logoTexto: 'Espaço Travessia Psicologia',
    cores: {
      primaria: '#d1ac74', secundaria: '#68503d', fundo: '#221914', texto: '#fff1dd', destaque: '#ebc690',
      tecido: '#676437', verniz: '#9b6644', luz: '#ffca86',
    },
    fontes: { titulo: 'Fraunces', texto: 'Inter' },
    cta: { texto: 'Agendar conversa', link: '#contato', origemPai: '' },
    textos: {
      titulo: 'Antes de entrar,\nchegue.',
      apoio: 'Reserve um momento para si mesmo. Interaja com o ambiente e prepare sua mente para o que está por vir.',
      passos: ['Escolha um som', 'Ajuste o volume', 'Respire 1 minuto', 'Siga quando quiser'],
      convite: 'Toque e experimente',
    },
    catalogo: { chuva: 'Chuva', lareira: 'Lareira', vitrola: 'Vitrola', relogio: 'Relógio', plantas: 'Plantas' },
  },
  neutra: {
    nome: 'Sala de Espera Sonora',
    logoTexto: 'Sala de Espera Sonora',
    cores: {
      primaria: '#a9c2ae', secundaria: '#3c504b', fundo: '#161f1d', texto: '#f0f2e5', destaque: '#d6e5ca',
      tecido: '#426459', verniz: '#856955', luz: '#f6dfb6',
    },
    fontes: { titulo: 'Fraunces', texto: 'Inter' },
    cta: { texto: 'Entrar em contato', link: '#contato', origemPai: '' },
    textos: {
      titulo: 'Uma pausa\nantes de seguir.',
      apoio: 'Crie a sua paisagem sonora. Escolha os sons e ajuste o volume no seu ritmo.',
      passos: ['Escolha um som', 'Ajuste o volume', 'Respire 1 minuto', 'Siga quando quiser'],
      convite: 'Explore a sala',
    },
    catalogo: { chuva: 'Chuva', lareira: 'Lareira', vitrola: 'Vitrola', relogio: 'Relógio', plantas: 'Plantas' },
  },
};
const MARCA = PRESETS.travessia;
window.SALA_BRAND = { PRESETS, MARCA };

