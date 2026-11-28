const MESA = {
  bumpers: [
    { id:'bumper-esquerdo', x:-.49,z:-1.02,color:'#ffb14d',points:120 },
    { id:'bumper-central',x:.01,z:-1.50,color:'#ffc36a',points:120 },
    { id:'bumper-direito',x:.54,z:-1.02,color:'#ff963d',points:120 },
  ],
  alvos: [
    { id:'alvo-1',x:-.45,z:-1.91,points:250 },
    { id:'alvo-2',x:-.13,z:-1.99,points:250 },
    { id:'alvo-3',x:.19,z:-1.98,points:250 },
    { id:'alvo-4',x:.51,z:-1.84,points:250 },
  ],
  rampa:{ points:500 },
  arte:{ emblema:'hamburguer', inscricao:'NA BRASA' },
};
const PRESETS = {
  brasa:{
    nome:'Hamburgueria Brasa',logoTexto:'Hamburgueria Brasa',
    cores:{primaria:'#e35429',secundaria:'#2d231e',fundo:'#190f0b',texto:'#fff6e6',destaque:'#ffc46a',madeira:'#c69766',verniz:'#4d2117',metal:'#c48644',luz:'#ffa238'},
    fontes:{titulo:'Bungee',texto:'Rubik'},cta:{texto:'Pedir agora',link:'#contato',origemPai:''},
    textos:{titulo:'Jogue uma\nrodada.',apoio:'Puxe o êmbolo, acerte os alvos e sinta o ritmo do pinball de madeira.',passos:['Puxe o êmbolo','Use os flippers','Acerte os alvos','Jogue de novo'],letreiro:['Hamburgueria','Brasa']},
    mesa:MESA,
  },
  neutra:{
    nome:'Pinball de Madeira',logoTexto:'Pinball de Madeira',
    cores:{primaria:'#266f64',secundaria:'#24332e',fundo:'#101f1c',texto:'#f7f5e5',destaque:'#a8ead4',madeira:'#c7ae82',verniz:'#233e35',metal:'#b0aa83',luz:'#75dfb8'},
    fontes:{titulo:'Bungee',texto:'Rubik'},cta:{texto:'Entrar em contato',link:'#contato',origemPai:''},
    textos:{titulo:'Dê o primeiro\nimpulso.',apoio:'Experimente a mesa artesanal e encontre o seu ritmo entre a rampa e os alvos.',passos:['Puxe o êmbolo','Use os flippers','Acerte os alvos','Jogue de novo'],letreiro:['Pinball','de Madeira']},
    mesa:{...MESA,bumpers:MESA.bumpers.map((b,i)=>({...b,color:['#a8ead4','#5fddbc','#f4ce8d'][i]})),arte:{emblema:'estrela',inscricao:'PINBALL'}},
  },
};
/* Troque pelo preset PRESETS.neutra ou por um objeto com as mesmas chaves. */
const MARCA=PRESETS.brasa;
window.PINBALL_BRAND={MARCA,PRESETS};

