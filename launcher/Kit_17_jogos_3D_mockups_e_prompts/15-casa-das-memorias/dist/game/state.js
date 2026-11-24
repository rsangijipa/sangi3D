import {roomKeys,kinds,                   } from './content.js';
import {allocate,limit,               } from './rules.js';
                                                                                                                      
                                             
export function initial(){return {version:1,seed:15,stage:0,mode:'livre',story:false,room:'studio'        ,focused:false,muted:true,reduced:false,paused:false,finished:false,drawer:false,caseOpen:false,draft:null                                             ,tokens:[]           ,show:[]            ,nextId:1,saveConsent:false,skipCount:0,activeMs:0};}
                                                                                                                                                                                                                                                                                                                                                                                                                                                         
export function reduce(s      ,a       )      {
 if(a.type==='reset')return {...initial(),reduced:s.reduced,muted:s.muted};
 if(a.type==='resume')return {...s,paused:false};
 if(s.paused)return s;
 switch(a.type){
 case 'start':return {...s,mode:a.mode,story:a.story,stage:1,finished:false};
 case 'room':return roomKeys.includes(a.room)?{...s,room:a.room,focused:true}:s;
 case 'home':return {...s,focused:false};
 case 'symbol':return kinds.includes(a.kind)?{...s,draft:{type:a.kind,label:'',drawing:[]},stage:2,focused:true}:s;
 case 'label':return s.draft?{...s,draft:{...s.draft,label:a.label.slice(0,55)}}:s;
 case 'drawing':return s.draft?{...s,draft:{...s.draft,drawing:a.drawing}}:s;
 case 'stage':return {...s,stage:limit(a.stage,0,5),finished:false};
 case 'skip':return {...s,stage:Math.min(s.stage+1,5),draft:s.stage===3?null:s.draft,skipCount:s.skipCount+1};
 case 'place':{
  if(!s.draft)return s;
  const room=a.visibility==='stored'?(s.room==='storage'?'storage':'studio'):s.room;
  const slot=allocate(s.tokens,room,a.visibility);if(!slot)return s;
  const entry={...s.draft,label:s.draft.label.trim(),id:s.nextId,room,slot:slot.id,visibility:a.visibility};
  return {...s,room,focused:true,drawer:s.drawer||a.visibility==='stored'&&room==='studio',caseOpen:s.caseOpen||a.visibility==='stored'&&room==='storage',tokens:[...s.tokens,entry],nextId:s.nextId+1,draft:null,stage:4};
 }
 case 'move':{
  const token=s.tokens.find(x=>x.id===a.id);if(!token)return s;
  const slot=allocate(s.tokens,a.room,a.visibility,a.id);if(!slot)return s;
  return {...s,tokens:s.tokens.map(x=>x.id===a.id?{...x,room:a.room,slot:slot.id,visibility:a.visibility}:x),show:s.show.filter(id=>id!==a.id),room:a.room,focused:true,drawer:s.drawer||a.visibility==='stored'&&a.room==='studio',caseOpen:s.caseOpen||a.visibility==='stored'&&a.room==='storage'};
 }
 case 'delete':return {...s,tokens:s.tokens.filter(x=>x.id!==a.id),show:s.show.filter(id=>id!==a.id)};
 case 'show':return s.tokens.some(x=>x.id===a.id)?{...s,show:s.show.includes(a.id)?s.show.filter(id=>id!==a.id):[...s.show,a.id]}:s;
 case 'drawer':return {...s,drawer:!s.drawer};
 case 'case':return {...s,caseOpen:!s.caseOpen};
 case 'pause':return {...s,paused:true};
 case 'mute':return {...s,muted:!s.muted};
 case 'motion':return {...s,reduced:!s.reduced};
 case 'finish':return {...s,finished:true,draft:null};
 case 'tick':return s.stage>0&&!s.finished?{...s,activeMs:s.activeMs+limit(a.ms,0,500)}:s;
 }
}
export const visibleReview=(s      )=>s.tokens.filter(t=>s.show.includes(t.id));

