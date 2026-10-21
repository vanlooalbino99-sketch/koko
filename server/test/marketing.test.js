// Rubrique Marketing (Campagnes, Modèles, Contenu, Sources & ROI) : branchements dans le CRM, données
// partagées par l'équipe (clé « marketing » des données du CRM) et règles des séquences de mails.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { testApp } from './helpers.js';
import { ACCES } from '../src/acces.js';
import { merge3 } from '../src/merge.js';

const lire = (f) => readFileSync(new URL('../../' + f, import.meta.url), 'utf8');
const JSONH = { 'Content-Type': 'application/json', 'X-Requested-With': 'blackstart' };
const PAGES = ['campagnes', 'modeles', 'contenu', 'sources'];
let server, base, made, admin;

before(async () => {
  made = await testApp();
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  const r = await fetch(base + '/api/auth/setup', { method: 'POST', headers: JSONH, body: JSON.stringify({ name: 'Albino', email: 'albino@exemple.fr', password: 'motdepasse-solide-1' }) });
  admin = r.headers.get('set-cookie').split(';')[0];
});
after(async () => { server.close(); await made.cleanup(); });

test('Marketing est branché dans le CRM : menu, pages, accès, icônes, enregistrement des données', () => {
  const app = lire('app/core/app.min.js'), html = lire('app/index.html');
  for (const bout of ['"payments","campagnes","modeles","contenu","sources"', '{id:"payments",label:"Paiements",icon:"wallet"},{group:"Marketing"},{id:"campagnes",label:"Campagnes",icon:"megaphone"}',
    '{id:"sources",label:"Sources & ROI",icon:"chart-pie"},{group:"Automatisation"}', 'window.bsCampagnes.monter(bsEl)', 'window.bsModeles.monter(bsEl)', 'window.bsContenu.monter(bsEl)',
    'window.bsSources.monter(bsEl)', '"templates","marketing","automatisations"]', 'marketing:n.marketing&&typeof n.marketing=="object"', 'campagnes:bsMk&&window.bsCampagnes']) assert.ok(app.includes(bout), bout);
  // bs-marketing.js (outils communs) est chargé avant les pages.
  const ordre = ['bs-marketing', 'bs-campagnes', 'bs-modeles', 'bs-contenu', 'bs-sources'].map((m) => html.indexOf(`modules/${m}.js`));
  assert.ok(ordre.every((i, k) => i > 0 && (k === 0 || i > ordre[k - 1])), 'ordre des scripts');
  for (const p of PAGES) assert.ok(ACCES.includes(p), p);
  // La liste des rubriques du navigateur suit celle du serveur, dans le même ordre.
  const acces = lire('app/modules/bs-acces.js');
  const cles = [...acces.slice(acces.indexOf('var RUBRIQUES'), acces.indexOf('var CLES')).matchAll(/\{ id: '([\w.]+)'/g)].map((m) => m[1]);
  assert.deepEqual(cles, ACCES);
  const icones = lire('app/modules/bs-icones.js');
  for (const p of PAGES) assert.match(icones, new RegExp(`id: '${p}'`));
});

test('les données Marketing sont enregistrées avec celles du CRM et fusionnées entre deux membres', async () => {
  const put = (value, baseVersion) => fetch(base + '/api/data/blackstart-data-v1', { method: 'PUT', headers: { ...JSONH, Cookie: admin }, body: JSON.stringify({ value: JSON.stringify(value), baseVersion }) }).then((r) => r.json());
  const c = { id: 'c1', nom: 'Prospection', etapes: [{ id: 'e1', delai: 0, sujet: 'Bonjour', texte: '…' }], inscrits: [] };
  const v1 = await put({ prospects: [], marketing: { campagnes: [c], posts: [] } }, 0);
  // Deux navigateurs partent de la même version : l'un inscrit p1, l'autre ajoute une publication.
  await put({ prospects: [], marketing: { campagnes: [{ ...c, inscrits: [{ id: 'p1', etape: 0 }] }], posts: [] } }, v1.version);
  const r = await put({ prospects: [], marketing: { campagnes: [c], posts: [{ id: 'post-1', titre: 'Sondage' }] } }, v1.version);
  assert.equal(r.merged, true);
  const d = JSON.parse(r.value);
  assert.deepEqual(d.marketing.campagnes[0].inscrits.map((i) => i.id), ['p1']);
  assert.deepEqual(d.marketing.posts.map((p) => p.id), ['post-1']);
  // Envois notés par deux membres sur deux prospects de la même campagne : rien n'est perdu.
  const b = { campagnes: [{ ...c, inscrits: [{ id: 'p1', envois: [] }, { id: 'p2', envois: [] }] }] };
  const m1 = { campagnes: [{ ...c, inscrits: [{ id: 'p1', envois: [{ etape: 0 }] }, { id: 'p2', envois: [] }] }] };
  const m2 = { campagnes: [{ ...c, inscrits: [{ id: 'p1', envois: [] }, { id: 'p2', envois: [{ etape: 0 }] }] }] };
  assert.deepEqual(merge3(b, m1, m2).campagnes[0].inscrits.map((i) => i.envois.length), [1, 1]);
});

// Les modules du navigateur, exécutés avec un faux magasin de données.
function navigateur(etat) {
  let s = etat;
  const store = { get: () => s, set(f) { const p = typeof f === 'function' ? f(s) : f; s = { ...s, ...p }; }, subscribe: () => () => {} };
  const ctx = { console, localStorage: { getItem: () => null, setItem() {} }, document: { addEventListener() {}, getElementById: () => null, head: { appendChild() {} } } };
  ctx.window = ctx; ctx.__bsStore = store;
  vm.createContext(ctx);
  for (const f of ['bs-marketing', 'bs-campagnes']) vm.runInContext(lire(`app/modules/${f}.js`), ctx, { filename: f + '.js' });
  return { ctx, store };
}

test('séquences : qui reçoit, qui sort, plafond par jour', () => {
  const auj = (() => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); })();
  const P = (id, statut, email, extra) => ({ id, entreprise: 'Entreprise ' + id, contact: 'Paul Martin', statut, email, ville: 'Lyon', tags: [], events: [], ...extra });
  const campagne = { id: 'c1', nom: 'Test', actif: true, maxJour: 5, filtres: { statut: 'a_appeler' }, etapes: [{ id: 'e1', delai: 0, sujet: '{{entreprise}}', texte: 'Bonjour {{prenom}}' }, { id: 'e2', delai: 3, sujet: 'Re', texte: '…' }], inscrits: [] };
  const { ctx, store } = navigateur({ prospects: [P('p1', 'a_appeler', 'a@b.fr'), P('p2', 'a_appeler', ''), P('p3', 'a_appeler', 'c@d.fr', { nePlusContacter: true }), P('p4', 'rdv_pris', 'e@f.fr'), P('p5', 'a_appeler', 'g@h.fr')],
    marketing: { campagnes: [campagne] } });
  const C = ctx.bsCampagnes, M = ctx.bsMarketing;
  const cand = C._candidats(campagne);
  assert.deepEqual(Array.from(cand.ok, (p) => p.id), ['p1', 'p5']);
  assert.equal(cand.sansEmail, 1); assert.equal(cand.bloques, 1);
  assert.equal(M.remplir('Bonjour {{prenom}}, {{entreprise}} à {{ville}}', store.get().prospects[0]), 'Bonjour Paul, Entreprise p1 à Lyon');
  assert.equal(M.remplir('Bonjour {{prenom}}', { contact: 'M. Durand' }), 'Bonjour M. Durand');
  const ins = (id, extra) => ({ id, at: auj, depart: 'a_appeler', etape: 0, prochain: auj, fini: '', envois: [], ...extra });
  const avec = (inscrits, extra) => store.set((s) => ({ marketing: { campagnes: [{ ...campagne, ...extra, inscrits }] } }));
  avec([ins('p1'), ins('p5')]);
  assert.equal(C._dus().length, 2);
  // Plafond par jour : un mail déjà parti aujourd'hui, plafond 2 → il en reste 1.
  avec([ins('p1'), ins('p5'), ins('p9', { etape: 1, envois: [{ etape: 0, at: new Date().toISOString() }], prochain: '2999-01-01' })], { maxJour: 2 });
  assert.equal(C._dus().length, 1);
  // A répondu, statut changé, ne plus contacter, séquence terminée, campagne en pause : plus rien.
  avec([ins('p1', { fini: 'repondu' }), ins('p5')]);
  assert.deepEqual(Array.from(C._dus(), (d) => d.pid), ['p5']);
  store.set((s) => ({ prospects: s.prospects.map((p) => (p.id === 'p5' ? { ...p, statut: 'rdv_pris' } : p)) }));
  assert.equal(C._dus().length, 0);
  avec([ins('p1', { etape: 2 })]);
  assert.equal(C._dus().length, 0);
  avec([ins('p1', { prochain: '2999-01-01' })]);
  assert.equal(C._dus().length, 0, 'pas avant la date prévue');
  avec([ins('p1')], { actif: false });
  assert.equal(C._dus().length, 0, 'campagne en pause');
  avec([ins('p1')], { supprime: true });
  assert.equal(C._dus().length, 0, 'campagne supprimée');
});
