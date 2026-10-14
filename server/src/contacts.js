import { Router } from 'express';
import { enrichFromWebsite, guessWebsite } from './siteweb.js';
import { interroger } from './osm.js';

// Générateur de leads : téléphone, site et email des entreprises trouvées dans la base officielle (qui n'en a pas).
// Dans l'ordre :
//   1. la base locale des lieux OpenStreetMap (lieux.js) : même SIRET, sinon même nom à la même adresse ;
//   2. les services à clé, s'ils sont configurés (facultatifs, meilleure couverture des téléphones) :
//        GOOGLE_PLACES_KEY   Google Places (payant au-delà de l'offre gratuite)
//        HERE_API_KEY        HERE (1 000 recherches gratuites par jour, sans carte bancaire)
//        TOMTOM_KEY          TomTom (2 500 recherches gratuites par mois)
//   3. le site internet de l'entreprise (accueil, contact, mentions légales) : téléphone et email ;
//      sans site connu, on essaie nom.fr / nom.com et on ne garde le site que s'il affiche le SIREN du lead.
// Si la base locale n'a pas pu être téléchargée, on se rabat sur Overpass (une requête par lot).

const UA = 'BlackstartCRM/1.0 (generateur de leads)';
const CACHE = new Map();
const CACHE_MAX = 5000, CACHE_OK_MS = 7 * 24 * 3600 * 1000, CACHE_VIDE_MS = 6 * 3600 * 1000;
const SITE = 'Site de l’entreprise';

// ------------------------------------------------------------------ outils
export function norm(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
const STOP = /^(sarl|sas|sasu|eurl|sa|sci|snc|selarl|selas|scp|scm|eirl|ei|ets|etablissements|societe|ste|cabinet|entreprise|groupe|holding|france|et|de|du|des|la|le|les|l|d|a|au|aux|en|chez|the)$/;
// Mots trop courants pour identifier une entreprise à eux seuls.
const GENERIQUE = /^(immobilier|immobiliere|immo|agence|transaction|transactions|gestion|plomberie|plombier|chauffage|sanitaire|electricite|electricien|elec|batiment|travaux|renovation|habitat|maison|construction|constructions|menuiserie|maconnerie|peinture|carrelage|couverture|toiture|serrurerie|metallerie|paysage|paysagiste|jardin|jardins|garage|auto|autos|automobile|automobiles|boulangerie|patisserie|coiffure|coiffeur|beaute|institut|esthetique|restaurant|brasserie|pizzeria|pizza|cafe|bar|traiteur|hotel|pharmacie|dentaire|dentiste|medical|medicale|sante|kine|kinesitherapie|osteopathe|veterinaire|clinique|centre|optique|opticien|fleurs|fleuriste|services|service|conseil|conseils|expertise|comptable|avocat|avocats|assurance|assurances|nettoyage|proprete|communication|informatique|ecole|formation|sport|fitness|club|paris|lyon|marseille|nord|sud|est|ouest|international|solutions|associes|partenaires|plus|pro)$/;
function tokens(s) { return norm(s).split(' ').filter((w) => w.length > 1 && !STOP.test(w)); }
export function sameName(a, b) {
  const ta = tokens(a), tb = tokens(b);
  if (!ta.length || !tb.length) return 0;
  const na = ta.join(' '), nb = tb.join(' ');
  if (na === nb) return 1;
  if ((na.length >= 5 && nb.includes(na)) || (nb.length >= 5 && na.includes(nb))) return 0.9;
  const inter = ta.filter((w) => tb.includes(w)).length;
  return inter / Math.min(ta.length, tb.length) * (inter >= 2 || Math.min(ta.length, tb.length) === 1 ? 1 : 0.6);
}
// Un mot distinctif en commun (un nom de famille, une marque), pour un lieu à la même adresse.
function motCommun(lead, nom) {
  const tn = tokens(nom);
  return [lead.nom, lead.enseigne, lead.dirigeant].some((x) => tokens(x).some((w) => w.length >= 4 && !GENERIQUE.test(w) && tn.includes(w)));
}
export function distM(a, b, c, d) {
  const r = Math.PI / 180, x = (d - b) * r * Math.cos((a + c) / 2 * r), y = (c - a) * r;
  return Math.sqrt(x * x + y * y) * 6371000;
}
function nomScore(lead, nom) {
  return Math.max(sameName(nom, lead.nom), lead.enseigne ? sameName(nom, lead.enseigne) : 0);
}

// Téléphone français lisible : 04 67 00 00 00 (fixe ou mobile), sinon tel quel.
export function telFr(t) {
  let d = String(t || '').replace(/[^\d+]/g, '');
  if (d.startsWith('+33')) d = '0' + d.slice(3);
  else if (d.startsWith('0033')) d = '0' + d.slice(4);
  d = d.replace(/^00/, '0');
  if (/^0[1-9]\d{8}$/.test(d)) return d.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
  return String(t || '').trim();
}
export function siteUrl(u) {
  u = String(u || '').trim();
  if (!u) return '';
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  try { const x = new URL(u); return /^https?:$/.test(x.protocol) ? x.href : ''; } catch { return ''; }
}
// Pages d'annuaires ou de réseaux sociaux : pas le site de l'entreprise, on ne les lit pas.
const PAS_SITE = /(facebook|instagram|linkedin|twitter|x\.com|tiktok|youtube|pagesjaunes|societe\.com|pappers|google\.|goo\.gl|yelp|tripadvisor|doctolib|leboncoin|annuaire|kompass|infogreffe|verif\.com|manageo)/i;
const emailOk = (e) => /^[^@\s]+@[^@\s]+\.[a-z]{2,24}$/i.test(String(e || '').trim());

async function getJson(url, { headers = {}, method = 'GET', body, timeout = 10000 } = {}) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeout);
  try {
    const r = await fetch(url, { method, body, signal: ctl.signal, headers: { 'User-Agent': UA, Accept: 'application/json', ...headers } });
    if (!r.ok) { const e = new Error('HTTP ' + r.status); e.status = r.status; throw e; }
    return await r.json();
  } finally { clearTimeout(t); }
}
function avecDelai(p, ms) { return Promise.race([p, new Promise((r) => setTimeout(() => r(null), ms).unref())]); }
// Pas plus de n tâches à la fois (lecture des sites).
function limite(n) {
  let actifs = 0;
  const file = [];
  const suivant = () => { if (actifs < n && file.length) { actifs++; file.shift()(); } };
  return (fn) => new Promise((ok, ko) => {
    file.push(() => fn().then(ok, ko).finally(() => { actifs--; suivant(); }));
    suivant();
  });
}
const lectureSite = limite(8);

// ------------------------------------------------------------------ 1. base locale des lieux OpenStreetMap
function versContact(x) {
  return { telephone: telFr(x.tel), site: siteUrl(x.site), email: emailOk(x.email) ? x.email.trim() : '', nomOsm: x.nom || x.marque };
}
export function trouverLocal(lieux, lead) {
  const siret = lieux.parSiret(lead.siret);
  if (siret.length) return versContact(siret[0]);
  for (const x of lieux.parSiren(lead.siren)) if (lead.lat == null || distM(lead.lat, lead.lon, x.lat, x.lon) <= 2000) return versContact(x);
  return meilleurLieu(lead, lead.lat == null ? [] : lieux.autour(lead.lat, lead.lon));
}
// Le lieu qui correspond au lead : même nom tout près, nom très proche un peu plus loin, ou un mot distinctif à la même adresse.
export function meilleurLieu(lead, lieux) {
  let best = null, bs = 0;
  for (const x of lieux) {
    const d = distM(lead.lat, lead.lon, x.lat, x.lon);
    if (d > 400) continue;
    const s = Math.max(nomScore(lead, x.nom), x.marque ? nomScore(lead, x.marque) : 0);
    const ok = (s >= 0.75 && d <= 250) || (s >= 0.9 && d <= 400) || (d <= 80 && motCommun(lead, x.nom || ''));
    const score = (ok ? Math.max(s, 0.6) : 0) - d / 4000;
    if (ok && score > bs) { bs = score; best = x; }
  }
  return best ? versContact(best) : null;
}

// Repli si la base locale n'a pas pu être chargée : une seule requête Overpass pour le lot.
async function parOverpass(leads) {
  const pts = leads.filter((l) => l.lat != null);
  if (!pts.length) return {};
  const q = '[out:json][timeout:25][maxsize:67108864];(' + pts.map((l) =>
    `nwr(around:250,${l.lat.toFixed(6)},${l.lon.toFixed(6)})["name"][~"^(phone|contact:phone|contact:mobile|website|contact:website|email|contact:email)$"~"."];`).join('') + ');out tags center;';
  const data = await interroger(q);
  const els = (data && data.elements) || [];
  const lieux = els.map((el) => {
    const t = el.tags || {}, c = el.center || el;
    return { lat: c.lat, lon: c.lon, nom: t.name || '', marque: t.brand || '', tel: String(t.phone || t['contact:phone'] || t['contact:mobile'] || '').split(';')[0],
      site: t.website || t['contact:website'] || '', email: String(t.email || t['contact:email'] || '').split(';')[0], siret: String(t['ref:FR:SIRET'] || '').replace(/\D/g, '') };
  }).filter((x) => x.lat != null);
  const out = {};
  for (const l of pts) {
    const s = l.siret && lieux.find((x) => x.siret === l.siret);
    out[l.id] = s ? versContact(s) : meilleurLieu(l, lieux);
  }
  return out;
}

// ------------------------------------------------------------------ 2. services à clé (facultatifs)
const appels = { jour: '', here: 0 };
export const SOURCES = {
  // Google Places API (New), Text Search : nom + adresse, biais de 300 m autour de l'établissement.
  async google(lead, { googleKey }) {
    const body = {
      textQuery: [lead.enseigne || lead.nom, lead.adresse || [lead.cp, lead.ville].join(' ')].filter(Boolean).join(', '),
      languageCode: 'fr', regionCode: 'FR', pageSize: 3,
      ...(lead.lat != null ? { locationBias: { circle: { center: { latitude: lead.lat, longitude: lead.lon }, radius: 300 } } } : {}),
    };
    const data = await getJson('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST', body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': googleKey, 'X-Goog-FieldMask': 'places.displayName,places.location,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri' },
    });
    let best = null, bs = 0;
    for (const p of data.places || []) {
      let s = nomScore(lead, p.displayName && p.displayName.text);
      if (lead.lat != null && p.location && distM(lead.lat, lead.lon, p.location.latitude, p.location.longitude) > 400) s *= 0.5;
      if (s > bs) { bs = s; best = p; }
    }
    if (!best || bs < 0.7) return null;
    return { telephone: telFr(best.nationalPhoneNumber || best.internationalPhoneNumber), site: siteUrl(best.websiteUri) };
  },

  // HERE Geocoding & Search, Discover : lieux autour de l'établissement, avec téléphone, site et email.
  async here(lead, { hereKey }) {
    if (lead.lat == null) return null;
    const jour = new Date().toISOString().slice(0, 10);
    if (appels.jour !== jour) { appels.jour = jour; appels.here = 0; }
    if (++appels.here > 950) return null; // offre gratuite : 1 000 par jour
    const q = encodeURIComponent(lead.enseigne || lead.nom);
    const data = await getJson(`https://discover.search.hereapi.com/v1/discover?at=${lead.lat},${lead.lon}&q=${q}&limit=5&lang=fr-FR&in=countryCode:FRA&apiKey=${encodeURIComponent(hereKey)}`);
    let best = null, bs = 0;
    for (const it of data.items || []) {
      let s = nomScore(lead, it.title);
      if (it.position && distM(lead.lat, lead.lon, it.position.lat, it.position.lng) > 400) s *= 0.5;
      if (s > bs) { bs = s; best = it; }
    }
    if (!best || bs < 0.75) return null;
    const c = best.contacts || [];
    const val = (k) => (c.flatMap((x) => x[k] || []).find((v) => v && v.value) || {}).value || '';
    return { telephone: telFr(val('phone') || val('mobile')), site: siteUrl(val('www')), email: emailOk(val('email')) ? val('email') : '' };
  },

  // TomTom Search API : recherche de lieux (POI) avec téléphone et site.
  async tomtom(lead, { tomtomKey }) {
    const q = encodeURIComponent(lead.enseigne || lead.nom);
    const pos = lead.lat != null ? `&lat=${lead.lat}&lon=${lead.lon}&radius=500` : '';
    const data = await getJson(`https://api.tomtom.com/search/2/poiSearch/${q}.json?key=${encodeURIComponent(tomtomKey)}&countrySet=FR&language=fr-FR&limit=5${pos}`);
    let best = null, bs = 0;
    for (const r of data.results || []) {
      const s = nomScore(lead, r.poi && r.poi.name);
      if (s > bs) { bs = s; best = r; }
    }
    if (!best || bs < 0.75) return null;
    return { telephone: telFr(best.poi.phone), site: siteUrl(best.poi.url) };
  },
};
const CLES = { google: 'googleKey', here: 'hereKey', tomtom: 'tomtomKey' };
const NOMS = { google: 'Google', here: 'HERE', tomtom: 'TomTom' };

// ------------------------------------------------------------------ recherche complète d'un lead
// trouve : résultat déjà connu pour ce lead (Overpass en repli) ; undefined : chercher dans la base locale.
export async function chercher(lead, conf = {}, trouve) {
  const res = { telephone: '', site: '', email: '', sources: [] };
  const erreurs = [];
  const prendre = (r, source) => {
    if (!r) return;
    let pris = false;
    for (const k of ['telephone', 'site', 'email']) if (!res[k] && r[k]) { res[k] = r[k]; pris = true; }
    if (pris && !res.sources.includes(source)) res.sources.push(source);
  };
  prendre(trouve !== undefined ? trouve : conf.lieux && conf.lieux.etat.pret ? trouverLocal(conf.lieux, lead) : null, 'OpenStreetMap');
  for (const nom of ['google', 'here', 'tomtom']) {
    if (res.telephone && res.site) break;
    if (!conf[CLES[nom]]) continue;
    try { prendre(await (conf.sources && conf.sources[nom] ? conf.sources[nom] : SOURCES[nom])(lead, conf), NOMS[nom]); } catch (e) { erreurs.push(nom + ': ' + (e && e.message)); }
  }
  if (conf.lireSites !== false) {
    try {
      if (res.site && !PAS_SITE.test(res.site) && (!res.telephone || !res.email)) {
        const r = await lectureSite(() => avecDelai((conf.enrichir || enrichFromWebsite)(res.site, lead, conf.siteOpts), 20000));
        if (r && r.confirmed !== 'mismatch') prendre({ telephone: r.telephone, email: r.email }, SITE);
      } else if (!res.site && /^\d{9}$/.test(lead.siren || '')) {
        const r = await lectureSite(() => avecDelai((conf.deviner || guessWebsite)(lead, conf.siteOpts), 25000));
        if (r && r.confirmed === 'siren') prendre({ site: r.site, telephone: r.telephone, email: r.email }, SITE);
      }
    } catch (e) { erreurs.push('site: ' + (e && e.message)); }
  }
  res.erreurs = erreurs;
  return res;
}

function leadValide(l) {
  return l && typeof l === 'object' && typeof l.nom === 'string' && l.nom.length <= 200
    && (l.lat == null || (typeof l.lat === 'number' && isFinite(l.lat) && Math.abs(l.lat) <= 90))
    && (l.lon == null || (typeof l.lon === 'number' && isFinite(l.lon) && Math.abs(l.lon) <= 180));
}
function propre(l) {
  const s = (v, n) => String(v == null ? '' : v).slice(0, n);
  return { id: s(l.id || l.siren, 40), siren: /^\d{9}$/.test(l.siren) ? l.siren : '', siret: /^\d{14}$/.test(l.siret) ? l.siret : '',
    nom: s(l.nom, 200), enseigne: s(l.enseigne, 200), dirigeant: s(l.dirigeant, 120),
    adresse: s(l.adresse, 300), cp: s(l.cp, 10), ville: s(l.ville, 100), lat: l.lat == null ? null : l.lat, lon: l.lon == null ? null : l.lon };
}

// Un lot de leads : base locale (ou Overpass en repli), puis services à clé et sites, en parallèle.
export async function chercherLot(leads, conf = {}) {
  if (conf.lieux) await conf.lieux.attendre(90000);
  const local = !!(conf.lieux && conf.lieux.etat.pret);
  const aChercher = [], out = {};
  for (const l of leads) {
    const cle = l.siret || l.siren || norm(l.nom + ' ' + l.cp);
    const c = CACHE.get(cle);
    if (c && Date.now() - c.t < (c.r.telephone || c.r.site || c.r.email ? CACHE_OK_MS : CACHE_VIDE_MS)) out[l.id] = c.r;
    else aChercher.push({ l, cle });
  }
  let trouves = {};
  if (!local && conf.overpass !== false) { try { trouves = await parOverpass(aChercher.map((x) => x.l)); } catch { trouves = {}; } }
  await Promise.all(aChercher.map(async ({ l, cle }) => {
    const r = await chercher(l, conf, local ? undefined : (trouves[l.id] || null));
    if (r.erreurs.length) console.warn('[contacts]', l.nom, '→', r.erreurs.join(' | '));
    delete r.erreurs;
    if (local || r.telephone || r.site || r.email) {
      CACHE.set(cle, { t: Date.now(), r });
      if (CACHE.size > CACHE_MAX) CACHE.delete(CACHE.keys().next().value);
    }
    out[l.id] = r;
  }));
  return out;
}

export function contactsRoutes(conf = {}) {
  const router = Router();
  router.post('/', async (req, res) => {
    const leads = req.body && req.body.leads;
    if (!Array.isArray(leads) || !leads.length || leads.length > 8 || !leads.every(leadValide)) return res.status(400).json({ error: 'Requête refusée' });
    const resultats = await chercherLot(leads.map(propre), conf);
    res.json({ resultats, base: conf.lieux ? conf.lieux.etat.pret : false });
  });
  return router;
}

// ------------------------------------------------------------------ essai réel au démarrage
// De vrais leads de la base officielle, cherchés comme dans le CRM : le journal du serveur montre ce qui est trouvé.
export function leadDepuisApi(o) {
  const e = (o.matching_etablissements || []).find((x) => x && x.etat_administratif !== 'F') || o.siege || {};
  let nom = o.nom_complet || o.nom_raison_sociale || '';
  let ens = (e.liste_enseignes && e.liste_enseignes[0]) || e.nom_commercial || '';
  const m = nom.match(/^(.*?)\s*\((.+)\)\s*$/);
  if (m) { nom = m[1]; if (!ens) ens = m[2]; }
  const lat = parseFloat(e.latitude), lon = parseFloat(e.longitude);
  return { id: String(o.siren), siren: String(o.siren), siret: e.siret || '', nom, enseigne: ens, adresse: e.adresse || '', cp: e.code_postal || '', ville: e.libelle_commune || '',
    lat: isFinite(lat) ? lat : null, lon: isFinite(lon) ? lon : null };
}
const ESSAIS = [
  ['plombiers du Rhône', '43.22A,43.22B', '69'],
  ['agences immobilières de Paris', '68.31Z', '75'],
  ['restaurants de l’Hérault', '56.10A', '34'],
  ['dentistes des Bouches-du-Rhône', '86.23Z', '13'],
  ['coiffeurs de la Manche', '96.02A', '50'],
];
export async function essaiReel(conf = {}) {
  const t0 = Date.now(), total = { n: 0, telephone: 0, site: 0, email: 0, un: 0 }, parSource = {};
  for (const [label, naf, dep] of ESSAIS) {
    let leads;
    try {
      const data = await getJson(`https://recherche-entreprises.api.gouv.fr/search?activite_principale=${naf}&departement=${dep}&etat_administratif=A&per_page=12&page=3`, { timeout: 15000 });
      leads = (data.results || []).map(leadDepuisApi).filter((l) => l.nom && !/non.?diffusible/i.test(l.nom));
    } catch (e) { console.warn(`[contacts] essai ${label} : base officielle injoignable (${e && e.message})`); continue; }
    const res = {};
    for (let i = 0; i < leads.length; i += 6) Object.assign(res, await chercherLot(leads.slice(i, i + 6), conf));
    const c = { telephone: 0, site: 0, email: 0, un: 0 };
    const exemples = [];
    for (const l of leads) {
      const r = res[l.id] || {};
      for (const k of ['telephone', 'site', 'email']) if (r[k]) { c[k]++; total[k]++; }
      if (r.telephone || r.site || r.email) { c.un++; total.un++; if (exemples.length < 2) exemples.push(`${l.enseigne || l.nom} → ${[r.telephone, r.site, r.email].filter(Boolean).join(' · ')} [${(r.sources || []).join(', ')}]`); }
      for (const s of r.sources || []) parSource[s] = (parSource[s] || 0) + 1;
    }
    total.n += leads.length;
    console.log(`[contacts] essai ${label} : ${leads.length} leads → au moins une coordonnée ${c.un}, téléphone ${c.telephone}, site ${c.site}, email ${c.email}${exemples.length ? ' | ex. ' + exemples.join(' ; ') : ''}`);
  }
  console.log(`[contacts] essai réel terminé : ${total.n} leads → au moins une coordonnée ${total.un}, téléphone ${total.telephone}, site ${total.site}, email ${total.email} ; sources ${JSON.stringify(parSource)} (${Math.round((Date.now() - t0) / 1000)} s)`);
  return total;
}
