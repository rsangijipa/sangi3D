import {slots,type Room} from './content.ts';
export const limit=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
export type Visibility='visible'|'stored';
export function allocate(items:{slot:string;id:number}[],room:Room,visibility:Visibility,except=-1){
 return slots.find(s=>s.room===room&&s.visibility===visibility&&items.filter(x=>x.id!==except&&x.slot===s.id).length<s.capacity);
}
