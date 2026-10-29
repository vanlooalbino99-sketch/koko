import assert from 'node:assert/strict';
import { test } from 'node:test';
import { splitTones } from '../lib/voice/emotion.ts';

test('ton du prospect : balises retirées du texte, ponctuation française intacte, tons du plus fort au plus doux', () => {
  assert.deepEqual(splitTones('[sighs] Écoutez… [shouts] NON, je vous ai dit que ça ne m’intéressait pas !'), {
    text: 'Écoutez… NON, je vous ai dit que ça ne m’intéressait pas !',
    tones: ['shouts', 'sighs'],
  });
  assert.deepEqual(splitTones('[low, threatening] Ah oui ? [mad]'), { text: 'Ah oui ?', tones: ['angry'] });
  // Des crochets ordinaires ne sont pas des balises.
  assert.deepEqual(splitTones('Voir la clause [3] du contrat [Société X].'), { text: 'Voir la clause [3] du contrat [Société X].', tones: [] });
  // Une balise inconnue sort du texte sans donner de ton.
  assert.deepEqual(splitTones('[gulp] Bon.'), { text: 'Bon.', tones: [] });
  assert.deepEqual(splitTones('[sighs]'), { text: '', tones: ['sighs'] });
});
