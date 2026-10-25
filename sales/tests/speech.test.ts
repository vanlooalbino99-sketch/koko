import assert from 'node:assert/strict';
import { test } from 'node:test';
import { annotate, coachTip, countFillers, lineFacts, lineSignals, paceBand, speechReport, type LiveState } from '../lib/live/speech.ts';

test('tics, hésitations et concessions repérés dans une réplique, questions surlignées', () => {
  const pieces = annotate('Euh, du coup je pense que oui. Comment gérez-vous les appels manqués ?', 'fr');
  assert.equal(pieces.map((p) => p.text).join(''), 'Euh, du coup je pense que oui. Comment gérez-vous les appels manqués ?');
  assert.deepEqual(
    pieces.filter((p) => p.mark).map((p) => [p.text, p.mark]),
    [
      ['Euh', 'filler'],
      ['du coup', 'filler'],
      ['je pense', 'hedge'],
    ],
  );
  assert.ok(pieces.filter((p) => p.question).map((p) => p.text).join('').startsWith('Comment gérez-vous'));
  // Un mot qui contient un tic n'en est pas un.
  assert.equal(annotate('Le benchmark est en fait-maison', 'fr').filter((p) => p.mark === 'filler').length, 1);
  assert.equal(annotate('Je vous fais une remise de 10 %', 'fr').find((p) => p.mark)?.mark, 'concession');
});

test('« like » ne compte comme tic qu\'entre virgules ; questions ouvertes et fermées', () => {
  const [like] = countFillers(['I like it.', 'So, like, we were stuck, um, for weeks.'], 'en').filter((f) => f.key === 'like');
  assert.equal(like.count, 1);
  const facts = lineFacts('So how do you handle it today? Is that a priority?', 'en');
  assert.deepEqual(facts.questions.map((q) => q.open), [true, false]);
  const fr = lineFacts("Et qu'est-ce qui vous bloque ? Vous avez un budget ?", 'fr');
  assert.deepEqual(fr.questions.map((q) => q.open), [true, false]);
});

test('signaux horodatés et conseil du coach selon ce qui se passe dans l\'appel', () => {
  const signals = lineSignals('Euh, euh, je crois que, euh, on peut vous faire une remise.', 42, 'fr');
  assert.deepEqual(signals.map((s) => s.kind), ['filler_cluster', 'hedge', 'concession']);
  assert.ok(signals.every((s) => s.at === 42));

  const base: LiveState = { elapsed: 20, sellerSeconds: 10, prospectSeconds: 5, sellerWords: 20, openQuestions: 0, closedQuestions: 0, fillers: 0, concessions: 0 };
  assert.equal(coachTip(base).key, 'objective');
  assert.deepEqual(coachTip({ ...base, elapsed: 70, sellerSeconds: 50, prospectSeconds: 10 }), { key: 'talk_too_much', criterion: 'listening', value: 83 });
  assert.equal(coachTip({ ...base, elapsed: 100, sellerSeconds: 20, prospectSeconds: 40 }).key, 'no_question');
  assert.equal(coachTip({ ...base, closedQuestions: 3 }).key, 'closed_questions');
  assert.equal(coachTip({ ...base, concessions: 1, elapsed: 70, sellerSeconds: 60 }).key, 'concession');
  assert.equal(paceBand(145), 'in_range');
  assert.equal(paceBand(190), 'fast');
});

test('élocution d\'un appel terminé : temps de parole, débit, questions, interruptions', () => {
  const report = speechReport(
    [
      { role: 'prospect', text: 'Allô, oui ?', at: 0 },
      { role: 'seller', text: 'Bonjour, euh, Paul de Standard IA. Combien d’appels ratez-vous par semaine ?', at: 2 },
      { role: 'prospect', text: 'Une dizaine, je dirais.', at: 9, interrupted: true },
      { role: 'seller', text: 'Du coup, vous avez un budget ?', at: 12 },
    ],
    20,
    'fr',
  );
  assert.equal(report.sellerWords, 17);
  assert.deepEqual(report.questions.map((q) => [q.open, q.at]), [
    [true, 2],
    [false, 12],
  ]);
  assert.equal(report.fillerTotal, 2);
  assert.equal(report.interruptions, 1);
  assert.equal(report.longestMonologueSeconds, 7);
  assert.ok(report.talkRatio! > 50);
  assert.ok(report.wordsPerMinute! > 0);
});
