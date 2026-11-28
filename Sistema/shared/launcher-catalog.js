(() => {
  'use strict';

  const categories = [
    { id: 'mundos', label: 'Mundos e exploração', hue: 190, entries: [
      'cidade-submersa', 'arquipelago-celestial', 'biblioteca-infinita', 'trem-sem-destino',
      'cidade-da-madrugada',
    ] },
    { id: 'natureza', label: 'Natureza e cultivo', hue: 145, entries: [
      'bancada-do-florista', 'colmeia-transparente', 'estufa-das-borboletas', 'jardim-dos-fungos',
      'lago-3d-interativo', 'oficina-de-bonsais', 'terrario-de-vidro',
      'floresta-bioluminescente', 'escultor-de-planetas', 'universo-de-uma-gota', 'bougainvillea',
      'arquitetura-de-uma-pena', 'hibiscus-rosa-sinensis', 'ipe-rosa',
      'cosmos-e-hesperiidae', 'passarela-na-mata-tropical', 'poca-pos-chuva-e-espirradeiras',
    ] },
    { id: 'oficinas', label: 'Arte e artesanato', hue: 36, entries: [
      'atelie-das-reconstrucoes-kintsugi', 'oficina-das-velas-artesanais', 'oficina-de-estofados',
      'oficina-do-vitralista', 'pavilhao-dos-tecidos-flutuantes', 'restauro-de-azulejos',
      'sopraria-das-transformacoes', 'tear-dos-vinculos',
      'atelie-de-ceramica', 'oceano-de-tinta', 'oficina-de-mosaicos',
    ] },
    { id: 'ciencia', label: 'Ciência e mecanismos', hue: 215, entries: [
      'arquitetura-do-impossivel', 'camara-antigravitacional', 'laboratorio-de-ferrofluido',
      'galeria-dos-equilibrios-impossiveis', 'gerador-de-mundos-climaticos', 'maquete-que-se-monta',
      'maquina-de-garra-de-brindes', 'maquina-de-reacao-em-cadeia', 'moinho-hidraulico',
      'pinball-de-madeira', 'relogio-aberto', 'trem-de-engrenagens', 'vulcao-em-miniatura', 'oficina-das-bolhas',
    ] },
    { id: 'sentidos', label: 'Som, luz e sentidos', hue: 275, entries: [
      'atlas-das-texturas', 'caixa-de-musica-perfurada', 'cartografia-dos-sons', 'copos-musicais',
      'laboratorio-de-camadas-sonoras', 'observatorio-da-luz', 'oficina-do-ritmo', 'orgao-do-perfumista',
      'paisagem-sonora-3d', 'pousada-vento-leve', 'sala-de-espera-sonora', 'toca-discos-de-vinil', 'universo-audioreativo',
      'corpo-de-particulas', 'maestro-invisivel',
    ] },
    { id: 'emocoes', label: 'Emoções e bem-estar', hue: 330, entries: [
      'agencia-de-investigacao-dos-pensamentos', 'areias-do-impermanente', 'atelie-do-gesto-lento',
      'atelie-dos-remendos-e-transformacoes', 'ateliemascaras', 'bussola-do-corpo', 'casa-da-arvore-das-emocoes',
      'escada-da-coragem', 'ilha-das-pausas', 'jardim-dos-ciclos', 'mesa-dos-objetos-que-acalmam',
      'meteorologia-das-emocoes', 'pensar-sentir-e-agir', 'radio-dos-pensamentos', 'refugio-da-chuva', 'rochas-em-equilibrio',
      'semaforo-das-emocoes', 'termometro-da-ansiedade', 'torre-do-impulso', 'tribunal-dos-pensamentos',
      'vale-dos-baloes-passageiros',
    ] },
    { id: 'historias', label: 'Histórias e convivência', hue: 15, entries: [
      'biblioteca-das-historias-inacabadas', 'casa-das-memorias', 'cidade-das-conexoes', 'cidade-das-conversas',
      'correio-das-palavras-nao-ditas', 'estacao-das-trocas', 'estudio-dos-limites', 'museu-das-memorias', 'museu-dos-pontos-de-vista',
      'oficina-dos-gestos-compartilhados-projeto', 'sala-das-cadeiras-possiveis', 'teatro-das-historias-possiveis',
      'territorio-dos-vinculos', 'trilha-do-mestre-mandou',
    ] },
    { id: 'cotidiano', label: 'Cotidiano e escolhas', hue: 54, entries: [
      'bancada-da-manicure', 'barista-de-bancada', 'central-dos-planos-alternativos', 'clepsidra-do-foco',
      'confeitaria-de-bolos-3d', 'cozinha-das-descobertas', 'ensaio-do-cotidiano', 'farol-da-atencao',
      'maquina-das-consequencias', 'maquina-de-escrever-das-intencoes', 'mochila-da-travessia-projeto',
      'navegador-dos-valores', 'oficina-do-tempo', 'porto-das-decisoes', 'relojoaria-das-prioridades',
    ] },
    { id: 'outros', label: 'Outras experiências', hue: 200, entries: [] },
  ];

  // Registra a data de publicação de cada novidade, independente do mtime do arquivo.
  const publications = [
    { date: '2026-11-28', type: 'new', entries: [
      'oficina-das-bolhas', 'universo-de-uma-gota', 'oficina-de-mosaicos',
      'cosmos-e-hesperiidae', 'passarela-na-mata-tropical', 'poca-pos-chuva-e-espirradeiras',
    ] },
    { date: '2026-11-24', type: 'new', entries: [
      'cidade-submersa', 'arquipelago-celestial', 'biblioteca-infinita', 'trem-sem-destino',
      'universo-audioreativo', 'oficina-de-estofados', 'restauro-de-azulejos',
    ] },
    { date: '2026-11-24', type: 'updated', entries: [
      'meteorologia-das-emocoes', 'oficina-de-bonsais', 'jardim-dos-fungos', 'terrario-de-vidro-atelier-expandido',
      'museu-dos-pontos-de-vista', 'estudio-dos-limites', 'teatro-das-historias-possiveis',
      'maquina-de-escrever-das-intencoes', 'copos-musicais', 'bancada-da-manicure', 'barista-de-bancada',
      'orgao-do-perfumista',
    ] },
  ];

  const categoryByEntry = new Map(categories.flatMap(({ entries, ...category }) =>
    entries.map((entry) => [entry, category])));
  const releaseByEntry = new Map();
  for (const { date, type, entries } of publications) {
    for (const entry of entries) {
      if ((releaseByEntry.get(entry)?.date ?? '') <= date) releaseByEntry.set(entry, { date, type });
    }
  }

  function pathKeys(app) {
    return String(app.path ?? '').split(/[\\/]/).reverse().map((part) => part
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      .replace(/\.(html|md)$/, '').replace(/^\d+[-_]/, '').replace(/[^a-z0-9]+/g, '-'));
  }

  function describe(app) {
    const keys = pathKeys(app);
    const archived = app.collection === 'Legado arquivado';
    const category = archived ? { id: 'archive', label: 'Versões arquivadas', hue: 30 }
      : keys.map((key) => categoryByEntry.get(key)).find(Boolean) ?? categories.at(-1);
    const release = archived || app.status !== 'ready' ? null
      : keys.map((key) => releaseByEntry.get(key)).find(Boolean) ?? null;
    return { ...app, category, release };
  }

  window.SangiLauncherCatalog = { categories, describe };
})();
