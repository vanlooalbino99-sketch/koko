// Store global minimaliste + persistance compatible v3 (clé « blackstart-data-v1»).
import { useEffect, useState, useRef } from 'preact/hooks';
import { STORAGE_KEY, DEFAULT_SETTINGS, DEFAULT_COMPANY, DEFAULT_SCRIPT, DEFAULT_TEMPLATES, SECTEURS, CANAUX } from './constants.js';
import { uid, today, nowTime } from './util.js';

export function createStore(initial) {
  let state = initial;
  const subs = new Set();
  return {
    get: () => state,
    set(patch) {
      const next = typeof patch === 'function' ? patch(state) : patch;
      if (!next || next === state) return;
      state = { ...state, ...next };
      subs.forEach((f) => f(state));
    },
    subscribe(f) {
      subs.add(f);
      return () => subs.delete(f);
    },
  };
}

export function useStore(store, selector = (s) => s) {
  const [, force] = useState(0);
  const sel = useRef(selector);
  sel.current = selector;
  const last = useRef(selector(store.get()));
  last.current = selector(store.get());
  useEffect(
    () =>
      store.subscribe((s) => {
        const v = sel.current(s);
        if (v !== last.current) {
          last.current = v;
          force((n) => n + 1);
        }
      }),
    [store],
  );
  return last.current;
}

/* ------------------------------------------------------------------ */
/* Données du CRM                                                      */
/* ------------------------------------------------------------------ */
const backend =
  typeof window !== 'undefined' && window.storage && typeof window.storage.get === 'function'
    ? window.storage
    : {
        async get(k) {
          try {
            const v = localStorage.getItem(k);
            return v !== null ? { key: k, value: v } : null;
          } catch (e) {
            return null;
          }
        },
        async set(k, v) {
          localStorage.setItem(k, v);
          return { key: k, value: v };
        },
      };

export const db = createStore({
  loaded: false,
  prospects: [],
  settings: { ...DEFAULT_SETTINGS },
  devisList: [],
  factures: [],
  tasks: [],
  companyInfo: { ...DEFAULT_COMPANY },
  script: DEFAULT_SCRIPT,
  templates: DEFAULT_TEMPLATES,
  saveError: null,
});

const PERSISTED = ['prospects', 'settings', 'devisList', 'factures', 'tasks', 'companyInfo', 'script', 'templates'];

export function normalizeProspect(p) {
  return {
    id: p.id || uid(),
    entreprise: p.entreprise || '',
    secteur: p.secteur || SECTEURS[0],
    contact: p.contact || '',
    telephone: p.telephone || '',
    email: p.email || '',
    ville: p.ville || '',
    adresse: p.adresse || '',
    siret: p.siret || '',
    site: p.site || '',
    canal: p.canal || CANAUX[0],
    statut: p.statut || 'a_appeler',
    priorite: p.priorite || '',
    tags: Array.isArray(p.tags) ? p.tags : [],
    notes: p.notes || '',
    dealValue: Number(p.dealValue) || 0,
    mrrValue: Number(p.mrrValue) || 0,
    signedAt: p.signedAt || null,
    resilieAt: p.resilieAt || null,
    prochaineRelance: p.prochaineRelance === undefined ? today() : p.prochaineRelance,
    prochaineRelanceHeure: p.prochaineRelanceHeure || null,
    createdAt: p.createdAt || today(),
    updatedAt: p.updatedAt || p.createdAt || today(),
    callLog: Array.isArray(p.callLog) ? p.callLog : [],
    events: Array.isArray(p.events) ? p.events : [],
    ...Object.fromEntries(Object.entries(p).filter(([k]) => !(k in BASE_KEYS))),
  };
}
const BASE_KEYS = Object.fromEntries(
  'id entreprise secteur contact telephone email ville adresse siret site canal statut priorite tags notes dealValue mrrValue signedAt resilieAt prochaineRelance prochaineRelanceHeure createdAt updatedAt callLog events'
    .split(' ')
    .map((k) => [k, 1]),
);

export function hydrate(raw) {
  const d = raw || {};
  return {
    prospects: Array.isArray(d.prospects) ? d.prospects.map(normalizeProspect) : [],
    settings: { ...DEFAULT_SETTINGS, ...(d.settings || {}) },
    devisList: Array.isArray(d.devisList) ? d.devisList : [],
    factures: Array.isArray(d.factures) ? d.factures : [],
    tasks: Array.isArray(d.tasks) ? d.tasks : [],
    companyInfo: {
      ...DEFAULT_COMPANY,
      ...(d.companyInfo || {}),
      paymentLinks: { ...DEFAULT_COMPANY.paymentLinks, ...((d.companyInfo && d.companyInfo.paymentLinks) || {}) },
    },
    script: Array.isArray(d.script) && d.script.length ? d.script : DEFAULT_SCRIPT,
    templates: Array.isArray(d.templates) && d.templates.length ? d.templates : DEFAULT_TEMPLATES,
  };
}

export async function loadData() {
  let raw = null;
  try {
    const r = await backend.get(STORAGE_KEY, false);
    if (r && r.value) raw = JSON.parse(r.value);
  } catch (e) {
    /* données illisibles : on démarre à vide sans écraser (voir saveBlocked) */
    saveBlocked = true;
    db.set({ saveError: 'Les données enregistrées sont illisibles — la sauvegarde automatique est suspendue.' });
  }
  db.set({ ...hydrate(raw), loaded: true });
  let t = null;
  db.subscribe((s) => {
    clearTimeout(t);
    t = setTimeout(() => persist(s), 250);
  });
}

let saveBlocked = false;
let lastSaved = '';
async function persist(s) {
  if (!s.loaded || saveBlocked) return;
  const out = {};
  PERSISTED.forEach((k) => (out[k] = s[k]));
  out.version = 4;
  const json = JSON.stringify(out);
  if (json === lastSaved) return;
  try {
    await backend.set(STORAGE_KEY, json, false);
    lastSaved = json;
    if (s.saveError) db.set({ saveError: null });
  } catch (e) {
    db.set({ saveError: 'Sauvegarde impossible : stockage du navigateur plein ou bloqué.' });
  }
}
export function exportData() {
  const s = db.get();
  const out = { app: 'Blackstart CRM', version: 4, exportedAt: new Date().toISOString() };
  PERSISTED.forEach((k) => (out[k] = s[k]));
  return out;
}
export function importData(obj) {
  saveBlocked = false;
  db.set({ ...hydrate(obj), saveError: null });
}

/* ------------------------------------------------------------------ */
/* Mutations                                                           */
/* ------------------------------------------------------------------ */
export const setList = (key, fn) => db.set((s) => ({ [key]: fn(s[key]) }));
export const patchProspect = (id, patch) =>
  setList('prospects', (l) => l.map((p) => (p.id === id ? { ...p, ...(typeof patch === 'function' ? patch(p) : patch), updatedAt: today() } : p)));
export const addEvent = (id, type, text) =>
  patchProspect(id, (p) => ({ events: [{ id: uid(), ts: new Date().toISOString(), date: today(), time: nowTime(), type, text }, ...(p.events || [])].slice(0, 200) }));

/* Instantané pour « Annuler ». */
export function snapshot() {
  const s = db.get();
  const out = {};
  PERSISTED.forEach((k) => (out[k] = s[k]));
  return out;
}
export const restore = (snap) => db.set(snap);
