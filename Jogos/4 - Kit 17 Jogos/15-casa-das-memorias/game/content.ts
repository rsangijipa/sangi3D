export const rooms = {
 reading:{name:'Sala de leitura',detail:'Poltrona de linho, estante e luminária.'},
 bedroom:{name:'Quarto',detail:'Uma cama com manta de feltro e luz de cabeceira.'},
 studio:{name:'Cômodo da cômoda',detail:'Um livro verde, uma moldura vazia e uma gaveta.'},
 storage:{name:'Depósito',detail:'Uma mala de couro e pequenas caixas na prateleira.'}
} as const;
export type Room=keyof typeof rooms;
export const symbols={leaf:'Folha',star:'Estrela',flower:'Flor',stone:'Pedra',card:'Cartão'} as const;
export const marks={leaf:'❧',star:'☆',flower:'✿',stone:'◇',card:'▤'} as const;
export type Kind=keyof typeof symbols;
export const stages=['Visitar','Escolher símbolo','Dar um detalhe','Guardar ou omitir','Reorganizar','Revisar'];
export const words=['calma','descoberta','encontro','mudança','pausa'];
export const slots=(Object.keys(rooms) as Room[]).flatMap(room=>Array.from({length:4},(_,i)=>({id:room+'-'+i,room,visibility:i===3&&['studio','storage'].includes(room)?'stored':'visible',capacity:i===3?5:1})));
export const roomKeys=Object.keys(rooms) as Room[];
export const kinds=Object.keys(symbols) as Kind[];
