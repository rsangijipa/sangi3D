import {initial,reduce,           } from './game/state.js';
import {samples,             } from './game/content.js';
import {mount} from './scene/workshop.js';
import {panelHtml,setupHtml,nameOf,detailOf} from './ui/views.js';
import {chime,disposeAudio} from './audio/sound.js';
import {wire} from './input/controls.js';

const stage=document.querySelector             ('#stage') ,panel=document.querySelector             ('#panel') ;
const dialog=document.querySelector                   ('#dialog') ,live=document.querySelector             ('#live') ;
const label=document.querySelector             ('#sample-label') ,fallback=document.querySelector             ('#fallback') ;
let state=initial(), workshop                                   , webgl=false, status='', hint=false, lastSave=-Infinity;
try {const settings=JSON.parse(localStorage.getItem('atlas.settings.v1')||'null'); if(settings){state.reduced=!!settings.reduced;state.muted=!!settings.muted;}else state.reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;} catch {}
function focusButton(previous                 ) {if(previous)panel.querySelector             ('[data-key="'+CSS.escape(previous)+'"]')?.focus({preventScroll:true});}
function render(){
 const active=(document.activeElement                    )?.dataset.key;
 const scroll=panel.scrollTop;
 panel.innerHTML=panelHtml(state,status,hint);
 panel.scrollTop=scroll;focusButton(active);
 label.textContent=state.stage===3 ? state.pair.map(nameOf).join('  ·  ') : nameOf(state.sampleId);
 if(!webgl)fallback.innerHTML='<div class="fallback-card"><p>Modo descritivo</p>'+ (state.stage===3?state.pair:[state.sampleId]).map(id=>'<h2>'+nameOf(id)+'</h2><p>'+detailOf(id)+'</p>').join('')+'</div>';
 document.documentElement.classList.toggle('reduced',state.reduced);
}
function setWebgl(available        ){webgl=available;fallback.hidden=available;stage.classList.toggle('fallback',!available);render();}
try {workshop=mount(stage,()=>setWebgl(false),()=>setWebgl(true));setWebgl(true);}catch{setWebgl(false);}
function announce(text       ){status=text;live.textContent=text;}
function dispatch(action       ){
 const next=reduce(state,action);if(next===state)return;
 state=next;if(action.type!=='tick')workshop?.apply(state,action.type==='save');
 if(action.type!=='tick'&&action.type!=='move') render();
}
function saveSettings() {try{localStorage.setItem('atlas.settings.v1',JSON.stringify({reduced:state.reduced,muted:state.muted}));}catch{}}
function download(){
 const summary={version:1,mode:state.mode,stage:state.stage,activeSeconds:Math.round(state.activeMs/1000),pauses:state.pauses,skips:state.skips,hints:state.hints,pair:state.pair,collection:state.collection};
 const url=URL.createObjectURL(new Blob([JSON.stringify(summary,null,2)],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download='atlas-das-texturas.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function openSetup(){dialog.innerHTML=setupHtml();if(!dialog.open)dialog.showModal();}
function modal(title       ,body       ,buttons       ){dialog.innerHTML='<h2>'+title+'</h2><p>'+body+'</p><div class="actions">'+buttons+'</div>';if(!dialog.open)dialog.showModal();}
function pause(){
 if(!state.started||state.paused)return;
 dispatch({type:'pause'});modal('Sessão pausada','As amostras ficam na bancada enquanto você faz uma pausa.','<button class="primary" value="resume">Continuar</button><button value="exit">Sair</button>');
}
function navigate(value       ){hint=false;status='';panel.scrollTop=0;dispatch({type:'stage',value});panel.querySelector             ('h2')?.focus({preventScroll:true});}
function act(key       ,value       ){
 switch(key){
 case 'stage':navigate(Number(value));break;
 case 'skip':hint=false;status='';dispatch({type:'skip'});break;
 case 'select':announce(nameOf(value            )+' na bancada.');dispatch({type:'select',id:value            });break;
 case 'pair':dispatch({type:'pair',id:value            });break;
 case 'rotate':dispatch({type:'rotate',value:Number(value)});break;
 case 'light':dispatch({type:'light',value:state.lampAngle+Number(value)});break;
 case 'elevation':dispatch({type:'elevation',value:state.lampElevation+Number(value)});break;
 case 'zoom':dispatch({type:'zoom',value:state.zoom+Number(value)});break;
 case 'move':{const [x,z]=value.split(',').map(Number);dispatch({type:'move',x:state.magnifierPos[0]+x,z:state.magnifierPos[1]+z});break;}
 case 'describe':dispatch({type:'describe',value});break;
 case 'prefer':dispatch({type:'prefer',value});break;
 case 'save':
  if(performance.now()-lastSave<680)break;
  lastSave=performance.now();announce(nameOf(state.sampleId)+' guardada no atlas.');dispatch({type:'save'});if(!state.muted)chime();break;
 case 'remove':announce(nameOf(value            )+' retirada.');dispatch({type:'remove',id:value            });break;
 case 'hint':hint=!hint; if(hint)dispatch({type:'hint'});else render();break;
 case 'pause':pause();break;
 case 'motion':dispatch({type:'motion'});saveSettings();break;
 case 'mute':dispatch({type:'mute'});saveSettings();if(!state.muted)chime();break;
 case 'reset':modal('Recomeçar sessão','As observações desta sessão serão apagadas.','<button value="cancel">Cancelar</button><button class="primary" value="reset">Recomeçar</button>');break;
 case 'export':modal('Exportar observações','O arquivo JSON ficará no dispositivo. Em um dispositivo compartilhado, apague-o depois de usar.','<button value="cancel">Cancelar</button><button class="primary" value="export">Baixar JSON</button>');break;
 }
}
dialog.addEventListener('click',e=>{
 const target=(e.target               ).closest                   ('button');if(!target)return;
 if(target.value==='demo'){modal('Experimente a bancada','Gire a amostra e compare o relevo conforme a luz muda. Use + e − para ajustar a lupa e guarde suas próprias observações.','<button class="primary" value="setup">Escolher modo</button>');return;}
 if(target.value==='setup'){openSetup();return;}
 if(target.value==='start'){
  const mode=dialog.querySelector                   ('select') .value                     ;
  const pool=Array.from(dialog.querySelectorAll                  ('input:checked'),el=>el.value            );
  if(mode==='acompanhado'&&(pool.length<2||pool.length>4)){dialog.querySelector             ('[role=status]') .textContent='Escolha de duas a quatro amostras.';return;}
  dispatch({type:'start',mode,pool});dialog.close();panel.querySelector             ('h2')?.focus();return;
 }
 dialog.close();
 if(target.value==='resume')dispatch({type:'resume'});
 if(target.value==='export')download();
 if(target.value==='exit'||target.value==='reset'){
  dispatch({type:'resume'});
  if(target.value==='exit'){navigate(5);return;}
  status='';hint=false;lastSave=-Infinity;dispatch({type:'reset'});openSetup();
 }
});
dialog.addEventListener('change',e=>{if((e.target               ).tagName==='SELECT')dialog.querySelector             ('fieldset') .hidden=(e.target                     ).value!=='acompanhado';});
dialog.addEventListener('cancel',e=>{if(!state.started){e.preventDefault();openSetup();}else if(state.paused)dispatch({type:'resume'});});
wire(panel,workshop?.canvas,act,()=>{if(!dialog.open)pause();},()=>state,dispatch);
let tick=performance.now();
const timer=setInterval(()=>{const now=performance.now();if(!document.hidden&&!dialog.open)dispatch({type:'tick',ms:now-tick});tick=now;},250);
const lifecycle=new AbortController();
document.addEventListener('visibilitychange',()=>{tick=performance.now();if(document.hidden&&!dialog.open)pause();},{signal:lifecycle.signal});
window.addEventListener('pagehide',e=>{if(e.persisted)return;clearInterval(timer);lifecycle.abort();disposeAudio();workshop?.dispose();},{once:true});
workshop?.apply(state);render();openSetup();

