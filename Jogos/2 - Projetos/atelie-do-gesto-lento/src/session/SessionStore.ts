import { SessionData, ClayConfig } from '../types';

export class SessionStore {
  private dbName = 'atelie_do_gesto_lento_db';
  private dbVersion = 1;
  private storeName = 'pieces';
  private db: IDBDatabase | null = null;
  private saveTimeout: number | null = null;
  private onStatusChangeCallback?: (status: string, isError: boolean) => void;

  constructor() {
    this.openDatabase().catch(() => {
      if (this.onStatusChangeCallback) {
        this.onStatusChangeCallback(
          'Não foi possível acessar o armazenamento local. Você ainda pode exportar a peça.',
          true
        );
      }
    });
  }

  public setStatusCallback(cb: (status: string, isError: boolean) => void): void {
    this.onStatusChangeCallback = cb;
  }

  private openDatabase(): Promise<IDBDatabase> {
    if (this.db) return Promise.resolve(this.db);

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = e => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };

      request.onsuccess = e => {
        this.db = (e.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Saves current clay state with 600ms debounce after user interaction stops.
   */
  public saveDebounced(data: SessionData): void {
    if (this.saveTimeout !== null) {
      window.clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = window.setTimeout(async () => {
      try {
        await this.saveDirect(data);
        if (this.onStatusChangeCallback) {
          this.onStatusChangeCallback('Guardado neste dispositivo', false);
        }
      } catch {
        if (this.onStatusChangeCallback) {
          this.onStatusChangeCallback(
            'Não foi possível guardar neste dispositivo. Você ainda pode exportar a peça.',
            true
          );
        }
      }
    }, 600);
  }

  public async saveDirect(data: SessionData): Promise<void> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.put(data, 'current_piece');

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async loadCurrent(): Promise<SessionData | null> {
    try {
      const db = await this.openDatabase();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const req = store.get('current_piece');

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return null;
    }
  }

  public async clearCurrent(): Promise<void> {
    try {
      const db = await this.openDatabase();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const req = store.delete('current_piece');

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Exports piece as serialized JSON data URL for download.
   */
  public exportJSON(data: SessionData): string {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    return URL.createObjectURL(blob);
  }

  /**
   * Validates incoming imported JSON against schema constraints and limits.
   */
  public validateImportedJSON(raw: unknown, config: ClayConfig): SessionData | null {
    if (!raw || typeof raw !== 'object') return null;
    const obj = raw as Partial<SessionData>;

    if (obj.version !== 1) return null;
    if (typeof obj.height !== 'number' || isNaN(obj.height) || obj.height < 0.10 || obj.height > 0.38) {
      return null;
    }

    const expectedCount = (obj.rings || config.rings) * (obj.segments || config.segments);
    if (!Array.isArray(obj.radii) || obj.radii.length !== expectedCount) return null;
    if (!Array.isArray(obj.thickness) || obj.thickness.length !== expectedCount) return null;

    // Check all numbers finite and within bounds
    for (let i = 0; i < expectedCount; i++) {
      if (!isFinite(obj.radii[i]) || obj.radii[i] < config.minRadius || obj.radii[i] > config.maxRadius) {
        return null;
      }
      if (!isFinite(obj.thickness[i]) || obj.thickness[i] < config.minThickness) {
        return null;
      }
    }

    return obj as SessionData;
  }
}
