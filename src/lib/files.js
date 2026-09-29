// Stockage durable des enregistrements audio et documents (IndexedDB).
// En v3 ils étaient perdus à chaque rechargement ; ici ils sont conservés sur l'appareil.
import { createStore } from './store.js';

const DB_NAME = 'blackstart-files';
const STORE = 'files';
let dbp = null;

function openDb() {
  if (dbp) return dbp;
  dbp = new Promise((res, rej) => {
    if (!window.indexedDB) return rej(new Error('IndexedDB indisponible'));
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: 'id' });
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  return dbp;
}
async function tx(mode, fn) {
  const d = await openDb();
  return new Promise((res, rej) => {
    const t = d.transaction(STORE, mode);
    const s = t.objectStore(STORE);
    const out = fn(s);
    t.oncomplete = () => res(out && out.result !== undefined ? out.result : undefined);
    t.onerror = () => rej(t.error);
    t.onabort = () => rej(t.error);
  });
}

/* Métadonnées en mémoire (le binaire reste dans IndexedDB). */
export const files = createStore({ list: [], ready: false, error: null });

export async function loadFiles() {
  try {
    const all = await tx('readonly', (s) => s.getAll());
    files.set({ list: (all || []).map(({ blob, ...m }) => m).sort((a, b) => (b.ts || '').localeCompare(a.ts || '')), ready: true });
  } catch (e) {
    files.set({ ready: true, error: 'Stockage des fichiers indisponible dans ce navigateur.' });
  }
}
export async function addFile(meta, blob) {
  const rec = { ...meta, ts: meta.ts || new Date().toISOString(), size: blob.size, mime: meta.mime || blob.type || '' };
  await tx('readwrite', (s) => s.put({ ...rec, blob }));
  files.set((st) => ({ list: [rec, ...st.list] }));
  return rec;
}
export async function removeFile(id) {
  await tx('readwrite', (s) => s.delete(id));
  files.set((st) => ({ list: st.list.filter((f) => f.id !== id) }));
}
export async function getBlob(id) {
  const r = await tx('readonly', (s) => s.get(id));
  return r ? r.blob : null;
}
export async function updateFile(id, patch) {
  const d = await openDb();
  await new Promise((res, rej) => {
    const t = d.transaction(STORE, 'readwrite');
    const s = t.objectStore(STORE);
    const g = s.get(id);
    g.onsuccess = () => g.result && s.put({ ...g.result, ...patch });
    t.oncomplete = res;
    t.onerror = () => rej(t.error);
  });
  files.set((st) => ({ list: st.list.map((f) => (f.id === id ? { ...f, ...patch } : f)) }));
}
