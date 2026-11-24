// Persistência voluntária. localStorage: só preferências não sensíveis.
// IndexedDB: acervo de criações salvo explicitamente pela pessoa (com aviso de dispositivo compartilhado).
import { validateScene, type QualityId, type SavedCreation } from '../game/state.ts';

const PREFS_KEY = 'tear-dos-vinculos:prefs:v1';

export interface Prefs {
  quality: QualityId;
  volume: number;
  reducedMotion: boolean;
  hintLevel: number;
  tourSeen: boolean;
}

export function loadPrefs(): Partial<Prefs> {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return {};
    const p = JSON.parse(raw) as Partial<Prefs>;
    const out: Partial<Prefs> = {};
    if (p.quality && ['auto', 'cinema', 'equilibrada', 'leve'].includes(p.quality)) out.quality = p.quality;
    if (typeof p.volume === 'number') out.volume = Math.max(0, Math.min(1, p.volume));
    if (typeof p.reducedMotion === 'boolean') out.reducedMotion = p.reducedMotion;
    if (typeof p.hintLevel === 'number') out.hintLevel = Math.max(0, Math.min(3, Math.round(p.hintLevel)));
    if (typeof p.tourSeen === 'boolean') out.tourSeen = p.tourSeen;
    return out;
  } catch {
    return {};
  }
}

export function savePrefs(p: Partial<Prefs>): void {
  try {
    const cur = loadPrefs();
    localStorage.setItem(PREFS_KEY, JSON.stringify({ ...cur, ...p }));
  } catch { /* armazenamento indisponível: segue sem persistir */ }
}

export function clearPrefs(): void {
  try { localStorage.removeItem(PREFS_KEY); } catch { /* sem efeito */ }
}

// ---------- IndexedDB ----------

const DB_NAME = 'tear-dos-vinculos';
const STORE = 'criacoes';

export interface StoredCreation extends SavedCreation {
  id: string;
  /** miniatura PNG (data URL) da composição */
  thumb?: string;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) { reject(new Error('IndexedDB indisponível.')); return; }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Falha ao abrir o acervo.'));
  });
}

function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then((db) => new Promise<T>((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const r = fn(t.objectStore(STORE));
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error ?? new Error('Falha no acervo.'));
    t.oncomplete = () => db.close();
  }));
}

export async function saveCreation(c: StoredCreation): Promise<void> {
  await tx('readwrite', (s) => s.put(c));
}

export async function listCreations(): Promise<StoredCreation[]> {
  const all = await tx<StoredCreation[]>('readonly', (s) => s.getAll() as IDBRequest<StoredCreation[]>);
  return all.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export async function loadCreation(id: string): Promise<StoredCreation | undefined> {
  const c = await tx<StoredCreation | undefined>('readonly', (s) => s.get(id) as IDBRequest<StoredCreation | undefined>);
  if (c) c.sceneState = validateScene(c.sceneState);
  return c;
}

export async function deleteCreation(id: string): Promise<void> {
  await tx('readwrite', (s) => s.delete(id));
}

export async function deleteAllCreations(): Promise<void> {
  await tx('readwrite', (s) => s.clear());
}
