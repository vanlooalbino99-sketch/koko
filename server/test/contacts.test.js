// Générateur de leads : base locale des lieux OpenStreetMap (zip + CSV), correspondance avec les leads, route /api/contacts.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import zlib from 'node:zlib';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { baseLieux, lecteurCsv, entreesZip, depuisLambert93 } from '../src/lieux.js';
import { chercherLot, trouverLocal, leadDepuisApi, telFr, SOURCES } from '../src/contacts.js';
import { extract, discoverLinks, pageHasSiren, slugCandidates } from '../src/siteweb.js';
import { testApp } from './helpers.js';

// Petit zip (une entrée compressée), comme les exports nationaux.
function zip(nom, texte) {
  const data = Buffer.from(texte, 'utf8'), comp = zlib.deflateRawSync(data), n = Buffer.from(nom);
  const local = Buffer.alloc(30); local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(8, 8);
  local.writeUInt32LE(comp.length, 18); local.writeUInt32LE(data.length, 22); local.writeUInt16LE(n.length, 26);
  const cd = Buffer.alloc(46); cd.writeUInt32LE(0x02014b50, 0); cd.writeUInt16LE(20, 4); cd.writeUInt16LE(20, 6); cd.writeUInt16LE(8, 10);
  cd.writeUInt32LE(comp.length, 20); cd.writeUInt32LE(data.length, 24); cd.writeUInt16LE(n.length, 28); cd.writeUInt32LE(0, 42);
  const off = 30 + n.length + comp.length;
  const end = Buffer.alloc(22); end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(1, 8); end.writeUInt16LE(1, 10);
  end.writeUInt32LE(46 + n.length, 12); end.writeUInt32LE(off, 16);
  return Buffer.concat([local, n, comp, cd, n, end]);
}
const CSV_COMMERCES = [
  'X,Y,osm_id,type,name,brand,operator,siret,website,phone,email,address,com_insee',
  // Agence Nestenn de Cherbourg : même nom que l'enseigne du lead, 40 m plus loin.
  '-1.6219,49.6390,n1,estate_agent,Nestenn,Nestenn,,,https://immobilier-cherbourg.nestenn.com,+33 2 33 00 00 00,,"56 Rue Gambetta, Cherbourg",50129',
  // Plombier : trouvé par son SIRET, même loin de l'adresse officielle.
  '4.8400,45.7600,n2,plumber,"Plomberie ""Martin"" & Fils",,,12345678900012,,04 78 11 22 33,contact@martin-plomberie.fr,,69123',
  // Voisin à la même adresse, autre entreprise : ne doit pas être pris.
  '2.3040,48.8710,n3,hairdresser,Salon Élégance,,,,,01 40 00 00 00,,,75108',
  // Sans téléphone, site ni email : ignoré.
  '2.3041,48.8711,n4,bakery,Boulangerie du coin,,,,,,,,75108',
].join('\n') + '\n';
const CSV_SANTE = '﻿longitude;latitude;name;phone;website;email\n5.3700;43.2960;Cabinet dentaire Dupuis;04 91 00 00 01;;\n';
const ZIPS = {
  'https://exemple.test/commerces.zip': zip('shop_craft_office.csv', CSV_COMMERCES),
  'https://exemple.test/sante.zip': zip('healthcare.csv', CSV_SANTE),
};
const fakeFetch = async (url) => {
  const b = ZIPS[url];
  if (!b) return new Response('absent', { status: 404 });
  return new Response(b, { status: 200 });
};
const silence = { log() {}, warn() {} };

let dir, lieux;
before(async () => {
  dir = mkdtempSync(join(tmpdir(), 'bs-lieux-'));
  lieux = baseLieux({ dossier: dir, fetchImpl: fakeFetch, log: silence, fichiers: [
    { theme: 'commerces', urls: ['https://exemple.test/absent.zip', 'https://exemple.test/commerces.zip'] },
    { theme: 'santé', urls: ['https://exemple.test/sante.zip'] },
  ] });
  await lieux.rafraichir();
});
after(() => { lieux.fermer(); rmSync(dir, { recursive: true, force: true }); });

test('CSV : séparateur détecté, guillemets doublés, retour à la ligne dans un champ', () => {
  const lignes = [];
  const csv = lecteurCsv((l) => lignes.push(l));
  csv.ecrire('a;b;c\n1;"x ""y"";z";'); csv.ecrire('"deux\nlignes"\n'); csv.ecrire('3;;fin'); csv.fin();
  assert.equal(csv.separateur, ';');
  assert.deepEqual(lignes, [['a', 'b', 'c'], ['1', 'x "y";z', 'deux\nlignes'], ['3', '', 'fin']]);
});

test('coordonnées Lambert-93 converties en latitude et longitude', () => {
  const [lat, lon] = depuisLambert93(652469, 6861940); // Notre-Dame de Paris
  assert.ok(Math.abs(lat - 48.853) < 0.01 && Math.abs(lon - 2.35) < 0.01);
});

test('zip : lecture du répertoire central', () => {
  const e = entreesZip(ZIPS['https://exemple.test/commerces.zip']);
  assert.equal(e.length, 1);
  assert.equal(e[0].nom, 'shop_craft_office.csv');
  assert.equal(e[0].methode, 8);
});

test('base locale : seuls les lieux avec coordonnées, deux formats de fichier', () => {
  assert.equal(lieux.etat.pret, true);
  assert.equal(lieux.etat.lieux, 4);
  assert.equal(lieux.autour(43.2960, 5.3700)[0].nom, 'Cabinet dentaire Dupuis');
});

test('correspondance : SIRET, enseigne entre parenthèses, rien pour le voisin', () => {
  const plombier = trouverLocal(lieux, { siret: '12345678900012', siren: '123456789', nom: 'Martin SARL', lat: 45.70, lon: 4.90 });
  assert.equal(plombier.telephone, '04 78 11 22 33');
  assert.equal(plombier.email, 'contact@martin-plomberie.fr');
  // « TAI (NESTENN) » dans la base officielle : l'enseigne est entre parenthèses.
  const lead = leadDepuisApi({ siren: '111111118', nom_complet: 'TAI (NESTENN)', siege: { siret: '11111111800011', latitude: '49.6393', longitude: '-1.6216', code_postal: '50100', libelle_commune: 'CHERBOURG-EN-COTENTIN' } });
  assert.equal(lead.nom, 'TAI');
  assert.equal(lead.enseigne, 'NESTENN');
  const agence = trouverLocal(lieux, lead);
  assert.equal(agence.telephone, '02 33 00 00 00');
  assert.equal(agence.site, 'https://immobilier-cherbourg.nestenn.com/');
  assert.equal(trouverLocal(lieux, { nom: 'Pelissolo Immobilier', siren: '222222226', lat: 48.8710, lon: 2.3040 }), null);
  assert.equal(telFr('+33 6 12 34 56 78'), '06 12 34 56 78');
});

test('lot : base locale puis site de l’entreprise (deviné, vérifié par le SIREN)', async () => {
  const conf = {
    lieux, siteOpts: {},
    enrichir: async () => ({ confirmed: 'none', telephone: '', whatsapp: '06 12 34 56 78', email: 'contact@agence-web.fr', emails: ['contact@agence-web.fr', 'agence@nestenn.com'] }),
    deviner: async (l) => (l.siren === '222222226' ? { confirmed: 'siren', site: 'https://pelissolo.fr/', telephone: '01 45 00 00 00', email: 'contact@pelissolo.fr' } : null),
  };
  const r = await chercherLot([
    { id: 'a', siren: '111111118', siret: '11111111800011', nom: 'TAI', enseigne: 'NESTENN', lat: 49.6393, lon: -1.6216 },
    { id: 'b', siren: '222222226', siret: '', nom: 'Pelissolo Immobilier', enseigne: '', lat: 48.8710, lon: 2.3040 },
    { id: 'c', siren: '333333334', siret: '', nom: 'SCI Les Tilleuls', enseigne: '', lat: 46.0, lon: 3.0 },
  ], conf);
  assert.deepEqual(r.a, { telephone: '02 33 00 00 00', site: 'https://immobilier-cherbourg.nestenn.com/', email: 'agence@nestenn.com', whatsapp: '06 12 34 56 78', sources: ['OpenStreetMap', 'Site de l’entreprise'] });
  assert.deepEqual(r.b, { telephone: '01 45 00 00 00', site: 'https://pelissolo.fr/', email: 'contact@pelissolo.fr', whatsapp: '', sources: ['Site de l’entreprise'] });
  assert.deepEqual(r.c, { telephone: '', site: '', email: '', whatsapp: '', sources: [] });
});

test('HERE : le lieu au même nom près de l’adresse, avec son téléphone, son site et son email', async () => {
  const vrai = globalThis.fetch;
  let url = '';
  globalThis.fetch = async (u) => { url = String(u); return new Response(JSON.stringify({ items: [
    { title: 'Boulangerie Voisine', position: { lat: 45.7602, lng: 4.8502 }, contacts: [{ phone: [{ value: '+33478999999' }] }] },
    { title: 'Plomberie Martin', position: { lat: 45.7601, lng: 4.8501 }, contacts: [{ phone: [{ value: '+33478112233' }], www: [{ value: 'https://plomberie-martin.fr' }] }, { email: [{ value: 'contact@plomberie-martin.fr' }] }] },
  ] }), { status: 200 }); };
  try {
    const r = await SOURCES.here({ nom: 'Martin Jean', enseigne: '', lat: 45.7600, lon: 4.8500 }, { hereKey: 'cle' });
    assert.match(url, /^https:\/\/discover\.search\.hereapi\.com\/v1\/discover\?at=45\.76,4\.85&q=Martin%20Jean/);
    assert.deepEqual(r, { telephone: '04 78 11 22 33', site: 'https://plomberie-martin.fr/', email: 'contact@plomberie-martin.fr' });
  } finally { globalThis.fetch = vrai; }
});

test('site : téléphone et email de la page contact, SIREN des mentions légales', () => {
  const html = '<a href="tel:+33478112233">Appelez-nous</a> <a href="/mentions-legales">Mentions légales</a> <a href="/nous-contacter">Contact</a>'
    + '<p>Email : contact [at] martin-plomberie.fr</p><p>Hébergeur : OVH, 2 rue Kellermann, 59100 Roubaix, 09 72 10 10 07</p><p>RCS Lyon 123 456 789</p>';
  const x = extract(html, { pageKind: 'contact', siteHost: 'www.martin-plomberie.fr' });
  assert.equal(x.phones.filter((p) => p.w > 0)[0].national, '04 78 11 22 33');
  assert.ok(x.phones.find((p) => p.national === '09 72 10 10 07').w <= 0, 'le téléphone de l’hébergeur est écarté');
  assert.deepEqual(x.emails, ['contact@martin-plomberie.fr']);
  assert.ok(pageHasSiren(x.text, '123456789'));
  const liens = discoverLinks(html, 'https://www.martin-plomberie.fr/');
  assert.equal(liens.get('legal'), 'https://www.martin-plomberie.fr/mentions-legales');
  assert.equal(liens.get('contact'), 'https://www.martin-plomberie.fr/nous-contacter');
  assert.ok(slugCandidates({ nom: 'Plomberie Martin SARL', ville: 'Lyon' }).includes('plomberie-martin.fr'));
});

test('site : numéro WhatsApp des liens wa.me / api.whatsapp.com et du texte « WhatsApp : 06… »', () => {
  const a = extract('<a href="https://wa.me/33612345678?text=Bonjour">Écrivez-nous</a>', { pageKind: 'home' });
  assert.equal(a.whatsapps[0].national, '06 12 34 56 78');
  const b = extract('<a href="https://api.whatsapp.com/send?l=fr&amp;phone=%2B32470123456">WhatsApp</a>', { pageKind: 'home' });
  assert.equal(b.whatsapps[0].national, '+32470123456');
  const c = extract('<p>Téléphone : 04 78 11 22 33 — WhatsApp : 07 11 22 33 44</p>', { pageKind: 'contact' });
  assert.deepEqual(c.whatsapps.map((w) => w.national), ['07 11 22 33 44']);
  assert.equal(extract('<a href="tel:0478112233">Appel</a>').whatsapps.length, 0);
});

test('route /api/contacts : connexion requise, lot limité, réponse par lead', async () => {
  const made = await testApp({ contacts: { lieux, lireSites: false } });
  const server = await new Promise((res) => { const s = made.app.listen(0, () => res(s)); });
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const h = { 'Content-Type': 'application/json', 'X-Requested-With': 'blackstart' };
    const anon = await fetch(base + '/api/contacts', { method: 'POST', headers: h, body: JSON.stringify({ leads: [{ nom: 'x' }] }) });
    assert.equal(anon.status, 401);
    const setup = await fetch(base + '/api/auth/setup', { method: 'POST', headers: h, body: JSON.stringify({ name: 'Admin', email: 'admin@exemple.fr', password: 'motdepasse-solide-1' }) });
    const cookie = setup.headers.get('set-cookie').split(';')[0];
    const call = (body) => fetch(base + '/api/contacts', { method: 'POST', headers: { ...h, Cookie: cookie }, body: JSON.stringify(body) });
    assert.equal((await call({ leads: Array.from({ length: 9 }, () => ({ nom: 'x' })) })).status, 400);
    const ok = await call({ leads: [{ id: '111111118', siren: '111111118', siret: '11111111800011', nom: 'TAI', enseigne: 'NESTENN', lat: 49.6393, lon: -1.6216 }] });
    assert.equal(ok.status, 200);
    const body = await ok.json();
    assert.equal(body.base, true);
    assert.equal(body.resultats['111111118'].telephone, '02 33 00 00 00');
  } finally { server.close(); await made.cleanup(); }
});
