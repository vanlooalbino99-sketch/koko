// Captures de la vraie interface pour la Formation (scènes « vraie interface » de app/modules/bs-formation.js).
//
// Démarre un CRM de démonstration (serveur + données de démo + une petite équipe + messages), puis photographie
// chaque écran en clair et en sombre. Écrit :
//   app/formation/ecrans/<id>-<clair|sombre>.webp   les captures (1440 × 900, rendues en 1,25×)
//   app/formation/ecrans.js                          window.BS_ECRANS = { id: { w, h, z: { zone: [x, y, l, h] } } }
// Les zones (en pixels CSS de la capture) servent au zoom, au curseur et au surlignage des scènes.
//
//   node --experimental-sqlite scripts/formation/ecrans.mjs [id …]      (sans id : toutes les captures)
//
// À relancer quand l'interface change. Chromium : celui de Playwright, ou BS_CHROMIUM.
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { createApp } from '../../server/src/app.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, 'app', 'formation', 'ecrans');
const MANIFEST = join(ROOT, 'app', 'formation', 'ecrans.js');
const LOCAL_CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const DSF = 1.25, QUALITE = 78;
const H = { 'X-Requested-With': 'blackstart', 'Content-Type': 'application/json' };
const only = process.argv.slice(2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------------------------ le décor : serveur, démo, équipe, messages
const dir = mkdtempSync(join(tmpdir(), 'bs-ecrans-'));
const made = await createApp({ dataDir: dir });
const server = await new Promise((res) => { const s = made.app.listen(0, () => res(s)); });
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.BS_CHROMIUM || (existsSync(LOCAL_CHROMIUM) ? LOCAL_CHROMIUM : undefined) });

async function connecte(email, nom) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base + '/');
  if (nom) await p.fill('input[name=name]', nom);
  await p.fill('input[name=email]', email);
  await p.fill('input[name=password]', 'motdepasse1');
  await p.click('button[type=submit]');
  await p.waitForURL(base + '/');
  await p.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded);
  const f = join(dir, email + '.json');
  await ctx.storageState({ path: f });
  const api = (m, path, body) => p.evaluate(async ([m, path, body, H]) => {
    const r = await fetch(path, { method: m, headers: H, body: body ? JSON.stringify(body) : undefined });
    return r.json().catch(() => ({}));
  }, [m, path, body, H]);
  return { ctx, p, api, state: f };
}
const alex = await connecte('alex@blackstart.fr', 'Alex Martin');
{
  await alex.p.evaluate(() => document.getElementById('splash')?.remove());
  const v0 = await alex.p.evaluate(() => window.bsEquipe.etat().version);
  await alex.p.getByText('Charger la démo').first().click();
  await alex.p.waitForFunction((v) => { const s = window.bsEquipe.etat(); return s.version > v && !s.enAttente; }, v0, { timeout: 20000 });
}
const ids = { alex: (await alex.api('GET', '/api/users')).users[0].id };
for (const [cle, nom, email] of [['sarah', 'Sarah Benali', 'sarah@blackstart.fr'], ['lucas', 'Lucas Moreau', 'lucas@blackstart.fr'], ['ines', 'Inès Garnier', 'ines@blackstart.fr']]) {
  ids[cle] = (await alex.api('POST', '/api/users', { name: nom, email, password: 'motdepasse1', role: 'membre' })).user.id;
}
await alex.api('PATCH', '/api/users/' + ids.alex, { poste: 'Fondateur & gérant' });
await alex.api('PATCH', '/api/users/' + ids.sarah, { poste: 'Responsable commerciale', managerId: ids.alex });
await alex.api('PATCH', '/api/users/' + ids.lucas, { poste: 'Commercial terrain', managerId: ids.sarah });
await alex.api('PATCH', '/api/users/' + ids.ines, { poste: 'Chargée de clientèle', managerId: ids.sarah });
const groupe = (await alex.api('POST', '/api/chat/groupes', { name: 'Équipe commerciale', members: [ids.sarah, ids.lucas, ids.ines] })).conversation;
const sarah = await connecte('sarah@blackstart.fr');
const direct = (await sarah.api('POST', '/api/chat/directs', { userId: ids.alex })).conversation;
const lucas = await connecte('lucas@blackstart.fr');
for (const [qui, conv, txt] of [
  [sarah, direct.id, 'Salut Alex ! Le cabinet Lumière a validé le devis ce matin 🎉'],
  [alex, direct.id, 'Top ! Tu peux préparer la facture d’acompte ?'],
  [sarah, direct.id, 'C’est fait, je l’envoie avant midi. On fait le point en visio à 14 h ?'],
  [lucas, groupe.id, 'J’ai 3 RDV posés cette semaine sur Villeurbanne 💪'],
  [sarah, groupe.id, 'Bravo Lucas ! Pensez à mettre vos relances dans l’agenda.'],
  [alex, groupe.id, 'Objectif de la semaine : 40 appels chacun. On y va !'],
]) { await qui.api('POST', `/api/chat/conversations/${conv}/messages`, { body: txt }); await sleep(30); }
for (const s of [alex, sarah, lucas]) await s.ctx.close();

// ------------------------------------------------------------------ outils de prise de vue
async function ouvrir({ scheme, mobile, hash = '', state }) {
  const ctx = await browser.newContext({
    storageState: state || undefined, deviceScaleFactor: mobile ? 2 : DSF, isMobile: !!mobile, hasTouch: !!mobile,
    viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  });
  await ctx.addInitScript((sc) => {
    try {
      const c = JSON.parse(localStorage.getItem('blackstart-ui-v4') || '{}');
      c.scheme = sc; localStorage.setItem('blackstart-ui-v4', JSON.stringify(c));
      localStorage.setItem('bs-orbite', 'off');
    } catch (e) {}
  }, scheme);
  const p = await ctx.newPage();
  p.setDefaultTimeout(5000);
  p.erreurs = [];
  p.on('pageerror', (e) => p.erreurs.push(e.message));
  await p.goto(base + '/' + hash);
  if (state) {
    await p.waitForFunction(() => window.__bsStore && window.__bsStore.get().loaded);
    await p.evaluate(() => document.getElementById('splash')?.remove());
  }
  await sleep(600);
  return p;
}
const aller = async (p, page, attente = 1300) => { await p.evaluate((h) => { location.hash = '#/' + h; }, page); await sleep(attente); };
const sel = (s) => async (p) => { const l = p.locator(s).first(); if (!(await l.count())) return null; const b = await l.boundingBox({ timeout: 1500 }); return b && [b.x, b.y, b.width, b.height]; };
const texte = (s, t) => sel(`${s}:has-text("${t}")`);
const union = (...fs) => async (p) => {
  const bs = (await Promise.all(fs.map((f) => f(p)))).filter(Boolean);
  if (!bs.length) return null;
  const x = Math.min(...bs.map((b) => b[0])), y = Math.min(...bs.map((b) => b[1]));
  return [x, y, Math.max(...bs.map((b) => b[0] + b[2])) - x, Math.max(...bs.map((b) => b[1] + b[3])) - y];
};
const cliquer = async (p, s, attente = 900) => { await p.locator(s).first().click(); await sleep(attente); };
const entreprises = (n) => Array.from({ length: n }, (_, i) => {
  const noms = ['PLOMBERIE DES TERREAUX', 'SAS AQUA CONFORT', 'CHAUFFAGE ET SANITAIRE LYONNAIS', 'MARTIN PLOMBERIE', 'HYDRO SERVICES 69', 'ATELIER DU CUIVRE',
    'LYON DEPANNAGE PLOMBERIE', 'SARL BERTHIER FRERES', 'CROIX-ROUSSE SANITAIRE', 'EAU & CO', 'PLOMBERIE GERLAND', 'RHONE THERMIQUE'];
  const n1 = i + 1, siren = String(812345000 + n1 * 7);
  return {
    siren, nom_complet: noms[i % noms.length], activite_principale: '43.22A', date_creation: n1 % 4 ? '2014-05-12' : '2026-02-03',
    tranche_effectif_salarie: n1 % 3 ? '02' : '11', nombre_etablissements_ouverts: 1, complements: { est_entrepreneur_individuel: false },
    dirigeants: [{ nom: ['MARTIN', 'BERTHIER', 'ROUSSEAU', 'LAMBERT'][i % 4], prenoms: ['JULIEN', 'SOPHIE', 'KARIM', 'CLAIRE'][i % 4], qualite: 'Gérant', type_dirigeant: 'personne physique' }],
    siege: { siret: siren + '00018' },
    matching_etablissements: [{ siret: siren + '00018', etat_administratif: 'A', adresse: `${3 + n1 * 4} RUE DE LA REPUBLIQUE 6900${1 + (i % 9)} LYON`, code_postal: '6900' + (1 + (i % 9)),
      libelle_commune: 'LYON', latitude: String(45.75 + i / 400), longitude: String(4.83 + i / 500), activite_principale: '43.22A', liste_enseignes: null, date_creation: '2014-05-12' }],
  };
});

// ------------------------------------------------------------------ les écrans
// act : prépare l'écran ; z : zones nommées (sélecteur ou fonction → [x, y, largeur, hauteur]).
const ECRANS = [
  // 1. Prise en main
  { id: 'connexion', sans: true, hash: 'connexion', z: { formulaire: sel('form'), email: sel('input[name=email]') } },
  { id: 'accueil', act: (p) => aller(p, 'today'), z: {
    menu: sel('.sidebar'), prospection: texte('.nav-item', 'Aujourd'), recherche: sel('.topbar-search'), creer: texte('button.btn-primary', 'Créer'),
    theme: sel('button[aria-label^="Passer en mode"]'), moi: sel('.bs-moi'), notifs: sel('.topbar button[aria-label*=otification], .topbar .icon-btn-ghost >> nth=0'), replier: texte('.nav-item', 'Replier') } },
  { id: 'recherche', act: async (p) => { await aller(p, 'today'); await p.keyboard.press('Control+k'); await sleep(500); await p.keyboard.type('ost', { delay: 60 }); await sleep(700); },
    z: { palette: sel('.palette'), champ: sel('.palette-input'), resultat: sel('.palette-item') } },
  { id: 'creer', act: async (p) => { await aller(p, 'today'); await cliquer(p, 'button.btn-primary:has-text("Créer")', 600); },
    z: { creer: texte('button.btn-primary', 'Créer'), menu: union(sel('.menu-item >> nth=0'), sel('.menu-item >> nth=5')) } },
  { id: 'moi', act: async (p) => { await aller(p, 'today'); await cliquer(p, '.bs-moi', 700); }, z: { moi: sel('.bs-moi'), menu: sel('.bs-moi-menu') } },
  { id: 'mobile', mobile: true, act: (p) => aller(p, 'today'), z: { barre: sel('.bottom-nav'), session: sel('.session-cta') } },

  // 2. Aujourd'hui et appels
  { id: 'aujourdhui', act: (p) => aller(p, 'today'), z: {
    session: sel('.session-cta'), file: union(sel('.queue-item >> nth=0'), sel('.queue-item >> nth=6')), premier: sel('.queue-item >> nth=0'),
    appeler: sel('.call-btn >> nth=0'), taches: texte('.card', 'Tâches du jour'), relances: texte('.card', 'Prochaines relances'), objectifs: sel('.hero-stats, .today-hero') } },
  { id: 'appel', act: async (p) => { await aller(p, 'today'); await cliquer(p, '.session-cta', 1300); }, z: {
    composer: texte('a.btn', 'Composer'), script: union(sel('.script-head >> nth=0'), sel('.script-head >> nth=5')), notes: sel('textarea'),
    terminer: texte('button', 'Terminer l'), passer: texte('button', 'Passer') } },
  { id: 'resultat', act: async (p) => { await aller(p, 'today'); await cliquer(p, '.session-cta', 1300); await p.locator('textarea').first().fill('Intéressée par un audit, rappeler jeudi pour fixer le RDV.'); await cliquer(p, 'button:has-text("Terminer l")', 1100); },
    z: { fenetre: sel('.modal, [role=dialog]'), choix: sel('.modal .outcome, .modal .grid, [role=dialog] .grid') } },

  // 3. Prospects
  { id: 'prospects', act: (p) => aller(p, 'prospects'), z: {
    statuts: union(sel('.chip >> nth=0'), sel('.chip >> nth=8')), recherche: sel('.search-input'), filtres: texte('button', 'Filtres'), tableau: sel('table'),
    premier: sel('tbody tr >> nth=0'), importer: texte('button', 'Importer'), exporter: texte('button', 'Exporter'), nouveau: texte('button.btn-primary', 'Nouveau'), vue: sel('.segmented') } },
  { id: 'fiche', act: async (p) => { await aller(p, 'prospects'); await cliquer(p, 'tbody tr >> nth=0', 1200); }, z: {
    fiche: sel('aside.drawer'), actions: sel('.drawer .p-actions'), historique: sel('.drawer .timeline') } },
  { id: 'nouveau-prospect', act: async (p) => { await aller(p, 'prospects'); await cliquer(p, 'button.btn-primary:has-text("Nouveau")', 900); }, z: { fenetre: sel('.modal, [role=dialog]') } },
  { id: 'import', act: async (p) => { await aller(p, 'prospects'); await cliquer(p, 'button:has-text("Importer")', 900); }, z: { fenetre: sel('.modal, [role=dialog]') } },

  // 4. Nouveaux leads
  { id: 'leads', act: async (p) => {
    const cors = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
    await p.route('https://recherche-entreprises.api.gouv.fr/**', (r) => r.fulfill({ headers: cors, body: JSON.stringify({ results: entreprises(12), total_results: 214, page: 1, per_page: 12, total_pages: 18 }) }));
    await p.route('https://geo.api.gouv.fr/**', (r) => r.fulfill({ headers: cors, body: JSON.stringify([{ nom: 'Lyon', code: '69123', codesPostaux: ['69001', '69002', '69003'], codeDepartement: '69', centre: { type: 'Point', coordinates: [4.835, 45.758] } }]) }));
    await p.route('**/api/contacts', (r) => {
      const leads = JSON.parse(r.request().postData() || '{}').leads || [];
      const resultats = {};
      leads.forEach((l, i) => { if ((+l.siren) % 3) resultats[l.siren] = { telephone: '04 78 ' + String(20 + i * 7).slice(-2) + ' 1' + i + ' 3' + i, site: i % 2 ? '' : l.nom.toLowerCase().replace(/[^a-z]+/g, '-') + '.fr', email: i % 2 ? 'contact@' + l.nom.toLowerCase().replace(/[^a-z]+/g, '') + '.fr' : '', sources: ['base'] }; });
      r.fulfill({ headers: cors, body: JSON.stringify({ resultats, base: true }) });
    });
    await aller(p, 'leads');
    await p.getByRole('tab', { name: 'Artisans / BTP' }).click();
    await p.selectOption('select[name=metier]', 'plombier');
    await p.fill('input[name=zone]', 'Lyon');
    await p.locator('input[name=zone]').dispatchEvent('change');
    await p.locator('button[data-act=gen]').first().click();
    await p.locator('.bsl-card >> nth=11').waitFor();
    await sleep(2500);
  }, z: { secteurs: sel('[role=tablist]'), formulaire: union(sel('select[name=metier]'), sel('button[data-act=gen]')), generer: sel('button[data-act=gen]'),
    cartes: union(sel('.bsl-card >> nth=0'), sel('.bsl-card >> nth=5')), carte: sel('.bsl-card >> nth=0'), ajouter: sel('.bsl-card >> nth=0 >> button') } },
  { id: 'niche', act: async (p) => { await aller(p, 'reports', 1600); await p.locator('.bsn-root').scrollIntoViewIfNeeded(); await sleep(600); },
    z: { niche: sel('.bsn-root'), ideal: texte('.bsn-root button', 'client idéal') } },

  // 5. Pipeline, agenda, tâches
  { id: 'pipeline', act: (p) => aller(p, 'pipeline'), z: { colonnes: sel('.kanban'), carte: sel('.kb-card'), colonne2: sel('.kb-col >> nth=1') } },
  { id: 'agenda', act: (p) => aller(p, 'agenda'), z: { relances: texte('.card', 'relances'), semaine: sel('.cal, .calendar, .week'), vues: union(texte('.seg', 'Jour'), texte('.seg', 'Mois')), planifier: texte('button', 'Planifier') } },
  { id: 'agenda-mois', act: async (p) => { await aller(p, 'agenda'); await cliquer(p, '.seg:has-text("Mois")', 900); }, z: { mois: sel('.cal, .calendar, .month') } },
  { id: 'planifier', act: async (p) => { await aller(p, 'agenda'); await cliquer(p, 'button:has-text("Planifier")', 900); }, z: { fenetre: sel('.modal, [role=dialog]') } },
  { id: 'taches', act: (p) => aller(p, 'tasks'), z: { retard: texte('.card', 'En retard'), jour: texte('.card', 'Aujourd'), nouvelle: texte('button', 'Nouvelle tâche') } },

  // 6. Devis, factures, paiements
  { id: 'devis', act: (p) => aller(p, 'devis'), z: { kpi: sel('.kpis'), liste: sel('table'), nouveau: texte('button', 'Nouveau devis'), onglets: union(texte('button', 'Devis'), texte('button', 'Factures')) } },
  { id: 'devis-edition', act: async (p) => { await aller(p, 'devis'); await cliquer(p, 'button:has-text("Nouveau devis")', 1200); }, z: { fenetre: sel('.modal, [role=dialog], .editor'), lignes: sel('.doc-lines'), totaux: sel('.t-row.t-total') } },
  { id: 'devis-apercu', act: async (p) => { await aller(p, 'devis'); await cliquer(p, 'tbody tr >> nth=0', 1300); }, z: { document: sel('.a4, .doc-page, .paper, .modal'), actions: sel('.modal .modal-foot, [role=dialog] footer') } },
  { id: 'paiements', act: (p) => aller(p, 'payments'), z: { kpi: union(texte('.card', 'À encaisser'), texte('.card', 'Encaissé au total')), liens: texte('.card', 'Liens de paiement'), virement: texte('.card', 'Virement bancaire'), factures: texte('.card', 'Factures à encaisser') } },

  // 7. Clients, tableau de bord, rapports
  { id: 'clients', act: (p) => aller(p, 'clients'), z: { kpi: sel('.kpis'), mrr: texte('.card', 'MRR par secteur'), top: texte('.card', 'Top clients'), portefeuille: texte('.card', 'Portefeuille') } },
  { id: 'tableau', act: (p) => aller(p, 'dashboard', 1800), z: { kpi: sel('.kpis'), objectifs: texte('.card', 'Objectifs'), entonnoir: texte('.card', 'Entonnoir'), appels: texte('.card', 'Appels par jour') } },
  { id: 'rapports', act: (p) => aller(p, 'reports', 1800), z: { kpi: sel('.kpis'), niche: sel('.bsn-root'), exporter: texte('button', 'Exporter CSV'), presenter: texte('button', 'Présenter') } },

  // 8. Carte clients
  { id: 'carte', act: (p) => aller(p, 'carte', 3500), z: { carte: sel('.bsc-canvas'), vues: sel('.bsc-tools, .bsc-vues'), villes: texte('.card', 'Top villes'), kpi: sel('.bsc-kpi'), filtres: union(texte('button', 'Tous'), texte('button', 'Prospects')) } },
  { id: 'globe', act: async (p) => { await aller(p, 'carte', 2500); await cliquer(p, 'button:has-text("Globe 3D")', 2500); }, z: { carte: sel('.bsc-canvas'), vues: texte('button', 'Globe 3D') } },

  // 9. Messagerie
  { id: 'messages', act: async (p) => { await aller(p, 'messages', 1500); await cliquer(p, '.bsm-conv:has-text("Sarah"), [data-conv]:has-text("Sarah"), button:has-text("Sarah Benali")', 1200); },
    z: { liste: sel('aside.bsm-side'), fil: sel('.bsm-scroll'), saisie: sel('form.bsm-compose'), visio: sel('.bsm-visio'), joindre: sel('.bsm-compose .bsm-outil >> nth=0'), emoji: sel('.bsm-compose .bsm-outil >> nth=-1') } },
  { id: 'groupes', act: async (p) => { await aller(p, 'groupes', 1500); await cliquer(p, ':is(button, div, a):has-text("Équipe commerciale") >> nth=-1', 1200); },
    z: { liste: sel('aside.bsm-side'), fil: sel('.bsm-scroll'), nouveau: texte('button', 'Nouveau groupe') } },
  { id: 'visio', act: (p) => aller(p, 'visio', 1300), z: { lancer: texte('button', 'Lancer'), groupe: texte('button', 'Nouveau groupe') } },

  // 10. Équipe et compte
  { id: 'organigramme', act: async (p) => { await aller(p, 'today'); await cliquer(p, '.bs-moi', 600); await cliquer(p, '.bs-moi-menu :text("Organigramme")', 1500); }, z: { organigramme: sel('.bsm-org, .organigramme, [role=dialog]') } },
  { id: 'compte', act: async (p) => { await aller(p, 'today'); await cliquer(p, '.bs-moi', 600); await cliquer(p, '.bs-moi-menu :text("Mon compte")', 1300); }, z: { fenetre: texte('section.card', 'Mon compte'), sonnerie: texte('section.card', 'Sonnerie des visios') } },
  { id: 'equipe', act: async (p) => { await aller(p, 'settings'); await cliquer(p, ':text("Équipe & compte")', 1300); await p.evaluate(() => document.querySelector('.bse-table')?.closest('section')?.scrollIntoView({ block: 'start' })); await sleep(500); },
    z: { membres: sel('.bse-table >> nth=0'), inviter: sel('form[data-form=add]'), equipe: texte('section.card', 'Les membres voient') } },
  { id: 'donnees', act: async (p) => { await aller(p, 'settings'); await cliquer(p, ':text-is("Données")', 1300); }, z: { sauvegarde: texte('.card', 'auvegarde'), versions: texte('.card', 'ersion') } },
  { id: 'suivi', act: async (p) => { await aller(p, 'formations', 1600); await p.locator('.bsf-team-card').scrollIntoViewIfNeeded(); await sleep(500); }, z: { suivi: sel('.bsf-team-card'), lecteur: sel('.bsf-player') } },

  // 11. Outils et réglages
  { id: 'enregistreur', act: (p) => aller(p, 'tools'), z: { onglets: sel('.tabs, [role=tablist]'), demarrer: texte('button', 'Démarrer l'), liste: texte('.card', 'Enregistrements') } },
  { id: 'script', act: async (p) => { await aller(p, 'tools'); await cliquer(p, ':text("Script d\'appel")', 900); }, z: { script: sel('.card') } },
  { id: 'modeles', act: async (p) => { await aller(p, 'tools'); await cliquer(p, ':text("Modèles d\'email")', 900); }, z: { modeles: sel('.card') } },
  { id: 'apparence', act: async (p) => { await aller(p, 'settings'); await cliquer(p, ':text-is("Apparence")', 1000); }, z: { themes: texte('.card', 'Thème'), accent: texte('.card', 'ccent'), sections: sel('.settings-nav, .subnav') } },
  { id: 'ambiance', act: async (p) => { await aller(p, 'settings'); await cliquer(p, ':text-is("Ambiance")', 1200); }, z: { ambiance: sel('.card') } },
  { id: 'notifications', act: async (p) => { await aller(p, 'settings'); await cliquer(p, ':text-is("Notifications")', 1100); }, z: { sonnerie: texte('.card', 'onnerie'), notifs: sel('.card') } },
  { id: 'icones', act: async (p) => { await aller(p, 'settings'); await cliquer(p, ':text("Icônes du menu")', 1100); }, z: { icones: sel('.card') } },
];

// ------------------------------------------------------------------ prise de vue
mkdirSync(OUT, { recursive: true });
const manifeste = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8').replace(/^[^{]*/, '').replace(/;\s*$/, '')) : {};
const tmp = mkdtempSync(join(tmpdir(), 'bs-ecrans-png-'));
const rates = [];
const ecrire = () => { manifeste._v = Date.now().toString(36); writeFileSync(MANIFEST, '/* Généré par scripts/formation/ecrans.mjs : zones des captures de la vraie interface. */\nwindow.BS_ECRANS = ' + JSON.stringify(manifeste) + ';\n'); };
for (const e of ECRANS.filter((x) => !only.length || only.includes(x.id))) {
  for (const [scheme, suffixe] of [['dark', 'sombre'], ['light', 'clair']]) {
    let p;
    try {
      p = await ouvrir({ scheme, mobile: e.mobile, hash: e.sans ? e.hash : '', state: e.sans ? null : alex.state });
      if (e.act) await e.act(p);
      if (process.env.SONDE && scheme === 'dark') console.log(e.id, await p.evaluate(() => [...new Set([...document.querySelectorAll('body *')].filter((x) => { const r = x.getBoundingClientRect(); return r.width > 30 && r.height > 14 && r.top < innerHeight && r.left < innerWidth && x.className && typeof x.className === 'string'; }).map((x) => x.tagName.toLowerCase() + '.' + x.className.trim().split(/\s+/).join('.')))].join(' ')));
      await p.mouse.move(-10, -10);
      await sleep(250);
      const png = join(tmp, `${e.id}-${suffixe}.png`);
      await p.screenshot({ path: png, timeout: 30000 });
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-c:v', 'libwebp', '-quality', String(QUALITE), '-compression_level', '6', join(OUT, `${e.id}-${suffixe}.webp`)]);
      if (scheme === 'dark') {
        const vp = p.viewportSize(), z = {};
        for (const [k, f] of Object.entries(e.z || {})) {
          try { const b = await f(p); if (b && b[2] > 2 && b[3] > 2) z[k] = b.map((v) => Math.round(v)); else rates.push(`${e.id}.${k} (absente)`); } catch (er) { rates.push(`${e.id}.${k} (${er.message.split('\n')[0].slice(0, 80)})`); }
        }
        manifeste[e.id] = { w: vp.width, h: vp.height, z };
        ecrire();
      }
      if (p.erreurs.length) rates.push(`${e.id} erreurs : ${p.erreurs.join(' | ').slice(0, 200)}`);
      console.log(`✔ ${e.id}-${suffixe}`);
    } catch (er) {
      rates.push(`${e.id}-${suffixe} : ${er.message.split('\n')[0].slice(0, 160)}`);
      console.log(`✘ ${e.id}-${suffixe}`);
    } finally { await p?.context().close(); }
  }
}
ecrire();
if (rates.length) console.log('\nÀ vérifier :\n- ' + rates.join('\n- '));
await browser.close(); made.hub?.close(); server.close(); await made.db?.close(); rmSync(dir, { recursive: true, force: true }); rmSync(tmp, { recursive: true, force: true });
