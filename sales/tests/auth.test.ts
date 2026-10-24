import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { eq } from 'drizzle-orm';
import { auditLog, sessions, users } from '../lib/db/schema.ts';
import { getAuthContext, hashToken, logIn, logOut, signUp, SignUpSchema } from '../lib/auth/service.ts';
import { hashPassword, verifyPassword } from '../lib/auth/password.ts';
import { hit } from '../lib/auth/rate-limit.ts';
import type { Db } from '../lib/db/client.ts';
import { newUser, testDb } from './helpers.ts';

let db: Db;
let close: () => Promise<void>;
before(async () => ({ db, close } = await testDb()));
after(() => close());

test('mot de passe : empreinte scrypt vérifiable, jamais en clair', async () => {
  const hash = await hashPassword('correct horse battery');
  assert.match(hash, /^scrypt\$32768\$8\$1\$/);
  assert.ok(!hash.includes('correct'));
  assert.equal(await verifyPassword('correct horse battery', hash), true);
  assert.equal(await verifyPassword('mauvais', hash), false);
  assert.equal(await verifyPassword('x', 'n/importe/quoi'), false);
});

test('inscription : compte, espace personnel propriétaire, session et journal', async () => {
  const { auth, token } = await newUser(db, 'Bruno');
  assert.equal(auth.role, 'owner');
  assert.equal(auth.organization.kind, 'personal');
  assert.equal(auth.user.name, 'Bruno');
  const [stored] = await db.select().from(sessions).where(eq(sessions.id, auth.sessionId));
  assert.equal(stored.tokenHash, hashToken(token), 'seule l\'empreinte du jeton est en base');
  assert.notEqual(stored.tokenHash, token);
  const events = await db.select().from(auditLog).where(eq(auditLog.actorUserId, auth.user.id));
  assert.ok(events.some((e) => e.action === 'user.signup'));
});

test('inscription : e-mail normalisé, doublon refusé', async () => {
  const input = SignUpSchema.parse({ name: 'Chloé', email: '  Chloe@Example.COM ', password: 'motdepasse-solide', locale: 'en' });
  assert.equal(input.email, 'chloe@example.com');
  assert.equal((await signUp(db, input)).ok, true);
  assert.deepEqual(await signUp(db, { ...input, name: 'Autre' }), { ok: false, error: 'email_taken' });
  assert.equal(SignUpSchema.safeParse({ ...input, password: 'court' }).success, false);
});

test('connexion : bon mot de passe seulement, puis déconnexion', async () => {
  const { email } = await newUser(db, 'Diane');
  assert.equal(await logIn(db, email, 'faux-mot-de-passe'), null);
  assert.equal(await logIn(db, 'inconnu@example.com', 'motdepasse-solide'), null);
  const ok = await logIn(db, email.toUpperCase(), 'motdepasse-solide');
  assert.ok(ok);
  const auth = await getAuthContext(db, ok.token);
  assert.equal(auth?.user.email, email);
  await logOut(db, ok.token);
  assert.equal(await getAuthContext(db, ok.token), null);
});

test('session expirée ou jeton inconnu : refusés', async () => {
  const { auth, token } = await newUser(db, 'Emile');
  assert.equal(await getAuthContext(db, 'jeton-invente'), null);
  assert.equal(await getAuthContext(db, undefined), null);
  await db.update(sessions).set({ expiresAt: new Date(Date.now() - 1000) }).where(eq(sessions.id, auth.sessionId));
  assert.equal(await getAuthContext(db, token), null);
});

test('limiteur : bloque au-delà du seuil puis se réinitialise', () => {
  const t0 = 1_000_000;
  for (let i = 0; i < 5; i++) assert.equal(hit('k', 5, 60_000, t0), true);
  assert.equal(hit('k', 5, 60_000, t0), false);
  assert.equal(hit('k', 5, 60_000, t0 + 61_000), true);
});

test('les e-mails sont stockés en minuscules (contrainte en base)', async () => {
  await assert.rejects(db.insert(users).values({ email: 'MAJ@example.com', name: 'X', passwordHash: 'x' }));
});
