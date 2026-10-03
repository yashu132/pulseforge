import { OfflineSyncItem } from '../types';

const DB_NAME = 'pulseforge_fitness_db';
const DB_VERSION = 1;
const STORE_NAME = 'app_data';

// IndexedDB Helper
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function idbGet<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch {
    // Fallback to localStorage
    const local = localStorage.getItem(`pulseforge_${key}`);
    return local ? JSON.parse(local) : null;
  }
}

export async function idbSet<T>(key: string, value: T): Promise<void> {
  // Always mirror in localStorage for immediate sync
  try {
    localStorage.setItem(`pulseforge_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage write failed:', e);
  }

  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('IndexedDB write failed, fallback used:', e);
  }
}

export async function queueOfflineAction(action: Omit<OfflineSyncItem, 'id' | 'timestamp' | 'synced'>): Promise<OfflineSyncItem> {
  const item: OfflineSyncItem = {
    id: 'sync_' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    synced: false,
    ...action,
  };

  const queue = (await idbGet<OfflineSyncItem[]>('offline_queue')) || [];
  queue.push(item);
  await idbSet('offline_queue', queue);
  return item;
}

export async function getOfflineQueue(): Promise<OfflineSyncItem[]> {
  return (await idbGet<OfflineSyncItem[]>('offline_queue')) || [];
}

export async function clearOfflineQueue(): Promise<void> {
  await idbSet('offline_queue', []);
}

export async function exportAllDataJSON(): Promise<string> {
  const keys = [
    'user_profile',
    'wearable_devices',
    'meals',
    'hydration',
    'completed_workouts',
    'custom_routines',
    'joined_challenges',
    'posts',
  ];

  const exportPayload: Record<string, any> = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    data: {},
  };

  for (const k of keys) {
    exportPayload.data[k] = await idbGet(k);
  }

  return JSON.stringify(exportPayload, null, 2);
}

export async function importDataJSON(jsonString: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !parsed.data) return false;

    for (const [key, val] of Object.entries(parsed.data)) {
      if (val !== undefined && val !== null) {
        await idbSet(key, val);
      }
    }
    return true;
  } catch (e) {
    console.error('Import error:', e);
    return false;
  }
}
