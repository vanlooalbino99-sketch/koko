import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bookingSchema, contactSchema, isBot } from '../lib/validation.ts';

const contact = { nom: 'Marc Durand', entreprise: '', email: ' Marc@Durand.FR ', telephone: '06 11 22 33 44', sujet: 'devis', message: 'Bonjour, je souhaite un devis.', consentement: true, website: '' };

test('contact valide : e-mail normalisé', () => {
  const r = contactSchema.safeParse(contact);
  assert.equal(r.success, true);
  assert.equal(r.data?.email, 'marc@durand.fr');
});

test('contact invalide : messages en français par champ', () => {
  const r = contactSchema.safeParse({ ...contact, nom: 'M', email: 'non', telephone: '123', message: 'court', consentement: false });
  assert.equal(r.success, false);
  const paths = r.error!.issues.map((i) => i.path[0]);
  for (const f of ['nom', 'email', 'telephone', 'message', 'consentement']) assert.ok(paths.includes(f), f);
  assert.match(r.error!.issues.find((i) => i.path[0] === 'email')!.message, /e-mail invalide/i);
});

const booking = { date: '2026-10-13', heure: '09:30', prenom: 'Julie', nom: 'Petit', entreprise: 'Cabinet Petit', email: 'julie@petit.fr', telephone: '+33 6 12 34 56 78', pays: 'France', codePostal: '69003', ville: 'Lyon', service: 'assistant-telephonique', consentement: true };

test('réservation : prénom, nom, pays, code postal et ville obligatoires', () => {
  const r = bookingSchema.safeParse({ ...booking, prenom: ' ', nom: '', pays: '', codePostal: '', ville: '' });
  assert.equal(r.success, false);
  const paths = r.error!.issues.map((i) => i.path[0]);
  for (const f of ['prenom', 'nom', 'pays', 'ville']) assert.ok(paths.includes(f), f);
});

test('réservation : code postal selon le pays', () => {
  assert.equal(bookingSchema.safeParse({ ...booking, codePostal: '6900' }).success, false);
  assert.equal(bookingSchema.safeParse({ ...booking, codePostal: '97400', ville: 'Saint-Denis' }).success, true);
  assert.equal(bookingSchema.safeParse({ ...booking, pays: 'Belgique', codePostal: '1000', ville: 'Bruxelles' }).success, true);
  assert.equal(bookingSchema.safeParse({ ...booking, pays: 'Suisse', codePostal: '12010' }).success, false);
  assert.equal(bookingSchema.safeParse({ ...booking, pays: 'Royaume-Uni', codePostal: 'sw1a 1aa', ville: 'Londres' }).data?.codePostal, 'SW1A 1AA');
  const r = bookingSchema.safeParse({ ...booking, codePostal: '' });
  assert.match(r.error!.issues.find((i) => i.path[0] === 'codePostal')!.message, /code postal/i);
});

test('réservation : date et heure obligatoires et bien formées', () => {
  const base = booking;
  assert.equal(bookingSchema.safeParse(base).success, true);
  assert.equal(bookingSchema.safeParse({ ...base, heure: '9h' }).success, false);
  assert.equal(bookingSchema.safeParse({ ...base, date: '' }).success, false);
  assert.equal(bookingSchema.safeParse({ ...base, service: 'inconnu' }).success, false);
});

test('champ piège rempli : repéré comme robot', () => {
  const r = contactSchema.safeParse({ ...contact, website: 'http://spam' });
  assert.equal(r.success && isBot(r.data), true);
  assert.equal(isBot(contactSchema.parse(contact)), false);
});
