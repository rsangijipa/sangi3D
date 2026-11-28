import './style.css';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { Studio, backdrop } from './studio.ts';
import { makeMask, nearestVertex, features, forms, materials, tools, finishes, decorations,
  type MaskState, type MaterialName, type Tool, type Side, type Decoration, type Finish } from './mask.ts';
import { interfaceMarkup, icon, palette, experiences, questions } from './view.ts';
import { WorkshopAudio } from './audio.ts';
import * as gallery from './gallery.ts';

document.querySelector('#app')!.innerHTML = interfaceMarkup();
const byId = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
byId('backdrop').style.backgroundImage = 'url("'+backdrop+'")';
const stage = byId('stage');
const studio = new Studio(stage);
const audio = new WorkshopAudio();
const modal = byId<HTMLDialogElement>('dialog');
const modalBody = byId('dialog-body');
const panel = document.querySelector<HTMLElement>('.panel')!;
const small = matchMedia('(max-width:759px)');
type Mode = 'sculpt' | 'paint' | 'decorate';
interface Workspace {
  state: MaskState;
  id: string;
  name: string;
  description: string;
  past: MaskState[];
  future: MaskState[];
  thumbnail?: string;
}
const workspace = (): Workspace => ({ state:makeMask(), id:crypto.randomUUID(), name:'', description:'', past:[], future:[] });
let pair = [workspace(),workspace()];
let slot = 0;
let active = pair[0];
let side: Side = 0;
let mode: Mode = 'sculpt';
let sceneReady = false;
let experience = 0;
let context = '';
let pigment = 0;
let tool: Tool = 'Puxar';
let finish: Finish = 'Fosco';
let decor: Decoration = 'Flor';
let brushSize = .49;
let intensity = .62;
let opacity = .64;
let texture = 'Liso';
let mix = false;
let symmetry = false;
let light = 1;
let temperature = .35;
let quality = 'auto';
let question = 0;
let toastTimer = 0;
let dialogRevision = 0;
let activeGesture: { pointer: number; orbit: boolean; lastX: number; lastY: number; acted: boolean; stroke: boolean } | undefined;
const getColor = () => palette[pigment][1];
// Expressões: Testa, Sobrancelhas, Olhos, Nariz, Maçãs do rosto, Boca, Queixo, Contorno.
const expressions: [string, number[]][] = [
  ['Neutra',[0,0,0,0,0,0,0,0]],
  ['Alegria',[.1,.35,.15,0,.7,.8,.1,.1]],
  ['Tristeza',[-.1,-.65,-.35,0,-.3,-.75,-.2,-.1]],
  ['Raiva',[-.3,-.9,-.5,.2,.2,-.45,.35,.15]],
  ['Surpresa',[.35,.9,.8,0,-.1,.6,-.25,0]],
  ['Serenidade',[.05,.15,-.25,0,.25,.2,0,-.05]],
];
let expressionTween = 0;
function setExpression(index: number) {
  history();
  const from = [...active.state.morph], to = expressions[index][1], start = performance.now(), target = active;
  cancelAnimationFrame(expressionTween);
  const step = (now: number) => {
    const k = Math.min(1,(now-start)/650), e = k*k*(3-2*k);
    to.forEach((v,i)=>{ target.state.morph[i] = from[i]+(v-from[i])*e; });
    if (target === active) studio.updateForm(target.state);
    if (k < 1) expressionTween = requestAnimationFrame(step);
    else if (mode === 'sculpt') syncPanel();
  };
  expressionTween = requestAnimationFrame(step);
  audio.chime(index*2);
  notify('Expressão: '+expressions[index][0]);
}

function notify(message: string) {
  const el = byId('toast');
  el.hidden = false;
  el.textContent = message;
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(()=>{ el.hidden=true; },2850);
}
function errorMessage(error: unknown) {
  console.error(error);
  notify(error instanceof Error ? error.message : 'Não foi possível concluir a ação.');
}
function task(f: () => Promise<unknown>) { void f().catch(errorMessage); }
function on(id: string,fn: () => void) { byId(id).addEventListener('click',fn); }
function escape(s: string) {
  return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
}
function button(id: string, label: string, primary = false) {
  return `<button type="button" id="${id}"${primary?' class="primary"':''}>${label}</button>`;
}
const options = (values: readonly string[],value: string) => values.map(v=>`<option${v===value?' selected':''}>${v}</option>`).join('');
const select = (id: string, name: string, values: readonly string[],value: string) => `<label class="field">${name}<select id="${id}">${options(values,value)}</select></label>`;
const range = (id: string, name: string, value: number,min=0,max=1) => `<label class="range-label"><span>${name}</span><input id="${id}" type="range" min="${min}" max="${max}" step=".01" value="${value}"></label>`;
function input(id: string,update: (el: HTMLInputElement) => void) {
  const el = byId<HTMLInputElement>(id);
  el.addEventListener('input',()=>update(el));
}
function changed(id: string,update: (value: string) => void) {
  const el = byId<HTMLSelectElement>(id);
  el.addEventListener('change',()=>update(el.value));
}
function history() {
  active.past.push(structuredClone(active.state));
  if (active.past.length > 32) active.past.shift();
  active.future.length = 0;
  historyButtons();
}
function historyButtons() {
  byId<HTMLButtonElement>('undo').disabled = !active.past.length;
  byId<HTMLButtonElement>('redo').disabled = !active.future.length;
}
function restore(forward: boolean) {
  const from = forward ? active.future : active.past;
  const to = forward ? active.past : active.future;
  const next = from.pop();
  if (!next) return;
  to.push(active.state); active.state=next;
  studio.setState(active.state);
  syncPanel();
  notify(forward ? 'Alteração refeita' : 'Alteração desfeita');
}
function expandPanel(open: boolean) {
  panel.classList.toggle('expanded',open);
  byId('disclosure').setAttribute('aria-expanded',String(open || !small.matches));
  byId('disclosure').lastElementChild!.textContent = open ? '⌄' : '⌃';
}
function syncPanel() {
  const edited = byId<HTMLDetailsElement>('sculpt-details')?.open;
  document.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.mode===mode)));
  document.querySelectorAll<HTMLButtonElement>('[data-pigment]').forEach((el,i)=>el.setAttribute('aria-pressed',String(i===pigment)));
  byId('face-label').textContent = side === 0 ? 'Face externa' : 'Face interna';
  byId('flip').setAttribute('aria-pressed',String(side === 1));
  byId('guide').textContent = studio.theater ? 'Teatro das máscaras' :
    mode === 'sculpt' ? 'Arraste sobre a máscara para esculpir' : mode === 'paint' ? 'Arraste sobre a máscara para pintar' : 'Toque na máscara para encaixar um adorno';
  const controls = byId('mode-controls');
  if (mode === 'sculpt') {
    controls.innerHTML = `<div class="control-grid">${select('tool','Ferramenta',tools,tool)}${select('material','Material',Object.keys(materials),active.state.material[side])}</div>
      ${range('size','Área',brushSize,.08)}
      <div class="expressions" role="group" aria-label="Expressões prontas">${expressions.map(([n],i)=>`<button type="button" class="chip" data-expression="${i}">${n}</button>`).join('')}</div>
      <details id="sculpt-details"${edited?' open':''}><summary>Forma e simetria</summary>
      ${select('form','Formato',forms,active.state.form)}${range('intensity','Intensidade',intensity,.08)}
      <label class="toggle-label"><input id="symmetry" type="checkbox"${symmetry?' checked':''}> Escultura simétrica</label>
      ${features.map((name,i)=>range('morph-'+i,name,active.state.morph[i],-1,1)).join('')}</details>`;
    controls.querySelectorAll<HTMLButtonElement>('[data-expression]').forEach(el=>el.onclick=()=>setExpression(Number(el.dataset.expression)));
    changed('tool',value=>{tool=value as Tool;});
    changed('material',value=>{history(); active.state.material[side]=value as MaterialName; studio.setState(active.state);});
    changed('form',value=>{history(); active.state.form=value as MaskState['form']; studio.updateForm(active.state);});
    input('symmetry',el=>{symmetry=el.checked;});
    input('intensity',el=>{intensity=el.valueAsNumber;});
    features.forEach((_,i)=>{
      const slider=byId<HTMLInputElement>('morph-'+i);
      let changing = false;
      slider.addEventListener('input',()=>{
        if (!changing) {history(); changing=true;}
        active.state.morph[i]=slider.valueAsNumber;
        studio.updateForm(active.state);
      });
      slider.addEventListener('change',()=>{changing=false;});
    });
  } else if (mode === 'paint') {
    controls.innerHTML = `<div class="control-grid">${select('finish','Acabamento',finishes,finish)}${select('brush-texture','Textura',['Liso','Seco','Granulado'],texture)}</div>
      ${range('size','Pincel',brushSize,.08)}${range('opacity','Opacidade',opacity,.04)}${range('intensity','Intensidade',intensity,.08)}
      <label class="toggle-label"><input id="mix" type="checkbox"${mix?' checked':''}> Misturar pigmentos</label>`;
    changed('finish',value=>{finish=value as Finish;});
    changed('brush-texture',value=>{texture=value;});
    input('opacity',el=>{opacity=el.valueAsNumber;});
    input('intensity',el=>{intensity=el.valueAsNumber;});
    input('mix',el=>{mix=el.checked;});
  } else {
    controls.innerHTML = `${select('ornament','Adorno',decorations,decor)}${range('size','Tamanho',brushSize,.08)}
      <button id="remove-ornament" type="button">Remover último adorno desta face</button>`;
    changed('ornament',value=>{decor=value as Decoration;});
    const remove=byId<HTMLButtonElement>('remove-ornament');
    remove.disabled = !active.state.ornaments.some(item=>item.side===side);
    remove.onclick = ()=>{
      const all = active.state.ornaments;
      let index=all.length-1;
      while (index>=0 && all[index].side!==side) index--;
      if (index < 0) return;
      history();
      all.splice(index,1);
      studio.setState(active.state);
      syncPanel();
    };
  }
  input('size',el=>{brushSize=el.valueAsNumber;});
  historyButtons();
}
function flip() {
  side = side === 0 ? 1 : 0;
  const old = studio.targetRotation;
  studio.targetRotation = (Math.round((old-side*Math.PI)/(2*Math.PI))*2+side)*Math.PI;
  if (Math.abs(studio.targetRotation-old) < .06) studio.targetRotation += 2*Math.PI;
  audio.play('rotate');
  syncPanel();
  notify(side ? 'Editando o interior' : 'Editando o exterior');
}
function turn(angle: number) { studio.targetRotation+=angle; audio.play('rotate'); }

function apply(x: number,y: number,gesture: NonNullable<typeof activeGesture>,repeat = false) {
  const hit = studio.hit(x,y,side);
  if (!hit) return;
  if (!gesture.acted) {history(); gesture.acted=true;}
  if (mode === 'sculpt') {
    const delta = (x-gesture.lastX)*.24;
    studio.sculpt(active.state,side,hit.point,tool,.087+brushSize*.43,(repeat ? .017 : .046)*intensity,symmetry,delta || 1.4);
  } else if (mode === 'paint') {
    if (!gesture.stroke) {
      active.state.paint[side].push({dots:[],color:getColor(),size:brushSize,opacity:opacity*intensity,texture,finish,mix});
      gesture.stroke=true;
    }
    active.state.paint[side].at(-1)!.dots.push([hit.uv.x,hit.uv.y]);
    studio.paint(active.state,side);
  } else if (!repeat) {
    active.state.ornaments.push({kind:decor,side,color:getColor(),vertex:nearestVertex(hit.uv),size:.38+brushSize*1.32});
    studio.setState(active.state);
    if (mode === 'decorate') byId<HTMLButtonElement>('remove-ornament').disabled=false;
    audio.chime(decorations.indexOf(decor));
  }
  audio.play(mode);
}
function listenStage() {
  const el = studio.element;
  el.addEventListener('contextmenu',e=>e.preventDefault());
  el.addEventListener('pointerdown',e=>{
    if (activeGesture || (e.button !== 0 && e.button !== 2)) return;
    el.setPointerCapture(e.pointerId);
    el.focus({preventScroll:true});
    byId('keyboard-cursor').hidden=true;
    activeGesture = {pointer:e.pointerId,orbit:e.shiftKey||e.button===2,lastX:e.clientX,lastY:e.clientY,acted:false,stroke:false};
    if (!activeGesture.orbit) apply(e.clientX,e.clientY,activeGesture);
  });
  el.addEventListener('pointermove',e=>{
    const g=activeGesture;
    if (!g || e.pointerId!==g.pointer || Math.hypot(e.clientX-g.lastX,e.clientY-g.lastY)<2) return;
    if (g.orbit) turn((e.clientX-g.lastX)*.012);
    else if (mode !== 'decorate' || !g.acted) apply(e.clientX,e.clientY,g,g.acted);
    g.lastX=e.clientX; g.lastY=e.clientY;
  });
  for (const event of ['pointerup','pointercancel','lostpointercapture']) el.addEventListener(event,e=>{
    if ((e as PointerEvent).pointerId === activeGesture?.pointer) activeGesture=undefined;
  });
  let cursorX=.467,cursorY=.46;
  el.addEventListener('keydown',e=>{
    const cursor=byId('keyboard-cursor');
    const arrows=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'];
    if (!arrows.includes(e.key) && e.code!=='Space') return;
    e.preventDefault();
    const bounds=el.getBoundingClientRect();
    const dx=e.key==='ArrowLeft'?-1:e.key==='ArrowRight'?1:0;
    const dy=e.key==='ArrowUp'?-1:e.key==='ArrowDown'?1:0;
    cursorX=Math.max(.05,Math.min(.94,cursorX+dx*(e.shiftKey?.025:.008)));
    cursorY=Math.max(.09,Math.min(.81,cursorY+dy*(e.shiftKey?.025:.008)));
    const x=bounds.left+bounds.width*cursorX,y=bounds.top+bounds.height*cursorY;
    cursor.style.left=x+'px'; cursor.style.top=y+'px';cursor.hidden=false;
    if (e.code==='Space') apply(x,y,{pointer:-1,orbit:false,lastX:x,lastY:y,acted:false,stroke:false});
  });
  el.addEventListener('blur',()=>{byId('keyboard-cursor').hidden=true;});
}

function show(title: string, content: string) {
  dialogRevision++;
  modalBody.innerHTML=`<div class="dialog-head"><h2 id="dialog-title">${title}</h2><button type="button" id="close-dialog" aria-label="Fechar">${icon('close')}</button></div>${content}`;
  modal.setAttribute('aria-labelledby','dialog-title');
  if (!modal.open) modal.showModal();
  byId('close-dialog').focus();
  on('close-dialog',()=>modal.close());
}
modal.addEventListener('close',()=>{dialogRevision++;});
modal.addEventListener('click',event=>{
  if (event.target===modal) {
    const r=modal.getBoundingClientRect();
    if (event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) modal.close();
  }
});
function settings() {
  show('Luz e câmera',`
    ${range('light','Intensidade da luz',light,.12,1.6)}${range('temperature','Temperatura da luz',temperature)}
    <label class="field">Qualidade<select id="quality"><option value="auto">Adaptativa</option><option value="low">Leve</option><option value="balanced">Equilibrada</option><option value="high">Alta</option></select></label>
    ${studio.theater ? select('movement','Movimento',['Balanço','Dança','Reverência'],studio.movement) : ''}`);
  byId<HTMLSelectElement>('quality').value=quality;
  const adjust=()=>studio.light(light,temperature);
  input('light',el=>{light=el.valueAsNumber; adjust();});
  input('temperature',el=>{temperature=el.valueAsNumber; adjust();});
  changed('quality',value=>{quality=value; studio.quality(value);});
  if (studio.theater) changed('movement',value=>{studio.movement=value; studio.refresh();});
}
function resetView() {
  side=0; studio.targetRotation=Math.round(studio.targetRotation/(2*Math.PI))*2*Math.PI; studio.setState(active.state); syncPanel();
}
function chooseExperience(index: number) {
  experience=index;
  studio.theater=index===5;
  studio.refresh();
  syncPanel();
  if (index===0) modal.close();
  if (index===1) {modal.close(); if (!side) flip();}
  if (index===2) saveDialog();
  if (index===3) polarities();
  if (index===4) social();
  if (index===5) settings();
  if (index===6) task(galleryDialog);
}
function showExperiences() {
  show('Experiências',`<div class="experience-list">${experiences.map(([name,desc],i)=>
    `<button type="button" data-exp="${i}" aria-current="${experience===i}">${name}<small>${desc}</small></button>`
    ).join('')}</div><div class="actions">${button('reflection','Perguntas opcionais')}${button('new-mask','Nova máscara')}</div>`);
  modalBody.querySelectorAll<HTMLButtonElement>('[data-exp]').forEach(el=>el.onclick=()=>chooseExperience(Number(el.dataset.exp)));
  on('reflection',reflection);
  on('new-mask',()=>{
    show('Nova máscara',`<p>A máscara da bancada será substituída. Você pode salvá-la antes de começar.</p>
      <div class="actions">${button('keep-current','Salvar criação')}${button('start-new','Começar nova',true)}</div>`);
    on('keep-current',saveDialog);
    on('start-new',()=>{
      pair[slot]=active=workspace(); resetView(); modal.close(); notify('Nova máscara na bancada');
    });
  });
}
function reflection() {
  show('Perguntas opcionais',`<p>${questions[question]}</p><div class="actions">${button('next-question','Outra pergunta')}${button('skip-question','Dispensar',true)}</div>`);
  on('next-question',()=>{question=(question+1)%questions.length; reflection();});
  on('skip-question',()=>modal.close());
}
function thumbnail() { return studio.image(480).toDataURL('image/jpeg',.78); }
function polarities() {
  if (sceneReady) active.thumbnail=thumbnail();
  show('Polaridades',`<div class="compare">${pair.map((entry,i)=>`<figure>${entry.thumbnail?`<img alt="Máscara ${i+1}" src="${entry.thumbnail}">`:''}<figcaption>${i===slot?'Na bancada':'Máscara '+(i+1)}</figcaption></figure>`).join('')}</div>
    <div class="actions">${button('switch-mask','Trabalhar na máscara '+(slot===0?'2':'1'),true)}${button('perspective','Pergunta opcional')}</div>`);
  on('switch-mask',()=>{slot=slot===0?1:0;active=pair[slot];resetView();modal.close();notify('Máscara '+(slot+1)+' na bancada');});
  on('perspective',()=>{question=4;reflection();});
}
function social() {
  show('Papéis sociais',`<label class="field">Contexto escolhido <input id="social-context" maxlength="100" value="${escape(context)}" placeholder="Por exemplo, em casa ou em um grupo"></label>
    <div class="actions">${button('use-context','Voltar à bancada',true)}</div>`);
  on('use-context',()=>{
    context=byId<HTMLInputElement>('social-context').value.trim();
    if (context) active.description = active.description || context;
    modal.close();
  });
}
function saveDialog() {
  if (!sceneReady) {notify('A bancada ainda está carregando.');return;}
  show('Salvar na galeria',`<form id="save-form">
    <label class="field">Nome da criação <input id="creation-name" required maxlength="80" value="${escape(active.name)}" placeholder="Dê um nome à máscara"></label>
    <label class="field">Descrição opcional <textarea id="creation-description" maxlength="1500">${escape(active.description)}</textarea></label>
    <p>O salvamento fica neste navegador. Salvar novamente registra uma nova versão.</p>
    <div class="actions"><button class="primary" type="submit">Salvar versão</button></div></form>`);
  byId('save-form').addEventListener('submit',event=>{
    event.preventDefault();
    const name=byId<HTMLInputElement>('creation-name').value.trim();
    const description=byId<HTMLTextAreaElement>('creation-description').value.trim();
    if (!name) {notify('Digite um nome para salvar.');return;}
    const submit=byId('save-form').querySelector<HTMLButtonElement>('button[type=submit]')!;
    const workspaceToSave=active;
    const version={id:crypto.randomUUID(),savedAt:Date.now(),state:structuredClone(active.state),thumbnail:thumbnail(),description};
    submit.disabled=true;
    task(async ()=>{
      try {
        await gallery.saveVersion(workspaceToSave.id,name,version);
        workspaceToSave.name=name;
        workspaceToSave.description=description;
        workspaceToSave.thumbnail=version.thumbnail;
        if (submit.isConnected) modal.close();
        notify('Versão salva na galeria');
      } finally {
        submit.disabled=false;
      }
    });
  });
}
const dates = new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'});
async function galleryDialog() {
  show('Galeria pessoal','<p>Carregando criações…</p>');
  const revision=dialogRevision;
  const entries=(await gallery.list()).sort((a,b)=>b.versions[0].savedAt-a.versions[0].savedAt);
  if (!modal.open || dialogRevision!==revision) return;
  show('Galeria pessoal',entries.length ? entries.map((entry,i)=>{
    const current=entry.versions[0];
    return `<article class="gallery-card">
      <img src="${current.thumbnail}" alt="">
      <div><h3>${escape(entry.name)}</h3>${current.description?`<p>${escape(current.description)}</p>`:''}
      <small>${entry.versions.length} ${entry.versions.length===1?'versão':'versões'}</small></div>
      <div class="actions">${button('load-'+i,'Abrir',true)}${button('duplicate-'+i,'Duplicar')}${button('delete-'+i,'Excluir')}</div>
      <details class="versions"><summary>Versões</summary><div class="actions">${entry.versions.map((v,j)=>button('version-'+i+'-'+j,dates.format(v.savedAt))).join('')}</div></details>
    </article>`;
  }).join('') : '<p>As máscaras salvas aparecem aqui.</p>');
  entries.forEach((entry,i)=>{
    const open=(v:gallery.Version)=>confirmLoad(entry,v);
    on('load-'+i,()=>open(entry.versions[0]));
    entry.versions.forEach((v,j)=>on('version-'+i+'-'+j,()=>open(v)));
    on('duplicate-'+i,()=>task(async()=>{
      await gallery.put({id:crypto.randomUUID(),name:entry.name+' (cópia)',versions:[{...entry.versions[0],id:crypto.randomUUID(),savedAt:Date.now()}]});
      await galleryDialog();notify('Criação duplicada');
    }));
    on('delete-'+i,()=>{
      show('Excluir criação',`<p>Excluir “${escape(entry.name)}” e todas as suas versões deste navegador?</p>
        <div class="actions">${button('keep','Cancelar')}${button('erase','Excluir criação',true)}</div>`);
      on('keep',()=>task(galleryDialog));
      on('erase',()=>task(async()=>{await gallery.remove(entry.id);await galleryDialog();notify('Criação excluída');}));
    });
  });
}
function confirmLoad(entry: gallery.Creation,version: gallery.Version) {
  const open=()=>{
    pair[slot]=active={id:entry.id,name:entry.name,description:version.description,state:structuredClone(version.state),thumbnail:version.thumbnail,past:[],future:[]};
    resetView();modal.close();notify('Criação aberta na bancada');
  };
  if (!active.past.length) {open();return;}
  show('Abrir criação',`<p>“${escape(entry.name)}” substituirá a máscara na bancada.</p>
    <div class="actions">${button('cancel-open','Voltar')}${button('open-confirm','Abrir máscara',true)}</div>`);
  on('cancel-open',()=>task(galleryDialog));on('open-confirm',open);
}
function download(data: Blob,extension: string) {
  const url=URL.createObjectURL(data);
  const a=document.createElement('a');
  a.href=url;
  a.download=(active.name||'mascara').replace(/[<>:"/\\|?*]/g,'-')+'.'+extension;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportsDialog() {
  if (!sceneReady) {notify('A bancada ainda está carregando.');return;}
  show('Exportar criação',`<div class="actions">${button('png','Imagem PNG',true)}${button('glb','Modelo GLB')}${button('obj','Malha OBJ')}</div>
    <p>O PNG inclui a cena do ateliê. O GLB inclui a máscara, a pintura e os adornos. O OBJ contém a geometria.</p>`);
  on('png',()=>studio.image().toBlob(blob=>{if (blob) {download(blob,'png');notify('Imagem exportada');}},'image/png'));
  on('glb',()=>task(async()=>{
    const trigger=byId<HTMLButtonElement>('glb');
    trigger.disabled=true;
    try {
      const data=await new GLTFExporter().parseAsync(studio.exportGroup(),{binary:true,maxTextureSize:1024});
      download(new Blob([data as ArrayBuffer],{type:'model/gltf-binary'}),'glb');
      notify('Modelo exportado');
    } finally {trigger.disabled=false;}
  }));
  on('obj',()=>{download(new Blob([new OBJExporter().parse(studio.exportGroup())],{type:'text/plain'}),'obj');notify('Malha exportada');});
}
function help() {
  show('Controles da bancada',`<p>Arraste sobre a máscara para esculpir ou pintar. Em Decorar, toque para colocar um adorno.</p>
    <p>Use Girar ou arraste com Shift ou com o botão direito do mouse. No teclado, use Q e E para girar e I para alternar as faces.</p>
    <p>Com foco na máscara, mova o cursor com as setas e aplique a ferramenta com Espaço. Use Ctrl ou ⌘ + Z para desfazer e Shift + Ctrl ou ⌘ + Z para refazer.</p>`);
}

document.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(el=>el.onclick=()=>{mode=el.dataset.mode as Mode;syncPanel();});
document.querySelectorAll<HTMLButtonElement>('[data-pigment]').forEach((el,i)=>el.onclick=()=>{
  pigment=i;
  if (mode==='sculpt') mode='paint';
  syncPanel();
});
on('disclosure',()=>expandPanel(!panel.classList.contains('expanded')));
on('undo',()=>restore(false));on('redo',()=>restore(true));
on('left',()=>turn(-Math.PI/8));on('right',()=>turn(Math.PI/8));
on('flip',flip);on('help',help);on('experiences',showExperiences);
on('save',saveDialog);on('export',exportsDialog);on('settings',settings);
on('gallery',()=>task(galleryDialog));
on('zoom',()=>byId('zoom').setAttribute('aria-pressed',String(studio.toggleZoom())));
on('sound',()=>task(async()=>{
  const enabled=await audio.toggle();
  const el=byId('sound');
  el.setAttribute('aria-pressed',String(enabled));
  el.innerHTML=icon(enabled?'sound':'muted')+'<span>Som</span>';
  notify(enabled?'Som ligado':'Som desligado');
}));
document.addEventListener('keydown',e=>{
  if (modal.open || (e.target instanceof Element && e.target.closest('input,textarea,select,summary'))) return;
  const key=e.key.toLowerCase();
  if ((e.ctrlKey||e.metaKey) && (key==='z'||key==='y')) {
    e.preventDefault();restore(e.shiftKey||key==='y');return;
  }
  if (e.ctrlKey||e.metaKey||e.altKey) return;
  if (key==='q') turn(-Math.PI/8);
  if (key==='e') turn(Math.PI/8);
  if (key==='i') flip();
});
small.addEventListener('change',()=>expandPanel(false));
expandPanel(false);
syncPanel();
studio.setState(active.state);
task(async()=>{
  try {
    await studio.init();
    studio.quality(quality);
    listenStage();
    sceneReady=true;
    byId('loading').hidden=true;
  } catch (error) {
    byId('loading').textContent='A aceleração 3D não está disponível. Abra em um navegador com WebGPU ou WebGL 2.';
    throw error;
  }
});
