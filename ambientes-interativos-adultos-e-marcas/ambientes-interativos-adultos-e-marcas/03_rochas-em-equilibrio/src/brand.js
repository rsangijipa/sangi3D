export const PRESETS = {
  casaSeixo: {
    id: 'casa-seixo',
    nome: 'Casa Seixo Yoga e Terapia',
    logoTexto: 'Casa Seixo Yoga e Terapia',
    cores: {
      primaria: '#556b59', // verde-musgo suave
      secundaria: '#374239', // ardósia escuro
      fundo: '#ecebe4', // pedra clara / linho lavado
      texto: '#222823', // grafite mineral
      destaque: '#c48f49', // ocre dourado quente
      rocha: '#6c7570', // ardósia média
      agua: '#589e98', // turquesa límpida de nascente
      linho: '#f7f6f0', // linho cru
      luz: '#fff6e3', // sol baixo da manhã
    },
    fontes: { titulo: 'Lora', texto: 'Nunito Sans' },
    cta: { texto: 'Ver horários', link: '#horarios', origemPai: '' },
    textos: {
      titulo: 'Uma pedra\nde cada vez.',
      apoio: 'Empilhe seixos com presença. Sinta o ponto de apoio e respire com o ritmo das águas.',
      passos: [
        'Escolha uma pedra',
        'Encontre o apoio',
        'Solte devagar',
        'Recomece quando cair',
      ],
      convite: 'Toque e experimente',
      sobre: 'Casa Seixo é um refúgio para mindfulness, yoga integrativa e psicoterapia corporal. Esta experiência convida a desacelerar, sentir o ponto de equilíbrio e perceber que a queda é apenas a oportunidade de um recomeço suave.',
    },
    catalogo: {
      rochas: [
        { id: 'seixo-ardosia', nome: 'Seixo Ardósia', cor: '#505658', tipo: 'base-larga', massa: 2.4 },
        { id: 'seixo-ocre', nome: 'Seixo Ocre', cor: '#b3824b', tipo: 'equilibrado', massa: 1.8 },
        { id: 'seixo-basalto', nome: 'Seixo Basalto', cor: '#3a3f3e', tipo: 'denso', massa: 1.5 },
        { id: 'pedra-musgosa', nome: 'Pedra Musgosa', cor: '#65775f', tipo: 'organico', massa: 1.1 },
        { id: 'seixo-arenito', nome: 'Seixo Arenito', cor: '#c8b69e', tipo: 'suave', massa: 0.8 },
        { id: 'seixo-quartzo', nome: 'Seixo Quartzo', cor: '#8d9492', tipo: 'topo', massa: 0.5 },
      ],
    },
  },
  neutro: {
    id: 'neutro',
    nome: 'Estúdio Equilíbrio Mineral',
    logoTexto: 'Equilíbrio Mineral',
    cores: {
      primaria: '#5a5c5f',
      secundaria: '#2f3133',
      fundo: '#efefec',
      texto: '#1f2022',
      destaque: '#878a8d',
      rocha: '#5e6063',
      agua: '#688285',
      linho: '#fafaf7',
      luz: '#fdfbf7',
    },
    fontes: { titulo: 'Lora', texto: 'Nunito Sans' },
    cta: { texto: 'Conhecer espaço', link: '#sobre', origemPai: '' },
    textos: {
      titulo: 'Uma pedra\nde cada vez.',
      apoio: 'Empilhe seixos com presença. Sinta o ponto de apoio e respire com o ritmo das águas.',
      passos: [
        'Escolha uma pedra',
        'Encontre o apoio',
        'Solte devagar',
        'Recomece quando cair',
      ],
      convite: 'Toque e experimente',
      sobre: 'Uma exploração física do equilíbrio paciente e da gravidade serena em ambiente fluvial contemporâneo.',
    },
    catalogo: {
      rochas: [
        { id: 'seixo-ardosia', nome: 'Ardósia Plana', cor: '#44484a', tipo: 'base-larga', massa: 2.4 },
        { id: 'seixo-ocre', nome: 'Granito Cinza', cor: '#787a7d', tipo: 'equilibrado', massa: 1.8 },
        { id: 'seixo-basalto', nome: 'Basalto Polido', cor: '#2c2e30', tipo: 'denso', massa: 1.5 },
        { id: 'pedra-musgosa', nome: 'Dolomita Suave', cor: '#6a706b', tipo: 'organico', massa: 1.1 },
        { id: 'seixo-arenito', nome: 'Calcário Claro', cor: '#b5b7b5', tipo: 'suave', massa: 0.8 },
        { id: 'seixo-quartzo', nome: 'Quartzo Mineral', cor: '#989a9c', tipo: 'topo', massa: 0.5 },
      ],
    },
  },
};

export const MARCA = window.MARCA_OVERRIDE || PRESETS.casaSeixo;

export function applyBrandStyles(brand = MARCA) {
  const root = document.documentElement;
  const c = brand.cores;
  root.style.setProperty('--color-primary', c.primaria);
  root.style.setProperty('--color-secondary', c.secundaria);
  root.style.setProperty('--color-bg', c.fundo);
  root.style.setProperty('--color-text', c.texto);
  root.style.setProperty('--color-accent', c.destaque);
  root.style.setProperty('--color-rock', c.rocha);
  root.style.setProperty('--color-water', c.agua);
  root.style.setProperty('--color-linen', c.linho);
  root.style.setProperty('--color-light', c.luz);
  root.style.setProperty('--font-title', `'${brand.fontes.titulo}', Georgia, serif`);
  root.style.setProperty('--font-text', `'${brand.fontes.texto}', system-ui, sans-serif`);
  document.title = `${brand.nome} — Rochas em Equilíbrio 3D`;
}
