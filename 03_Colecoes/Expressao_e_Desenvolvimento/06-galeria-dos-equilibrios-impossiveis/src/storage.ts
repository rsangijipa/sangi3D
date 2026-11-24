import type { GameState } from './game/state.ts'

export async function collection(action: 'read' | 'write' | 'delete', state?: GameState): Promise<GameState | undefined> {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('galeria-equilibrios-db', 2)
    request.onupgradeneeded = () => {
      if (request.result.objectStoreNames.contains('sculptures')) {
        request.result.deleteObjectStore('sculptures')
      }
      request.result.createObjectStore('sculptures')
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  try {
    return await new Promise<GameState | undefined>((resolve, reject) => {
      const transaction = db.transaction('sculptures', action === 'read' ? 'readonly' : 'readwrite')
      const store = transaction.objectStore('sculptures')
      const value = state
        ? {
            ...state,
            sceneState: { ...state.sceneState, observations: [] },
            history: [],
            future: []
          }
        : undefined
      const request = action === 'read' ? store.get('saved') : action === 'delete' ? store.delete('saved') : store.put(value, 'saved')
      transaction.oncomplete = () => resolve(action === 'read' ? request.result : undefined)
      transaction.onerror = () => reject(transaction.error)
      transaction.onabort = () => reject(transaction.error)
    })
  } finally {
    db.close()
  }
}
