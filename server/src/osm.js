import { Router } from 'express';

// Générateur de leads : recherche des téléphones, sites et emails sur OpenStreetMap (Overpass) depuis le serveur.
// Le navigateur seul échoue souvent (serveurs publics saturés, bloqueurs, réseau d'entreprise) : ici on essaie
// plusieurs serveurs Overpass l'un après l'autre et on garde en mémoire les réponses récentes.
const SERVEURS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];
const CACHE = new Map();
const CACHE_MAX = 300, CACHE_MS = 6 * 3600 * 1000;
let premier = 0;

// Seules les requêtes du générateur passent : lecture, sortie JSON, recherche autour d'un point.
function valide(q) {
  return typeof q === 'string' && q.length <= 20000 && /^\[out:json\]\[timeout:\d{1,2}\];\(/.test(q)
    && /out tags center;$/.test(q) && !/(\bout\s+body|\bmeta\b|recurse|>;|<;)/.test(q.slice(0, -16));
}

async function essai(url, q) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 20000);
  try {
    const r = await fetch(url, {
      method: 'POST', signal: ctl.signal,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json', 'User-Agent': 'BlackstartCRM/1.0 (generateur de leads)' },
      body: 'data=' + encodeURIComponent(q),
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}

// Une requête essayée sur chaque serveur jusqu'à ce que l'un réponde (réponses gardées 6 h). null si aucun ne répond.
export async function interroger(q, { fetchImpl } = {}) {
  const c = CACHE.get(q);
  if (c && Date.now() - c.t < CACHE_MS) return c.data;
  const n = SERVEURS.length, erreurs = [];
  for (let k = 0; k < n; k++) {
    const i = (premier + k) % n;
    try {
      const data = await (fetchImpl ? fetchImpl(SERVEURS[i], q) : essai(SERVEURS[i], q));
      premier = i;
      const out = { elements: Array.isArray(data && data.elements) ? data.elements : [] };
      CACHE.set(q, { t: Date.now(), data: out });
      if (CACHE.size > CACHE_MAX) CACHE.delete(CACHE.keys().next().value);
      return out;
    } catch (e) { erreurs.push(new URL(SERVEURS[i]).host + ': ' + (e && e.message)); }
  }
  console.warn('[osm] aucun serveur Overpass n’a répondu :', erreurs.join(' | '));
  return null;
}

export function osmRoutes({ fetchImpl } = {}) {
  const router = Router();
  router.post('/', async (req, res) => {
    const q = req.body && req.body.q;
    if (!valide(q)) return res.status(400).json({ error: 'Requête refusée' });
    const out = await interroger(q, { fetchImpl });
    if (out) return res.json(out);
    res.status(503).json({ error: 'OpenStreetMap indisponible' });
  });
  return router;
}
