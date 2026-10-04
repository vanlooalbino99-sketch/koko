import { test } from 'node:test';
import assert from 'node:assert/strict';
import { merge3, deepEqual } from '../src/merge.js';

const p = (id, extra = {}) => ({ id, entreprise: 'E' + id, statut: 'a_appeler', ...extra });

test('chacun ajoute un prospect : les deux sont gardés', () => {
  const base = { prospects: [p('1')] };
  const mine = { prospects: [p('2'), p('1')] };
  const theirs = { prospects: [p('3'), p('1')] };
  const r = merge3(base, mine, theirs);
  assert.deepEqual(r.prospects.map((x) => x.id).sort(), ['1', '2', '3']);
});

test('champs différents d’un même prospect : les deux modifications sont gardées', () => {
  const base = { prospects: [p('1')] };
  const mine = { prospects: [p('1', { statut: 'rdv_pris' })] };
  const theirs = { prospects: [p('1', { notes: 'rappeler lundi' })] };
  const r = merge3(base, mine, theirs);
  assert.equal(r.prospects[0].statut, 'rdv_pris');
  assert.equal(r.prospects[0].notes, 'rappeler lundi');
});

test('suppression d’un côté, rien de l’autre : supprimé', () => {
  const base = { prospects: [p('1'), p('2')] };
  const mine = { prospects: [p('1')] };
  const theirs = { prospects: [p('1'), p('2'), p('3')] };
  const r = merge3(base, mine, theirs);
  assert.deepEqual(r.prospects.map((x) => x.id).sort(), ['1', '3']);
});

test('supprimé ici mais modifié là-bas : conservé (aucune perte)', () => {
  const base = { prospects: [p('1'), p('2')] };
  const mine = { prospects: [p('1')] };
  const theirs = { prospects: [p('1'), p('2', { notes: 'important' })] };
  const r = merge3(base, mine, theirs);
  assert.ok(r.prospects.some((x) => x.id === '2' && x.notes === 'important'));
});

test('historique d’un prospect (liste imbriquée) fusionné', () => {
  const ev = (id) => ({ id, type: 'call', text: id });
  const base = { prospects: [p('1', { events: [ev('a')] })] };
  const mine = { prospects: [p('1', { events: [ev('b'), ev('a')] })] };
  const theirs = { prospects: [p('1', { events: [ev('c'), ev('a')] })] };
  const r = merge3(base, mine, theirs);
  assert.deepEqual(r.prospects[0].events.map((e) => e.id).sort(), ['a', 'b', 'c']);
});

test('réglages : modifications de champs différents gardées, même champ = dernier enregistrement', () => {
  const base = { settings: { goalCalls: 50, goalRdv: 5 }, companyInfo: { nom: 'A' } };
  const mine = { settings: { goalCalls: 60, goalRdv: 5 }, companyInfo: { nom: 'B' } };
  const theirs = { settings: { goalCalls: 50, goalRdv: 8 }, companyInfo: { nom: 'C' } };
  const r = merge3(base, mine, theirs);
  assert.deepEqual(r.settings, { goalCalls: 60, goalRdv: 8 });
  assert.equal(r.companyInfo.nom, 'B');
});

test('sans base connue : union, rien n’est perdu', () => {
  const r = merge3(undefined, { prospects: [p('1')] }, { prospects: [p('2')] });
  assert.deepEqual(r.prospects.map((x) => x.id).sort(), ['1', '2']);
});

test('deepEqual ignore l’ordre des clés', () => {
  assert.ok(deepEqual({ a: 1, b: [1, { c: 2 }] }, { b: [1, { c: 2 }], a: 1 }));
  assert.ok(!deepEqual({ a: 1 }, { a: 1, b: undefined }));
});

test('base inconnue : un réglage en conflit garde la valeur en base, les ajouts sont gardés', () => {
  const r = merge3(undefined, { settings: { goalCalls: 50, neuf: 1 } }, { settings: { goalCalls: 80 } });
  assert.deepEqual(r.settings, { goalCalls: 80, neuf: 1 });
});
