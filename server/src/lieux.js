import { DatabaseSync } from 'node:sqlite';
import { Readable } from 'node:stream';
import zlib from 'node:zlib';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { rmSync } from 'node:fs';

// Générateur de leads : base locale des commerces, artisans, bureaux, cabinets de santé, restaurants et hôtels
// de France publiés sur OpenStreetMap avec un téléphone, un site ou un email (exports nationaux GeoDataMine,
// dont la Base nationale des commerces ouverte). Téléchargée au démarrage puis chaque jour : la recherche des
// coordonnées ne dépend plus des serveurs Overpass publics, souvent saturés. Données © les contributeurs d'OpenStreetMap (ODbL).
export const FICHIERS = [
  { theme: 'commerces, artisans et bureaux', urls: ['https://geodatamine.fr/dump/shop_craft_office_csv.zip', 'https://www.data.gouv.fr/api/1/datasets/r/3d612ad7-f726-4fe5-a353-bdf76c5a44c2'] },
  { theme: 'santé', urls: ['https://geodatamine.fr/dump/healthcare_csv.zip'] },
  { theme: 'restaurants', urls: ['https://geodatamine.fr/dump/restaurant_csv.zip'] },
  { theme: 'hôtels', urls: ['https://geodatamine.fr/dump/hosting_csv.zip'] },
];
const UA = 'BlackstartCRM/1.0 (generateur de leads)';
const JOUR = 24 * 3600 * 1000;

// ------------------------------------------------------------------ zip (sans dépendance)
export function entreesZip(buf) {
  let i = buf.length - 22;
  const min = Math.max(0, buf.length - 65557);
  while (i >= min && buf.readUInt32LE(i) !== 0x06054b50) i--;
  if (i < min) throw new Error('fichier zip illisible');
  const n = buf.readUInt16LE(i + 10);
  let off = buf.readUInt32LE(i + 16);
  const out = [];
  for (let k = 0; k < n; k++) {
    if (buf.readUInt32LE(off) !== 0x02014b50) throw new Error('fichier zip illisible');
    const ln = buf.readUInt16LE(off + 28), le = buf.readUInt16LE(off + 30), lc = buf.readUInt16LE(off + 32);
    out.push({ nom: buf.toString('utf8', off + 46, off + 46 + ln), methode: buf.readUInt16LE(off + 10), taille: buf.readUInt32LE(off + 20), local: buf.readUInt32LE(off + 42) });
    off += 46 + ln + le + lc;
  }
  return out;
}
function fluxEntree(buf, e) {
  const debut = e.local + 30 + buf.readUInt16LE(e.local + 26) + buf.readUInt16LE(e.local + 28);
  const flux = Readable.from([buf.subarray(debut, debut + e.taille)]);
  if (e.methode === 0) return flux;
  if (e.methode === 8) return flux.pipe(zlib.createInflateRaw());
  throw new Error('compression zip non gérée : ' + e.methode);
}

// ------------------------------------------------------------------ CSV en flux (séparateur détecté, guillemets RFC 4180)
export function lecteurCsv(onLigne) {
  let sep = null, champ = '', ligne = [], guill = false, finGuill = false, reste = '';
  function car(c) {
    if (guill) {
      if (c === '"') { guill = false; finGuill = true; } else champ += c;
      return;
    }
    if (c === '"') { if (finGuill) { champ += '"'; guill = true; finGuill = false; } else if (!champ) guill = true; else champ += c; return; }
    finGuill = false;
    if (c === sep) { ligne.push(champ); champ = ''; }
    else if (c === '\n') { ligne.push(champ.endsWith('\r') ? champ.slice(0, -1) : champ); champ = ''; onLigne(ligne); ligne = []; }
    else champ += c;
  }
  function detecter(txt) {
    const tete = txt.slice(0, txt.indexOf('\n') + 1 || txt.length).replace(/"[^"]*"/g, '');
    const n = (c) => tete.split(c).length;
    sep = [',', ';', '\t', '|'].sort((a, b) => n(b) - n(a))[0];
  }
  return {
    ecrire(txt) {
      if (sep === null) { reste += txt; if (!reste.includes('\n') && reste.length < 100000) return; detecter(reste); txt = reste.replace(/^﻿/, ''); reste = ''; }
      for (let i = 0; i < txt.length; i++) car(txt[i]);
    },
    fin() {
      if (sep === null) { detecter(reste); const t = reste.replace(/^﻿/, ''); reste = ''; for (let i = 0; i < t.length; i++) car(t[i]); }
      if (champ || ligne.length) { ligne.push(champ); onLigne(ligne); }
      champ = ''; ligne = [];
    },
    get separateur() { return sep; },
  };
}

// Colonnes reconnues (les exports n'ont pas tous les mêmes noms).
const COLONNES = {
  lat: ['y', 'lat', 'latitude'], lon: ['x', 'lon', 'lng', 'long', 'longitude'], nom: ['name', 'nom'], marque: ['brand', 'marque'],
  tel: ['phone', 'contact:phone', 'telephone', 'téléphone', 'tel'], mobile: ['contact:mobile', 'mobile'],
  site: ['website', 'contact:website', 'site', 'site_web', 'url'], email: ['email', 'contact:email', 'mail', 'courriel'],
  siret: ['siret', 'ref_siret', 'ref:fr:siret', 'ref_fr_siret'], type: ['type', 'categorie', 'category'], facebook: ['facebook', 'contact:facebook'],
};
function indexColonnes(entete) {
  const h = entete.map((x) => String(x).trim().toLowerCase());
  const ix = {};
  for (const [k, noms] of Object.entries(COLONNES)) ix[k] = noms.map((n) => h.indexOf(n)).find((i) => i >= 0) ?? -1;
  return ix;
}

// Coordonnées Lambert-93 (mètres, France métropolitaine) → latitude, longitude.
export function depuisLambert93(x, y) {
  const n = 0.725607765053267, C = 11754255.426096, Xs = 700000, Ys = 12655612.049876, e = 0.0818191910428158;
  const dx = x - Xs, dy = y - Ys, g = Math.atan(dx / -dy), L = -Math.log(Math.hypot(dx, dy) / C) / n;
  let phi = 2 * Math.atan(Math.exp(L)) - Math.PI / 2;
  for (let i = 0; i < 8; i++) { const es = e * Math.sin(phi); phi = 2 * Math.atan(Math.pow((1 + es) / (1 - es), e / 2) * Math.exp(L)) - Math.PI / 2; }
  return [phi * 180 / Math.PI, 3 + g / n * 180 / Math.PI];
}
// Case de la grille (environ 550 m × 380 m) d'un point.
export function cellule(lat, lon) { return (Math.floor(lat * 200) + 40000) * 100000 + (Math.floor(lon * 200) + 40000); }
function premier(v) { return String(v || '').split(';')[0].trim(); }

// ------------------------------------------------------------------ chargement
async function telecharger(url, fetchImpl) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 180000);
  try {
    const r = await fetchImpl(url, { signal: ctl.signal, headers: { 'User-Agent': UA } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return Buffer.from(await r.arrayBuffer());
  } finally { clearTimeout(t); }
}

// Remplit la table « lieux » de db avec un fichier (zip contenant un CSV). Renvoie { lignes, gardees, entete }.
export async function chargerZip(db, buf) {
  const entree = entreesZip(buf).filter((e) => /\.csv$/i.test(e.nom)).sort((a, b) => b.taille - a.taille)[0];
  if (!entree) throw new Error('aucun CSV dans le zip');
  const ins = db.prepare('INSERT INTO lieux (cell, lat, lon, nom, marque, tel, site, email, siret, type) VALUES (?,?,?,?,?,?,?,?,?,?)');
  let ix = null, entete = null, lignes = 0, gardees = 0;
  const csv = lecteurCsv((l) => {
    if (!ix) { entete = l; ix = indexColonnes(l); if (ix.lat < 0 || ix.lon < 0) throw new Error('colonnes de position absentes : ' + l.join(',')); return; }
    lignes++;
    const v = (k) => (ix[k] >= 0 ? l[ix[k]] || '' : '');
    let lat = parseFloat(v('lat')), lon = parseFloat(v('lon'));
    if (lon > 1e4 && lon < 1.3e6 && lat > 6e6 && lat < 7.2e6) [lat, lon] = depuisLambert93(lon, lat);
    else if (Math.abs(lat) > 90 && Math.abs(lon) <= 90) [lat, lon] = [lon, lat];
    if (!isFinite(lat) || !isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return;
    const tel = premier(v('tel')) || premier(v('mobile')), email = premier(v('email'));
    // Sans site, la page Facebook de l'établissement (souvent la seule présence en ligne d'un artisan ou d'un restaurant).
    const fb = premier(v('facebook')), site = premier(v('site')) || (/^(https?:\/\/)?([\w-]+\.)?facebook\.com\//i.test(fb) ? fb : fb && /^[\w.-]+$/.test(fb) ? 'https://www.facebook.com/' + fb : '');
    const nom = v('nom').trim(), marque = v('marque').trim();
    if (!(tel || site || email) || !(nom || marque)) return;
    ins.run(cellule(lat, lon), lat, lon, nom.slice(0, 200), marque.slice(0, 120), tel.slice(0, 40), site.slice(0, 300), email.slice(0, 120), v('siret').replace(/\D/g, '').slice(0, 14), v('type').slice(0, 60));
    gardees++;
  });
  db.exec('BEGIN');
  try {
    const dec = new TextDecoder('utf-8');
    for await (const morceau of fluxEntree(buf, entree)) csv.ecrire(dec.decode(morceau, { stream: true }));
    csv.ecrire(dec.decode());
    csv.fin();
    db.exec('COMMIT');
  } catch (e) { db.exec('ROLLBACK'); throw e; }
  return { lignes, gardees, entete: entete || [], separateur: csv.separateur };
}

function nouvelleBase(fichier) {
  const db = new DatabaseSync(fichier);
  db.exec(`PRAGMA journal_mode=OFF; PRAGMA synchronous=OFF;
    CREATE TABLE IF NOT EXISTS lieux (id INTEGER PRIMARY KEY, cell INTEGER, lat REAL, lon REAL, nom TEXT, marque TEXT, tel TEXT, site TEXT, email TEXT, siret TEXT, type TEXT);`);
  return db;
}

// La base : se charge en arrière-plan, se recharge chaque jour, garde l'ancienne version tant que la nouvelle n'est pas prête.
export function baseLieux({ dossier = tmpdir(), fichiers = FICHIERS, fetchImpl = fetch, log = console } = {}) {
  let db = null, fichierActif = null, etat = { pret: false, lieux: 0, date: null, erreurs: [] }, enCours = null;
  async function charger() {
    const fichier = join(dossier, `blackstart-lieux-${Date.now()}.db`);
    const neuve = nouvelleBase(fichier);
    const t0 = Date.now(), erreurs = [];
    let total = 0;
    for (const f of fichiers) {
      let ok = false;
      for (const url of f.urls) {
        try {
          const buf = await telecharger(url, fetchImpl);
          const r = await chargerZip(neuve, buf);
          log.log(`[lieux] ${f.theme} : ${r.gardees} lieux avec coordonnées sur ${r.lignes} (${Math.round(buf.length / 1e6)} Mo, séparateur « ${r.separateur} », colonnes : ${r.entete.slice(0, 25).join(',')})`);
          total += r.gardees; ok = true; break;
        } catch (e) { erreurs.push(`${f.theme} (${new URL(url).host}) : ${e && e.message}`); }
      }
      if (!ok) log.warn(`[lieux] ${f.theme} : téléchargement impossible`);
    }
    if (erreurs.length) log.warn('[lieux] erreurs :', erreurs.join(' | '));
    if (!total) { neuve.close(); try { rmSync(fichier, { force: true }); } catch { /* rien */ } etat = { ...etat, erreurs }; return etat; }
    neuve.exec('CREATE INDEX lieux_cell ON lieux(cell); CREATE INDEX lieux_siret ON lieux(siret);');
    const ancienne = db, ancienFichier = fichierActif;
    db = neuve; fichierActif = fichier;
    etat = { pret: true, lieux: total, date: new Date().toISOString(), erreurs };
    if (ancienne) { ancienne.close(); try { rmSync(ancienFichier, { force: true }); } catch { /* rien */ } }
    log.log(`[lieux] base prête : ${total} lieux en ${Math.round((Date.now() - t0) / 1000)} s`);
    return etat;
  }
  function rafraichir() {
    if (!enCours) enCours = charger().catch((e) => { log.warn('[lieux] chargement impossible :', e && e.message); return etat; }).finally(() => { enCours = null; });
    return enCours;
  }
  return {
    get etat() { return etat; },
    rafraichir,
    // Au démarrage, la base se télécharge : on l'attend un peu plutôt que de répondre sans elle.
    attendre(ms) { return etat.pret || !enCours ? Promise.resolve(etat) : Promise.race([enCours, new Promise((r) => setTimeout(() => r(etat), ms))]); },
    demarrer() {
      const p = rafraichir();
      setInterval(rafraichir, JOUR).unref();
      return p;
    },
    // Lieux autour d'un point (cases voisines de la grille).
    autour(lat, lon) {
      if (!db || lat == null || lon == null) return [];
      const c = cellule(lat, lon), cs = [];
      for (const d of [-100000, 0, 100000]) for (const e of [-1, 0, 1]) cs.push(c + d + e);
      return db.prepare(`SELECT lat, lon, nom, marque, tel, site, email, siret, type FROM lieux WHERE cell IN (${cs.map(() => '?').join(',')})`).all(...cs);
    },
    parSiret(siret) {
      if (!db || !/^\d{14}$/.test(siret || '')) return [];
      return db.prepare('SELECT lat, lon, nom, marque, tel, site, email, siret, type FROM lieux WHERE siret = ?').all(siret);
    },
    parSiren(siren) {
      if (!db || !/^\d{9}$/.test(siren || '')) return [];
      return db.prepare('SELECT lat, lon, nom, marque, tel, site, email, siret, type FROM lieux WHERE siret >= ? AND siret < ?').all(siren, siren + 'a');
    },
    fermer() { if (db) { db.close(); try { rmSync(fichierActif, { force: true }); } catch { /* rien */ } db = null; } },
  };
}
