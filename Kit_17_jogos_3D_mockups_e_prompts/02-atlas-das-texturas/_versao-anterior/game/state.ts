import { samples, descriptors, preferences, type SampleId } from './content.ts';
import { clamp } from './rules.ts';
export type Mode = 'livre'|'guiado'|'acompanhado';
export type Entry = {id:SampleId; descriptors:string[]; preference:string};
export type State = ReturnType<typeof initial>;
export function initial(seed = 42) {
 return {version:1,seed,mode:'livre' as Mode,stage:0,started:false,paused:false,
 pool:samples.map(([id])=>id), pair:['cork','slate'] as SampleId[], sampleId:'cork' as SampleId,
 rotation:0,lampAngle:-46,lampElevation:28,magnifierPos:[0,0],zoom:1,
 collection:[] as Entry[],descriptors:[] as string[],preference:'',reduced:false,muted:true,
 pauses:0,skips:0,hints:0,activeMs:0 };
}
export type Action = {type:'start';mode:Mode;pool:SampleId[]} | {type:'select'|'pair'|'remove';id:SampleId} |
 {type:'stage'|'rotate'|'light'|'elevation'|'zoom';value:number} | {type:'move';x:number;z:number} |
 {type:'describe'|'prefer';value:string} | {type:'save'|'pause'|'resume'|'reset'|'skip'|'hint'|'motion'|'mute'} |
 {type:'tick';ms:number};
export function reduce(s:State,a:Action):State {
 if(a.type==='reset') return {...initial(s.seed),reduced:s.reduced,muted:s.muted};
 if(a.type==='resume') return {...s,paused:false};
 if(a.type==='motion') return {...s,reduced:!s.reduced};
 if(a.type==='mute') return {...s,muted:!s.muted};
 if(s.paused) return s;
 switch(a.type) {
 case 'start': {const pool = a.mode==='acompanhado' ? [...new Set(a.pool)].filter(id=>s.pool.includes(id)) : s.pool;
 if(pool.length<2 || (a.mode==='acompanhado' && pool.length>4)) return s;
 return {...s,mode:a.mode,pool,pair:pool.slice(0,2),sampleId:pool[0],started:true};}
 case 'pause': return {...s,paused:true,pauses:s.pauses+1};
 case 'tick': return s.started && s.stage<5 ? {...s,activeMs:s.activeMs+clamp(a.ms,0,500)} : s;
 case 'stage': return {...s,stage:Math.round(clamp(a.value,0,5))};
 case 'skip': return {...s,stage:Math.min(s.stage+1,5),skips:s.skips+1};
 case 'hint': return {...s,hints:s.hints+1};
 case 'select': return s.pool.includes(a.id) ? {...s,sampleId:a.id,pair:[a.id,s.pair.find(id=>id!==a.id) ?? s.pool.find(id=>id!==a.id)!],descriptors:[],preference:''} : s;
 case 'pair': return s.pool.includes(a.id) && a.id!==s.sampleId ? {...s,pair:[s.sampleId,a.id]} : s;
 case 'rotate': return {...s,rotation:(s.rotation+clamp(a.value,-360,360))%360};
 case 'light': return {...s,lampAngle:clamp(a.value,-75,75)};
 case 'elevation': return {...s,lampElevation:clamp(a.value,15,65)};
 case 'zoom': return {...s,zoom:clamp(a.value,1,3)};
 case 'move': return {...s,magnifierPos:[clamp(a.x,-.75,.75),clamp(a.z,-.5,.5)]};
 case 'describe': return descriptors.includes(a.value) ? {...s,descriptors:s.descriptors.includes(a.value) ? s.descriptors.filter(d=>d!==a.value) : [...s.descriptors,a.value]} : s;
 case 'prefer': return a.value==='' || preferences.includes(a.value) ? {...s,preference:a.value} : s;
 case 'save': return {...s,collection:[...s.collection.filter(e=>e.id!==s.sampleId),{id:s.sampleId,descriptors:[...s.descriptors],preference:s.preference}]};
 case 'remove': return {...s,collection:s.collection.filter(e=>e.id!==a.id)};
 }
}

