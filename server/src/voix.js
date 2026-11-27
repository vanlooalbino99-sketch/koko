// Voix off de la Formation avec ElevenLabs (facultatif, ELEVENLABS_API_KEY).
// Chaque phrase est enregistrée une seule fois, à la première écoute, puis gardée dans DATA_DIR : la clé ne
// quitte jamais le serveur et seules les phrases de la Formation peuvent être lues (pas de texte libre).
// En cas d'échec (quota, clé refusée, réseau), la voix pré-enregistrée du projet (app/voix) prend le relais.
import { existsSync, mkdirSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { phrasesFormation } from '../../scripts/formation/phrases.mjs';

const API = 'https://api.elevenlabs.io/v1/text-to-speech/';
// Voix par défaut : présente sur tous les comptes ; ELEVENLABS_VOICE_ID pour une voix française de la bibliothèque.
export const VOIX_DEFAUT = 'JBFqnCBsd6RMkjVDRZzb';
export const MODELE_DEFAUT = 'eleven_multilingual_v2';
const PAUSE_ECHEC = 10 * 60 * 1000; // après un refus d'ElevenLabs, voix du projet pendant 10 min

export function voixElevenLabs({ apiKey, voiceId = VOIX_DEFAUT, modelId = MODELE_DEFAUT, dataDir, root, fetchImpl = fetch, log = console }) {
  const dir = join(dataDir, 'voix-elevenlabs', `${voiceId}-${modelId}`.replace(/[^\w.-]/g, '_'));
  let phrases = null, enPause = 0;
  const enCours = new Map();

  async function enregistrer(h, texte) {
    const body = { text: texte, model_id: modelId };
    // Seuls les modèles Turbo et Flash acceptent de forcer la langue.
    if (/turbo|flash/.test(modelId)) body.language_code = 'fr';
    const r = await fetchImpl(`${API}${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) {
      const detail = (await r.text().catch(() => '')).slice(0, 200);
      const e = new Error(`ElevenLabs a répondu ${r.status} ${detail}`);
      e.status = r.status;
      throw e;
    }
    const mp3 = Buffer.from(await r.arrayBuffer());
    if (mp3.length < 200) throw new Error('ElevenLabs a renvoyé un fichier vide');
    mkdirSync(dir, { recursive: true });
    const tmp = join(dir, `${h}.${process.pid}.tmp`);
    writeFileSync(tmp, mp3);
    renameSync(tmp, join(dir, `${h}.mp3`));
  }

  // Express : GET /voix/el/<empreinte>.mp3
  return async function route(req, res) {
    const m = /^([0-9a-f]{8})\.mp3$/.exec(req.params.f || '');
    if (!m) return res.status(404).end();
    const h = m[1];
    const repli = () => res.redirect(302, `/voix/${h}.mp3`);
    const fichier = join(dir, `${h}.mp3`);
    if (existsSync(fichier)) return res.sendFile(fichier, { maxAge: '30d', immutable: true });
    if (!phrases) phrases = phrasesFormation(root);
    const texte = phrases.get(h);
    if (!texte) return res.status(404).end();
    if (Date.now() < enPause) return repli();
    let p = enCours.get(h);
    if (!p) {
      p = enregistrer(h, texte).finally(() => enCours.delete(h));
      enCours.set(h, p);
    }
    try {
      await p;
      res.sendFile(fichier, { maxAge: '30d', immutable: true });
    } catch (e) {
      // Clé refusée ou quota épuisé : pause longue ; réseau ou panne passagère : courte pause.
      enPause = Date.now() + (e.status === 401 || e.status === 402 || e.status === 429 ? PAUSE_ECHEC : 60 * 1000);
      log.warn('[voix] ' + e.message);
      repli();
    }
  };
}
