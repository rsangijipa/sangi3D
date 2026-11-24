import {config} from './content';
import {entity,clamp} from '../core/types';
import type {GameState,Command,SceneState} from '../core/types';
export function initial(preset=0):GameState{
 const s:SceneState={entities:[],values:{selected:0,light:1,wind:.35,running:0,progress:0},strings:{},heights:[],wet:[],links:[]};
 switch(config.kind){
 case 7:s.entities=[entity('chair0','linen',-1.8,0,.1,'Lugar 1'),entity('chair1','wood',0,0,-1.2,'Lugar 2'),entity('chair2','velvet',1.8,0,.1,'Lugar 3')];s.entities[0].angle=.36;s.entities[2].angle=-.36;if(preset===1)s.entities.splice(2);if(preset===2)s.entities.forEach((e,i)=>{e.x=Math.cos(i*2.094)*2;e.z=Math.sin(i*2.094)*2;e.angle=(-i*2.094)||0});break;
 case 8:s.values={...s.values,heat:.25,rotation:0,spinning:1,pressure:.4,color:preset,ring:10,finished:0};s.heights=Array.from({length:25},(_,i)=>.18+Math.sin(i/24*Math.PI)*(.25+preset*.07));break;
 case 9:s.entities=Array.from({length:3},(_,i)=>entity('cloth'+i,'cloth',-1.8+i*1.8,3.4,-1.2+i*.55));s.values={...s.values,wind:[.35,0,.7][preset],cut:0};s.strings.cut='';break;
 case 10:{const cases=[['Uma mensagem não foi respondida.','A mensagem foi enviada às 10h.','Não houve resposta até agora.','Talvez a pessoa esteja ocupada.','Não sabemos se ela leu.'],['Um colega passou sem cumprimentar.','O corredor estava cheio.','Ele estava olhando para o chão.','Talvez ele não tenha me visto.','Não sabemos o que ele estava pensando.'],['Uma tarefa voltou com anotações.','Há três sugestões no documento.','O prazo continua o mesmo.','Talvez sejam ajustes de apresentação.','Podemos perguntar o que deve mudar.']][preset];s.strings.case=cases[0];s.entities=cases.slice(1).map((t,i)=>entity('card'+i,'pendente',-1.55+(i%2)*2.9,1.3-Math.floor(i/2)*.7,-1.7,t));break;}
 case 11:s.values={...s.values,frequency:[12,48,83][preset],volume:.3,activity:0};s.strings.message='Estou notando um pensamento.';break;
 case 12:s.entities=[entity('ball','sphere',0,2.85,-1.72)];s.values={...s.values,switch:preset%2,prediction:-1,released:0,result:-1,progress:0,replay:0,obstacles:preset};break;
 case 13:s.values={...s.values,destination:preset%2,route:0,blocked:preset===1?1:0,signal:1,running:0,progress:0,secondTrain:preset===2?1:0,arrivals:0};break;
 case 14:s.entities=[entity('task0','atividade',8,0,0,'Criar'),entity('task1','atividade',11,0,0,'Pausa'),entity('task2','atividade',14,0,0,'Explorar')];s.entities[0].value=[2,3,1][preset];s.entities[1].value=1;s.entities[2].value=2;s.values={...s.values,running:0,hour:8,speed:1,exploded:0};break;
 case 15:s.values={...s.values,beam:0,target:preset,marked:-1,count:5,intensity:.7,fog:.25,contrast:0};s.entities=Array.from({length:5},(_,i)=>entity('boat'+i,['listras','vela','bandeira','listras','vela'][i],Math.cos(i*1.25)*9,0,Math.sin(i*1.25)*9));break;
 case 16:s.entities=Array.from({length:4},(_,i)=>entity('balloon'+i,'balloon',-6+i*4,4+(i%2)*2,-4-i*3,''));s.values={...s.values,walk:0,wind:[.25,.5,.1][preset],retain:1};break;
 case 17:s.entities=[entity('sailboat','boat',0,0,0)];s.values={...s.values,sail:[.45,.75,.2][preset],rudder:0,heading:0,wind:1,windAngle:.9,anchored:1,speed:0,destination:preset,travel:0};s.strings.destination=['Cuidado','Aprendizagem','Conexão'][preset];break;
 case 18:s.heights=new Array(65*65).fill(0);s.wet=new Array(65*65).fill(0);s.entities=[entity('stone0','stone',-1,1.02,-.5),entity('stone1','stone',1.1,1.02,.5)];s.values={...s.values,erosion:0,brush:.22,tool:0,wind:0};if(preset!==0)for(let i=0;i<65*65;i++){const x=i%65-32,z=Math.floor(i/65)-32;s.heights[i]=preset===1?Math.sin(Math.sqrt(x*x+z*z)*1.2)*.025:Math.cos(x*.5)*.02}break;
 }
 return {version:1,seed:1731,mode:'livre',phase:'explore',preset,settings:{reducedMotion:false,snap:false},sceneState:s,observations:[]};
}
export function canPlace(s:SceneState,id:string,x:number,z:number,r=.7){return Math.abs(x)<3.6&&Math.abs(z)<2.6&&s.entities.every(e=>e.id===id||Math.hypot(e.x-x,e.z-z)>r*2)}
export function overlap(a:{x:number;value:number},b:{x:number;value:number}){return a.x<b.x+b.value&&b.x<a.x+a.value}
export function reduce(state:GameState,c:Command){const s=state.sceneState,v=s.values,e=s.entities.find(e=>e.id===c.id),n=c.value??0;
 if(c.type==='value'){if(!c.id||!Number.isFinite(n))return false;v[c.id]=clamp(n,-1000,1000);return true}
 if(c.type==='text'){if(!c.id)return false;s.strings[c.id]=(c.text??'').slice(0,160);return true}
 if(c.type==='select'){if(n<0||n>=Math.max(1,s.entities.length))return false;v.selected=n;return true}
 if(c.type==='label'){if(!e)return false;e.label=(c.text??'').slice(0,160);return true}
 if(c.type==='move'){if(!e||!Number.isFinite(c.x)||!Number.isFinite(c.z))return false;if(config.kind===7&&!canPlace(s,e.id,c.x!,c.z!))return false;e.x=clamp(c.x!,-12,12);e.z=clamp(c.z!,-12,12);if(c.y!==undefined)e.y=clamp(c.y,.05,4);return true}
 if(c.type==='rotate'){if(!e)return false;e.angle+=n;return true}
 switch(config.kind){
 case 7:if(c.type==='add'&&s.entities.length<6){const i=s.entities.length;let x=0,z=1.8;if(!canPlace(s,'new',x,z,.55)){x=-3;z=1.8}if(!canPlace(s,'new',x,z,.5))return false;s.entities.push(entity('chair'+state.seed++,['linen','wood','velvet'][i%3],x,0,z,'Lugar '+(i+1)));return true}if(c.type==='remove'&&e&&s.entities.length>1){s.entities=s.entities.filter(a=>a!==e);v.selected=0;return true}break;
 case 8:if(c.type==='heat'){v.heat=clamp(v.heat+n,0,1);return true}if(c.type==='expand'){if(v.heat<.3||v.finished)return false;for(let i=1;i<s.heights.length-1;i++)s.heights[i]=clamp(s.heights[i]+Math.sin(i/(s.heights.length-1)*Math.PI)*n*v.heat,.07,.95);v.heat=clamp(v.heat-.025,0,1);return true}if(c.type==='shape'){if(v.heat<.25||v.finished)return false;const ring=Math.round(c.extra??v.ring);for(let i=1;i<s.heights.length-1;i++){const w=Math.exp(-Math.pow((i-ring)/2.8,2));s.heights[i]=clamp(s.heights[i]+n*w*v.heat,.065,.95)}return true}if(c.type==='cool'){v.heat=0;v.finished=1;return true}break;
 case 9:if(c.type==='cut'){const i=Math.round(v.selected);const key=i+':'+Math.round(c.value??9);const cuts=s.strings.cut.split(',').filter(Boolean);if(cuts.length>=12||cuts.includes(key))return false;cuts.push(key);s.strings.cut=cuts.join(',');return true}break;
 case 10:if(c.type==='classify'&&e){if(!['Fato','Interpretação','Falta saber','Hipótese'].includes(c.text??''))return false;e.type=c.text!;return true}if(c.type==='link'&&e){const other=s.entities[Math.round(n)];if(!other||other===e||s.links.some(l=>l.a===e.id&&l.b===other.id))return false;s.links.push({a:e.id,b:other.id});return true}if(c.type==='new'){if(s.entities.length>=12)return false;s.entities.push(entity('hyp'+state.seed++,'Hipótese',0,2,-1.7,c.text||'Uma hipótese a investigar'));return true}break;
 case 11:if(c.type==='tune'){v.frequency=clamp(n,0,100);return true}if(c.type==='activity'){v.activity=clamp(v.activity+1,0,9);return true}break;
 case 12:if(c.type==='release'){if(v.released)return false;v.released=1;v.result=-1;v.progress=0;return true}if(c.type==='resetBall'){v.released=0;v.result=-1;v.progress=0;s.entities[0].x=0;s.entities[0].y=2.85;s.entities[0].z=-1.72;v.vx=v.vy=v.vz=0;return true}if(c.type==='switch'&&!v.released){v.switch=1-v.switch;return true}break;
 case 13:if(c.type==='start'){if(v.blocked&&v.route===0)return false;if(v.signal===0)return false;v.running=1;return true}if(c.type==='switch'){if(v.running&&v.progress>.3&&v.progress<.7)return false;v.route=1-v.route;return true}if(c.type==='block'){v.blocked=1-v.blocked;if(v.blocked&&v.route===0)v.running=0;return true}break;
 case 14:if(c.type==='duration'&&e){e.value=clamp(n,.25,12);return true}if(c.type==='startTime'&&e){e.x=clamp(n,0,24-e.value);return true}if(c.type==='new'){if(s.entities.length>=12)return false;s.entities.push({...entity('task'+state.seed++,'atividade',8,0,0,c.text||'Nova atividade'),value:1});return true}if(c.type==='rest'){s.entities.push({...entity('rest'+state.seed++,'descanso',n||12,0,0,'Descanso'),value:1});return true}break;
 case 15:if(c.type==='mark'){const i=Math.round(n);if(i<0||i>=v.count)return false;v.marked=i;return true}if(c.type==='criterion'){v.target=(v.target+1)%3;v.marked=-1;return true}break;
 case 16:if(c.type==='add'){if(s.entities.length>=8)return false;s.entities.push(entity('balloon'+state.seed++,'balloon',0,4,-3,c.text??''));return true}if(c.type==='walk'){v.walk=clamp(v.walk+1,0,6);return true}break;
 case 17:if(c.type==='anchor'){v.anchored=1-v.anchored;if(v.anchored)v.speed=0;return true}break;
 case 18:if(c.type==='brush'){const x=c.x??0,z=c.z??0,tool=Math.round(v.tool),r=v.brush;for(let iz=0;iz<65;iz++)for(let ix=0;ix<65;ix++){const wx=(ix/64-.5)*4.6,wz=(iz/64-.5)*3.2;if(s.entities.some(e=>Math.hypot(wx-e.x,wz-e.z)<.38))continue;const d=Math.hypot(wx-x,wz-z);if(d>r)continue;const idx=iz*65+ix,w=(1-d/r);if(tool===1)s.wet[idx]=clamp(s.wet[idx]+w*.15,0,1);else if(tool===2)s.heights[idx]*=1-w*.4;else s.heights[idx]=clamp(s.heights[idx]+Math.cos((wx-x)*70)*w*.016,-.12,.12)}return true}if(c.type==='stone'){if(s.entities.length>=7)return false;s.entities.push(entity('stone'+state.seed++,'stone',c.x??0,1.02,c.z??0));return true}break;
 }
 return false;
}
