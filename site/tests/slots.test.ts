import { test } from 'node:test';
import assert from 'node:assert/strict';
import { availableSlots, daySlots, easterSunday, formatSlot, isClosed, isDate, zonedToUtc } from '../lib/slots.ts';

// Lundi 12 octobre 2026, 8 h 00 à Paris (6 h 00 UTC, heure d'été).
const NOW = new Date('2026-10-12T06:00:00Z');

test('créneaux d’une journée ouverte : matin et après-midi, pas de 30 min', () => {
  const s = daySlots('2026-10-13');
  assert.equal(s[0], '09:00');
  assert.ok(s.includes('11:30') && !s.includes('12:00'));
  assert.ok(s.includes('14:00') && s.includes('17:30') && !s.includes('18:00'));
  assert.equal(s.length, 14);
});

test('jours fermés : week-end, fériés fixes et de Pâques', () => {
  assert.equal(isClosed('2026-10-17'), true); // samedi
  assert.equal(isClosed('2026-11-11'), true);
  assert.equal(easterSunday(2027), '2027-03-28');
  assert.equal(isClosed('2027-03-29'), true); // lundi de Pâques
  assert.equal(isClosed('2026-10-13'), false);
  assert.deepEqual(daySlots('2026-10-18'), []);
});

test('délai de prévenance de 3 h et fenêtre de réservation', () => {
  const today = availableSlots('2026-10-12', [], NOW);
  assert.equal(today[0], '11:00'); // 8 h + 3 h
  assert.deepEqual(availableSlots('2026-10-09', [], NOW), []); // passé
  assert.deepEqual(availableSlots('2027-01-15', [], NOW), []); // trop loin
});

test('un rendez-vous existant bloque les créneaux qu’il chevauche', () => {
  const s = availableSlots('2026-10-13', ['10:30', '15:15'], NOW);
  assert.ok(!s.includes('10:30'));
  assert.ok(s.includes('10:00') && s.includes('11:00'));
  assert.ok(!s.includes('15:00') && !s.includes('15:30'));
});

test('conversion heure de Paris → UTC, été comme hiver', () => {
  assert.equal(zonedToUtc('2026-07-01', '09:00').toISOString(), '2026-07-01T07:00:00.000Z');
  assert.equal(zonedToUtc('2026-12-01', '09:00').toISOString(), '2026-12-01T08:00:00.000Z');
});

test('validation et affichage des dates', () => {
  assert.equal(isDate('2026-02-30'), false);
  assert.equal(isDate('2026-02-28'), true);
  assert.equal(formatSlot('2026-10-13', '09:30'), 'mardi 13 octobre 2026 à 9 h 30');
});
