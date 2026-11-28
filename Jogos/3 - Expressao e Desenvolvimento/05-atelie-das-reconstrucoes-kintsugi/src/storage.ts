import type { Atelier } from './game/state'

export async function collection(action:'read'|'write'|'delete', state?:Atelier) {
  const db=await new Promise<IDBDatabase>((resolve,reject)=>{
    const request=indexedDB.open('atelie-kintsugi',1)
    request.onupgradeneeded=()=>request.result.createObjectStore('pieces')
    request.onsuccess=()=>resolve(request.result)
    request.onerror=()=>reject(request.error)
  })
  try {
    return await new Promise<Atelier|undefined>((resolve,reject)=>{
      const transaction=db.transaction('pieces',action==='read'?'readonly':'readwrite')
      const store=transaction.objectStore('pieces')
      const value=state ? {...state,sceneState:{...state.sceneState,observations:[]},history:[],future:[]} : undefined
      const request=action==='read'?store.get('saved'):action==='delete'?store.delete('saved'):store.put(value,'saved')
      transaction.oncomplete=()=>resolve(action==='read'?request.result:undefined)
      transaction.onerror=()=>reject(transaction.error)
      transaction.onabort=()=>reject(transaction.error)
    })
  } finally {db.close()}
}
