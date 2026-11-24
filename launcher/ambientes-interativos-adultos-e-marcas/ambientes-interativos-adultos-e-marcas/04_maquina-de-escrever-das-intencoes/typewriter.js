import * as T from '/shared/vendor/three.module.js';
import { ResponsiveAudio } from '/shared/engine/audio.js';
import { LifecycleManager } from '/shared/engine/lifecycle.js';
import { createDesk, keyRows } from './desk.js';

const get=id=>document.getElementById(id);
const host=get('scene');
const input=get('type-input');
const audio=new ResponsiveAudio();
audio.setVolume(.29);
audio.setMuted(true);
let localSound=false;
let hostMuted=false;
let paused=false;
let desk;
const WIDTH=32;
const MAX_TEXT=210;
let snapshot='';
let stamped=false;
let stored=false;
let saved=false;
const canvas=document.createElement('canvas');
canvas.width=1360;
canvas.height=1120;
const ctx=canvas.getContext('2d');
const texture=new T.CanvasTexture(canvas);
texture.colorSpace=T.SRGBColorSpace;
texture.anisotropy=8;
const stock=document.createElement('canvas');
stock.width=canvas.width;
stock.height=canvas.height;
const grain=stock.getContext('2d');
const wash=grain.createLinearGradient(0,0,1360,1120);
wash.addColorStop(0,'#f7e9c9');
wash.addColorStop(.58,'#ebdbb2');
wash.addColorStop(1,'#f4e8c9');
grain.fillStyle=wash;
grain.fillRect(0,0,1360,1120);
for(let i=0;i<30000;i++){
  grain.fillStyle=i%2?'#7e5a2920':'#ffffff30';
  grain.fillRect((i*173.78)%1360,(i*411.18)%1120,1+i%5,1+i%2);
}

function lines(value) {
  return value.split('\n').flatMap(line=>{
    const chars=[...line];
    return Array.from({length:Math.max(1,Math.ceil(chars.length/WIDTH))},(_,i)=>chars.slice(i*WIDTH,(i+1)*WIDTH).join(''));
  });
}
function draw() {
  ctx.drawImage(stock,0,0);
  ctx.strokeStyle='#73543060';
  ctx.lineWidth=2;
  ctx.strokeRect(56,53,1248,1014);
  ctx.fillStyle='#704e30';
  ctx.font='600 40px Georgia';
  ctx.letterSpacing='7px';
  ctx.fillText('ATELIER PALAVRA VIVA',104,144);
  ctx.letterSpacing='0px';
  ctx.fillStyle=snapshot?'#292219':'#776c55';
  ctx.font='56px Courier New';
  const text=lines(snapshot||'Esta semana eu vou…');
  text.slice(0,10).forEach((line,i)=>ctx.fillText(line,100,264+i*68,1160));
  if(text.length>10) {
    ctx.font='33px Courier New';
    ctx.fillText('…',100,958);
  }
  if(stamped){
    ctx.save();
    ctx.translate(944,952);
    ctx.rotate(-.115);
    ctx.strokeStyle='#913d2d';
    ctx.lineWidth=5;
    ctx.strokeRect(-182,-51,364,102);
    ctx.fillStyle='#913d2d';
    ctx.font='bold 46px Courier New';
    ctx.textAlign='center';
    ctx.fillText('INTENÇÃO',0,17);
    ctx.restore();
  }
  texture.needsUpdate=true;
}
function activeStep(){
  if(stored||saved) return 3;
  if(stamped) return 2;
  if(snapshot.trim()) return 1;
  return 0;
}
function render(character) {
  const caret=input.selectionEnd??snapshot.length;
  const part=snapshot.slice(0,caret);
  const layout=lines(part);
  desk?.update({column:[...layout.at(-1)].length,line:layout.length-1,character,stored});
  input.readOnly=stored;
  get('typed-text').textContent=snapshot||'Esta semana eu vou…';
  get('stamp-mark').hidden=!stamped;
  get('counter').textContent=snapshot.length+' / '+MAX_TEXT;
  get('stamp').disabled=stored||!snapshot.trim()||stamped;
  get('fold').disabled=stored||!snapshot.trim();
  get('return').disabled=stored||snapshot.length===MAX_TEXT;
  get('download').disabled=!snapshot.trim();
  get('reset').disabled=!snapshot;
  get('keyboard-toggle').disabled=stored;
  for(const key of get('keyboard').querySelectorAll('button')) key.disabled=stored;
  for(const [index,step] of [...get('steps').children].entries()){
    if(index===activeStep()) step.setAttribute('aria-current','step');
    else step.removeAttribute('aria-current');
  }
  draw();
}
function setHelp(text){get('help-msg').textContent=text;}
function play(effect) { if(localSound&&!hostMuted&&!paused) effect(); }
function focusInput(){if(!stored) input.focus({preventScroll:true});}
function readInput(event) {
  if(stored) return;
  const previous=snapshot;
  snapshot=input.value.slice(0,MAX_TEXT);
  if(snapshot!==previous) {
    saved=false;
    if(stamped) stamped=false;
  }
  const index=input.selectionEnd??snapshot.length;
  const char=snapshot.length>previous.length?snapshot.slice(0,index).at(-1):undefined;
  const layout=lines(snapshot.slice(0,index));
  if(event?.inputType!=='insertLineBreak'&&char){
    play(()=>audio.playTypewriterClack());
    if([...layout.at(-1)].length===WIDTH) {
      play(()=>audio.playChime(1130,.45));
      setHelp('Fim da linha. Use o retorno do carro para avançar.');
    } else {
      setHelp('Releia a folha antes de carimbar ou guardar.');
    }
  } else if(event?.inputType==='insertLineBreak') {
    desk?.animate('return');
    play(()=>audio.playChime(1100,.48));
    setHelp('Carro retornado para uma nova linha.');
  }
  render(char);
}
function insert(text,inputType) {
  if(stored) return;
  const start=input.selectionStart??snapshot.length;
  const end=input.selectionEnd??snapshot.length;
  const replace=text.slice(0,MAX_TEXT-snapshot.length+end-start);
  if(!replace&&text) return;
  input.setRangeText(replace,start,end,'end');
  readInput({inputType});
}
function returnCarriage(){ insert('\n','insertLineBreak'); }
function stamp(){
  if(stored||stamped||!snapshot.trim()) return;
  stamped=true;
  saved=false;
  render();
  desk?.animate('stamp');
  play(()=>audio.playClick(245,.075));
  setHelp('Carimbo aplicado à sua folha.');
}
function fold(){
  if(stored||!snapshot.trim()) return;
  stored=true;
  render();
  if(!get('keyboard').hidden) toggleKeys(false);
  desk?.animate('fold');
  play(()=>audio.playClick(365,.046));
  setHelp('Folha guardada no envelope. Você pode baixar uma imagem ou iniciar outra.');
}
function download(){
  if(!snapshot.trim()) return;
  const link=document.createElement('a');
  const image=document.createElement('canvas');
  image.width=1360;
  const text=lines(snapshot);
  image.height=Math.max(1120,370+text.length*68);
  const result=image.getContext('2d');
  if(text.length<=10) result.drawImage(canvas,0,0);
  else {
    result.drawImage(stock,0,0,image.width,image.height);
    result.strokeStyle='#73543060';
    result.lineWidth=2;
    result.strokeRect(56,53,1248,image.height-106);
    result.fillStyle='#704e30';
    result.font='600 40px Georgia';
    result.fillText('ATELIER PALAVRA VIVA',104,144);
    result.fillStyle='#292219';
    result.font='56px Courier New';
    text.forEach((line,i)=>result.fillText(line,100,264+i*68,1160));
    if(stamped){
      result.fillStyle='#913d2d';
      result.font='bold 46px Courier New';
      result.fillText('INTENÇÃO',975,image.height-112);
    }
  }
  link.download='minha-intencao.png';
  link.href=image.toDataURL('image/png');
  link.click();
  saved=true;
  setHelp('Imagem da sua intenção preparada para baixar.');
  render();
}
function reset(){
  if(snapshot&&!stored&&!window.confirm('Começar outra folha e apagar o texto desta?')) return;
  input.value='';
  snapshot='';
  stamped=false;
  stored=false;
  saved=false;
  render();
  setHelp('Uma folha em branco está pronta.');
  focusInput();
}
function toggleKeys(open) {
  get('keyboard').hidden=!open;
  get('keyboard-toggle').setAttribute('aria-expanded',String(open));
  if(open) get('keyboard').scrollIntoView({block:'nearest'});
}
function installKeyboard(){
  for(const keys of [...keyRows,'ÁÉÍÓÚÃ','⌫ _ ↵']){
    const middle=document.createElement('div');
    middle.className='key-row';
    const letters=[...keys].filter(key=>key!==' ');
    middle.style.setProperty('--key-count',letters.length);
    for(const letter of letters){
      const key=document.createElement('button');
      key.type='button';
      key.textContent=letter==='_'?'Espaço':letter;
      if(letter==='⌫') key.setAttribute('aria-label','Apagar caractere');
      if(letter==='↵') key.setAttribute('aria-label','Retorno do carro pelo teclado');
      key.addEventListener('pointerdown',event=>event.preventDefault());
      key.addEventListener('click',()=>{
        if(letter==='↵') returnCarriage();
        else if(letter==='⌫'&&!stored){
          const start=input.selectionStart??0;
          const end=input.selectionEnd??0;
          if(start===end) input.setSelectionRange(Math.max(0,start-1),end);
          insert('','deleteContentBackward');
        } else insert(letter==='_'?' ':letter.toLowerCase(),'insertText');
      });
      middle.append(key);
    }
    get('keyboard').append(middle);
  }
}
get('keyboard-toggle').addEventListener('click',()=>toggleKeys(get('keyboard').hidden));
get('return').addEventListener('click',returnCarriage);
get('stamp').addEventListener('click',stamp);
get('fold').addEventListener('click',fold);
get('download').addEventListener('click',download);
get('reset').addEventListener('click',reset);
get('sound').addEventListener('click',()=>{
  localSound=!localSound;
  get('sound').setAttribute('aria-pressed',String(localSound));
  get('sound').textContent=localSound?'Som ligado':'Som desligado';
  setMute();
  if (localSound) play(()=>audio.playClick(440,.035));
});
input.addEventListener('input',readInput);
input.addEventListener('click',()=>render());
input.addEventListener('keyup',event=>{if(event.key.startsWith('Arrow')) render();});
if(new URLSearchParams(location.search).get('embed')==='1') document.body.classList.add('embed');
installKeyboard();
draw();
try{
  desk=createDesk(host,texture,{focus:focusInput,stamp,fold,returnCarriage});
}catch(error){
  if(error.message!=='Error creating WebGL context.') console.error(error);
  get('scene-status').textContent='Visualização 3D indisponível. Sua folha pode ser preenchida pelo painel.';
  get('scene-status').hidden=false;
}
function setMute(){audio.setMuted(!localSound||hostMuted||paused);}
const lifecycle=new LifecycleManager({
  onPause:()=>{paused=true;desk?.pause(true);setMute();},
  onResume:()=>{paused=false;desk?.pause(false);setMute();},
  onMute:value=>{hostMuted=value;setMute();},
  dispose:()=>{desk?.dispose();audio.dispose();},
});
addEventListener('pagehide',event=>{if(!event.persisted) lifecycle.dispose();});
render();
