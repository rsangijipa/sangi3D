export const icons: Record<string,string> = {
  mask: '<path d="M3 4c3 1 6 0 9 2 3-2 6-1 9-2 0 8-3 12-9 16C6 16 3 12 3 4Z"/><path d="M6.5 9c1-.7 2.5-.5 3.5.5-1.3 1-2.5.9-3.5-.5Zm7.5.5c1-1 2.5-1.2 3.5-.5-1 1.4-2.2 1.5-3.5.5ZM9 14c2 1.7 4 1.7 6 0"/>',
  sculpt: '<path d="m3 21 3.3-7.5L17.5 2.3c.5-.5 1.1-.4 1.6 0l2.5 2.5c.5.5.5 1.1 0 1.6L10.4 17.7 3 21Z"/><path d="m12 8 4 4m-9.5 1.5 4 4M4 19l1 1"/>',
  paint: '<path d="M12 14c4.8-3 10-9.7 9-11s-8.1 4.2-11 9m2 2c1.1 2.9-1.5 5.7-5.4 5.9l-3.1.1c2-1.1 1.1-3.5 2.7-5.6 1.5-2 3.5-2 5.8-.4Z"/>',
  decorate: '<path d="M3 22C7 16 12 12 21 3M8 16C4 13 4 9 6 6c3 3 4 7 2 10Zm5-5c-1-3 1-6 4-8 0 4-1 6-4 8Zm-2 4c5 1 8-1 10-4-4-1-8 1-10 4ZM5 19c5 2 8 1 11-1-4-2-7-2-11 1Z"/>',
  undo: '<path d="M8 5 3 10l5 5M3 10h11a5 5 0 1 1 0 10h-3"/>',
  redo: '<path d="m16 5 5 5-5 5m5-5H10a5 5 0 1 0 0 10h3"/>',
  left: '<path d="m14 5-7 7 7 7"/>', right: '<path d="m10 5 7 7-7 7"/>',
  rotate: '<ellipse cx="12" cy="12" rx="10" ry="4"/><path d="m11 6 3 2-3 3m2 2-3 3 3 2"/>',
  sound: '<path d="M3 9h4l5-4v14l-5-4H3zM16 8a6 6 0 0 1 0 8m2-10a9 9 0 0 1 0 12"/>',
  muted: '<path d="M3 9h4l5-4v14l-5-4H3zm13 0 5 6m0-6-5 6"/>',
  camera: '<path d="M4 6h4l2-2h4l2 2h4a1 1 0 0 1 1 1v12H3V7a1 1 0 0 1 1-1Z"/><circle cx="12" cy="12" r="3"/>',
  sliders: '<path d="M5 3v18M12 3v18M19 3v18"/><path d="M2 8h6m1 8h6m1-6h6"/>',
  export: '<path d="M12 3v12m-4-4 4 4 4-4M4 15v5h16v-5"/>',
  gallery: '<rect x="3" y="4" width="18" height="15" rx="2"/><path d="m4 16 5-5 4 4 3-3 4 4"/><circle cx="16" cy="8" r="1"/>',
  book: '<path d="M12 6c-3-3-6-3-9-2v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 2Zm0 0v14"/>',
  save: '<path d="M4 3h13l3 3v14H4zM8 3v6h8V3M8 20v-7h8v7"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  keyboard: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h1m4 0h1m4 0h1m-11 4h1m4 0h1m4 0h1m-8 3h6"/>',
};
export const icon = (name: string) => '<svg aria-hidden="true" viewBox="0 0 24 24" '+
  'fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round">'+icons[name]+'</svg>';

export const palette = [
  ['Marfim','#ead9bd'],['Ocre','#bc7c20'],['Terracota','#a34b2c'],['Carmim','#a3332b'],['Vinho','#6e2937'],
  ['Verde petróleo','#206e69'],['Azul petróleo','#21566b'],['Ultramar','#274581'],['Ameixa','#623d6d'],['Carvão','#292525'],
];

export const experiences = [
  ['Máscara livre','Crie a partir dos materiais e das formas que escolher.'],
  ['Dentro e fora','Explore as duas superfícies de uma mesma máscara.'],
  ['Máscara em transformação','Registre versões ao longo da criação.'],
  ['Polaridades','Trabalhe em duas máscaras independentes e compare as criações.'],
  ['Papéis sociais','Escolha um contexto para acompanhar a criação.'],
  ['Teatro das máscaras','Experimente movimentos e luz com a máscara num personagem.'],
  ['Galeria pessoal','Reúna e revisite suas criações salvas neste navegador.'],
] as const;

export const questions = [
  'O que você percebe enquanto cria?',
  'Como é observar essa máscara por dentro?',
  'O que você gostaria de transformar?',
  'Que nome você daria a essa criação?',
  'Como seria colocar as duas máscaras em diálogo?',
];

const tab = (name: string, label: string) => '<button type="button" class="work-tab" data-mode="'+name+'" aria-pressed="'+(name==='sculpt')+'">'+icon(name)+'<span>'+label+'</span></button>';
const button = (id: string, symbol: string, label: string) => '<button type="button" id="'+id+'" title="'+label+'" aria-label="'+label+'">'+icon(symbol)+'<span>'+label+'</span></button>';

export function interfaceMarkup() {
  return `
  <main id="atelier" aria-label="Ateliê das Máscaras Emocionais">
    <div class="backdrop" id="backdrop"></div>
    <div class="vignette"></div>
    <div id="stage"></div>
    <p class="sr-only" id="stage-help">Use as setas para mover o cursor de edição na máscara. Pressione Espaço para aplicar a ferramenta. Use as teclas Q e E para girar.</p>
    <header class="top">
      <nav class="top-nav glass" aria-label="Navegação do ateliê">
        ${button('experiences','book','Experiências')}
        ${button('gallery','gallery','Galeria')}
      </nav>
      <div class="brand glass">
        <div class="crest">${icon('mask')}</div>
        <h1>${icon('decorate')}<span>Ateliê das Máscaras <i>Emocionais</i></span>${icon('decorate')}</h1>
      </div>
      <nav class="top-controls glass" aria-label="Som e visualização">
        ${button('sound','muted','Som')}
        ${button('zoom','camera','Câmera')}
        ${button('settings','sliders','Luz e qualidade')}
      </nav>
    </header>
    <aside class="panel glass" aria-label="Ferramentas da máscara">
      <button type="button" id="disclosure" aria-controls="panel-content" aria-expanded="true">Ferramentas <span>⌃</span></button>
      <div id="panel-content">
        <div class="panel-label"><span>Bancada</span><span id="face-label">Face externa</span></div>
        <div class="work-tabs" role="group" aria-label="Ferramentas">
          ${tab('sculpt','Esculpir')}${tab('paint','Pintar')}${tab('decorate','Decorar')}
        </div>
        <div id="mode-controls"></div>
        <div class="section-title"><span>Pigmentos</span></div>
        <div class="swatches" role="group" aria-label="Pigmentos">
          ${palette.map(([n,c],i)=>`<button type="button" class="swatch" style="--pigment:${c}" aria-label="${n}" title="${n}" data-pigment="${i}" aria-pressed="${i===0}"></button>`).join('')}
        </div>
        <button type="button" id="flip" aria-pressed="false">${icon('mask')}<span>Dentro e fora</span></button>
      </div>
    </aside>
    <footer class="bottom">
      <div class="stage-guide"><span id="guide">Arraste sobre a máscara para esculpir</span>${button('help','keyboard','Atalhos')}</div>
      <div class="dock" aria-label="Ações da criação">
        <div class="glass dock-group">${button('undo','undo','Desfazer')}${button('redo','redo','Refazer')}</div>
        <div class="glass dock-group turn" aria-label="Girar pedestal">
          ${button('left','left','Girar à esquerda')}<span>${icon('rotate')}Girar</span>${button('right','right','Girar à direita')}
        </div>
        <div class="glass dock-group">${button('save','save','Salvar')}${button('export','export','Exportar')}</div>
      </div>
    </footer>
    <div class="keyboard-cursor" id="keyboard-cursor" hidden></div>
    <div class="toast glass" id="toast" role="status" hidden></div>
    <div class="loading glass" id="loading" role="status">Preparando a bancada…</div>
    <dialog id="dialog" class="glass"><div id="dialog-body"></div></dialog>
  </main>`;
}
