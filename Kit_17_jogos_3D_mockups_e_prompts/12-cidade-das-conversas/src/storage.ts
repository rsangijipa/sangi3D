import type { GameState } from './game/state.ts'

export async function collection(action: 'read' | 'write' | 'delete', state?: GameState): Promise<GameState | undefined> {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('cidade-conversas-db', 1)
    request.onupgradeneeded = () => request.result.createObjectStore('sessions')
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

  try {
    return await new Promise<GameState | undefined>((resolve, reject) => {
      const transaction = db.transaction('sessions', action === 'read' ? 'readonly' : 'readwrite')
      const store = transaction.objectStore('sessions')
      const value = state
        ? {
            ...state,
            undoStack: [],
            redoStack: []
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
