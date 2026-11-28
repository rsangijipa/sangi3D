export const presets = {
  bowl: { label: 'Tigela de ondas', family: 'Tigela', count: 5, profile: [[.085,.012],[.102,.026],[.143,.044],[.197,.083],[.237,.133],[.267,.195],[.276,.225]], color: '#254867' },
  plate: { label: 'Prato de marfim', family: 'Prato', count: 4, profile: [[.09,.008],[.115,.022],[.173,.028],[.228,.039],[.282,.064],[.305,.086],[.31,.096]], color: '#ceb493' },
  vase: { label: 'Vaso de outono', family: 'Vaso', count: 6, profile: [[.092,.012],[.125,.042],[.168,.107],[.173,.181],[.144,.249],[.085,.305],[.088,.351]], color: '#823e32' },
} as const
export type Vessel = keyof typeof presets
export type Mode = 'free' | 'guided' | 'alternate' | 'facilitated'
export const modes: Record<Mode, string> = {free:'Livre', guided:'Guiado', alternate:'Composição alternativa', facilitated:'Acompanhado'}
export const Tau = Math.PI * 2
