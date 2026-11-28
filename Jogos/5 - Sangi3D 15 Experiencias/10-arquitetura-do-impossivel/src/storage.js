import { CONFIG } from './config.js';

/**
 * Persistência versionada localStorage + validação estrita na importação JSON.
 */
export function defaultSavedState() {
  return {
    schemaVersion: CONFIG.schemaVersion,
    fov: CONFIG.defaultFov,
    quality: null,
    smoothTransitions: true,
    reducedMotion: false,
    freeRoam: true,
    volumeMaster: 0.8,
    volumeAmbient: 0.7,
    volumeSfx: 0.9,
    visitedRooms: ['hub'],
    discoveries: [],
    bridgePosition: 1,
    bridgeAligned: false,
    bridgeCrossed: false,
    galleryPosition: 1,
    galleryAligned: false,
    mirrorInspected: false,
    panoramicUnlocked: false,
    roomId: 'hub',
  };
}

export function validateState(raw) {
  if (!raw || typeof raw !== 'object') throw new Error('JSON inválido.');
  if (raw.schemaVersion !== CONFIG.schemaVersion) {
    throw new Error('Versão de esquema incompatível.');
  }
  const base = defaultSavedState();
  const num = (v, min, max, fallback) =>
    typeof v === 'number' && Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : fallback;

  return {
    schemaVersion: CONFIG.schemaVersion,
    fov: num(raw.fov, CONFIG.minFov, CONFIG.maxFov, base.fov),
    quality: ['LOW', 'BALANCED', 'HIGH'].includes(raw.quality) ? raw.quality : base.quality,
    smoothTransitions: typeof raw.smoothTransitions === 'boolean' ? raw.smoothTransitions : base.smoothTransitions,
    reducedMotion: typeof raw.reducedMotion === 'boolean' ? raw.reducedMotion : base.reducedMotion,
    freeRoam: typeof raw.freeRoam === 'boolean' ? raw.freeRoam : base.freeRoam,
    volumeMaster: num(raw.volumeMaster, 0, 1, base.volumeMaster),
    volumeAmbient: num(raw.volumeAmbient, 0, 1, base.volumeAmbient),
    volumeSfx: num(raw.volumeSfx, 0, 1, base.volumeSfx),
    visitedRooms: Array.isArray(raw.visitedRooms)
      ? raw.visitedRooms.filter(r => typeof r === 'string').slice(0, 12)
      : base.visitedRooms,
    discoveries: Array.isArray(raw.discoveries)
      ? raw.discoveries.filter(d => typeof d === 'string').slice(0, 12)
      : base.discoveries,
    bridgePosition: Number.isInteger(raw.bridgePosition) ? ((raw.bridgePosition % 4) + 4) % 4 : base.bridgePosition,
    bridgeAligned: Boolean(raw.bridgeAligned),
    bridgeCrossed: Boolean(raw.bridgeCrossed),
    galleryPosition: Number.isInteger(raw.galleryPosition) ? ((raw.galleryPosition % 4) + 4) % 4 : base.galleryPosition,
    galleryAligned: Boolean(raw.galleryAligned),
    mirrorInspected: Boolean(raw.mirrorInspected),
    panoramicUnlocked: Boolean(raw.panoramicUnlocked),
    roomId: typeof raw.roomId === 'string' ? raw.roomId : base.roomId,
  };
}

export function loadSavedState() {
  try {
    const raw = localStorage.getItem(CONFIG.storageKey);
    if (!raw) return defaultSavedState();
    return validateState(JSON.parse(raw));
  } catch {
    return defaultSavedState();
  }
}

export function persistState(state) {
  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(validateState(state)));
    return true;
  } catch {
    return false;
  }
}

export function clearSavedState() {
  try {
    localStorage.removeItem(CONFIG.storageKey);
    return true;
  } catch {
    return false;
  }
}
