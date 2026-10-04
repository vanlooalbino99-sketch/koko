// Localisation des prospects : ville → coordonnées.
// 1) coordonnées précises enregistrées à l'import Sirene (p.geo), 2) répertoire de villes intégré,
// 3) en ligne, API Découpage administratif (geo.api.gouv.fr), résultats mis en cache sur l'appareil.
import { CITY_NAMES, CITY_COORDS } from './geodata.js';

const CACHE_KEY = 'blackstart-geo-cache-v1';

export function normCity(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\bcedex\b.*$/, '')
    .replace(/\(.*?\)/g, ' ')
    .replace(/\b\d+\s*(e|er|eme|ème)?\b(\s*arr(ondissement)?\.?)?/g, ' ')
    .replace(/[^a-z]+/g, ' ')
    .replace(/\bste\b/g, 'sainte')
    .replace(/\bst\b/g, 'saint')
    .trim()
    .replace(/\s+/g, ' ');
}

/* Noms français de grandes villes étrangères (le répertoire utilise les noms internationaux). */
const ALIASES = {
  londres: 'london', bruxelles: 'brussels', anvers: 'antwerpen', bale: 'basel', pekin: 'beijing', moscou: 'moscow',
  barcelone: 'barcelona', lisbonne: 'lisbon', varsovie: 'warsaw', 'le caire': 'cairo', alger: 'algiers', tanger: 'tangier',
  'new york': 'new york city', seville: 'sevilla', copenhague: 'copenhagen', athenes: 'athens', francfort: 'frankfurt am main',
};

let index = null;
function getIndex() {
  if (index) return index;
  const names = CITY_NAMES.split('|');
  const bin = atob(CITY_COORDS);
  const view = new DataView(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) view.setUint8(i, bin.charCodeAt(i));
  const map = new Map();
  const keys = [];
  names.forEach((name, i) => {
    const k = normCity(name);
    if (!k || map.has(k)) return;
    map.set(k, { name, lon: view.getInt16(i * 4, true) / 100, lat: view.getInt16(i * 4 + 2, true) / 100 });
    keys.push(k);
  });
  index = { map, keys };
  return index;
}

let cache = null;
function getCache() {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') || {};
  } catch (e) {
    cache = {};
  }
  return cache;
}
function saveCache() {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    /* stockage plein : le cache reste en mémoire */
  }
}

/* Recherche locale, sans réseau. Renvoie { lat, lon, name } ou null. */
export function findCity(ville) {
  const k0 = normCity(ville);
  if (!k0) return null;
  const k = ALIASES[k0] || k0;
  const { map, keys } = getIndex();
  if (map.has(k)) return k === k0 ? map.get(k) : { ...map.get(k), name: String(ville).trim() };
  const c = getCache()[k];
  if (c) return { name: c[2] || ville, lon: c[0], lat: c[1] };
  // « Villefranche » → Villefranche-sur-Saône, « Caluire » → Caluire-et-Cuire (la plus peuplée l'emporte).
  if (k.length >= 4) {
    const hit = keys.find((x) => x.startsWith(k + ' '));
    if (hit) return map.get(hit);
  }
  return null;
}

export function locate(p) {
  if (p.geo && Number.isFinite(p.geo.lat) && Number.isFinite(p.geo.lon) && normCity(p.geo.ville) === normCity(p.ville)) {
    return { lat: p.geo.lat, lon: p.geo.lon, name: p.ville };
  }
  return findCity(p.ville);
}

/* Recherche en ligne des villes inconnues du répertoire (communes françaises). */
const pending = new Set();
export async function geocodeOnline(villes) {
  const c = getCache();
  const todo = [...new Set(villes.map(normCity))].filter((k) => k && !(k in c) && !pending.has(k)).slice(0, 30);
  let found = 0;
  for (const k of todo) {
    pending.add(k);
    try {
      const r = await fetch(`https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(k)}&fields=nom,centre&boost=population&limit=1`);
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json();
      const g = j && j[0] && j[0].centre && j[0].centre.coordinates;
      c[k] = g ? [g[0], g[1], j[0].nom] : 0;
      if (g) found++;
    } catch (e) {
      break; // hors ligne : on réessaiera plus tard
    } finally {
      pending.delete(k);
    }
  }
  if (todo.length) saveCache();
  return found;
}
