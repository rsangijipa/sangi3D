import './style.css'
import { BenchAudio } from './audio'
import { modes, presets, type Mode, type Vessel } from './game/content'
import { coverage, dispatch, full, jointAvailable } from './game/rules'
import { initial, type Observation, type Quality, type Tool } from './game/state'
import type { init } from './scene'
import { collection } from './storage'
import { layout } from './ui/layout'

const app=document.querySelector<HTMLElement>('#app')!
layout(app)
const el=<E extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as E
const dialog=el<HTMLDialogElement>('dialog')
const world=el('world'), panel=el('panel')
const audio=new BenchAudio()
let state=initial(matchMedia('(prefers-reduced-motion: reduce)').matches)
let scene:ReturnType<typeof init>|undefined
let tool:Tool='fit', selected=2, joint=0, compare=false, view:'desk'|'top'|'detail'='desk'
let panelOpen=true, hidden=false, help=false, guided=0, collaborator=1, fallback=false
let ready=false
let activityVessel:Vessel='bowl', activityMode:Mode='free', activityCount:number=5
const quality:Record<Quality,string>={auto:'Automática',light:'Leve',balanced:'Equilibrada',cinema:'Cinema'}
const title:Record<Tool,string>={fit:'Encaixar fragmentos',lacquer:'Aplicar laca',finish:'Acabamento',orbit:'Girar e aproximar'}
const observations:Observation[]=['Independente','Com ajuda','Não realizada','Recusada']
const embed=new URLSearchParams(location.search).get('embed')==='1'
document.body.classList.toggle('embedded',embed)
const options=<T extends string>(items:[T,string][], current:T)=>items.map(([value,label])=>`<option value="${value}" ${value===current?'selected':''}>${label}</option>`).join('')
const numeric=(max:number,start=0)=>Array.from({length:Math.max(0,max-start)},(_,index)=>index+start)
const flag=(condition:boolean)=>condition?'disabled':''

function status(message:string) { el('status').textContent=message }
function tell(event:string, detail:object={}) {
  const data={source:'atelie-kintsugi',version:1,type:event,...detail}
  window.dispatchEvent(new CustomEvent('kintsugi:session',{detail:data}))
  if(!embed||window.parent===window||!document.referrer) return
  const parentOrigin=new URL(document.referrer).origin
  if(parentOrigin===location.origin) window.parent.postMessage(data,parentOrigin)
}
function readyEvent() {
  if(ready) return
  ready=true; tell('ready',{renderer:fallback?'fallback':'webgl2'})
}
function setFallback(active:boolean) {
  fallback=active; el('fallback').hidden=!active; world.classList.toggle('unavailable',active)
}

const countPlaced=()=>state.sceneState.fragments.filter(part=>part.slot!==null).length
const total=(layer:'gold'|'lacquer')=>state.sceneState.joints.filter(item=>item[layer]===full).length
const jointList=()=>numeric(state.sceneState.count).filter(id=>jointAvailable(state.sceneState,id))
const interaction=()=>state.phase==='work'&&!compare
const unresolved=()=>state.sceneState.fragments.findIndex(part=>part.slot===null)
function sync() {
  if (!scene) return
  if(dialog.open && dialog.dataset.kind==='demo' && guided>0) {
    const example=structuredClone(state)
    dispatch(example,{type:'turn',id:2,degrees:-example.sceneState.fragments[2].angle})
    dispatch(example,{type:'fit',id:2,slot:2})
    if(guided===2) {
      dispatch(example,{type:'brush',id:0,layer:'lacquer'})
      dispatch(example,{type:'brush',id:0,layer:'gold'})
    }
    scene.sync({state:example,tool,selected:unresolved(),joint,view,compare:false})
    return
  }
  scene.sync({state,tool,selected,joint,view,compare})
}

function fallbackDiagram() {
  if(!fallback) return
  const data=state.sceneState
  el('diagram').innerHTML=numeric(data.count).map(id=>{
    const has=compare?id<2:data.fragments.some(part=>part.slot===id)
    const colors=data.joints[id].gold?'gold':data.joints[id].lacquer?'lacquer':''
    return `<span class="${has?'placed':''} ${compare?'':colors}" style="--angle:${id*360/data.count}deg" title="Posição ${id+1}"></span>`
  }).join('')
}

function panelMarkup() {
  const {sceneState:data}=state
  const mask=data.joints[joint]
  const selectedPart=data.fragments[selected]
  const joints=jointList()
  const contextual=tool==='fit'
    ? 'Toque ou clique em um fragmento no linho. Gire até alinhar as bordas e arraste até a posição iluminada. Os botões executam os mesmos gestos.'
    : tool==='orbit'
      ? 'Arraste na cena para orbitar. Use a roda do mouse ou faça uma pinça para aproximar. As três vistas também mudam o enquadramento.'
      : 'Passe o pincel ao longo da costura clara. Use os trechos numerados ou cubra a junta inteira com um botão.'
  let body=''
  if(tool==='fit') {
    const loose=numeric(data.count).filter(id=>data.fragments[id].slot===null)
    body=loose.length ? `
      <div class="field-row"><label for="fragment">Fragmento</label><select id="fragment">${loose.map(id=>`<option value="${id}" ${id===selected?'selected':''}>Fragmento ${id+1}</option>`).join('')}</select></div>
      ${state.mode==='alternate'? `<div class="field-row"><label for="slot">Posição</label><select id="slot">${numeric(data.count).filter(slot=>!data.fragments.some(part=>part.slot===slot)).map(slot=>`<option value="${slot}">Posição ${slot+1}</option>`).join('')}</select></div>`:''}
      <div class="rotation-row"><button data-action="turn-left" aria-label="Girar fragmento à esquerda">↶</button><output id="fragment-angle">${selectedPart?.angle??0}°</output><button data-action="turn-right" aria-label="Girar fragmento à direita">↷</button></div>
      <div class="button-row"><button data-action="inspect">Inspecionar</button><button data-action="align">Alinhar bordas</button></div>
      <button class="primary wide" data-action="fit">Encaixar <span aria-hidden="true">→</span></button>`
      : '<p>Todos os fragmentos estão na peça. Você já pode aplicar laca nas juntas.</p>'
  } else if(tool==='orbit') {
    body=`<div class="view-grid">${[['desk','Bancada'],['top','De cima'],['detail','Detalhe']].map(([id,label])=>`<button data-action="view-${id}" aria-pressed="${view===id}">${label}</button>`).join('')}</div><div class="button-row"><button data-action="orbit-left" aria-label="Orbitar à esquerda">↶ Esquerda</button><button data-action="orbit-right" aria-label="Orbitar à direita">Direita ↷</button></div>`
  } else if (joints.length) {
    const layer=tool==='lacquer'?'lacquer':'gold'
    const blocked=layer==='gold' && mask?.lacquer!==full
    const bits=mask?.[layer]??0
    body=`
      <div class="field-row"><label for="joint">Junta</label><select id="joint">${joints.map(id=>`<option value="${id}" ${id===joint?'selected':''}>Junta ${id+1}</option>`).join('')}</select></div>
      <p class="coverage-text">${blocked?'Aplique laca em toda a junta antes do pigmento.':`${coverage(bits)} de 8 trechos cobertos`}</p>
      <div class="segments" role="group" aria-label="Trechos da junta">${numeric(8).map(id=>`<button data-action="section-${id}" aria-label="Pintar trecho ${id+1}" aria-pressed="${Boolean(bits&(1<<id))}" ${flag(blocked||Boolean(bits&(1<<id)))}>${id+1}</button>`).join('')}</div>
      <button class="primary wide" data-action="brush-all" ${flag(blocked||bits===full)}>${layer==='gold'?'Cobrir com pigmento':'Cobrir com laca'} <span aria-hidden="true">→</span></button>
      ${layer==='gold'?`<label class="check"><input id="discrete" type="checkbox" ${state.settings.discrete?'checked':''}> Acabamento discreto</label>`:''}`
  } else body='<p>Encaixe dois fragmentos vizinhos para abrir uma junta.</p>'
  return `<div class="panel-head"><div><p class="eyebrow">${modes[state.mode]}</p><h2>${title[tool]}</h2></div><button class="icon-button" data-action="close-panel" aria-label="Recolher painel">−</button></div>
    <div class="panel-body">${body}</div>
    <div class="panel-footer"><button data-action="help" aria-expanded="${help}">? Ajuda</button><button data-action="redo" ${flag(!state.future.length)}>↷ Refazer</button>${state.mode==='facilitated'?'<button data-action="observe">Observar</button>':''}</div>
    ${help?`<p class="context-help">${contextual}</p>`:''}`
}

function render() {
  const working=state.phase==='work'
  const entry=state.phase==='entry'||state.phase==='exit'
  const focused=document.activeElement as HTMLElement|null
  const focusedAction=panel.contains(focused)?focused?.dataset.action:undefined
  const focusedId=panel.contains(focused)?focused?.id:undefined
  el('entry').hidden=!entry
  el('experience').classList.toggle('working',working)
  el('experience').classList.toggle('entrance',entry)
  el('work-hud').hidden=!working||hidden
  el('scene-label').hidden=entry||hidden
  el('piece-name').textContent=presets[state.sceneState.vessel].label
  app.querySelector<HTMLButtonElement>('[data-action="show"]')!.hidden=!hidden
  document.body.classList.toggle('controls-hidden',hidden)
  app.querySelector<HTMLButtonElement>('[data-action="pause"]')!.disabled=!working
  app.querySelector<HTMLButtonElement>('[data-action="exit"]')!.disabled=entry
  for(const button of app.querySelectorAll<HTMLButtonElement>('[data-tool]')) button.setAttribute('aria-pressed',String(button.dataset.tool===tool))
  app.querySelector<HTMLButtonElement>('[data-action="undo"]')!.disabled=!state.history.length
  panel.hidden=!working||!panelOpen||hidden
  if(!panel.hidden) {
    panel.innerHTML=panelMarkup()
    const focus=focusedId?document.getElementById(focusedId):focusedAction?panel.querySelector<HTMLElement>(`[data-action="${focusedAction}"]`):null
    if(focus instanceof HTMLElement && !(focus instanceof HTMLButtonElement && focus.disabled)) focus.focus({preventScroll:true})
    else if(focused && panel.contains(focused)===false && focusedAction) panel.querySelector<HTMLElement>('[data-action="close-panel"]')?.focus({preventScroll:true})
  }
  fallbackDiagram();sync()
}

function showDialog(titleText:string, body:string, kind:string) {
  dialog.dataset.kind=kind
  el('dialog-content').innerHTML=`<div class="dialog-head"><h2 id="dialog-title">${titleText}</h2><button class="icon-button" data-action="close-dialog" aria-label="Fechar">×</button></div>${body}`
  if(!dialog.open) dialog.showModal()
}
function closeDialog() {
  if(!dialog.open) return
  const preview=dialog.dataset.kind==='demo'
  dialog.close()
  if(preview) sync()
}
function available() {
  if(state.sceneState.fragments[selected]?.slot!==null) selected=unresolved()
  const joints=jointList()
  if(!joints.includes(joint)) joint=joints[0]??0
}
function command(command:Parameters<typeof dispatch>[1], quiet=false) {
  const before=state.sceneState
  const result=dispatch(state,command)
  available()
  if(!quiet||state.sceneState!==before) status(result)
  if(before!==state.sceneState) {
    if(command.type==='fit') audio.play('fit')
    if(command.type==='brush') audio.play(command.layer)
  }
  render()
}
function start(vessel:Vessel, count:number, mode:Mode) {
  closeDialog()
  tool='fit'; compare=false; selected=2; joint=0; view='desk'; help=false; panelOpen=true; hidden=false; collaborator=1
  command({type:'start',vessel,count,mode})
  if(mode==='guided') { guided=0; demo() }
  else panel.querySelector<HTMLElement>('select')?.focus({preventScroll:true})
}
function demo() {
  const steps=[
    ['Observe as bordas','Selecione um fragmento solto. Use Inspecionar para ver a junta de perto.'],
    ['Experimente o encaixe','Gire o fragmento até alinhar as bordas. Arraste-o sobre o contorno iluminado ou use o botão Encaixar.'],
    ['Passe o pincel','Com duas bordas reunidas, cubra a junta com laca. Quando a linha estiver inteira, experimente o pigmento.'],
  ]
  const [name,body]=steps[guided]
  showDialog(name,`<p>${body}</p><div class="button-row"><button data-action="close-dialog">Pular demonstração</button><button class="primary" data-action="demo-next">${guided===2?'Ir à bancada':'Avançar'} →</button></div>`,'demo')
  sync()
}
function activity() {
  showDialog('Escolher atividade',`
    <div class="field-row"><label for="activity-vessel">Cerâmica</label><select id="activity-vessel">${options(Object.entries(presets).map(([id,item])=>[id as Vessel,item.label]),activityVessel)}</select></div>
    <div class="field-row"><label for="activity-count">Fragmentos</label><select id="activity-count">${options(numeric(8,3).map(n=>[String(n),String(n)]),String(activityCount))}</select></div>
    <div class="field-row"><label for="activity-mode">Modo</label><select id="activity-mode">${options(Object.entries(modes).map(([id,label])=>[id as Mode,label]),activityMode)}</select></div>
    <p id="mode-note"></p>
    <button data-action="start-custom" class="primary wide">Preparar bancada <span aria-hidden="true">→</span></button>`,'activity')
  modeNote()
}
function modeNote() {
  el('mode-note').textContent={
    free:'Explore as ferramentas em qualquer ordem e termine quando quiser.',
    guided:'Experimente uma demonstração breve com pistas para o encaixe e o acabamento.',
    alternate:'Encaixe os fragmentos em posições livres e altere o padrão da cerâmica.',
    facilitated:'Combine as instruções e registre somente as ações observadas. A pausa e a recusa estão disponíveis a qualquer momento.',
  }[activityMode]
}
function settings() {
  showDialog('Configurações',`
    <div class="field-row"><label for="quality">Qualidade</label><select id="quality">${options(Object.entries(quality).map(([id,label])=>[id as Quality,label]),state.settings.quality)}</select></div>
    <div class="field-row"><label for="tolerance">Tolerância do encaixe</label><output id="tolerance-value">${state.settings.tolerance}°</output></div>
    <input class="range" id="tolerance" type="range" min="5" max="30" value="${state.settings.tolerance}">
    <label class="check"><input id="reduced" type="checkbox" ${state.settings.reduced?'checked':''}> Reduzir movimentos</label>
    ${state.mode==='facilitated'?`<div class="field-row"><label for="opportunities">Oportunidades</label><select id="opportunities">${options(numeric(9,1).map(n=>[String(n),String(n)]),String(state.settings.opportunities))}</select></div><div class="field-row"><label for="instruction">Instrução</label><select id="instruction">${options([['both','Visual e verbal'],['visual','Visual'],['verbal','Verbal']],state.settings.instruction)}</select></div>`:''}
    <div class="button-row"><button data-action="load">Abrir peça salva</button><button data-action="delete-save">Excluir peça salva</button></div>
    ${state.phase==='work'?'<button data-action="reset" class="wide">Reiniciar peça…</button>':''}
    <p class="fineprint">Arraste para manipular. H recolhe os controles e Esc fecha o painel.</p>`,'settings')
}
function review() {
  showDialog('Revisar a peça',`
    <dl class="summary"><div><dt>Fragmentos encaixados</dt><dd>${countPlaced()} / ${state.sceneState.count}</dd></div><div><dt>Juntas com laca</dt><dd>${total('lacquer')}</dd></div><div><dt>Juntas com pigmento</dt><dd>${total('gold')}</dd></div></dl>
    <button class="wide" data-action="compare" aria-pressed="${compare}">${compare?'Ver peça atual':'Comparar com o início'}</button>
    <p class="reflection">O que você percebe quando experimenta outra forma de recompor?</p>
    <div class="button-row"><button data-action="save">Guardar neste dispositivo</button><button data-action="capture" ${flag(!scene||fallback)}>Capturar imagem</button></div>
    <div class="button-row"><button data-action="export">Exportar resumo</button><button data-action="repeat">Nova peça</button></div>
    <div class="button-row"><button data-action="resume">Voltar à bancada</button><button class="primary" data-action="finish">Encerrar →</button></div>`,'review')
}
function observe() {
  const tracked=state.sceneState.observations
  showDialog('Observação da sessão',`
    <p>Registre a ação observada. Cada oportunidade pode ser atualizada.</p>
    <div class="field-row"><label for="opportunity">Oportunidade</label><select id="opportunity">${numeric(state.settings.opportunities+1,1).map(n=>`<option value="${n}">${n}${tracked.find(item=>item.opportunity===n)?' · registrada':''}</option>`).join('')}</select></div>
    <div class="field-row"><label for="observation">Ação</label><select id="observation">${observations.map(item=>`<option>${item}</option>`).join('')}</select></div>
    <div class="button-row"><button data-action="pass">Passar a vez</button><button class="primary" data-action="record">Registrar</button></div>`,'observe')
}
function download(name:string, url:string) {
  const link=document.createElement('a');link.href=url;link.download=name;link.click()
}
function exportSummary(include:boolean) {
  const payload={version:1,piece:presets[state.sceneState.vessel].label,mode:modes[state.mode],fragments:state.sceneState.count,fitted:countPlaced(),lacquer:total('lacquer'),gold:total('gold'),...(include?{observations:state.sceneState.observations}:{})}
  const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}))
  download('kintsugi-resumo.json',url)
  window.setTimeout(()=>URL.revokeObjectURL(url),1000)
  tell('summary',{fitted:countPlaced(),lacquer:total('lacquer'),gold:total('gold')})
}

function applyBrush(id:number, section?:number) {
  if(!interaction()) return
  if(tool!=='lacquer'&&tool!=='finish') return
  const layer=tool==='lacquer'?'lacquer':'gold'
  if(section!==undefined && (state.sceneState.joints[id][layer]&(1<<section))) return
  joint=id
  command({type:'brush',id,layer,section},section!==undefined)
}
function resume() {
  const wasPaused=state.phase==='paused'
  closeDialog();compare=false;command({type:'resume'})
  if(wasPaused) tell('resume')
}
function exit() {
  closeDialog();compare=false;hidden=false;command({type:'exit'});tell('exit')
}
function confirmDialog(titleText:string, body:string, action:string, label:string) {
  showDialog(titleText,`<p>${body}</p><div class="button-row"><button data-action="cancel-confirm">Cancelar</button><button data-action="${action}" class="primary">${label}</button></div>`,'confirm')
}
function togglePanel() {panelOpen=!panelOpen;render()}
function safeClose() {
  if(dialog.dataset.kind==='review'||dialog.dataset.kind==='pause') resume()
  else if(state.phase==='review') review()
  else if(state.phase==='paused') showDialog('Bancada em pausa','<button class="primary wide" data-action="resume">Retomar</button>','pause')
  else closeDialog()
}

async function run(action:string) {
  if(action.startsWith('tool-')) {tool=action.slice(5) as Tool; panelOpen=true;help=false;render();return}
  if(action.startsWith('view-')) {view=action.slice(5) as typeof view;render();return}
  if(action.startsWith('section-')) {applyBrush(joint,Number(action.slice(8)));return}
  switch(action) {
    case 'start':start('bowl',5,'free');break
    case 'activity':activity();break
    case 'start-custom':start(activityVessel,activityCount,activityMode);break
    case 'demo-next':if(guided===2) closeDialog();else {guided++;demo()} break
    case 'settings':settings();break
    case 'sound': {
      const enabled=await audio.toggle()
      const button=app.querySelector('[data-action="sound"]')!
      button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label',enabled?'Silenciar som':'Ativar som')
      status(enabled?'Som ativado.':'Som silenciado.');break
    }
    case 'fullscreen':if(document.fullscreenElement) await document.exitFullscreen();else await document.documentElement.requestFullscreen();break
    case 'pause':command({type:'pause'});tell('pause');showDialog('Bancada em pausa','<div class="button-row"><button data-action="exit">Sair</button><button class="primary" data-action="resume">Retomar →</button></div>','pause');break
    case 'resume':resume();break
    case 'close-dialog':safeClose();break
    case 'close-panel':togglePanel();break
    case 'cancel-confirm':if(state.phase==='paused')showDialog('Bancada em pausa','<button class="primary wide" data-action="resume">Retomar</button>','pause');else closeDialog();break
    case 'exit':confirmDialog('Sair da bancada?','Para guardar a peça neste dispositivo, use o painel de revisão antes de encerrar.','exit-confirm','Sair');break
    case 'exit-confirm':exit();break
    case 'review':command({type:'review'});review();break
    case 'compare':compare=!compare;sync();fallbackDiagram();review();break
    case 'finish':tell('complete',{fitted:countPlaced(),total:state.sceneState.count});exit();break
    case 'repeat':resume();activity();break
    case 'show':hidden=false;render();break
    case 'help':help=!help;render();break
    case 'undo':command({type:'undo'});break
    case 'redo':command({type:'redo'});break
    case 'reset':confirmDialog('Reiniciar a peça?','A cerâmica volta ao estado inicial. Você ainda pode desfazer o reinício.','reset-confirm','Reiniciar');break
    case 'reset-confirm':closeDialog();selected=2;command({type:'reset'});break
    case 'turn-left':case 'turn-right':command({type:'turn',id:selected,degrees:action==='turn-left'?-10:10});break
    case 'align':command({type:'turn',id:selected,degrees:-(state.sceneState.fragments[selected]?.angle??0)});break
    case 'fit':command({type:'fit',id:selected,slot:state.mode==='alternate'?Number(el<HTMLSelectElement>('slot').value):selected});break
    case 'inspect':view='detail';render();status('Observe a borda iluminada da junta e compare o ângulo do fragmento.');break
    case 'brush-all':applyBrush(joint);break
    case 'orbit-left':case 'orbit-right':scene?.orbit(action==='orbit-left'?-.23:.23);break
    case 'observe':observe();break
    case 'pass':collaborator=collaborator===1?2:1;closeDialog();status(`Vez da pessoa ${collaborator}.`);break
    case 'record':command({type:'observe',opportunity:Number(el<HTMLSelectElement>('opportunity').value),result:el<HTMLSelectElement>('observation').value as Observation});closeDialog();break
    case 'capture':if(scene) download('kintsugi-peca.png',scene.snapshot());break
    case 'export':showDialog('Exportar resumo','<p>O arquivo inclui os números de fragmentos e juntas trabalhadas.</p><label class="check"><input id="export-observations" type="checkbox"> Incluir observações da sessão</label><div class="button-row"><button data-action="back-review">Voltar</button><button data-action="export-confirm" class="primary">Baixar resumo</button></div>','export');break
    case 'export-confirm':exportSummary(el<HTMLInputElement>('export-observations').checked);review();break
    case 'back-review':review();break
    case 'save':showDialog('Guardar neste dispositivo?','<p>A peça fica salva neste navegador. Em um dispositivo compartilhado, outras pessoas que usam este perfil poderão reabri-la. As observações ficam só na sessão.</p><div class="button-row"><button data-action="back-review">Voltar</button><button data-action="save-confirm" class="primary">Guardar peça</button></div>','save');break
    case 'save-confirm':await collection('write',state);review();status('Peça guardada neste navegador.');break
    case 'load':{
      const saved=await collection('read')
      if(saved?.version!==1) {showDialog('Peça salva','<p>Não há peça guardada neste navegador.</p><button class="wide" data-action="settings">Voltar</button>','notice');break}
      state=saved;state.phase='work';compare=false;view='desk';tool='fit';selected=-1;available();closeDialog();render();status('Peça reaberta.');break
    }
    case 'delete-save':confirmDialog('Excluir peça salva?','A cópia guardada neste navegador será removida.','delete-confirm','Excluir');break
    case 'delete-confirm':await collection('delete');settings();status('Cópia local excluída.');break
  }
}

document.addEventListener('click',event=>{
  const button=(event.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]')
  if(button && !button.disabled) void run(button.dataset.action!).catch(()=>{
    status('Esta ação não está disponível neste navegador.')
    if(dialog.open) showDialog('Ação indisponível','<p>Não foi possível concluir a ação neste navegador.</p><button class="wide" data-action="close-dialog">Fechar</button>','notice')
  })
})
document.addEventListener('input',event=>{
  const target=event.target as HTMLInputElement
  if(target.id==='tolerance') {
    state.settings.tolerance=Number(target.value);el('tolerance-value').textContent=target.value+'°'
  }
})
document.addEventListener('change',event=>{
  const target=event.target as HTMLInputElement
  switch(target.id) {
    case 'activity-vessel':activityVessel=target.value as Vessel;activityCount=presets[activityVessel].count;el<HTMLSelectElement>('activity-count').value=String(activityCount);break
    case 'activity-count':activityCount=Number(target.value);break
    case 'activity-mode':activityMode=target.value as Mode;modeNote();break
    case 'fragment':selected=Number(target.value);render();break
    case 'joint':joint=Number(target.value);render();break
    case 'quality':state.settings.quality=target.value as Quality;sync();break
    case 'reduced':state.settings.reduced=target.checked;sync();break
    case 'discrete':state.settings.discrete=target.checked;sync();break
    case 'instruction':state.settings.instruction=target.value as typeof state.settings.instruction;sync();break
    case 'opportunities':state.settings.opportunities=Number(target.value);break
  }
})
dialog.addEventListener('cancel',event=>{event.preventDefault();safeClose()})
document.addEventListener('keydown',event=>{
  if(dialog.open||/INPUT|SELECT|TEXTAREA/.test((event.target as HTMLElement).tagName)) return
  if(event.key.toLowerCase()==='h') {hidden=!hidden;render()}
  if(event.key==='Escape'&&state.phase==='work'&&panelOpen) togglePanel()
  if(state.phase!=='work')return
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z') {
    event.preventDefault();command({type:event.shiftKey?'redo':'undo'})
  }
})

render()
import('./scene').then(({init})=>{
  scene=init(world,{
    select(id){selected=id;panelOpen=true;render()},
    fit(id,slot,distance){if(interaction())command({type:'fit',id,slot,distance})},
    brush:applyBrush,status,fallback(active){setFallback(active);fallbackDiagram()},
  })
  sync();readyEvent()
}).catch(()=>{setFallback(true);fallbackDiagram();readyEvent()})
const disposeKintsugi = () => {
  scene?.dispose()
}
addEventListener('pagehide',event=>{if(!event.persisted)disposeKintsugi()})
addEventListener('sangi:dispose', disposeKintsugi)
addEventListener('beforeunload', disposeKintsugi)
addEventListener('message', (e) => {
  if (e.data?.type === 'SANGI_APP_DISPOSE' || (e.data?.type === 'SANGI_COMMAND' && String(e.data?.command).toUpperCase() === 'DISPOSE')) {
    disposeKintsugi()
  }
})
if(import.meta.env.PROD&&'serviceWorker' in navigator) {
  const scope=new URL('.',location.href)
  void navigator.serviceWorker.register(new URL('sw.js',scope),{scope:scope.pathname}).catch(()=>{})
}
