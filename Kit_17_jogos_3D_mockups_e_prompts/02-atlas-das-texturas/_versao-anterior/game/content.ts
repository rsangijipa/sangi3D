export const samples = [
 ['cork','Cortiça','Placas irregulares, fendas profundas e pequenos poros.'],
 ['wool','Lã','Fios entrelaçados, curvas e espaços entre as mechas.'],
 ['slate','Ardósia','Camadas achatadas, bordas quebradas e estrias finas.'],
 ['linen','Linho cru','Fios retos cruzados em uma trama regular.'],
 ['leaf','Folha','Nervura central e ramificações sobre uma superfície fina.'],
 ['wood','Madeira lisa','Veios longos e superfície plana com bordas arredondadas.'],
 ['ceramic','Cerâmica','Superfície curva, contínua e com reflexos suaves.'],
 ['sandstone','Arenito','Grãos pequenos e camadas onduladas.'],
] as const;
export type SampleId = typeof samples[number][0];
export const descriptors = ['liso','rugoso','fibroso','granulado','outro','não sei'];
export const preferences = ['gostei','indiferente','prefiro evitar'];
export const stages = ['Escolher','Observar','Luz rasante','Comparar','Atlas','Revisão'] as const;
