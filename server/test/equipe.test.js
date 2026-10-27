// Accueil des administrateurs (/api/equipe) : simulations envoyées par chaque membre (sans doublon),
// vue d'ensemble réservée aux administrateurs, compteur des requêtes Claude.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testApp } from './helpers.js';

let server, base, made, admin, membre;
// Faux Claude : répond toujours la même chose (aucune requête ne sort du test).
const faux = () => ({
  models: { retrieve: async (m) => ({ id: m }) },
  beta: { messages: { create: async () => ({ stop_reason: 'end_turn', content: [{ type: 'text', text: 'Bonjour Paul, voici notre proposition.' }] }) } },
});
const h = (cookie, extra = {}) => ({ 'X-Requested-With': 'blackstart', 'Content-Type': 'application/json', Cookie: cookie, ...extra });
const cookieDe = (r) => r.headers.get('set-cookie').split(';')[0];
before(async () => {
  delete process.env.ANTHROPIC_API_KEY;
  made = await testApp({ ia: { creer: faux } });
  await new Promise((res) => { server = made.app.listen(0, res); });
  base = `http://127.0.0.1:${server.address().port}`;
  admin = cookieDe(await fetch(base + '/api/auth/setup', { method: 'POST', headers: h(''), body: JSON.stringify({ name: 'Albino Vanloo', email: 'admin@exemple.fr', password: 'motdepasse-solide-1' }) }));
  await fetch(base + '/api/users', { method: 'POST', headers: h(admin), body: JSON.stringify({ name: 'Sophie Laurent', email: 'sophie@exemple.fr', password: 'motdepasse-solide-2' }) });
  membre = cookieDe(await fetch(base + '/api/auth/login', { method: 'POST', headers: h(''), body: JSON.stringify({ email: 'sophie@exemple.fr', password: 'motdepasse-solide-2' }) }));
});
after(async () => { server.close(); await made.cleanup(); });

const envoyer = (cookie, corps) => fetch(base + '/api/equipe/simulations', { method: 'POST', headers: h(cookie), body: JSON.stringify(corps) });

test('chaque membre envoie ses simulations ; la même simulation renvoyée ne compte qu’une fois', async () => {
  const at = new Date(Date.now() - 3600000).toISOString();
  assert.equal((await envoyer(membre, { note: 80, famille: 'objections', titre: 'Objection prix', duree: 240, ia: true, at })).status, 201);
  assert.equal((await envoyer(membre, { note: 80, famille: 'objections', titre: 'Objection prix', duree: 240, ia: true, at })).status, 201);
  assert.equal((await envoyer(membre, { note: 55, famille: 'inconnue', titre: '  Appel   libre ' })).status, 201);
  assert.equal((await envoyer(membre, { note: 140 })).status, 400);
  assert.equal((await envoyer(membre, { note: 50, at: '2001-01-01T00:00:00Z' })).status, 400);
  assert.equal((await envoyer('', { note: 50 })).status, 401);

  const r = await fetch(base + '/api/equipe/apercu', { headers: h(admin) });
  assert.equal(r.status, 200);
  const b = await r.json();
  assert.equal(b.membres.length, 2);
  const sophie = b.membres.find((m) => m.name === 'Sophie Laurent');
  const sims = b.simulations.filter((s) => s.userId === sophie.id);
  assert.equal(sims.length, 2);
  assert.deepEqual(sims.map((s) => [s.famille, s.titre, s.note]).sort(), [['autre', 'Appel libre', 55], ['objections', 'Objection prix', 80]]);
  assert.equal(sims.find((s) => s.note === 80).ia, true);
  assert.deepEqual(b.ia, { mois: 0, moisPrecedent: 0 });
  // Pas de contenu de message ni de transcription : seulement des chiffres.
  assert.ok(Array.isArray(b.messages) && Array.isArray(b.formation));
});

test('la vue d’ensemble est réservée aux administrateurs', async () => {
  assert.equal((await fetch(base + '/api/equipe/apercu', { headers: h(membre) })).status, 403);
});

test('chaque requête envoyée à Claude est comptée pour le mois', async () => {
  const apercu = async () => (await (await fetch(base + '/api/equipe/apercu', { headers: h(admin) })).json()).ia.mois;
  // Sans clé Claude, la requête est refusée avant de partir : rien n'est compté.
  assert.equal((await fetch(base + '/api/ia/rediger', { method: 'POST', headers: h(membre), body: JSON.stringify({ type: 'email', consigne: 'Premier mail' }) })).status, 409);
  assert.equal(await apercu(), 0);
  assert.equal((await fetch(base + '/api/ia/cle', { method: 'PUT', headers: h(admin), body: JSON.stringify({ cle: 'sk-ant-api03-' + 'x'.repeat(40) }) })).status, 200);
  assert.equal((await fetch(base + '/api/ia/rediger', { method: 'POST', headers: h(membre), body: JSON.stringify({ type: 'email', consigne: 'Premier mail' }) })).status, 200);
  assert.equal((await fetch(base + '/api/ia/rediger', { method: 'POST', headers: h(admin), body: JSON.stringify({ type: 'email', consigne: 'Relance' }) })).status, 200);
  let n = 0;
  for (let i = 0; i < 20 && (n = await apercu()) < 2; i++) await new Promise((r) => setTimeout(r, 50));
  assert.equal(n, 2);
});
