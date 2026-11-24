import './ui/style.css';
import { modes, regions, sensations, storageKey, type Intensity, type Mode, type Region } from './game/content';
import { hasContent, isRegion, isSensation, readEntries } from './game/rules';
import { initial, reducer, type Action } from './game/state';
import { ObservatorySound } from './audio/sound';
import { icon } from './ui/icons';
import { escapeHtml, orbitButtons, panel } from './ui/views';
import type { LightSetting, QualitySetting, createScene } from './scene/scene';

const $ = <E extends HTMLElement>(selector: string) => document.querySelector<E>(selector)!;
const uiButton = (action: string, label: string, symbol: string) => `<button type="button" class="icon-btn" data-action="${action}" aria-label="${label}" title="${label}">${icon(symbol)}</button>`;
const prefsKey = 'bussola-do-corpo:preferencias:v1';
const collapsedKey = 'ambientes:controles-recolhidos';
const params = new URLSearchParams(location.search);
function read(key: string) { try { return localStorage.getItem(key); } catch { return null; } }
function store(key: string, value: string | null) {
  try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key,value); return true; }
  catch { return false; }
}
function parse(key: string) { try { return JSON.parse(read(key) ?? 'null'); } catch { return null; } }
function savedRecord() {
  const record = parse(storageKey);
  if (record?.version !== 1) return null;
  const entries = readEntries(record.entries);
  return entries.length ? { entries, fictional: record.fictional !== false,
    mode: typeof record.mode === 'string' && Object.hasOwn(modes, record.mode) ? record.mode as Mode : 'free' as const } : null;
}
const storedPrefs = parse(prefsKey);
const qualities = { auto: 'Automática', baixa:'Leve', media:'Equilibrada', alta:'Cinema' };
const lights = { noite:'Noite estrelada', lunar:'Luz lunar', lampadas:'Luminárias acesas' } as const;
let quality: QualitySetting = typeof storedPrefs?.quality === 'string' && Object.hasOwn(qualities,storedPrefs.quality) ? storedPrefs.quality : 'auto';
let light: LightSetting = typeof storedPrefs?.light === 'string' && Object.hasOwn(lights,storedPrefs.light) ? storedPrefs.light : 'noite';
let volume = typeof storedPrefs?.volume === 'number' ? Math.max(0,Math.min(.35,storedPrefs.volume)) : .16;
let state = initial(), ownWord = false, showChoices = false, isFallback = params.has('acessivel');
let collapsed = read(collapsedKey) === '1', audioEnabled = false;
let inactiveTime = 0, activeTime = 0, pauses = 0;
let visual: Awaited<ReturnType<typeof createScene>> | undefined;
let visualAbort: AbortController | undefined;
let modalCallback: (()=>void) | null = null;
let lastHover: Region | null = null;
let sceneGeneration = 0;
let focusedReturn: HTMLElement | null = null;
let hostPaused = false;
const launchLink = params.get('launcher') === '1' ? '/' : './launcher.html';
const sound = new ObservatorySound();
const controller = new AbortController();
const { signal } = controller;

function host(event: 'ready'|'pause'|'resume'|'complete'|'exit'|'summary', data: object = {}) {
  if (window.parent !== window && params.get('embed') === '1') {
    window.parent.postMessage({ source:'bussola-do-corpo',version:1,event,...data },location.origin);
  }
}
function clock() {
  const now = performance.now();
  if (inactiveTime) activeTime += now-inactiveTime;
  inactiveTime = !document.hidden && !state.paused && !hostPaused && state.phase !== 'entry' && state.phase !== 'done' ? now : 0;
}
function syncPause() {
  clock();
  const quiet = state.paused || hostPaused || document.hidden || state.exited;
  visual?.pause(quiet);
  sound.update(audioEnabled,quiet,volume);
}
function status(text: string) { $('#status').textContent = text; }

$('#app').innerHTML = `<main>
  <div id="world" aria-hidden="true"></div>
  <div id="fallback-art" aria-hidden="true" hidden>
    <svg viewBox="0 0 180 330" fill="none"><path d="M90 7c-15 0-24 13-24 28 0 13 6 21 13 27v12c-5 7-20 4-29 16-9 12-12 33-22 55L9 176c-6 10 2 15 8 8l22-24c10-12 19-30 24-42 0 14-5 30-9 49-5 23-1 46 5 77l4 60c-2 8-9 12-8 16 2 7 25 3 26-3l3-64 6-62 6 62 3 64c1 6 24 10 26 3 1-4-6-8-8-16l4-60c6-31 10-54 5-77-4-19-9-35-9-49 5 12 14 30 24 42l22 24c6 7 14 2 8-8l-19-31c-10-22-13-43-22-55-9-12-24-9-29-16V62c7-6 13-14 13-27C114 20 105 7 90 7Z" fill="#8a889b" fill-opacity=".42" stroke="#e0c4ab" stroke-opacity=".71" stroke-width="2"/></svg>
  </div>
  <div id="orbit" aria-label="Símbolos de sensação">${orbitButtons()}</div>
  <header id="chrome">
    <a href="${launchLink}" class="launcher" aria-label="Voltar a Ambientes">${icon('arrow')}<span>Ambientes</span></a>
    <div class="brand paper">${icon('compass')}<span>Bússola do Corpo</span></div>
    <nav class="toolbar" aria-label="Controles da sessão">
      ${uiButton('sound','Ligar som','mute')}${uiButton('pause','Pausar','pause')}${uiButton('settings','Ajustes','gear')}${uiButton('fullscreen','Tela cheia','fullscreen')}${uiButton('collapse','Recolher controles','eye')}
    </nav>
  </header>
  <div id="world-feedback"><p id="status" role="status"></p><p id="hover" aria-hidden="true"></p></div>
  <div id="loading" class="paper" role="status"></div>
  <button type="button" class="show-ui" data-action="collapse" hidden>${icon('eye')} Mostrar controles</button>
  <button type="button" class="reopen" data-action="reopen" hidden>Mostrar etapa</button>
  <div id="dock" aria-label="Ferramentas do mapa"></div>
  <section id="panel" class="paper" aria-labelledby="stage-title"></section>
  <dialog class="paper" id="dialog"></dialog>
</main>`;

const world = $('#world'), orbit = $('#orbit'), panelNode = $('#panel');
const dialog = $<HTMLDialogElement>('#dialog');
let stepHidden = false;
function showDialog(html: string, callback?: () => void) {
  focusedReturn = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  modalCallback = callback ?? null;
  dialog.innerHTML = html;
  dialog.setAttribute('aria-labelledby','dialog-title');
  if (!dialog.open) dialog.showModal();
}
function confirm(title: string, description: string, label: string, callback: () => void) {
  showDialog(`<h2 id="dialog-title">${title}</h2><p>${description}</p>
    <div class="step-actions"><button class="secondary" data-action="close" autofocus>Cancelar</button>
    <button class="primary" data-action="confirm">${label}</button></div>`, callback);
}
function savePrefs() { store(prefsKey,JSON.stringify({ version:1,quality,light,volume })); }
function settings() {
  showDialog(`<h2 id="dialog-title">Ajustes</h2>
    <label for="quality">Qualidade gráfica</label><select id="quality">${Object.entries(qualities).map(([id,label])=>`<option value="${id}" ${id===quality?'selected':''}>${label}${id==='auto'&&visual?' · '+qualities[visual.tier]:''}</option>`).join('')}</select>
    <label for="light">Luz do observatório</label><select id="light">${Object.entries(lights).map(([id,label])=>`<option value="${id}" ${id===light?'selected':''}>${label}</option>`).join('')}</select>
    <label for="volume">Volume</label><input type="range" id="volume" min="0" max=".35" step=".01" value="${volume}">
    <div class="step-actions"><button class="secondary" data-action="${isFallback?'retry':'fallback'}">${isFallback?'Tentar modo 3D':'Ativar modo acessível'}</button>
    <button class="secondary" data-action="restart">Reiniciar sessão</button>
    <button class="primary" data-action="close" autofocus>Voltar ao mapa</button></div>`);
}

function render() {
  const focus = document.activeElement as HTMLElement | null;
  const activeButton = focus instanceof HTMLButtonElement && panelNode.contains(focus) ? focus.dataset : null;
  const previousScroll = panelNode.querySelector('.panel-scroll')?.scrollTop ?? 0;
  const oldPhase = panelNode.dataset.phase;
  const stageChanged = oldPhase !== state.phase;
  panelNode.innerHTML = panel(state,{
    ownWord, showChoices: showChoices || isFallback, saved: !!savedRecord(), activeSeconds: Math.floor(activeTime/1000),
  });
  panelNode.dataset.phase = state.phase;
  document.documentElement.dataset.phase = state.phase;
  panelNode.hidden = collapsed || stepHidden;
  panelNode.inert = state.paused || hostPaused;
  $('#chrome').hidden = collapsed;
  $('#dock').hidden = collapsed || stepHidden;
  $('.show-ui').hidden = !collapsed;
  $('.reopen').hidden = collapsed || !stepHidden;
  $('#dock').innerHTML = state.phase === 'region' || state.phase === 'review' ? `<button class="scene-tool" data-action="flip">${icon('rotate')}${state.bodyView==='front'?'Ver costas':'Ver frente'}</button>
    <button class="scene-tool" data-action="hideStep" aria-expanded="${!stepHidden}">Recolher etapa</button>` :
    `<button class="scene-tool" data-action="hideStep" aria-expanded="${!stepHidden}">Recolher etapa</button>`;
  orbit.hidden = collapsed || state.exited;
  orbit.inert = state.paused || hostPaused;
  document.documentElement.classList.toggle('fallback',isFallback);
  $('#fallback-art').hidden = !isFallback;
  orbit.querySelectorAll<HTMLButtonElement>('button').forEach(btn => {
    const id = btn.dataset.id ?? '';
    btn.disabled = state.phase !== 'sensation' || state.paused;
    btn.setAttribute('aria-pressed',String(isSensation(id) && state.draft.sensationIds.includes(id)));
  });
  const soundButton = $<HTMLButtonElement>('[data-action="sound"]');
  soundButton.innerHTML = icon(audioEnabled?'sound':'mute');
  soundButton.setAttribute('aria-pressed',String(audioEnabled));
  soundButton.setAttribute('aria-label',audioEnabled?'Desligar som':'Ligar som');
  soundButton.title = soundButton.getAttribute('aria-label')!;
  $<HTMLButtonElement>('[data-action="pause"]').disabled = state.phase === 'done';
  if (!stageChanged) {
    panelNode.querySelector('.panel-scroll')!.scrollTop = previousScroll;
    if (activeButton) Array.from(panelNode.querySelectorAll('button')).find(btn =>
      btn.dataset.action===activeButton.action && btn.dataset.id===activeButton.id)?.focus({ preventScroll:true });
  } else if (oldPhase && !panelNode.hidden) $('#stage-title').focus({ preventScroll:true });
}

function dispatch(action: Action) {
  if (hostPaused && !['exit','reset','pause'].includes(action.type)) return;
  const before = state;
  state = reducer(state,action);
  if (before === state) return;
  if (before.phase !== state.phase) {
    showChoices = false;
    ownWord = Boolean(state.draft.customWord);
    lastHover = null;
    $('#hover').textContent = '';
    status(action.type === 'demo' ? 'Exemplo fictício · Antebraço esquerdo' : '');
  }
  if (action.type === 'region') status(`${regions[action.id]}${state.draft.regionIds.includes(action.id) ? ' · selecionado' : ' · removido'}`);
  if (action.type === 'sensation') status(`${sensations[action.id][0]}${state.draft.sensationIds.includes(action.id) ? ' · selecionado' : ' · removido'}`);
  if (action.type === 'flip') status(state.bodyView === 'front' ? 'Vista de frente' : 'Vista de costas');
  if (action.type === 'reset') {
    activeTime = 0; inactiveTime = 0; pauses = 0; stepHidden = false;
    if (!visual && !isFallback) void loadScene();
  }
  syncPause();
  if (action.type === 'pause') { if (action.value) pauses++; host(action.value ? 'pause' : 'resume'); }
  if (action.type === 'exit') {
    releaseScene();
    sound.dispose();
    audioEnabled = false;
    host('exit');
  }
  if (action.type === 'finish') {
    host('complete');
    host('summary',{summary:{ points:state.entries.length, fictional:state.fictionalMode, activeSeconds:Math.floor(activeTime/1000),pauses }});
  }
  if (action.type === 'region' || action.type === 'sensation' || action.type === 'intensity') sound.touch();
  if (action.type !== 'word') render();
}

function releaseScene() {
  sceneGeneration++;
  visualAbort?.abort();
  visualAbort = undefined;
  visual?.dispose();
  visual = undefined;
  if (params.has('diagnostico')) {
    const debug = window as unknown as Record<string, unknown>;
    for (const name of ['bussolaMetrics','bussolaMeasure','bussolaInspect']) delete debug[name];
  }
}
async function loadScene() {
  releaseScene();
  const generation = sceneGeneration;
  const abort = new AbortController();
  visualAbort = abort;
  const loading = $('#loading');
  loading.hidden = false;
  loading.textContent = 'Abrindo o observatório…';
  isFallback = false;
  render();
  try {
    const { createScene } = await import('./scene/scene');
    abort.signal.throwIfAborted();
    const result = await createScene(world,orbit,()=>state,quality,id=>dispatch({type:'region',id}),id=>{
      if (id !== lastHover) { lastHover = id; $('#hover').textContent = id ? regions[id] : ''; }
    },()=> useFallback('O 3D foi interrompido. Você pode continuar pela lista ou tentar recuperar.'),text=>{ loading.textContent=text; },abort.signal,()=>light);
    if (generation !== sceneGeneration) { result.dispose(); return; }
    visual = result;
    if (params.has('diagnostico')) Object.assign(window,{
      bussolaMetrics:visual.metrics, bussolaMeasure:visual.measure, bussolaInspect:visual.inspect,
    });
    syncPause();
    status('');
  } catch {
    if (generation !== sceneGeneration) return;
    useFallback('O 3D está indisponível. Use as listas para seguir com a atividade.');
  } finally {
    if (generation === sceneGeneration) loading.hidden = true;
  }
}
function useFallback(message: string) {
  releaseScene();
  isFallback = true;
  $('#loading').hidden = true;
  status(message);
  render();
}
function pause() {
  if (state.phase === 'done') return;
  dispatch({type:'pause',value:true});
  showDialog(`<h2 id="dialog-title">Sessão em pausa</h2><p>Retome quando quiser.</p>
    <div class="step-actions"><button class="primary" data-action="close" autofocus>Retomar</button>
    <button class="secondary" data-action="exit">Sair da sessão</button></div>`);
}
function exportRecord() {
  const filename = 'bussola-do-corpo.json';
  const data = { version:1,fictional:state.fictionalMode,mode:state.mode,entries:state.entries,
    activeSeconds:Math.floor(activeTime/1000),pauses };
  const uri = URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
  const download = document.createElement('a');
  download.href = uri; download.download = filename; download.click();
  window.setTimeout(()=>URL.revokeObjectURL(uri),1000);
}
function toggleCollapse() {
  collapsed = !collapsed;
  store(collapsedKey, collapsed ? '1' : '0');
  render();
  $(collapsed?'.show-ui':'[data-action="collapse"]').focus();
}
function skip() {
  const draft = state.draft;
  const hasStep = state.phase==='region' ? draft.regionIds.length :
    state.phase==='sensation' ? draft.sensationIds.length || draft.customWord.trim() :
      state.phase==='intensity' && draft.intensity!==null;
  if (hasStep) confirm('Pular esta etapa?','As escolhas desta etapa serão removidas. As outras etapas continuam no mapa.','Pular etapa',()=>dispatch({type:'skip'}));
  else dispatch({type:'skip'});
}
function eraseSaved() {
  if (!store(storageKey,null)) { status('O navegador não permitiu apagar o registro.'); return false; }
  status('Registro deste dispositivo apagado.');
  return true;
}

document.addEventListener('click',event=>{
  if (event.detail > 1) return;
  const launcher = (event.target as Element).closest<HTMLAnchorElement>('.launcher');
  if (launcher && state.phase !== 'done' && (hasContent(state.draft) || state.entries.length)) {
    event.preventDefault();
    confirm('Voltar a Ambientes?','As escolhas da sessão atual serão descartadas.','Voltar a Ambientes',()=>{
      dispatch({type:'exit'}); location.assign(launcher.href);
    });
    return;
  }
  const button = (event.target as Element).closest<HTMLButtonElement>('button[data-action]');
  if (!button || button.disabled) return;
  const { action, id = '' } = button.dataset;
  switch(action) {
    case 'mode': if (Object.hasOwn(modes,id)) dispatch({type:'mode',mode:id as Mode}); break;
    case 'start': dispatch({type:'start',fictional:id==='fiction'}); break;
    case 'restore': { const record = savedRecord(); if (record) dispatch({type:'restore',...record}); break; }
    case 'region': if (isRegion(id)) dispatch({type:'region',id}); break;
    case 'sensation': if (isSensation(id)) dispatch({type:'sensation',id}); break;
    case 'intensity': dispatch({type:'intensity',value:id==='unknown'?'unknown':Number(id) as Intensity}); break;
    case 'flip': case 'another': case 'back': case 'next': case 'cancelEdit': case 'demo': dispatch({type:action}); break;
    case 'edit': dispatch({type:'edit',index:Number(id)}); break;
    case 'remove':
      confirm('Remover este ponto?','As outras escolhas continuam no mapa.','Remover ponto',()=>dispatch({type:'remove',index:Number(id)})); break;
    case 'discardPoint':
      confirm('Remover este ponto?','As escolhas deste ponto serão apagadas.','Remover ponto',()=>dispatch({type:'discardPoint'})); break;
    case 'skip': skip(); break;
    case 'wordToggle':
      if (ownWord && state.draft.customWord.trim()) {
        confirm('Retirar sua palavra?','Os símbolos escolhidos continuam neste ponto.','Retirar palavra',()=>{
          dispatch({type:'word',word:''}); ownWord=false; render();
        });
      } else {
        ownWord=!ownWord; render(); if (ownWord) $('#word').focus();
      }
      break;
    case 'choices': showChoices=!showChoices; render(); break;
    case 'pause': pause(); break;
    case 'close': dialog.close(); break;
    case 'confirm': { const cb=modalCallback; dialog.close(); cb?.(); break; }
    case 'settings': settings(); break;
    case 'sound': audioEnabled=!audioEnabled; syncPause(); render(); break;
    case 'collapse': toggleCollapse(); break;
    case 'hideStep': stepHidden = true; render(); $('.reopen').focus(); break;
    case 'reopen': stepHidden = false; render(); $('#stage-title').focus(); break;
    case 'fullscreen':
      void (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(()=>status('Tela cheia indisponível neste navegador.')); break;
    case 'fallback': dialog.close(); useFallback('Modo acessível ativo. Use as listas para escolher.'); break;
    case 'retry': dialog.close(); void loadScene(); break;
    case 'restart':
      confirm('Reiniciar a sessão?','O mapa em andamento será apagado.','Reiniciar',()=>dispatch({type:'reset'})); break;
    case 'reset': dispatch({type:'reset'}); break;
    case 'exit': {
      const closeSession = () => {
        if (dialog.open) dialog.close();
        dispatch({type:'exit'});
      };
      if (hasContent(state.draft) || state.entries.length) confirm('Sair sem salvar?','As escolhas da sessão atual serão descartadas.','Sair sem salvar',closeSession);
      else closeSession();
      break;
    }
    case 'finish': dispatch({type:'finish',save:false}); break;
    case 'save':
      confirm('Registrar neste dispositivo?','O mapa ficará disponível para outras pessoas que usarem este navegador. Um registro anterior será substituído.','Registrar mapa',()=>{
        if (!store(storageKey,JSON.stringify({version:1,fictional:state.fictionalMode,mode:state.mode,entries:state.entries}))) {
          status('O navegador não permitiu salvar. O mapa segue disponível nesta sessão.'); return;
        }
        dispatch({type:'finish',save:true});
      }); break;
    case 'clear':
      confirm('Apagar o mapa?', 'O mapa em andamento e o registro deste dispositivo serão apagados.', 'Apagar mapa',()=>{
        const deleted = eraseSaved(); dispatch({type:'clear'}); if (!deleted) status('O navegador não permitiu apagar o registro salvo.');
      }); break;
    case 'savedClear':
      confirm('Apagar o registro salvo?', 'O registro será removido deste navegador.', 'Apagar registro',()=>{
        if (eraseSaved()) { dispatch({type:'reset'}); status('Registro deste dispositivo apagado.'); }
      }); break;
    case 'export':
      confirm('Exportar registro?', 'O arquivo inclui as palavras e regiões escolhidas. Ele será salvo na pasta de downloads.', 'Exportar JSON', exportRecord); break;
  }
},{signal});

dialog.addEventListener('close',()=>{
  if (dialog.open) return;
  modalCallback=null;
  if (state.paused) dispatch({type:'pause',value:false});
  if (focusedReturn?.isConnected) focusedReturn.focus();
  focusedReturn=null;
},{signal});
document.addEventListener('input',event=>{
  const input=event.target as HTMLInputElement;
  if (input.id==='word') dispatch({type:'word',word:input.value});
  if (input.id==='volume') { volume=Number(input.value); savePrefs(); syncPause(); }
},{signal});
document.addEventListener('change',event=>{
  const input=event.target as HTMLSelectElement;
  if (input.id==='quality' && Object.hasOwn(qualities,input.value)) {
    quality=input.value as QualitySetting; savePrefs();
    if (!isFallback) void loadScene();
  }
  if (input.id==='light' && Object.hasOwn(lights,input.value)) { light=input.value as LightSetting; savePrefs(); }
},{signal});
document.addEventListener('keydown',event=>{
  if (event.defaultPrevented || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
  const typing = event.target instanceof HTMLElement && ['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName);
  if (event.key.toLowerCase()==='h' && !typing && !dialog.open) { event.preventDefault(); toggleCollapse(); }
  if (event.key==='Escape' && !dialog.open) { event.preventDefault(); pause(); }
  if (event.key==='Enter' && (event.target as HTMLElement)?.id==='word' && !event.isComposing) {
    event.preventDefault(); dispatch({type:'next'});
  }
  if (event.key.startsWith('Arrow') && orbit.contains(document.activeElement)) {
    const buttons=[...orbit.querySelectorAll<HTMLButtonElement>('button')];
    const current=buttons.indexOf(document.activeElement as HTMLButtonElement);
    const next=(current+(['ArrowRight','ArrowDown'].includes(event.key)?1:7))%8;
    event.preventDefault(); buttons[next].focus();
  }
},{signal});
document.addEventListener('visibilitychange',syncPause,{signal});
window.addEventListener('message',event=>{
  if (event.origin!==location.origin || event.source!==window.parent || params.get('embed')!=='1') return;
  if (event.data?.source!=='ambientes' || event.data?.version!==1) return;
  if (event.data.event==='pause' || event.data.event==='resume') {
    hostPaused = event.data.event==='pause'; syncPause(); render();
  }
},{signal});
window.addEventListener('pagehide',event=>{
  if (event.persisted) return;
  controller.abort(); releaseScene(); sound.dispose();
},{signal});

render();
if (isFallback) useFallback('Modo acessível ativo. Use as listas para escolher.');
else void loadScene();
host('ready');
