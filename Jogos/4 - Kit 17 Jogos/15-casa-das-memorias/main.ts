import {rooms,roomKeys,type Room,type Kind} from './game/content.ts';
import {initial,reduce,visibleReview,type State,type Action} from './game/state.ts';
import {type Visibility} from './game/rules.ts';
import {mount} from './scene/house.ts';
import {panel,setup} from './ui/views.ts';
import {bindDrawing} from './input/drawing.ts';
import {play,dispose,setAmbient,type Cue} from './audio/sound.ts';
const stage=document.querySelector<HTMLElement>('#scene')!,area=document.querySelector<HTMLElement>('#panel')!,modal=document.querySelector<HTMLDialogElement>('#dialog')!;
const fallback=document.querySelector<HTMLElement>('#fallback')!,live=document.querySelector<HTMLElement>('#live')!,home=document.querySelector<HTMLButtonElement>('#home')!;
const roomName=document.querySelector<HTMLElement>('#room-name')!;
const life=new AbortController(),listen={signal:life.signal};
let state=initial(),message='',scene:ReturnType<typeof mount>|undefined;
try{const settings=JSON.parse(localStorage.getItem('memorias.settings.v1')||'null');state.reduced=settings?!!settings.reduced:matchMedia('(prefers-reduced-motion: reduce)').matches;state.muted=settings?!!settings.muted:true;}catch{}
function tell(text:string){message=text;live.textContent=text;}
function fallbackMode(active:boolean){fallback.hidden=!active;stage.classList.toggle('fallback',active);}
function render(){
 const previous=(document.activeElement as HTMLElement|null)?.dataset.key,scroll=area.scrollTop,drawOpen=area.querySelector('details')?.open;
 area.innerHTML=panel(state,message);area.scrollTop=scroll;
 if(previous)area.querySelector<HTMLElement>('[data-key="'+CSS.escape(previous)+'"]')?.focus({preventScroll:true});
 home.hidden=!state.focused;roomName.textContent=state.focused?rooms[state.room].name:'Vista da casa';
 const drawing=area.querySelector<HTMLCanvasElement>('#drawing');if(drawing&&state.draft){if(drawOpen)drawing.closest('details')!.open=true;bindDrawing(drawing,state.draft.drawing,data=>dispatch({type:'drawing',drawing:data},false));}
}
function dispatch(action:Action,update=true){
 const next=reduce(state,action);if(next===state)return false;
 state=next;
 if(!['tick','label','drawing','show'].includes(action.type))scene?.apply(state);
 if(update)render();return true;
}
function roomSelect(room:Room){tell('');if(dispatch({type:'room',room}))effect('room');}
try{scene=mount(stage,roomSelect,fallbackMode);scene.apply(state);}catch(e){console.warn('Modo descritivo da casa.',e);fallbackMode(true);}
function show(html:string){modal.innerHTML=html;if(!modal.open)modal.showModal();}
function ask(title:string,text:string,confirm:string,value:string){show('<h2>'+title+'</h2><p>'+text+'</p><div class="row"><button value="cancel">Cancelar</button><button class="primary" value="'+value+'">'+confirm+'</button></div>');}
function pause(){if(!state.stage||state.paused)return;dispatch({type:'pause'});show('<h2>Visita pausada</h2><p>Os símbolos ficam na casa durante a pausa.</p><div class="row"><button class="primary" value="resume">Continuar</button><button value="exit-ask">Sair</button></div>');}
function changes(){try{localStorage.setItem('memorias.settings.v1',JSON.stringify({muted:state.muted,reduced:state.reduced}));}catch{}}
function effect(cue:Cue='ui'){if(!state.muted)play(cue);}
function navigate(step:number){tell('');area.scrollTop=0;dispatch({type:'stage',stage:step});area.querySelector<HTMLElement>('h2')?.focus();}
function save(){
 const selection=visibleReview(state).map(({type,room,label,drawing})=>({type,room,label,drawing}));
 const url=URL.createObjectURL(new Blob([JSON.stringify({version:1,items:selection},null,2)],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download='casa-das-memorias.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),800);
}
home.addEventListener('click',()=>dispatch({type:'home'}),listen);
area.addEventListener('click',e=>{
 const button=(e.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');if(!button)return;
 const value=button.value;const action=button.dataset.action;
 switch(action){
 case 'open':if(value==='demo'){show('<h2>Uma visita em seis etapas</h2><p>Visite um cômodo, escolha um símbolo, e decida onde ele fica. Na revisão, você escolhe quais símbolos quer mostrar.</p><div class="row"><button class="primary" value="setup">Escolher modo</button><button value="close">Voltar</button></div>');}else show(setup());break;
 case 'stage':navigate(Number(value));break;
 case 'room':roomSelect(value as Room);break;
 case 'symbol':tell('');dispatch({type:'symbol',kind:value as Kind});break;
 case 'word':dispatch({type:'label',label:value});break;
 case 'clear':dispatch({type:'drawing',drawing:[]});break;
 case 'place':tell('');if(dispatch({type:'place',visibility:value as Visibility})){tell(value==='stored'?'Símbolo guardado na casa.':'Símbolo colocado à vista.');effect(value==='stored'?'store':'place');}else tell('Esse espaço está cheio. Escolha outro cômodo ou retire um objeto.');render();break;
 case 'skip':tell('');dispatch({type:'skip'});area.scrollTop=0;break;
 case 'drawer':case 'case':roomSelect(action==='drawer'?'studio':'storage');dispatch({type:action});effect(action==='drawer'?'drawer':'case');break;
 case 'delete':ask('Remover símbolo?','O símbolo e seus detalhes serão apagados desta sessão.','Remover','delete-'+value);break;
 case 'pause':pause();break;
 case 'mute':dispatch({type:'mute'});changes();setAmbient(!state.muted);effect();break;
 case 'motion':dispatch({type:'motion'});changes();break;
 case 'finish':dispatch({type:'finish'});effect('finish');break;
 case 'export':ask('Exportar seleção?','O arquivo inclui os detalhes dos símbolos que você marcou. Quem acessar o arquivo poderá ler esses detalhes.','Baixar JSON','export');break;
 case 'exit':ask('Sair da casa?','Os símbolos desta sessão serão descartados.','Sair e descartar','exit');break;
 case 'reset':ask('Reiniciar visita?','Os símbolos desta sessão serão descartados.','Reiniciar','reset');break;
 }
},listen);
area.addEventListener('input',e=>{const element=e.target as HTMLInputElement;if(element.id==='label')dispatch({type:'label',label:element.value},false);},listen);
area.addEventListener('change',e=>{
 const control=e.target as HTMLInputElement|HTMLSelectElement;
 if(control.dataset.action==='show')dispatch({type:'show',id:Number(control.value)});
 if(control.dataset.action==='move'&&control.value){
  const [room,visibility]=control.value.split('|') as [Room,Visibility];
  tell('');if(dispatch({type:'move',id:Number(control.dataset.id),room,visibility})){tell('Símbolo movido.');effect(visibility==='stored'?'store':'place');}else tell('O espaço selecionado está cheio.');render();
 }
},listen);
modal.addEventListener('change',e=>{const target=e.target as HTMLSelectElement;if(target.id==='mode')modal.querySelector<HTMLElement>('#companion')!.hidden=target.value!=='acompanhado';},listen);
modal.addEventListener('click',e=>{
 const btn=(e.target as HTMLElement).closest<HTMLButtonElement>('button');if(!btn)return;
 const value=btn.value;
 if(value==='setup'){show(setup());return;}
 if(value==='exit-ask'){ask('Sair da casa?','Os símbolos desta sessão serão descartados.','Sair e descartar','exit');return;}
 if(value==='visit'||value==='story'){
  const mode=modal.querySelector<HTMLSelectElement>('#mode')!.value;
  const firstRoom=modal.querySelector<HTMLSelectElement>('#first-room')!.value as Room;
  dispatch({type:'start',mode,story:value==='story'});if(mode==='acompanhado')roomSelect(firstRoom);area.querySelector<HTMLElement>('h2')?.focus();
 }
 if(value==='close'||value==='resume'||value==='cancel')dispatch({type:'resume'});
 if(value==='export')save();
 if(value.startsWith('delete-')){tell('Símbolo removido.');effect('remove');dispatch({type:'delete',id:Number(value.slice(7))});}
 if(value==='exit'||value==='reset'){tell('');dispatch({type:'reset'});}
 modal.close();
},listen);
modal.addEventListener('cancel',()=>dispatch({type:'resume'}),listen);
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&!modal.open){pause();return;}
 const typing=(e.target as HTMLElement).closest('input,select,textarea,canvas');if(typing||modal.open||e.ctrlKey||e.metaKey||e.altKey)return;
 const n=Number(e.key);if(n>=1&&n<=4&&state.stage>0){roomSelect(roomKeys[n-1]);}
 if((e.key==='h'||e.key==='H')&&state.focused)dispatch({type:'home'});
},listen);
// Dica flutuante com o nome do cômodo sob o cursor.
const tip=document.createElement('p');tip.id='hover-tip';tip.setAttribute('aria-hidden','true');tip.hidden=true;stage.after(tip);
new MutationObserver(()=>{const r=stage.dataset.hover as Room|'';tip.hidden=!r;if(r)tip.innerHTML='<b>'+rooms[r].name+'</b><span>'+rooms[r].detail+'</span>';}).observe(stage,{attributes:true,attributeFilter:['data-hover']});
stage.addEventListener('pointermove',e=>{tip.style.transform='translate('+(e.clientX+16)+'px,'+(e.clientY+14)+'px)';},listen);
document.addEventListener('pointerdown',()=>{if(!state.muted)setAmbient(true);},{...listen,once:true});
let last=performance.now();
const timer=setInterval(()=>{const now=performance.now();if(!document.hidden&&!modal.open)dispatch({type:'tick',ms:now-last},false);last=now;},250);
document.addEventListener('visibilitychange',()=>{last=performance.now();if(document.hidden&&!modal.open)pause();},listen);
window.addEventListener('pagehide',e=>{if(e.persisted)return;clearInterval(timer);life.abort();scene?.dispose();dispose();},listen);
render();
