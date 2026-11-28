import type { MaskState } from './mask.ts';

export interface Version {
  id: string;
  savedAt: number;
  state: MaskState;
  thumbnail: string;
  description: string;
}
export interface Creation {
  id: string;
  name: string;
  versions: Version[];
}
let pending: Promise<IDBDatabase> | undefined;
function database() {
  pending ??= new Promise<IDBDatabase>((resolve,reject) => {
    const request = indexedDB.open('atelie-das-mascaras',1);
    request.onupgradeneeded = () => request.result.createObjectStore('creations',{keyPath:'id'});
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  }).catch(error => { pending = undefined; throw error; });
  return pending;
}
async function transaction<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>) {
  const db = await database();
  return new Promise<T>((resolve,reject) => {
    const tx = db.transaction('creations',mode);
    const request = action(tx.objectStore('creations'));
    tx.oncomplete = () => resolve(request.result);
    tx.onabort = () => reject(tx.error ?? request.error ?? new Error('Falha no armazenamento local.'));
  });
}
export const list = () => transaction('readonly',store=>store.getAll() as IDBRequest<Creation[]>);
export const put = (creation: Creation) => transaction('readwrite',store=>store.put(creation));
export const remove = (id: string) => transaction('readwrite',store=>store.delete(id));
export async function saveVersion(id: string, name: string, version: Version) {
  const db = await database();
  return new Promise<void>((resolve,reject)=>{
    const tx = db.transaction('creations','readwrite');
    const store = tx.objectStore('creations');
    const get = store.get(id) as IDBRequest<Creation|undefined>;
    get.onsuccess = () => store.put({id,name,versions:[version,...(get.result?.versions??[])]});
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error ?? new Error('Falha ao salvar a versão.'));
  });
}
