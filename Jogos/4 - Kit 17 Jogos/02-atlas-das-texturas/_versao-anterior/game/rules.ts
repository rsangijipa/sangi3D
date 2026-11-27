export const clamp = (value:number,min:number,max:number) => Number.isFinite(value) ? Math.min(max,Math.max(min,value)) : min;
export function random(seed:number) {
 return () => { seed = (Math.imul(seed,1664525)+1013904223) >>> 0; return seed / 4294967296; };
}
