import { regions, sensations, type Region, type Sensation, type Intensity } from './content.ts';

export interface Entry {
  regionIds: Region[];
  sensationIds: Sensation[];
  customWord: string;
  intensity: Intensity;
}
export const empty = (): Entry => ({ regionIds: [], sensationIds: [], customWord: '', intensity: null });
export const hasContent = (e: Entry) => Boolean(e.regionIds.length || e.sensationIds.length || e.customWord.trim() || e.intensity !== null);
export const toggle = <T>(list: T[], id: T): T[] => list.includes(id) ? list.filter(item => item !== id) : [...list, id];
export const isRegion = (id: unknown): id is Region => typeof id === 'string' && Object.hasOwn(regions, id);
export const isSensation = (id: unknown): id is Sensation => typeof id === 'string' && Object.hasOwn(sensations, id);
export function validIntensity(value: unknown): value is Intensity {
  return value === null || value === 'unknown' || (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 4);
}
export function readEntries(raw: unknown): Entry[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap(row => {
    if (!row || !Array.isArray(row.regionIds) || !Array.isArray(row.sensationIds)) return [];
    const entry: Entry = {
      regionIds: [...new Set<Region>(row.regionIds.filter(isRegion))],
      sensationIds: [...new Set<Sensation>(row.sensationIds.filter(isSensation))],
      customWord: typeof row.customWord === 'string' ? row.customWord.slice(0, 80) : '',
      intensity: validIntensity(row.intensity) ? row.intensity : null,
    };
    return hasContent(entry) ? [entry] : [];
  });
}
