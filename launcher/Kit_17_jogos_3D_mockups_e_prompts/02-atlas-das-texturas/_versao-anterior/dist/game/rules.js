export const clamp = (value       ,min       ,max       ) => Number.isFinite(value) ? Math.min(max,Math.max(min,value)) : min;
export function random(seed       ) {
 return () => { seed = (Math.imul(seed,1664525)+1013904223) >>> 0; return seed / 4294967296; };
}
