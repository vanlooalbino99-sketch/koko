// Phrases de la voix off de la Formation, par empreinte du texte (FNV-1a 32 bits, comme hashCap() dans
// bs-formation.js). Servent au générateur des MP3 (voix.mjs) et au serveur (voix ElevenLabs).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

export function hashCap(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); }

// Deux passes : version équipe (tutos sur captures) et version autonome (anciennes scènes animées).
export function phrasesFormation(root) {
  const caps = new Map();
  for (const serveur of [true, false]) {
    const win = { document: { documentElement: { getAttribute: () => 'dark' } }, location: { protocol: 'http:' } };
    if (serveur) win.BS_SERVER = {};
    const ctx = vm.createContext({ window: win, document: win.document, location: win.location, navigator: {}, setTimeout, console });
    // Toutes les captures « présentes » : chaque tuto compte, même avant d'avoir refait les captures.
    if (serveur) win.BS_ECRANS = new Proxy({}, { get: (_, k) => (k === '_v' ? undefined : { w: 1440, h: 900, z: {} }) });
    vm.runInContext(readFileSync(join(root, 'app', 'modules', 'bs-formation.js'), 'utf8'), ctx);
    for (const m of win.bsFormation.modules) for (const s of m.scenes) for (const c of s.captions) caps.set(hashCap(c), c);
  }
  return caps;
}
