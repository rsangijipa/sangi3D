import * as T from '/Sistema/shared/vendor/three.module.js';
import { LifecycleManager } from '/Sistema/shared/engine/lifecycle.js';
import { createGallery } from './gallery.js';

const get = id => document.getElementById(id);
const names = ['Mostarda','Terracota','Verde'];
const positions = [[-1.46,.08],[.08,-.99],[1.44,.32]];
const exhibits = [
  {person:0, divider:0, boxX:.43, kind:'now', hint:'Mova a divisória e compare sua posição com a linha de visão.'},
  {person:2, divider:.45, boxX:.42, kind:'now', hint:'Compare Verde e Mostarda com a caixa no mesmo lugar.'},
  {person:0, divider:0, boxX:.44, kind:'before', initialSeen:[0], hint:'Mostarda observou a caixa antes de ela mudar de lado.'},
  {person:2, divider:0, boxX:-.42, kind:'heard', hint:'Use “Contar sobre a caixa” para registrar um relato para o observador escolhido.'},
  {person:1, divider:0, boxX:.48, kind:'absent', absent:1, hint:'Terracota saiu da vitrine. Não há registro do que aconteceu antes.'},
  {person:1, divider:-.56, boxX:.43, kind:'now', hint:'A caixa pode estar visível para uma pessoa, mesmo quando outra tem a visão bloqueada.'},
];
let index=0;
let free=false;
let review=false;
let accepted=false;
let answers=[];
let state;
let gallery;
const ray=new T.Ray();
const slab=new T.Box3();
const hit=new T.Vector3();
const direction=new T.Vector3();
const target=new T.Vector3();
const eyes=positions.map(([x,z])=>{
  const forward=new T.Vector3(-x,0,.21-z).normalize();
  return {forward, position:new T.Vector3(x,1.561,z).addScaledVector(forward,.15)};
});

function blockedDistance(origin, heading, max, config=state) {
  slab.min.set(config.divider-.041,1.257,-.358);
  slab.max.set(config.divider+.041,1.897,.468);
  ray.set(origin,heading);
  let distance=ray.intersectBox(slab,hit) ? Math.min(max,hit.distanceTo(origin)) : max;
  slab.min.set(-.81,1.151,-.46);
  slab.max.set(.81,1.251,.74);
  if(ray.intersectBox(slab,hit)) distance=Math.min(distance,hit.distanceTo(origin));
  return distance;
}
function sees(person, config=state) {
  if (person===config.absent) return false;
  const {forward,position}=eyes[person];
  return [[0,.19,0],[-.18,.242,-.15],[-.18,.242,.15],[.18,.242,-.15],[.18,.242,.15]].some(([x,y,z])=>{
    target.set(config.boxX+x,1.258+y,.29+z);
    direction.copy(target).sub(position);
    const length=direction.length();
    direction.normalize();
    const horizontal=Math.hypot(direction.x,direction.z);
    return length<=3.6 && direction.dot(forward)/horizontal>=Math.cos(.475) &&
      blockedDistance(position,direction,length,config)>=length-.002;
  });
}
function load(i, isFree=false) {
  index=i;
  free=isFree;
  review=false;
  accepted=false;
  const item=exhibits[i];
  state={person:item.person, divider:item.divider, boxX:item.boxX, pov:false,
    absent:isFree ? undefined : item.absent, seen:new Set(isFree ? [] : item.initialSeen), heard:new Set()};
  update();
}
function selectPerson(i) {
  if (!review && i!==state.person) {
    state.person=i;
    state.pov=false;
    accepted=false;
    update();
  }
}
function remember() {
  positions.forEach((_,person)=>{ if(sees(person)) state.seen.add(person); });
}
function changeDivider(value) {
  remember();
  state.divider=Number(value)*.008;
  accepted=false;
  update();
}
function choicesFor() {
  const item=exhibits[index];
  if (!free && item.kind==='before') return [
    ['VIU_ANTES','Viu a caixa antes',state.seen.has(state.person)],
    ['OUVIU','Só ouviu contar',!state.seen.has(state.person)&&state.heard.has(state.person)],
    ['INCERTO','Não dá para saber',!state.seen.has(state.person)&&!state.heard.has(state.person)],
  ];
  if (!free && item.kind==='heard') return [
    ['VIU','Vê agora',sees(state.person)],
    ['OUVIU','Ouviu o relato',state.heard.has(state.person)],
    ['INCERTO','Não há relato registrado',!state.heard.has(state.person)&&!sees(state.person)],
  ];
  return [
    ['VIU','Vê a caixa agora',sees(state.person)],
    ['BLOQUEADO','A divisória bloqueia a visão',state.person!==state.absent&&!sees(state.person)],
    ['INCERTO','Não dá para saber',state.person===state.absent],
  ];
}
function question() {
  const name=names[state.person];
  const kind=free?'now':exhibits[index].kind;
  if (kind==='before') return 'Que evidência existe de antes para '+name+'?';
  if (kind==='heard') return 'Que evidência foi registrada para '+name+'?';
  return 'O que '+name+' consegue ver agora?';
}
function evidence() {
  if (state.person===state.absent) return 'O observador está ausente e o passado não foi registrado.';
  const current=sees(state.person) ? 'A caixa está no campo de visão.' : 'A divisória cobre a caixa nesta posição.';
  const seen=state.seen.has(state.person) ? ' Há registro de visão anterior.' : '';
  const heard=state.heard.has(state.person) ? ' Há um relato registrado.' : '';
  return current+seen+heard;
}
function offerChoices() {
  get('choices').replaceChildren(...choicesFor().map(([key,label],i)=>{
    const button=document.createElement('button');
    button.id='ans-'+(i+1);
    button.textContent=label;
    button.setAttribute('aria-pressed','false');
    button.addEventListener('click',()=>{
      const correct=choicesFor().find(([choice])=>choice===key)?.[2];
      const intended=free||state.person===exhibits[index].person;
      accepted=Boolean(correct&&intended);
      if(accepted&&!free) answers[index]=[label,evidence()];
      get('result-msg').textContent=(accepted?'Registrado. ':correct?'Compare também com o observador desta vitrine. ':'Confira a evidência. ')+evidence();
      for (const option of get('choices').children) option.setAttribute('aria-pressed',String(option===button));
      get('next').disabled=free||!accepted;
    });
    return button;
  }));
}
function update(message='') {
  const present=state.person!==state.absent;
  gallery?.update({...state,present},blockedDistance);
  get('progress').textContent=free?'VITRINE LIVRE':'VITRINE '+(index+1)+' DE '+exhibits.length;
  get('brief').textContent=free?'Mude a caixa e a divisória. Compare o que cada observador consegue ver.':
    'Observe '+names[exhibits[index].person]+'. '+exhibits[index].hint;
  get('view-label').textContent=state.pov?'Visão de '+names[state.person]:'Vista da galeria';
  get('q-text').textContent=question();
  get('btn-pov').textContent=state.pov?'Voltar à vista da galeria':'Ver pelos olhos do observador';
  get('btn-pov').setAttribute('aria-pressed',String(state.pov));
  get('btn-pov').disabled=!present;
  get('tell').disabled=!present||state.heard.has(state.person);
  get('move-box').disabled=false;
  get('sl-divider').disabled=false;
  get('sl-divider').value=Math.round(state.divider/.008);
  get('lbl-divider').textContent=state.divider<-.08?'Esquerda':state.divider>.08?'Direita':'Centro';
  get('result-msg').textContent=message || (present?'Selecione uma resposta para conferir a evidência.':'O observador não está presente.');
  get('mode').textContent=free?'Voltar às vitrines':'Explorar livremente';
  get('next').textContent=index===exhibits.length-1?'Rever evidências':'Próxima vitrine';
  get('next').disabled=free||!accepted;
  for (const button of document.querySelectorAll('[data-person]')) {
    button.disabled=false;
    button.setAttribute('aria-pressed',String(Number(button.dataset.person)===state.person));
  }
  offerChoices();
}
function showReview() {
  review=true;
  get('progress').textContent='REVISÃO';
  get('brief').textContent='As escolhas que você verificou nas seis vitrines.';
  get('q-text').textContent='Evidências registradas';
  get('choices').replaceChildren(...answers.map(([choice,detail],i)=>{
    const summary=document.createElement('p');
    summary.textContent=(i+1)+'. '+choice+'. '+detail;
    return summary;
  }));
  for (const button of document.querySelectorAll('[data-person], #btn-pov, #move-box, #tell, #sl-divider')) button.disabled=true;
  get('result-msg').textContent='Explore a vitrine livre ou percorra a coleção de novo.';
  get('next').disabled=false;
  get('next').textContent='Recomeçar';
}
for (const button of document.querySelectorAll('[data-person]')) button.addEventListener('click',()=>selectPerson(Number(button.dataset.person)));
get('btn-pov').addEventListener('click',()=>{
  state.pov=!state.pov;
  update();
});
get('sl-divider').addEventListener('input',event=>changeDivider(event.target.value));
get('move-box').addEventListener('click',()=>{
  remember();
  state.boxX=state.boxX<0?.43:-.43;
  accepted=false;
  update('A caixa mudou de lado. O que foi visto antes fica registrado.');
});
get('tell').addEventListener('click',()=>{
  state.heard.add(state.person);
  accepted=false;
  update(names[state.person]+' recebeu um relato sobre a caixa.');
});
let guidedIndex=0;
get('mode').addEventListener('click',()=>{
  if(free) load(guidedIndex);
  else {
    guidedIndex=review?0:index;
    load(index,true);
  }
});
get('next').addEventListener('click',()=>{
  if(review) { answers=[]; load(0); }
  else if(index===exhibits.length-1) showReview();
  else load(index+1);
});
document.addEventListener('keydown',event=>{
  if (!review&&event.key==='Escape'&&state.pov) get('btn-pov').click();
});
try {
  gallery=createGallery(get('canvas-container'),selectPerson);
} catch(error) {
  if (error.message!=='Error creating WebGL context.') console.error(error);
  get('scene-status').textContent='Vitrine 3D indisponível. Compare as evidências pelo painel.';
  get('scene-status').hidden=false;
}
const lifecycle=new LifecycleManager({
  onPause:()=>gallery?.pause(true), onResume:()=>gallery?.pause(false), dispose:()=>gallery?.dispose(),
});
addEventListener('pagehide',event=>{if(!event.persisted) lifecycle.dispose();});
load(0);
