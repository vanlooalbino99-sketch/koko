// Claude dans le CRM (/api/ia) : clé collée par un administrateur (chiffrée, jamais renvoyée), simulateur d'appel
// (répliques du prospect, note de l'appel), rédaction, erreurs de Claude expliquées en français.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import Anthropic from '@anthropic-ai/sdk';
import { testApp } from './helpers.js';
import { MODELE, erreurClaude } from '../src/routes/ia.js';

const JSONH = { 'Content-Type': 'application/json', 'X-Requested-With': 'blackstart' };
const CLE = 'sk-ant-api03-' + 'x'.repeat(40);
let server, base, made, admin, marie, marieId;
const demandes = [], cles = [];
let prochaine = null; // réponse (ou erreur) que le faux Claude donnera au prochain appel
const faux = (cle) => {
  cles.push(cle);
  return {
    models: { retrieve: async (m) => { if (cle.endsWith('mauvaise' + 'x'.repeat(32))) throw new Anthropic.AuthenticationError(401, { type: 'error' }, 'invalid x-api-key', new Headers()); return { id: m }; } },
    beta: { messages: { create: async (p) => {
      demandes.push(p);
      const r = prochaine; prochaine = null;
      if (r instanceof Error) throw r;
      return r || { stop_reason: 'end_turn', content: [{ type: 'thinking', thinking: '' }, { type: 'text', text: 'Bonjour, oui ?' }] };
    } } },
  };
};
const call = (c, method, path, body) => fetch(base + path, { method, headers: { ...JSONH, Cookie: c }, body: body ? JSON.stringify(body) : undefined });
const FICHE = 'Prospect à jouer : Paul Martin, gérant de la Boulangerie Martin, à Lyon.';

before(async () => {
  delete process.env.ANTHROPIC_API_KEY;
  made = await testApp({ ia: { creer: faux } });
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  const r = await fetch(base + '/api/auth/setup', { method: 'POST', headers: JSONH, body: JSON.stringify({ name: 'Albino', email: 'albino@exemple.fr', password: 'motdepasse-solide-1' }) });
  admin = r.headers.get('set-cookie').split(';')[0];
  await call(admin, 'POST', '/api/users', { name: 'Marie', email: 'marie@exemple.fr', password: 'motdepasse-solide-2', role: 'membre' });
  marieId = (await (await call(admin, 'GET', '/api/users')).json()).users.find((u) => u.email === 'marie@exemple.fr').id;
  const r0 = await fetch(base + '/api/auth/login', { method: 'POST', headers: JSONH, body: JSON.stringify({ email: 'marie@exemple.fr', password: 'motdepasse-solide-2' }) });
  marie = r0.headers.get('set-cookie').split(';')[0];
});
after(async () => { server.close(); await made.cleanup(); });

test('sans clé : le CRM le dit, et rien ne part chez Claude', async () => {
  assert.deepEqual(await (await call(admin, 'GET', '/api/ia/etat')).json(), { ia: false, source: null, admin: true, modele: MODELE });
  const r = await call(admin, 'POST', '/api/ia/simulation/repondre', { fiche: FICHE, messages: [{ de: 'vendeur', texte: 'Bonjour !' }] });
  assert.equal(r.status, 409);
  assert.equal((await r.json()).code, 'SANS_CLE');
  assert.equal(demandes.length, 0);
});

test('la clé : réservée aux administrateurs, vérifiée, chiffrée en base, jamais renvoyée', async () => {
  assert.equal((await call(marie, 'PUT', '/api/ia/cle', { cle: CLE })).status, 403);
  let r = await call(admin, 'PUT', '/api/ia/cle', { cle: 'bonjour' });
  assert.equal(r.status, 400);
  assert.match((await r.json()).error, /sk-ant-/);
  r = await call(admin, 'PUT', '/api/ia/cle', { cle: 'sk-ant-api03-mauvaise' + 'x'.repeat(32) });
  assert.equal(r.status, 400);
  assert.match((await r.json()).error, /clé Claude est refusée/);
  r = await call(admin, 'PUT', '/api/ia/cle', { cle: ' ' + CLE + '\n' });
  assert.equal(r.status, 200);
  const etat = await (await call(marie, 'GET', '/api/ia/etat')).json();
  assert.deepEqual(etat, { ia: true, source: 'crm', admin: false, modele: MODELE });
  const brut = (await made.db.get("SELECT value FROM settings WHERE key = 'ia_claude'")).value;
  assert.ok(!brut.includes(CLE) && !brut.includes('xxxxxxxx'), 'la clé est chiffrée');
  assert.ok(!JSON.stringify(etat).includes('sk-ant'));
});

test('simulateur : Claude joue le prospect avec la fiche, la conversation et le repli automatique', async () => {
  demandes.length = 0;
  prochaine = { stop_reason: 'end_turn', content: [{ type: 'text', text: '*soupir* « Écoutez, je n’ai pas le temps. »' }] };
  const messages = [{ de: 'prospect', texte: 'Boulangerie Martin, bonjour ?' }, { de: 'vendeur', texte: 'Bonjour Monsieur Martin, Albino de Blackstart.' }];
  let r = await call(marie, 'POST', '/api/ia/simulation/repondre', { fiche: FICHE, messages });
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { texte: 'Écoutez, je n’ai pas le temps.', fin: false });
  const p = demandes[0];
  assert.equal(p.model, MODELE);
  assert.equal(p.fallbacks, 'default');
  assert.deepEqual(p.betas, ['server-side-fallback-2026-07-01']);
  assert.equal(p.output_config.effort, 'low');
  assert.ok(p.system.includes(FICHE));
  assert.deepEqual(p.messages.map((m) => m.role), ['user', 'assistant', 'user']);
  assert.equal(p.messages[2].content, 'Bonjour Monsieur Martin, Albino de Blackstart.');
  assert.equal(cles.at(-1), CLE, 'la clé déchiffrée est utilisée');

  prochaine = { stop_reason: 'end_turn', content: [{ type: 'text', text: 'Bon, d’accord pour mardi 10 h. Au revoir. [FIN]' }] };
  r = await call(marie, 'POST', '/api/ia/simulation/repondre', { fiche: FICHE, messages: messages.concat({ de: 'prospect', texte: 'Non.' }, { de: 'vendeur', texte: 'Mardi 10 h ?' }) });
  assert.deepEqual(await r.json(), { texte: 'Bon, d’accord pour mardi 10 h. Au revoir.', fin: true });

  r = await call(marie, 'POST', '/api/ia/simulation/repondre', { fiche: FICHE, messages: [{ de: 'prospect', texte: 'Allô ?' }] });
  assert.equal(r.status, 400, 'c’est au vendeur de parler');
});

test('simulateur : la note de l’appel arrive en JSON structuré, bornée à 10', async () => {
  demandes.length = 0;
  const note = { note: 14, verdict: 'Bon appel.', objectif_atteint: true, points_forts: ['Présentation claire'], a_ameliorer: ['a', 'b', 'c'], objections: [{ objection: 'Pas le temps', bien_traitee: true, conseil: 'OK' }], phrase_a_essayer: 'Mardi ou jeudi ?' };
  prochaine = { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(note) }] };
  const r = await call(marie, 'POST', '/api/ia/simulation/noter', { fiche: FICHE, duree: 185, messages: [{ de: 'prospect', texte: 'Allô ?' }, { de: 'vendeur', texte: 'Bonjour !' }] });
  assert.equal(r.status, 200);
  const b = await r.json();
  assert.equal(b.note, 10);
  assert.equal(b.objectif_atteint, true);
  const p = demandes[0];
  assert.equal(p.output_config.format.type, 'json_schema');
  assert.equal(p.output_config.format.schema.additionalProperties, false);
  assert.match(p.messages[0].content, /Vendeur : Bonjour !/);
  assert.match(p.messages[0].content, /3 min/);
});

test('rédaction et refus : texte prêt à copier, refus et erreurs en français', async () => {
  prochaine = { stop_reason: 'end_turn', content: [{ type: 'text', text: 'Objet : {{entreprise}}\nBonjour {{prenom}},' }] };
  let r = await call(marie, 'POST', '/api/ia/rediger', { type: 'email', consigne: 'Premier mail pour une boulangerie' });
  assert.deepEqual(await r.json(), { texte: 'Objet : {{entreprise}}\nBonjour {{prenom}},' });
  prochaine = { stop_reason: 'refusal', content: [] };
  r = await call(marie, 'POST', '/api/ia/rediger', { type: 'post', consigne: 'x' });
  assert.equal(r.status, 422);
  prochaine = new Anthropic.RateLimitError(429, { type: 'error' }, 'rate', new Headers());
  r = await call(marie, 'POST', '/api/ia/rediger', { type: 'post', consigne: 'x' });
  assert.equal(r.status, 429);
  assert.match((await r.json()).error, /trop de demandes/);
  assert.equal(erreurClaude(new Anthropic.BadRequestError(400, { type: 'error' }, 'credit', new Headers())).status, 400);
  assert.match(erreurClaude(new Anthropic.BadRequestError(400, {}, 'x', new Headers())).error, /crédit/);
  assert.equal(erreurClaude(new Anthropic.InternalServerError(529, {}, 'overloaded', new Headers())).status, 503);
  assert.equal(erreurClaude(new Anthropic.APIConnectionError({ message: 'x' })).status, 502);
});

test('leads LinkedIn : Claude qualifie sans recevoir les noms, réponse bornée et rangée par lead', async () => {
  demandes.length = 0;
  prochaine = { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify({ leads: [
    { id: 'a', score: 140, categorie: 'qualifie', raison: 'Gérant d’une plomberie à Lyon.', message: 'Bonjour {{prenom}}, ' + 'x'.repeat(400) },
    { id: 'b', score: 20, categorie: 'bizarre', raison: 'Étudiant.', message: 'Bonjour {{prenom}},' },
    { id: 'z', score: 99, categorie: 'qualifie', raison: 'inventé', message: '' },
  ] }) }] };
  const leads = [
    { id: 'a', nom: 'Jean Dupont', poste: 'Gérant chez Plomberie Dupont', entreprise: 'Plomberie Dupont', lieu: 'Lyon' },
    { id: 'b', nom: 'Léa Martin', poste: 'Étudiante en droit', entreprise: '', lieu: 'Paris' },
    { id: 'c', nom: 'Vide', poste: '', entreprise: '' },
  ];
  let r = await call(marie, 'POST', '/api/ia/linkedin/qualifier', { cible: { postes: 'gérant', zone: 'Lyon' }, leads });
  assert.equal(r.status, 200);
  const b = await r.json();
  assert.deepEqual(b.leads.map((l) => [l.id, l.score, l.categorie]), [['a', 100, 'qualifie'], ['b', 20, 'hors_cible']]);
  assert.ok(b.leads[0].message.length <= 300);
  const p = demandes[0];
  assert.equal(p.output_config.format.type, 'json_schema');
  assert.ok(!JSON.stringify(p).includes('Dupont Jean') && !JSON.stringify(p).includes('Jean Dupont') && !JSON.stringify(p).includes('Léa'), 'les noms ne partent pas chez Claude');
  assert.match(p.messages[0].content, /Zone visée : Lyon/);
  assert.match(p.system, /\{\{prenom\}\}/);
  r = await call(marie, 'POST', '/api/ia/linkedin/qualifier', { leads: Array.from({ length: 26 }, (_, i) => ({ id: 'l' + i, poste: 'Gérant' })) });
  assert.equal(r.status, 400);
});

test('assistants IA : liste selon l’accès, réglage par l’administrateur, conversation avec le contexte du CRM', async () => {
  let l = await (await call(admin, 'GET', '/api/ia/assistants')).json();
  assert.equal(l.ia, true);
  assert.ok(l.assistants.length >= 8);
  assert.deepEqual(l.assistants.find((a) => a.id === 'ceo').acces, { tous: false, membres: [] });
  l = await (await call(marie, 'GET', '/api/ia/assistants')).json();
  assert.deepEqual(l.assistants.map((a) => a.id), ['membre', 'leads', 'clients']);
  assert.equal(l.assistants[0].acces, undefined);
  assert.equal((await call(marie, 'POST', '/api/ia/assistants/ceo', { messages: [{ de: 'moi', texte: 'Bonjour' }] })).status, 403);
  assert.equal((await call(marie, 'PUT', '/api/ia/assistants/ceo/acces', { tous: false, membres: [marieId] })).status, 403);

  let r = await call(admin, 'PUT', '/api/ia/assistants/ceo/acces', { tous: false, membres: [marieId, 'inconnu'] });
  assert.deepEqual((await r.json()).acces, { tous: false, membres: [marieId] });
  r = await call(admin, 'PUT', '/api/ia/assistants/clients/acces', { tous: false, membres: [] });
  assert.equal(r.status, 200);
  l = await (await call(marie, 'GET', '/api/ia/assistants')).json();
  assert.deepEqual(l.assistants.map((a) => a.id), ['membre', 'ceo', 'leads']);

  assert.equal((await call(marie, 'POST', '/api/ia/assistants/ceo', { messages: [{ de: 'ia', texte: 'Bonjour !' }] })).status, 400);
  const avant = demandes.length;
  prochaine = { stop_reason: 'end_turn', content: [{ type: 'text', text: 'Commencez par les 3 rappels en retard.' }] };
  r = await call(marie, 'POST', '/api/ia/assistants/ceo', {
    messages: [{ de: 'ia', texte: 'Bonjour, je suis votre assistant.' }, { de: 'moi', texte: 'Par quoi je commence ?' }],
    contexte: 'Appels à passer : 7\nEn retard : 3',
  });
  assert.equal(r.status, 200);
  assert.equal((await r.json()).texte, 'Commencez par les 3 rappels en retard.');
  assert.equal(demandes.length, avant + 1);
  const d = demandes.at(-1);
  assert.equal(d.model, MODELE);
  assert.deepEqual(d.messages, [{ role: 'user', content: 'Par quoi je commence ?' }]);
  assert.match(d.system, /bras droit du CEO/);
  assert.match(d.system, /Tu parles avec : Marie \(membre/);
  assert.match(d.system, /En retard : 3/);
  assert.equal((await call(admin, 'POST', '/api/ia/assistants/inconnu', { messages: [{ de: 'moi', texte: 'Bonjour' }] })).status, 404);
});

test('simulateur : suit l’accès Entraînement ; la clé peut être retirée', async () => {
  await call(admin, 'PATCH', `/api/users/${marieId}`, { acces: ['today'] });
  assert.equal((await call(marie, 'POST', '/api/ia/simulation/repondre', { fiche: FICHE, messages: [{ de: 'vendeur', texte: 'Bonjour' }] })).status, 403);
  assert.equal((await call(marie, 'POST', '/api/ia/linkedin/qualifier', { leads: [{ id: 'a', poste: 'Gérant' }] })).status, 403);
  assert.equal((await call(marie, 'DELETE', '/api/ia/cle')).status, 403);
  assert.equal((await call(admin, 'DELETE', '/api/ia/cle')).status, 200);
  assert.equal((await (await call(admin, 'GET', '/api/ia/etat')).json()).ia, false);
});
