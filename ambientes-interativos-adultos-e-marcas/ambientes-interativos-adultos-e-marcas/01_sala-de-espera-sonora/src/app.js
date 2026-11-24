import { RoomAudio } from './audio';
import { icon } from './icons';

const q=(selector)=>document.querySelector(selector);
const root=document.documentElement, params=new URLSearchParams(location.search);
const {PRESETS,MARCA}=window.SALA_BRAND;
const keys=['chuva','lareira','vitrola','relogio','plantas'];
const qualityNames={auto:'Automática',alta:'Alta',equilibrada:'Equilibrada',leve:'Leve'};
const prefix='amb3d_sala-de-espera-sonora_v1';
const audio=new RoomAudio(), dialog=q('#dialog');
const clamp=(n)=>Number.isFinite(n)?Math.max(0,Math.min(1,n)):0;
const percent=x=>Math.round(x*100);
const esc=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const embed=params.get('embed')==='1';
let prefs={};
try{prefs=JSON.parse(localStorage.getItem(prefix)||'{}')||{};}catch{}
const listed=(object,name)=>typeof name==='string'&&Object.hasOwn(object,name);
let preset=listed(PRESETS,params.get('marca'))?params.get('marca'):'travessia';
let brand=preset==='travessia'?MARCA:PRESETS[preset];
let visual=null, sceneModule=null, generation=0, oldFocus=null;
let guideOpen=false, mixer=false, collapsed=false, uiTimer=0, breathFrame=0;
const defaults=[.53,.49,.42,.28,.42];
const state={
  mix:Object.fromEntries(keys.map((key,i)=>[key,{active:false,volume:typeof prefs.volumes?.[key]==='number'?clamp(prefs.volumes[key]):defaults[i]}])),
  curtain:typeof prefs.curtain==='number'?clamp(prefs.curtain):.36,
  quality:listed(qualityNames,prefs.quality)?prefs.quality:'auto',
  sound:false, manuallyMuted:false, breath:null, step:0,
  fallback:params.get('modo')==='2d',
};
if(listed(qualityNames,params.get('qualidade')))state.quality=params.get('qualidade');

function persist(){
  try{localStorage.setItem(prefix,JSON.stringify({ version:1, quality:state.quality, curtain:state.curtain,
    volumes:Object.fromEntries(keys.map(id=>[id,state.mix[id].volume])) }));}catch{}
}
function control(action){return q('[data-action="'+action+'"]');}
function linkFor(value){
  const link=String(value||'');
  if(link.startsWith('#'))return link;
  try{const parsed=new URL(link,location.href);return ['http:','https:','mailto:','tel:'].includes(parsed.protocol)?parsed.href:'#contato';}
  catch{return '#contato';}
}
function cssFont(value,fallback){return '"'+String(value).replace(/[^-\w\sÀ-ÿ]/g,'')+'",'+fallback;}
function paintBrand(){
  document.title=brand.nome+' · Sala de Espera Sonora';
  q('.wordmark').textContent=brand.logoTexto;
  for(const [prop,key] of [['primary','primaria'],['secondary','secundaria'],['background','fundo'],['text','texto'],['accent','destaque']]){
    root.style.setProperty('--'+prop,brand.cores[key]);
  }
  root.style.setProperty('--warm-panel',brand.cores.secundaria);
  root.style.setProperty('--title',cssFont(brand.fontes.titulo,'Georgia,serif'));
  root.style.setProperty('--body',cssFont(brand.fontes.texto,'system-ui,sans-serif'));
  q('#titulo').textContent=brand.textos.titulo;
  q('#apoio').textContent=brand.textos.apoio;
  document.querySelectorAll('[data-cta]').forEach(link=>{
    link.textContent=brand.cta.texto;link.href=linkFor(brand.cta.link);
    if(!linkFor(brand.cta.link).startsWith('#')){link.target='_blank';link.rel='noopener noreferrer';}
    else{link.removeAttribute('target');link.removeAttribute('rel');}
  });
  keys.forEach(id=>{
    q('#channels [data-id="'+id+'"] .channel-label').textContent=brand.catalogo[id];
    q('label[for="volume-'+id+'"] span:first-child').textContent=brand.catalogo[id];
  });
  visual?.setBrand(brand);
  render();
}
function setPreset(id){
  if(!listed(PRESETS,id))return;
  preset=id;brand=id==='travessia'?MARCA:PRESETS[id];
  paintBrand();
  announce(brand.nome);
}
function labelFor(id) {
  return ({cortina:'Cortina',luminaria:'Luminária'})[id]||brand.catalogo[id]||'';
}
function announce(message,visible=true) {
  q('#live').textContent=message;
  if(!visible)return;
  const prompt=q('#prompt');
  prompt.textContent=message;
  clearTimeout(uiTimer);
  uiTimer=setTimeout(()=>{prompt.textContent=brand.textos.convite;},3600);
}
function step(n){state.step=Math.max(state.step,n);}
function render(){
  q('#sala').dataset.embed=String(embed);
  q('.navigation').hidden=embed;
  q('.embed-cta').hidden=!embed;
  q('#guide').hidden=collapsed;
  q('.bottom').hidden=collapsed;
  q('.utility').hidden=collapsed && embed;
  q('#restore-bar').hidden=!collapsed;
  q('#mixer').hidden=!mixer;
  q('#breath').hidden=!state.breath||mixer;
  q('#prompt').hidden=mixer||!!state.breath;
  q('#guide-steps').hidden=!guideOpen;
  q('#step-button').setAttribute('aria-expanded',String(guideOpen));
  q('.utility [data-action="mixer"]').setAttribute('aria-expanded',String(mixer));
  q('#step-label').textContent=(state.step+1)+' · '+brand.textos.passos[state.step];
  document.querySelectorAll('.step-track i').forEach((x,i)=>x.classList.toggle('done',i<=state.step));
  q('#guide-steps').innerHTML=brand.textos.passos.map((label,i)=>'<li'+(i===state.step?' aria-current="step"':'')+'>'+esc(label)+'</li>').join('');
  for(const id of keys){
    const button=q('#channels [data-id="'+id+'"]'), entry=state.mix[id];
    button.setAttribute('aria-pressed',String(entry.active));
    button.title=brand.catalogo[id]+' · '+(entry.active?'ativo':'desligado')+' · '+percent(entry.volume)+'%';
    q('#volume-'+id).value=String(percent(entry.volume));
    q('#value-'+id).textContent=percent(entry.volume)+'%';
  }
  q('#curtain').value=String(percent(state.curtain));
  for(const sound of document.querySelectorAll('[data-action="sound"]')){
    sound.innerHTML=icon(state.sound?'sound':'mute');
    sound.setAttribute('aria-pressed',String(state.sound));
    sound.title=state.sound?'Silenciar':'Ligar som';sound.setAttribute('aria-label',sound.title);
  }
  q('#breathe-button').textContent=state.breath?'Encerrar pausa':'Respirar 1 minuto';
  q('#breathe-button').setAttribute('aria-pressed',String(Boolean(state.breath)));
}
function sync(){
  render();audio.sync(state);visual?.request();
}
async function unlock() {
  const ok=await audio.unlock();
  if(!ok&&state.sound){state.sound=false;announce('O navegador manteve o som desligado. Tente Ligar som.');}
  sync();
}
function toggleChannel(id){
  if(!listed(state.mix,id))return;
  const track=state.mix[id];
  track.active=!track.active;
  if(track.active){
    step(1);
    if(!state.manuallyMuted)state.sound=true;
    if(state.sound)void unlock();
  }
  sync();
  announce(labelFor(id)+(track.active?' ativado':' desligado'));
}
function soundToggle(){
  state.sound=!state.sound;
  state.manuallyMuted=!state.sound;
  if(state.sound)void unlock();
  sync();
  announce(state.sound?'Som ligado':'Som silenciado');
}
function volume(id,value,drag=false){
  const track=state.mix[id];if(!track)return;
  track.volume=clamp(value);step(2);sync();
  if(drag){
    q('#prompt').textContent=labelFor(id)+' · '+percent(track.volume)+'%';
  }else{
    announce(labelFor(id)+' · '+percent(track.volume)+'%',false);
  }
}
function curtain(value,drag=false){
  state.curtain=clamp(value);
  sync();
  if(drag)q('#prompt').textContent='Cortina · '+percent(state.curtain)+'% aberta';
}
function commit(id){
  persist();
  if(id==='cortina')announce('Cortina · '+percent(state.curtain)+'% aberta');
  else if(state.mix[id])announce(labelFor(id)+' · '+percent(state.mix[id].volume)+'%');
}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let lastInstruction='';
function breathTick(now){
  if(!state.breath)return;
  const elapsed=Math.max(0,(now-state.breath.start)/1000);
  state.breath.elapsed=Math.min(60,elapsed);
  if(elapsed>=60){endBreath(true);return;}
  const phase=elapsed%10;
  const up=phase<5;
  const text=up?'Inspire enquanto a luz cresce':'Solte o ar enquanto a luz baixa';
  if(text!==lastInstruction){
    lastInstruction=text;q('#breath-instruction').textContent=text;announce(text,false);
  }
  const amplitude=.5-.5*Math.cos(2*Math.PI*phase/10);
  q('.breath-orb').style.setProperty('--pace',reduced.matches?1:.87+amplitude*.25);
  q('#breath-progress').value=elapsed;
  if(state.fallback)q('#visual').style.filter='brightness('+(0.79+amplitude*.14).toFixed(3)+')';
  breathFrame=requestAnimationFrame(breathTick);
}
function startBreath(){
  if(state.breath){endBreath();return;}
  mixer=false;step(2);lastInstruction='';
  state.breath={start:performance.now(),elapsed:0};
  sync();
  breathFrame=requestAnimationFrame(breathTick);
}
function endBreath(done=false){
  if(!state.breath)return;
  cancelAnimationFrame(breathFrame);state.breath=null;lastInstruction='';
  q('#visual').style.removeProperty('filter');
  if(done){step(3);announce('Um minuto passou. Siga quando quiser.');}
  else announce('Pausa encerrada. Siga quando quiser.');
  sync();
}
function toggleObject(id){
  if(id==='luminaria'){startBreath();return;}
  if(id==='cortina'){curtain(state.curtain>.50?.31:.83);commit(id);return;}
  toggleChannel(id);
}
function hover(id){
  if(state.breath||mixer)return;
  q('#prompt').textContent=id?(id==='cortina'?'Cortina · toque ou arraste':id==='luminaria'?'Luminária · iniciar pausa':labelFor(id)+' · toque ou arraste na vertical'):brand.textos.convite;
}
function collapse(){
  collapsed=!collapsed;render();
  (collapsed?q('#restore'):q('.utility [data-action="collapse"]')).focus();
}
function setFallback(message) {
  generation++;
  if(visual){visual.dispose();visual=null;}
  state.fallback=true;
  q('#still').hidden=false;
  q('#canvas').hidden=true;
  if(message)announce(message);
  render();
}
async function initScene() {
  const attempt=++generation;
  q('#canvas').hidden=false;
  try{
    sceneModule??=await import('sala/scene');
    if(attempt!==generation)return;
    visual=sceneModule.createScene(q('#canvas'),brand,()=>state,{
      toggle:toggleObject,volume,curtain:v=>curtain(v,true),hover,commit,
      loss:()=>setFallback('A sala 3D foi interrompida. Os sons continuam disponíveis.'),
    });
    state.fallback=false;q('#still').hidden=true;
    if(params.has('diagnostico')){
      window.SCENE_MANIFEST=visual.manifest;
      window.salaQA={
        stats:()=>visual?.stats(),
        point:id=>visual?.point(id),
        hit:(x,y)=>visual?.pick(x,y),
        photo:()=>visual?.photo(),
        colors:()=>visual?.colors(),
        measure:n=>visual?.syncMeasure(n),
        demoTrack:()=>audio.demoTrack(),
        state:()=>({sound:state.sound,step:state.step,curtain:state.curtain,breath:state.breath?.elapsed??null,mix:structuredClone(state.mix),audio:audio.diagnostics()}),
        seekBreath:seconds=>{if(state.breath)state.breath.start=performance.now()-1000*seconds;},
      };
    }
    console.info('Sala de Espera Sonora ·',visual.stats().triangles,'triângulos ·',visual.stats().calls,'draw calls');
  }catch(error){
    if(params.has('diagnostico'))window.salaBootError=String(error?.stack||error);
    if(attempt===generation)setFallback('Modo 2D disponível. Use o dock para explorar os sons.');
  }
  render();
}
function modal(name,opener){
  if(!dialog.open)oldFocus=opener||document.activeElement;
  const info={
    sobre:['Sobre esta experiência','<p>Uma sala interativa para explorar sons e fazer uma pausa opcional antes de seguir.</p><p>A experiência não é uma intervenção clínica. Os sons são sintetizados no aparelho. A sala guarda só preferências de volume, cortina e qualidade no seu navegador e não usa rastreamento.</p><p>Cena procedural em Three.js e áudio em Web Audio. Fraunces e Inter têm licença SIL Open Font.</p>'],
    servicos:['Serviços','<p>A Sala de Espera Sonora é uma demonstração de acolhimento para sites de profissionais e espaços de atendimento.</p><a class="cta" href="#contato" data-nav="contato">Ver opções de contato</a>'],
    contato:['Contato','<p>'+esc(brand.nome)+' é uma marca de demonstração. O botão de agendamento pode receber o endereço da marca ao publicar o ambiente.</p><button class="cta" data-action="close">Voltar à sala</button>'],
    ajuda:['Preciso de ajuda agora','<p>Para conversar e receber apoio emocional no Brasil, entre em contato com o CVV.</p><a class="contact-link" href="tel:+55188?oai_link_source=model_response_hotline">CVV · 188</a><a class="contact-link" href="https://www.cvv.org.br/chat/?oai_link_source=model_response_hotline" target="_blank" rel="noopener noreferrer">Chat do CVV</a><p>Em uma emergência de saúde, ligue para o SAMU.</p><a class="contact-link" href="tel:192">SAMU · 192</a>'],
    ajustes:['Ajustes','<label>Qualidade gráfica<select id="quality">'+Object.entries(qualityNames).map(([id,label])=>'<option value="'+id+'"'+(state.quality===id?' selected':'')+'>'+label+(id==='auto'&&visual?' · '+qualityNames[visual.detect()]:'')+'</option>').join('')+'</select></label><label>Marca de demonstração<select id="preset"><option value="travessia"'+(preset==='travessia'?' selected':'')+'>Espaço Travessia</option><option value="neutra"'+(preset==='neutra'?' selected':'')+'>Neutra</option></select></label><button class="cta" data-action="'+(state.fallback?'retry':'fallback')+'">'+(state.fallback?'Tentar modo 3D':'Usar modo 2D')+'</button><p>Atalhos: 1 a 5 alternam os canais, M controla o som, R inicia ou encerra a pausa, V abre os volumes e H recolhe os controles.</p>'],
  }[name];
  if(!info)return;
  dialog.innerHTML='<header><h2 id="dialog-title">'+info[0]+'</h2><button class="icon-button" data-action="close" aria-label="Fechar" autofocus>'+icon('close')+'</button></header>'+info[1];
  if(!dialog.open)dialog.showModal();
}
function navigation(id,target){
  if(id==='inicio'){ if(dialog.open)dialog.close();return; }
  const nav=q('#nav');nav.classList.remove('open');control('menu').setAttribute('aria-expanded','false');
  modal(id,target);
}
function notifyParent(){
  if(window.parent===window||!embed)return;
  let origin=brand.cta.origemPai||'';
  if(!origin&&document.referrer){try{origin=new URL(document.referrer).origin;}catch{}}
  try{window.parent.postMessage({tipo:'cta'},origin&&origin!=='null'?origin:'*');}catch{}
}
function mixerToggle(){
  mixer=!mixer;render();
  if(mixer)q('#volume-chuva').focus({preventScroll:true});
  else q('.utility [data-action="mixer"]').focus({preventScroll:true});
}

for(const id of keys){
  const button=document.createElement('button');
  button.type='button';button.className='channel';button.dataset.action='channel';button.dataset.id=id;
  button.innerHTML='<span class="disc">'+icon(id)+'</span><span class="channel-label"></span>';
  q('#channels').append(button);
  const row=document.createElement('label');
  row.className='slider-row';row.htmlFor='volume-'+id;
  row.innerHTML='<span></span><span class="slider-control"><input id="volume-'+id+'" type="range" min="0" max="100" aria-describedby="value-'+id+'"><output id="value-'+id+'" for="volume-'+id+'"></output></span>';
  q('#sliders').append(row);
}
control('menu').innerHTML=icon('menu');
q('#mixer [data-action="mixer"]').innerHTML=icon('close');
q('#prompt').textContent=brand.textos.convite;
if(window.SALA_STILL)q('#still').src=window.SALA_STILL;

document.addEventListener('click',event=>{
  const target=event.target.closest('[data-action],[data-nav],[data-cta]');
  if(!target)return;
  if(target.hasAttribute('data-cta')){
    notifyParent();
    const link=linkFor(brand.cta.link);
    if(link.startsWith('#')){event.preventDefault();modal('contato',target);}
    return;
  }
  if(target.dataset.nav){event.preventDefault();navigation(target.dataset.nav,target);return;}
  switch(target.dataset.action){
    case 'channel':toggleChannel(target.dataset.id);break;
    case 'sound':soundToggle();break;
    case 'mixer':mixerToggle();break;
    case 'guide':guideOpen=!guideOpen;render();break;
    case 'breath':startBreath();break;
    case 'stop':endBreath();q('#breathe-button').focus();break;
    case 'collapse':collapse();break;
    case 'help':modal('ajuda',target);break;
    case 'settings':modal('ajustes',target);break;
    case 'close':dialog.close();break;
    case 'retry':dialog.close();void initScene();break;
    case 'fallback':dialog.close();setFallback('Modo 2D ativo.');break;
    case 'menu':{
      const open=q('#nav').classList.toggle('open');target.setAttribute('aria-expanded',String(open));break;
    }
  }
});
document.addEventListener('input',event=>{
  const id=event.target.id;
  if(id?.startsWith('volume-'))volume(id.slice(7),Number(event.target.value)/100);
  else if(id==='curtain')curtain(Number(event.target.value)/100);
});
document.addEventListener('change',event=>{
  const id=event.target.id;
  if(id==='quality'&&listed(qualityNames,event.target.value)){
    state.quality=event.target.value;persist();visual?.setQuality();announce('Qualidade '+qualityNames[state.quality],false);
  }else if(id==='preset')setPreset(event.target.value);
  else if(id==='curtain')commit('cortina');
  else if(id?.startsWith('volume-'))persist();
});
document.addEventListener('keydown',event=>{
  if(event.defaultPrevented||event.repeat||event.metaKey||event.ctrlKey||event.altKey||dialog.open)return;
  const key=event.key.toLowerCase();
  if(/^(select|input|textarea)$/i.test(event.target.tagName)||event.target.isContentEditable)return;
  if(/^[1-5]$/.test(key)){event.preventDefault();toggleChannel(keys[Number(key)-1]);}
  else if(key==='m'){event.preventDefault();soundToggle();}
  else if(key==='v'&&!collapsed){event.preventDefault();mixerToggle();}
  else if(key==='r'){event.preventDefault();startBreath();}
  else if(key==='h'){event.preventDefault();collapse();}
  else if(key==='escape'){
    if(mixer)mixerToggle();
    else if(state.breath)endBreath();
    else if(q('#nav').classList.contains('open')){
      q('#nav').classList.remove('open');control('menu').setAttribute('aria-expanded','false');control('menu').focus();
    }
  }
  if(key.startsWith('arrow')&&q('#channels').contains(document.activeElement)){
    const index=keys.indexOf(document.activeElement.dataset.id);
    if(index<0)return;
    event.preventDefault();
    q('#channels [data-id="'+keys[(index+(['arrowright','arrowdown'].includes(key)?1:4))%5]+'"]').focus();
  }
});
dialog.addEventListener('close',()=>{
  if(oldFocus?.isConnected)oldFocus.focus({preventScroll:true});
  oldFocus=null;
});
document.addEventListener('visibilitychange',()=>audio.sync(state));
window.addEventListener('pagehide',event=>{
  if(event.persisted)return;
  audio.dispose();visual?.dispose();cancelAnimationFrame(breathFrame);
});
paintBrand();
if(state.fallback)setFallback();
else void initScene();

