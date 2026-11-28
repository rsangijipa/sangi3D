import { PinAudio } from './audio';
import { makeFallback } from './fallback';

const $=s=>document.querySelector(s), root=document.documentElement;
const dialog=$('#dialog'), world=$('#world'), holder=$('#canvas');
const params=new URLSearchParams(location.search), embedded=params.get('embed')==='1';
const {MARCA,PRESETS}=window.PINBALL_BRAND;
const qualityLabels={auto:'Automática',alta:'Alta',equilibrada:'Equilibrada',leve:'Leve'};
const known=(o,k)=>typeof k==='string'&&Object.hasOwn(o,k);
const prefKey='amb3d_pinball-de-madeira_v1';
let prefs={};try{prefs=JSON.parse(localStorage.getItem(prefKey)||'{}')||{};}catch{}
let preset=known(PRESETS,params.get('marca'))?params.get('marca'):'brasa';
let brand=preset==='brasa'?MARCA:PRESETS[preset];
let quality=known(qualityLabels,params.get('qualidade'))?params.get('qualidade'):known(qualityLabels,prefs.quality)?prefs.quality:'auto';
let relax=prefs.relax===true, is2d=params.get('modo')==='2d';
let sim,stage,sceneModule,simModule,generation=0,raf=0,last=0,step=0,collapsed=false,guide=!matchMedia('(max-width:730px) and (orientation:portrait)').matches;
let lastScore=-1,paused=false, oldFocus=null, hintTimer=0, chargeOwner=null, pointerAbort=null;
const motions=matchMedia('(prefers-reduced-motion: reduce)');
const audio=new PinAudio(), ownership=[new Set(),new Set()];
let sound=false;
const escape=x=>String(x).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]));
const glyphs={
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  close:'<path d="m6 6 12 12m0-12L6 18"/>',
  sound:'<path d="M4 9h4l4-3v12l-4-3H4zm11 .2a4 4 0 0 1 0 5.6m2.7-8.3a8 8 0 0 1 0 11"/>',
  mute:'<path d="M4 9h4l4-3v12l-4-3H4zm11 1 5 5m0-5-5 5"/>',
};
const icon=id=>`<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round">${glyphs[id]}</svg>`;
const buttons=name=>document.querySelectorAll('[data-action="'+name+'"]');
const action=name=>document.querySelector('[data-action="'+name+'"]');
const link=value=>{
  if(String(value).startsWith('#'))return value;
  try{const url=new URL(value,location.href);return ['https:','http:','mailto:','tel:'].includes(url.protocol)?url.href:'#contato';}
  catch{return '#contato';}
};
function hint(text,announce=true){
  $('#hint').textContent=text;
  if(announce)$('#live').textContent=text;
  clearTimeout(hintTimer);hintTimer=setTimeout(()=>{$('#hint').textContent='Toque e experimente';},3600);
}
function keepPrefs(){try{localStorage.setItem(prefKey,JSON.stringify({version:1,quality,relax}));}catch{}}
function setBrand(){
  document.title=brand.nome+' · Pinball de Madeira';
  $('.logo').textContent=brand.logoTexto;$('#title').textContent=brand.textos.titulo;$('#support').textContent=brand.textos.apoio;
  for(const [css,key] of [['primary','primaria'],['secondary','secundaria'],['bg','fundo'],['ink','texto'],['accent','destaque']])
    root.style.setProperty('--'+css,brand.cores[key]);
  for(const [css,key] of [['display','titulo'],['text','texto']]){
    const font=String(brand.fontes[key]).replace(/[^-\w\sÀ-ÿ]/g,'');
    root.style.setProperty('--'+css,'"'+font+'",system-ui,sans-serif');
  }
  document.querySelectorAll('[data-cta]').forEach(a=>{
    a.textContent=brand.cta.texto;a.setAttribute('href',link(brand.cta.link));
    if(!link(brand.cta.link).startsWith('#')){a.target='_blank';a.rel='noopener noreferrer';}
    else{a.removeAttribute('target');a.removeAttribute('rel');}
  });
}
function show(){
  const s=sim?.state;
  $('.nav').hidden=embedded;$('.embed-cta').hidden=!embedded;
  $('#steps').hidden=collapsed;$('.utility').hidden=collapsed;$('.bottom').hidden=collapsed;$('#restore').hidden=!collapsed;
  $('#hud').hidden=collapsed;
  $('#step-button').textContent=(step+1)+' · '+brand.textos.passos[step];$('#step-button').setAttribute('aria-expanded',String(guide));
  $('#step-list').hidden=!guide;
  $('#step-list').innerHTML=brand.textos.passos.map((v,i)=>i===step?'':'<li class="glass">'+(i+1)+' · '+escape(v)+'</li>').join('');
  $('#turn').textContent=relax?'Bolas livres':s?.phase==='fim'?'Fim da rodada':'Bola '+(s?.ball??1)+' de 3';
  if(s&&s.score!==lastScore){
    const points=$('#points');points.textContent=String(s.score).padStart(6,'0');points.setAttribute('aria-label',s.score+' pontos');
    points.classList.remove('pulse');if(s.score>0&&!motions.matches){void points.offsetWidth;points.classList.add('pulse');}
    lastScore=s.score;
  }
  const launch=action('launch');
  launch.disabled=!s||!['pronta','fim'].includes(s.phase);
  launch.querySelector('span').textContent=s?.phase==='fim'?'Jogar de novo':s?.holding?'Solte para lançar':'Lançar';
  launch.title=s?.phase==='fim'?'Iniciar nova rodada':'Segure e solte · Espaço';
  launch.style.setProperty('--charge',String(s?.charge||0));
  action('relax').setAttribute('aria-pressed',String(relax));
  action('nudge').hidden=!s?.stuck;
  buttons('flip').forEach((b,i)=>b.dataset.pressed=String(!!s?.pressed[i]));
  buttons('sound').forEach(b=>{
    b.innerHTML=icon(sound?'sound':'mute');b.setAttribute('aria-pressed',String(sound));b.setAttribute('aria-label',sound?'Silenciar':'Ligar som');
  });
}
function event(type,info){
  if(type==='lancar'){step=Math.max(step,1);hint('Bola em jogo. Use os flippers.');}
  if(type==='flipper'&&sim?.state.phase==='jogando')step=Math.max(step,2);
  if(['bumper','alvo','rampa'].includes(type)){
    step=Math.max(step,2);
    const naam={bumper:'Bumper',alvo:'Alvo',rampa:'Rampa'}[type];
    hint(naam+' · +'+info.points+' pontos');
  }
  if(type==='proxima')hint(relax?'Bola pronta. Jogue no seu ritmo.':'Bola '+sim.state.ball+' de 3 · segure Lançar');
  if(type==='retorno')hint('A bola voltou ao canal. Segure um pouco mais.');
  if(type==='fim'){step=3;hint('Rodada encerrada · '+sim.state.score+' pontos');}
  if(type==='destravar')hint(info.automatic?'A bola voltou ao jogo.':'Bola destravada.');
  audio.sound(type);show();request();
}
function frame(now){
  raf=0;
  const s=sim?.state;
  if(!s||document.hidden)return;
  const dt=last?Math.min(.075,(now-last)/1000):1/180;last=now;
  if(!paused)sim.step(dt);
  stage?.draw(s,motions.matches);
  audio.roll(!paused&&s.phase==='jogando'?s.speed:0);
  if(s.holding)action('launch').style.setProperty('--charge',String(s.charge));
  if(stuckDisplay!==s.stuck){stuckDisplay=s.stuck;action('nudge').hidden=!s.stuck;}
  if(!raf&&!paused&&(sim.isActive()||stage?.glowing()))raf=requestAnimationFrame(frame);
  else if(!raf)last=0;
}
let stuckDisplay=false;
function request(){if(!raf&&!document.hidden)raf=requestAnimationFrame(frame);}
function reset(){
  if(!sim)return;
  releaseAll(true);step=0;lastScore=-1;sim.reset();hint('Segure e solte para lançar.');show();request();
}
function pressFlip(i,id){
  if(!sim||paused)return;
  ownership[i].add(id);sim.flip(i,true);show();request();
}
function releaseFlip(i,id){
  ownership[i].delete(id);
  if(!ownership[i].size)sim?.flip(i,false);
  show();request();
}
function pressCharge(owner){
  if(!sim||paused||chargeOwner!==null||!sim.beginCharge())return;
  chargeOwner=owner;hint('Solte para lançar. A força cresce enquanto você segura.',false);show();request();
}
function releaseCharge(owner,cancel=false){
  if(owner!==chargeOwner||chargeOwner===null)return;
  chargeOwner=null;
  if(cancel)sim?.cancelCharge();else sim?.releaseCharge();
  show();request();
}
function releaseAll(cancel){
  if(chargeOwner!==null)releaseCharge(chargeOwner,cancel);
  ownership.forEach((set,i)=>{set.clear();sim?.flip(i,false);});show();
}
function installPointer(canvas){
  pointerAbort?.abort();pointerAbort=new AbortController();
  const signal=pointerAbort.signal, touches=new Map();
  canvas.addEventListener('pointerdown',e=>{
    if(e.button!==0||paused||!sim)return;
    const token='canvas:'+e.pointerId;
    const charge=stage.plungerAt(e.clientX,e.clientY)&&sim.state.phase==='pronta'&&chargeOwner===null;
    const index=e.clientX<innerWidth*.5?0:1;
    touches.set(e.pointerId,{charge,index,token});
    try{canvas.setPointerCapture(e.pointerId);}catch{}
    if(charge)pressCharge(token);else pressFlip(index,token);
  },{signal});
  const end=(e,cancel)=>{
    const input=touches.get(e.pointerId);if(!input)return;
    touches.delete(e.pointerId);
    if(input.charge)releaseCharge(input.token,cancel);else releaseFlip(input.index,input.token);
  };
  canvas.addEventListener('pointerup',e=>end(e,false),{signal});
  canvas.addEventListener('pointercancel',e=>end(e,true),{signal});
  canvas.addEventListener('lostpointercapture',e=>end(e,true),{signal});
  canvas.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')canvas.style.cursor=stage.plungerAt(e.clientX,e.clientY)?'ns-resize':'pointer';},{signal});
  canvas.addEventListener('contextmenu',e=>e.preventDefault(),{signal});
}
async function openStage(twoD=is2d){
  let version=++generation;
  releaseAll(true);
  pointerAbort?.abort();stage?.dispose();stage=null;
  is2d=twoD;
  try{
    if(!is2d){
      sceneModule??=await import('pinball/scene');
      if(version!==generation)return;
      stage=sceneModule.createScene(holder,brand,request,()=>{
        hint('O 3D foi interrompido. Continue na mesa 2D.');void openStage(true);
      });
      window.SCENE_MANIFEST=stage.manifest;
      stage.quality(quality);
    }
  }catch(error){
    if(version!==generation)return;
    if(params.has('diagnostico'))window.pinballStageError=String(error);
    holder.replaceChildren();is2d=true;hint('A mesa 2D está disponível.');
  }
  if(is2d)stage=makeFallback(holder,brand,request);
  world.classList.toggle('fallback',is2d);
  $('#fallback-picture').hidden=!is2d||!window.PINBALL_STILL;
  installPointer(stage.canvas);
  if(sim)stage.draw(sim.state,motions.matches);
  if(!is2d)console.info('Pinball de Madeira ·',stage.stats().triangles,'triângulos ·',stage.stats().calls,'chamadas de desenho');
  show();request();
}
async function boot(){
  try{
    simModule??=await import('pinball/physics');
    sim=await simModule.createPhysics(brand.mesa,event,relax);
    await openStage(is2d);show();
    if(params.has('diagnostico')){
      window.pinQA={
        state:()=>structuredClone(sim.state),
        stats:()=>stage?.stats?.(), point:()=>stage.point(), photo:()=>stage.photo(),
        colors:()=>stage?.colors?.(),
        measure:n=>stage.measure(n), place:(...a)=>{sim.place(...a);show();request();},
        track:()=>audio.track(), canvas:()=>stage.canvas, mode:()=>is2d,
      };
    }
  }catch(error){
    hint('A simulação não pôde ser iniciada neste navegador.');show();
    if(params.has('diagnostico'))window.pinballError=String(error);
  }
}
function modal(tab,source){
  if(!dialog.open)oldFocus=source||document.activeElement;
  const entries={
    sobre:['Sobre esta experiência','<p>Pinball de Madeira é uma mesa artesanal em Three.js com física em Rapier 2D e som procedural em Web Audio.</p><p>O placar vive nesta rodada. Apenas qualidade e preferência do modo relax ficam no navegador. O jogo não usa rastreamento, compra ou prêmios.</p><p>Tipografia Bungee e Rubik, com licença SIL Open Font.</p>'],
    servicos:['Serviços','<p>Este é um ambiente jogável para sites e eventos, com escolha de cores, ilustração e disposição dos alvos.</p><a class="cta" href="#contato" data-nav="contato">Contato</a>'],
    contato:['Contato','<p>'+escape(brand.nome)+' é uma marca de demonstração. Ao publicar, configure o endereço do botão para abrir a página de pedidos ou contato da sua marca.</p>'],
    controls:['Atalhos da mesa','<p>Segure e solte <strong>Espaço</strong> para lançar. Use <strong>← / →</strong> ou <strong>A / D</strong> para os flippers.</p><p>No celular, toque nos botões ou nas metades do cenário. Você também pode segurar o êmbolo na própria mesa.</p><p><strong>R</strong> alterna o modo relax, <strong>M</strong> controla o som e <strong>H</strong> recolhe os controles.</p>'],
    reset:['Reiniciar rodada?','<p>A pontuação da rodada atual será apagada.</p><button type="button" class="cta" data-action="confirm-reset">Reiniciar</button>'],
    settings:['Ajustes','<label>Qualidade gráfica<select id="quality" aria-label="Qualidade gráfica">'+Object.entries(qualityLabels).map(([k,label])=>'<option value="'+k+'"'+(quality===k?' selected':'')+'>'+label+'</option>').join('')+'</select></label><label>Marca<select id="brand" aria-label="Marca"><option value="brasa"'+(preset==='brasa'?' selected':'')+'>Hamburgueria Brasa</option><option value="neutra"'+(preset==='neutra'?' selected':'')+'>Pinball de Madeira</option></select></label><p>Trocar a marca reinicia a rodada.</p><button class="cta" type="button" data-action="toggle-view">'+(is2d?'Tentar mesa 3D':'Usar mesa 2D')+'</button>'],
  };
  const [title,copy]=entries[tab];
  releaseAll(true);paused=true;audio.roll(0);
  dialog.innerHTML='<header><h2 id="dialog-title">'+title+'</h2><button type="button" class="icon" data-action="close" aria-label="Fechar" autofocus>'+icon('close')+'</button></header>'+copy;
  if(!dialog.open)dialog.showModal();
}
async function switchBrand(id){
  if(id===preset||!known(PRESETS,id)||!simModule)return;
  preset=id;brand=id==='brasa'?MARCA:PRESETS[id];
  releaseAll(true);const old=sim;sim=await simModule.createPhysics(brand.mesa,event,relax);old?.free();
  step=0;lastScore=-1;setBrand();await openStage(is2d);hint('Mesa atualizada.');show();
}
function toggleRelax(){
  relax=!relax;
  if(relax&&sim?.state.phase==='fim'){step=0;lastScore=-1;}
  sim?.setRelax(relax);keepPrefs();hint(relax?'Modo relax · bolas livres':'Rodada de três bolas');show();request();
}
async function toggleSound(){
  sound=!sound;show();
  if(!await audio.enable(sound)){sound=false;show();hint('O som está indisponível neste navegador.');return;}
  hint(sound?'Som ligado':'Som silenciado');
}
function collapse(){
  collapsed=!collapsed;show();
  (collapsed?$('#restore button'):$('.utility [data-action=collapse]')).focus({preventScroll:true});
}
function post(){
  if(!embedded||parent===window)return;
  let target=brand.cta.origemPai;
  if(!target&&document.referrer)try{target=new URL(document.referrer).origin;}catch{}
  try{parent.postMessage({tipo:'cta'},target||'*');}catch{}
}
document.addEventListener('click',e=>{
  const button=e.target.closest('[data-action],[data-cta],[data-nav]');if(!button)return;
  if(button.hasAttribute('data-cta')){
    post();if(link(brand.cta.link).startsWith('#')){e.preventDefault();modal('contato',button);}return;
  }
  if(button.dataset.nav){
    e.preventDefault();$('#menu').classList.remove('open');action('menu').setAttribute('aria-expanded','false');
    if(button.dataset.nav!=='inicio')modal(button.dataset.nav,button);return;
  }
  switch(button.dataset.action){
    case 'launch':
      if(sim?.state.phase==='fim')reset();
      else if(e.detail===0){pressCharge('access');releaseCharge('access');}
      break;
    case 'flip':
      if(e.detail===0){const i=Number(button.dataset.index);pressFlip(i,'access');setTimeout(()=>releaseFlip(i,'access'),100);}break;
    case 'sound':void toggleSound();break;
    case 'relax':toggleRelax();break;
    case 'collapse':collapse();break;
    case 'steps':guide=!guide;show();break;
    case 'reset':
      if(sim?.state.phase==='fim'||sim?.state.phase==='pronta'&&sim.state.ball===1&&!sim.state.score)reset();else modal('reset',button);
      break;
    case 'confirm-reset':dialog.close();reset();break;
    case 'nudge':sim?.nudge();request();break;
    case 'settings':case 'controls':modal(button.dataset.action,button);break;
    case 'toggle-view':dialog.close();void openStage(!is2d);break;
    case 'close':dialog.close();break;
    case 'menu':{const open=$('#menu').classList.toggle('open');button.setAttribute('aria-expanded',String(open));break;}
  }
});
function bindDock(button){
  const id=(e)=>'dock:'+e.pointerId;
  const index=Number(button.dataset.index),isFlip=button.dataset.action==='flip';
  button.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    try{button.setPointerCapture(e.pointerId);}catch{}
    if(isFlip)pressFlip(index,id(e));else pressCharge(id(e));
  });
  const end=(e,cancel)=>isFlip?releaseFlip(index,id(e)):releaseCharge(id(e),cancel);
  button.addEventListener('pointerup',e=>end(e,false));button.addEventListener('pointercancel',e=>end(e,true));
  button.addEventListener('lostpointercapture',e=>end(e,true));
}
buttons('flip').forEach(bindDock);bindDock(action('launch'));
const mapKey=key=>['ArrowLeft','KeyA'].includes(key)?0:['ArrowRight','KeyD'].includes(key)?1:-1;
document.addEventListener('keydown',e=>{
  if(e.repeat||dialog.open||e.metaKey||e.altKey||e.ctrlKey||/^(input|select|textarea)$/i.test(e.target.tagName))return;
  const side=mapKey(e.code);
  if(side>=0){e.preventDefault();pressFlip(side,e.code);return;}
  if(e.code==='Space'){
    const focusedControl=e.target.closest('button,a');
    if(focusedControl&&focusedControl.dataset.action!=='launch')return;
    e.preventDefault();
    if(sim?.state.phase==='fim')reset();else pressCharge(e.code);
  }else if(e.code==='KeyR'){e.preventDefault();toggleRelax();}
  else if(e.code==='KeyM'){e.preventDefault();void toggleSound();}
  else if(e.code==='KeyH'){e.preventDefault();collapse();}
  else if(e.code==='Escape'&&$('#menu').classList.contains('open')){ $('#menu').classList.remove('open');action('menu').setAttribute('aria-expanded','false'); }
});
document.addEventListener('keyup',e=>{
  const side=mapKey(e.code);
  if(side>=0)releaseFlip(side,e.code);
  if(e.code==='Space')releaseCharge(e.code);
});
document.addEventListener('change',e=>{
  if(e.target.id==='quality'&&known(qualityLabels,e.target.value)){quality=e.target.value;keepPrefs();stage?.quality(quality);request();}
  else if(e.target.id==='brand')void switchBrand(e.target.value);
});
dialog.addEventListener('close',()=>{paused=false;last=0;request();if(oldFocus?.isConnected)oldFocus.focus({preventScroll:true});});
window.addEventListener('blur',()=>releaseAll(true));
document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden){releaseAll(true);audio.roll(0);}else request();});
window.addEventListener('pagehide',e=>{if(!e.persisted){pointerAbort?.abort();stage?.dispose();sim?.free();audio.close();cancelAnimationFrame(raf);}});
motions.addEventListener('change',request);
if(window.PINBALL_STILL)$('#fallback-picture').src=window.PINBALL_STILL;
action('menu').innerHTML=icon('menu');
setBrand();show();

// Sangi3D Universal Bridge
if (window.parent && window.parent !== window) {
  try {
    window.parent.postMessage({
      type: 'SANGI_APP_READY',
      id: 'pinball-de-madeira',
      capabilities: { webgl2: true, physics: 'rapier2d', touch: true, audio: true }
    }, '*');
  } catch {}
}
window.addEventListener('message', (e) => {
  if (!e.data || typeof e.data !== 'object') return;
  if (e.data.type === 'SANGI_APP_PAUSE') {
    paused = true; releaseAll(true); audio.roll(0); cancelAnimationFrame(raf);
  } else if (e.data.type === 'SANGI_APP_RESUME') {
    paused = false; last = 0; request();
  } else if (e.data.type === 'SANGI_APP_MUTE') {
    sound = !e.data.muted; audio.toggle(sound); show();
  } else if (e.data.type === 'SANGI_APP_DISPOSE') {
    pointerAbort?.abort(); stage?.dispose(); sim?.free(); audio.close(); cancelAnimationFrame(raf);
  }
});

void boot();

