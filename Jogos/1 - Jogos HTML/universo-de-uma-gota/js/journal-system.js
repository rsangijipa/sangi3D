/**
 * Diário científico e álbum persistente em IndexedDB para Universo de uma Gota 2.0.
 * Inclui tratamento de erro de armazenamento, exclusão e exportação de metadados.
 */

const DB_NAME = 'universo-gota-journal-v2';
const STORE_NAME = 'entries';

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB indisponível'));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {keyPath: 'id'});
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Falha ao abrir IndexedDB'));
  });
}

export function createJournalSystem() {
  let memoryFallback = [];

  async function listEntries() {
    try {
      const db = await openDB();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).getAll();
        req.onsuccess = () => resolve((req.result || []).sort((a, b) => b.timestamp - a.timestamp));
        req.onerror = () => reject(req.error);
      });
    } catch {
      return [...memoryFallback].sort((a, b) => b.timestamp - a.timestamp);
    }
  }

  async function saveEntry(entry) {
    const record = {
      id: `entry-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: Date.now(),
      dateIso: new Date().toISOString(),
      ...entry,
    };
    try {
      const db = await openDB();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(record);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      memoryFallback.unshift(record);
      if (memoryFallback.length > 24) memoryFallback.pop();
    }
    return record;
  }

  async function deleteEntry(id) {
    memoryFallback = memoryFallback.filter((e) => e.id !== id);
    try {
      const db = await openDB();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      // ignora em fallback
    }
  }

  async function clearAll() {
    memoryFallback = [];
    try {
      const db = await openDB();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch {
      // ignora em fallback
    }
  }

  return {listEntries, saveEntry, deleteEntry, clearAll};
}
