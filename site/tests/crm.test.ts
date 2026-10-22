import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';

// Faux CRM : les premières réponses imitent un hébergement gratuit qui se réveille (503, puis page HTML d'attente).
let server: Server;
let reponses: { status: number; body: string; type?: string }[] = [];
let recus = 0;

before(async () => {
  server = createServer((req, res) => {
    recus++;
    const r = reponses.shift() || { status: 201, body: JSON.stringify({ prospectId: 'p1' }) };
    res.writeHead(r.status, { 'Content-Type': r.type || 'application/json' });
    res.end(r.body);
  });
  await new Promise<void>((ok) => server.listen(0, '127.0.0.1', ok));
  const a = server.address();
  process.env.CRM_URL = `http://127.0.0.1:${typeof a === 'object' && a ? a.port : 0}`;
  process.env.CRM_SITE_KEY = 'cle-de-test-assez-longue-123456';
});
after(() => server.close());

const crm = () => import('../lib/crm.ts');

test('réservation : le CRM qui se réveille (503 puis page HTML) reçoit quand même le RDV', async () => {
  const { pushLead } = await crm();
  reponses = [{ status: 503, body: 'Service Unavailable', type: 'text/plain' }, { status: 200, body: '<html>Waking up…</html>', type: 'text/html' }];
  recus = 0;
  const r = await pushLead({ type: 'rdv', requestId: 'req-1', nom: 'Jean Test', email: 'jean@exemple.fr', telephone: '0600000000', date: '2026-10-26', heure: '10:00' });
  assert.deepEqual(r, { prospectId: 'p1', skipped: false });
  assert.equal(recus, 3);
});

test('créneau déjà pris : le 409 du CRM remonte tout de suite, sans nouvel essai', async () => {
  const { pushLead, CrmError } = await crm();
  reponses = [{ status: 409, body: JSON.stringify({ error: 'Ce créneau est déjà réservé.' }) }];
  recus = 0;
  await assert.rejects(pushLead({ type: 'rdv', requestId: 'req-2', nom: 'A B', email: 'a@b.fr', telephone: '0600000000' }),
    (e: unknown) => e instanceof CrmError && e.status === 409 && /déjà réservé/.test(e.message));
  assert.equal(recus, 1);
});

test('affichage des créneaux : délai court, abandon rapide si le CRM ne répond pas', async () => {
  const { bookedSlots } = await crm();
  reponses = [{ status: 503, body: 'x', type: 'text/plain' }];
  const t = Date.now();
  await assert.rejects(bookedSlots('2026-10-26', '2026-10-26', 1_000));
  assert.ok(Date.now() - t < 2_000);
});
