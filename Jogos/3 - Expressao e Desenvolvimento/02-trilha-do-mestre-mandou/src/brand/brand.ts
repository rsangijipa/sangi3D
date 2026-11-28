/**
 * Sistema de Marca e Presets de Estilo
 * Projeto: 02. Trilha do Mestre Mandou
 */

export interface BrandConfig {
  id: string;
  nome: string;
  logoTexto: string;
  tagline: string;
  cores: {
    primaria: string;
    secundaria: string;
    acento: string;
    destaque: string;
    fundo: string;
    superficie: string;
    texto: string;
    textoClaro: string;
  };
}

export const PRESETS_MARCA: Record<string, BrandConfig> = {
  original: {
    id: 'original',
    nome: 'Parque da Trilha Viva',
    logoTexto: 'Trilha do Mestre Mandou',
    tagline: 'Seguimento de instruções, planejamento e expressão corporal',
    cores: {
      primaria: '#365A43',
      secundaria: '#81945B',
      acento: '#E5BC58',
      destaque: '#5599A5',
      fundo: '#263c2e',
      superficie: 'rgba(38, 60, 46, 0.88)',
      texto: '#fbf8f2',
      textoClaro: '#ffffff'
    }
  },
  neutro: {
    id: 'neutro',
    nome: 'Circuito de Atenção & Foco',
    logoTexto: 'Trilha de Foco',
    tagline: 'Coordenação e planejamento funcional',
    cores: {
      primaria: '#2b3036',
      secundaria: '#58616b',
      acento: '#9aa0a6',
      destaque: '#3d5a80',
      fundo: '#16191c',
      superficie: 'rgba(30, 34, 40, 0.90)',
      texto: '#f0f2f5',
      textoClaro: '#ffffff'
    }
  }
};

export let MARCA = { ...PRESETS_MARCA.original };

export function aplicarMarca(presetKey: string = 'original') {
  const preset = PRESETS_MARCA[presetKey] || PRESETS_MARCA.original;
  MARCA = { ...preset };

  const root = document.documentElement;
  const c = preset.cores;
  root.style.setProperty('--cor-primaria', c.primaria);
  root.style.setProperty('--cor-secundaria', c.secundaria);
  root.style.setProperty('--cor-acento', c.acento);
  root.style.setProperty('--cor-destaque', c.destaque);
  root.style.setProperty('--cor-fundo', c.fundo);
  root.style.setProperty('--cor-superficie', c.superficie);
  root.style.setProperty('--cor-texto', c.texto);
  root.style.setProperty('--cor-texto-claro', c.textoClaro);

  return preset;
}

if (typeof window !== 'undefined') {
  (window as any).MARCA = MARCA;
  (window as any).setPresetMarca = (key: string) => aplicarMarca(key);
}
