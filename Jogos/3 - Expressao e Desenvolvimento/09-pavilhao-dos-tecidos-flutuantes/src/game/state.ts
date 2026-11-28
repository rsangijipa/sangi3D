import type { GameState,Command } from '../core/types';
import { initial, reduce } from './rules';
export class Store {
  state:GameState;past:GameState[]=[];future:GameState[]=[];listeners:(()=>void)[]=[];
  constructor(){this.state=initial(0)}
  checkpoint(){this.past.push(structuredClone(this.state));if(this.past.length>32)this.past.shift();this.future=[]}
  dispatch(c:Command){const next=structuredClone(this.state);if(!reduce(next,c))return false;this.checkpoint();this.state=next;this.changed();return true}
  undo(){const s=this.past.pop();if(!s)return;this.future.push(structuredClone(this.state));this.state=s;this.changed()}
  redo(){const s=this.future.pop();if(!s)return;this.past.push(structuredClone(this.state));this.state=s;this.changed()}
  reset(preset=0){this.checkpoint();const mode=this.state.mode;this.state=initial(preset);this.state.mode=mode;this.changed()}
  changed(){for(const f of this.listeners)f()}
  load(s:GameState){if(s.version!==1||!s.sceneState||!Array.isArray(s.sceneState.entities)||s.sceneState.entities.length>64||!Array.isArray(s.sceneState.heights)||s.sceneState.heights.length>18000||!s.sceneState.heights.every(Number.isFinite)||!s.sceneState.entities.every(e=>[e.x,e.y,e.z,e.angle,e.value].every(Number.isFinite)&&typeof e.id==='string'&&typeof e.label==='string')||!Object.values(s.sceneState.values).every(Number.isFinite))throw Error('Arquivo de sessão incompatível');this.checkpoint();this.state=structuredClone(s);this.changed()}
}
