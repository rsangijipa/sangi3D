/**
 * Configuração de Marca e Presets de Estilo
 * Projeto: 02. Mesa dos Objetos que Acalmam
 */

export const PRESETS_MARCA = {
  pontoQuieto: {
    id: 'pontoQuieto',
    nome: 'Clínica Ponto Quieto',
    logoTexto: 'Clínica Ponto Quieto',
    tagline: 'Psicologia, Terapia Ocupacional e Bem-Estar',
    cores: {
      fundo: '#18120d',
      superficie: 'rgba(247, 243, 236, 0.85)',
      superficieHover: 'rgba(255, 255, 255, 0.95)',
      texto: '#2c221a',
      textoSuave: '#6b584c',
      textoClaro: '#f9f6f0',
      primaria: '#3d2e24',
      secundaria: '#c49a45',
      acento: '#a24b31',
      borda: 'rgba(255, 255, 255, 0.35)',
      bordaSuave: 'rgba(61, 46, 36, 0.15)',
      vidro: 'rgba(245, 240, 232, 0.65)',
      vidroEscuro: 'rgba(24, 18, 13, 0.72)',
      sombra: 'rgba(15, 10, 6, 0.35)'
    },
    fontes: {
      titulo: "'Cormorant Garamond', Garamond, 'Times New Roman', serif",
      texto: "'Karla', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    },
    cta: {
      texto: 'Conhecer o espaço',
      link: '#conhecer-espaco'
    },
    textos: {
      titulo: 'Mexa devagar.',
      subtitulo: 'Um espaço interativo para desacelerar a mente e encontrar o seu ritmo natural.',
      passos: [
        { num: '1', texto: 'Empurre o pêndulo', dica: 'Arraste o pêndulo e observe o desenho geométrico se formar na areia' },
        { num: '2', texto: 'Toque o gongo', dica: 'Toque na tigela tibetana ou faça círculos na borda para fazê-la cantar' },
        { num: '3', texto: 'Gire a ampulheta', dica: 'Vire a ampulheta líquida para acompanhar a descida suave das gotas' },
        { num: '4', texto: 'Desenhe na areia', dica: 'Alise a areia com o rastelo para recomeçar o desenho' }
      ]
    },
    materiais3D: {
      madeiraMesa: 0x3a2518,
      almofadaTigela: 0x932621,
      almofadaBrocado: 0xd4a047,
      metalTigela: 0xc49a45,
      metalNewton: 0xe8ecf0,
      liquidoAzul: 0x1b70a6,
      liquidoAmbar: 0xdf8437,
      areiaTom: 0xf1ece1
    }
  },

  neutro: {
    id: 'neutro',
    nome: 'Espaço Silêncio & Foco',
    logoTexto: 'Silêncio & Foco',
    tagline: 'Mindfulness & Design Sensorial',
    cores: {
      fundo: '#121416',
      superficie: 'rgba(245, 246, 248, 0.88)',
      superficieHover: 'rgba(255, 255, 255, 0.98)',
      texto: '#1a1d20',
      textoSuave: '#58616b',
      textoClaro: '#ffffff',
      primaria: '#2b3036',
      secundaria: '#728091',
      acento: '#3d5a80',
      borda: 'rgba(255, 255, 255, 0.4)',
      bordaSuave: 'rgba(43, 48, 54, 0.15)',
      vidro: 'rgba(238, 241, 245, 0.7)',
      vidroEscuro: 'rgba(18, 20, 22, 0.75)',
      sombra: 'rgba(0, 0, 0, 0.4)'
    },
    fontes: {
      titulo: "'Cormorant Garamond', Garamond, 'Times New Roman', serif",
      texto: "'Karla', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    },
    cta: {
      texto: 'Agendar Sessão',
      link: '#agendar'
    },
    textos: {
      titulo: 'Respire e pause.',
      subtitulo: 'Um refúgio sensorial no seu dia para clarear os pensamentos.',
      passos: [
        { num: '1', texto: 'Empurre o pêndulo', dica: 'Puxe o pêndulo e observe a matemática zen das curvas na areia' },
        { num: '2', texto: 'Toque o gongo', dica: 'Toque a tigela metálica e acompanhe o eco sonoro dissolvendo' },
        { num: '3', texto: 'Gire a ampulheta', dica: 'Inverta a ampulheta para acompanhar a dança lenta das esferas' },
        { num: '4', texto: 'Desenhe na areia', dica: 'Alise a areia para limpar o traçado e recomeçar' }
      ]
    },
    materiais3D: {
      madeiraMesa: 0x242426,
      almofadaTigela: 0x3d434d,
      almofadaBrocado: 0x8b94a0,
      metalTigela: 0xa8aeb8,
      metalNewton: 0xdde2e8,
      liquidoAzul: 0x415a77,
      liquidoAmbar: 0x778da9,
      areiaTom: 0xe8eaed
    }
  }
};

export let MARCA = { ...PRESETS_MARCA.pontoQuieto };

export function aplicarMarca(presetKey = 'pontoQuieto', sceneCallbacks = null) {
  const preset = PRESETS_MARCA[presetKey] || PRESETS_MARCA.pontoQuieto;
  MARCA = { ...preset };

  const root = document.documentElement;
  const c = preset.cores;
  root.style.setProperty('--cor-fundo', c.fundo);
  root.style.setProperty('--cor-superficie', c.superficie);
  root.style.setProperty('--cor-superficie-hover', c.superficieHover);
  root.style.setProperty('--cor-texto', c.texto);
  root.style.setProperty('--cor-texto-suave', c.textoSuave);
  root.style.setProperty('--cor-texto-claro', c.textoClaro);
  root.style.setProperty('--cor-primaria', c.primaria);
  root.style.setProperty('--cor-secundaria', c.secundaria);
  root.style.setProperty('--cor-acento', c.acento);
  root.style.setProperty('--cor-borda', c.borda);
  root.style.setProperty('--cor-borda-suave', c.bordaSuave);
  root.style.setProperty('--cor-vidro', c.vidro);
  root.style.setProperty('--cor-vidro-escuro', c.vidroEscuro);
  root.style.setProperty('--cor-sombra', c.sombra);

  root.style.setProperty('--fonte-titulo', preset.fontes.titulo);
  root.style.setProperty('--fonte-texto', preset.fontes.texto);

  // Atualizar textos no DOM se existirem
  const logoEl = document.getElementById('logo-marca');
  if (logoEl) logoEl.textContent = preset.logoTexto;

  const tituloEl = document.getElementById('titulo-hero');
  if (tituloEl) tituloEl.textContent = preset.textos.titulo;

  const subtituloEl = document.getElementById('subtitulo-hero');
  if (subtituloEl) subtituloEl.textContent = preset.textos.subtitulo;

  const ctaBtn = document.getElementById('btn-cta-nav');
  if (ctaBtn) {
    ctaBtn.textContent = preset.cta.texto;
    ctaBtn.href = preset.cta.link;
  }

  // Notificar cena 3D para atualizar materiais se callback fornecido
  if (typeof sceneCallbacks === 'function') {
    sceneCallbacks(preset.materiais3D);
  } else if (window.__atualizarMateriais3D) {
    window.__atualizarMateriais3D(preset.materiais3D);
  }

  return preset;
}

if (typeof window !== 'undefined') {
  window.MARCA = MARCA;
  window.PRESETS_MARCA = PRESETS_MARCA;
  window.setPresetMarca = (key) => aplicarMarca(key);
}
