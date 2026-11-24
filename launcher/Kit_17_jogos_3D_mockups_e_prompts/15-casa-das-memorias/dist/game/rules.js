import {slots,         } from './content.js';
export const limit=(n       ,min       ,max       )=>Math.max(min,Math.min(max,n));
                                          
export function allocate(items                          ,room     ,visibility           ,except=-1){
 return slots.find(s=>s.room===room&&s.visibility===visibility&&items.filter(x=>x.id!==except&&x.slot===s.id).length<s.capacity);
}
