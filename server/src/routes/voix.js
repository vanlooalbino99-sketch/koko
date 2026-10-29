// /api/formation/voix : voix off ElevenLabs de la formation.
// Chaque phrase (sous-titre) est lue une fois par ElevenLabs puis gardée en base : les membres l'écoutent
// ensuite sans rien recoûter. Clé ElevenLabs : variable ELEVENLABS_API_KEY, sinon collée par un administrateur
// dans Formations (chiffrée dans settings `voix_eleven`). La génération tourne en tâche de fond, deux phrases à
// la fois (limite du plan gratuit), et s'arrête proprement quand le crédit du mois est épuisé.
import express, { Router } from 'express';
import { getSetting, setSetting } from '../store.js';
import { coffre } from '../coffre.js';

const API = 'https://api.elevenlabs.io';
const MODELE = process.env.ELEVENLABS_FORMATION_MODEL || 'eleven_flash_v2_5';
const MAX_PHRASE = 400, MAX_LOT = 800, EN_PARALLELE = 2;
const ECHANTILLON = 'Bonjour ! Je suis la voix de votre formation Blackstart. On démarre ensemble ?';
// Même empreinte que hashCap() dans app/modules/bs-formation.js (FNV-1a 32 bits sur les unités UTF-16).
export function empreinte(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}
const cleDe = (hash, voix) => hash + '-' + String(voix).replace(/[^A-Za-z0-9]/g, '').slice(0, 10);
const ID_VOIX = /^[A-Za-z0-9]{8,40}$/;

export function voixRoutes({ db, dataDir, appel = fetch }) {
  const r = Router();
  const { chiffrer, dechiffrer } = coffre(dataDir);
  const travail = { file: [], enCours: 0, faites: 0, erreur: null, voix: null };
  let credits = null; // { at, valeur } : abonnement ElevenLabs, relu au plus une fois par minute

  async function cle() {
    if (process.env.ELEVENLABS_API_KEY) return { cle: process.env.ELEVENLABS_API_KEY, source: 'env' };
    const g = await getSetting(db, 'voix_eleven', null);
    if (!g || !g.cle) return null;
    try { return { cle: dechiffrer(g.cle), source: 'crm', at: g.at }; } catch { return null; }
  }
  async function eleven(k, chemin, opts = {}) {
    const rep = await appel(API + chemin, { ...opts, headers: { 'xi-api-key': k, ...(opts.body ? { 'Content-Type': 'application/json' } : {}), ...(opts.headers || {}) }, signal: AbortSignal.timeout(90000) });
    if (!rep.ok) {
      let d = null; try { d = (await rep.json()).detail; } catch {}
      const e = new Error((d && (d.message || d.status)) || 'HTTP ' + rep.status);
      e.status = rep.status; e.code = d && d.status;
      throw e;
    }
    return rep;
  }
  const lisible = (e) => {
    if (e.code === 'quota_exceeded') return 'Crédit ElevenLabs du mois épuisé : la suite reprendra au renouvellement (ou avec un plan payant).';
    if (e.status === 401) return 'Clé ElevenLabs refusée : vérifiez-la sur elevenlabs.io (Developers, API Keys).';
    if (e.status === 402 || e.code === 'paid_plan_required') return 'Cette voix demande un plan ElevenLabs payant : choisissez une voix de votre compte.';
    return 'ElevenLabs ne répond pas (' + (e.message || 'erreur') + ').';
  };
  // Voix choisie par l'administrateur, sinon une voix française du compte, sinon une voix « premade » connue.
  async function voixChoisie(k) {
    const g = await getSetting(db, 'voix_eleven_reglage', null);
    if (g && g.voix) return g.voix;
    if (process.env.ELEVENLABS_FORMATION_VOICE) return process.env.ELEVENLABS_FORMATION_VOICE;
    const liste = await voixDuCompte(k);
    const fr = liste.find((v) => /fr|french|fran/i.test([v.langue, v.accent].join(' ')));
    const v = fr || liste.find((x) => /^(sarah|charlotte|alice|laura)$/i.test(x.nom)) || liste[0];
    if (!v) throw Object.assign(new Error('aucune voix'), { status: 404 });
    await setSetting(db, 'voix_eleven_reglage', { voix: v.id, nom: v.nom });
    return v.id;
  }
  async function voixDuCompte(k) {
    const b = await (await eleven(k, '/v1/voices')).json();
    return (b.voices || []).map((v) => ({ id: v.voice_id, nom: v.name, categorie: v.category, genre: v.labels && v.labels.gender || '',
      accent: v.labels && v.labels.accent || '', langue: v.labels && v.labels.language || '', apercu: v.preview_url || '' }));
  }
  async function lire(k, voix, texte) {
    const corps = { text: texte, model_id: MODELE, voice_settings: { stability: 0.42, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true } };
    if (!/multilingual_v2/.test(MODELE)) corps.language_code = 'fr';
    const b = await (await eleven(k, `/v1/text-to-speech/${voix}/with-timestamps?output_format=mp3_44100_128`, { method: 'POST', body: JSON.stringify(corps) })).json();
    const fins = b.alignment && b.alignment.character_end_times_seconds || [];
    const data = Buffer.from(b.audio_base64 || '', 'base64');
    if (!data.length) throw new Error('réponse vide');
    // Durée : fin du dernier caractère prononcé (sinon estimée sur le débit du MP3 à 128 kbit/s).
    const ms = Math.round(fins.length ? fins[fins.length - 1] * 1000 : data.length / 16);
    return { data, ms };
  }

  async function suivante() {
    while (travail.enCours < EN_PARALLELE && travail.file.length && !travail.erreur) {
      const p = travail.file.shift();
      travail.enCours++;
      (async () => {
        const c = await cle();
        if (!c) throw Object.assign(new Error('sans clé'), { status: 401 });
        const k = cleDe(p.h, travail.voix);
        if (await db.get('SELECT 1 AS x FROM formation_voix WHERE cle = ?', k)) return;
        let essai = 0, lu;
        for (;;) {
          try { lu = await lire(c.cle, travail.voix, p.t); break; }
          catch (e) { if (e.status === 429 && essai++ < 4) { await new Promise((ok) => setTimeout(ok, 1500 * essai)); continue; } throw e; }
        }
        await db.run('INSERT INTO formation_voix (cle, hash, voix, ms, data, created_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(cle) DO NOTHING',
          k, p.h, travail.voix, lu.ms, lu.data, new Date().toISOString());
        travail.faites++;
      })().catch((e) => {
        if (!travail.erreur) { travail.erreur = lisible(e); console.error('[voix] arrêt :', e.status || '', e.code || '', e.message); }
        travail.file = [];
      }).finally(() => { travail.enCours--; suivante(); });
    }
  }

  const admin = (req, res) => { if (req.user.role === 'admin') return true; res.status(403).json({ error: 'Réservé aux administrateurs.' }); return false; };

  // Phrases déjà lues avec la voix choisie : { empreinte: [durée ms, fichier] }.
  r.get('/index', async (_req, res) => {
    const g = await getSetting(db, 'voix_eleven_reglage', null);
    const rows = g && g.voix ? await db.all('SELECT cle, hash, ms FROM formation_voix WHERE voix = ?', g.voix) : [];
    res.set('Cache-Control', 'no-store').json({ voix: Object.fromEntries(rows.map((x) => [x.hash, [x.ms, x.cle]])) });
  });

  r.get('/etat', async (req, res) => {
    const c = await cle(), g = await getSetting(db, 'voix_eleven_reglage', null);
    const out = { cle: !!c, source: c ? c.source : null, admin: req.user.role === 'admin', modele: MODELE, voix: g || null,
      generees: g && g.voix ? (await db.get('SELECT COUNT(*) AS n FROM formation_voix WHERE voix = ?', g.voix)).n : 0,
      travail: { reste: travail.file.length + travail.enCours, faites: travail.faites, erreur: travail.erreur } };
    if (c && out.admin) {
      try {
        if (!credits || Date.now() - credits.at > 60000) {
          const s = await (await eleven(c.cle, '/v1/user/subscription')).json();
          credits = { at: Date.now(), valeur: { utilises: s.character_count, limite: s.character_limit, plan: s.tier, renouvellement: s.next_character_count_reset_unix } };
        }
        out.credits = credits.valeur;
      } catch (e) { out.credits = null; out.creditsErreur = lisible(e); }
    }
    res.json(out);
  });

  r.put('/cle', express.json({ limit: '4kb' }), async (req, res) => {
    if (!admin(req, res)) return;
    if (process.env.ELEVENLABS_API_KEY) return res.status(409).json({ error: 'La clé ElevenLabs est déjà réglée sur le serveur (variable ELEVENLABS_API_KEY).' });
    const k = String(req.body && req.body.cle || '').replace(/\s+/g, '').slice(0, 200);
    if (!/^[A-Za-z0-9_-]{20,}$/.test(k)) return res.status(400).json({ error: 'Ce n’est pas une clé ElevenLabs (elevenlabs.io, Developers, API Keys).' });
    try { await eleven(k, '/v1/voices'); } catch (e) { return res.status(400).json({ error: lisible(e) }); }
    await setSetting(db, 'voix_eleven', { cle: chiffrer(k), at: new Date().toISOString(), par: req.user.id });
    travail.erreur = null; credits = null;
    res.json({ cle: true, source: 'crm' });
  });

  r.delete('/cle', async (req, res) => {
    if (!admin(req, res)) return;
    await db.run('DELETE FROM settings WHERE key = ?', 'voix_eleven');
    travail.file = []; credits = null;
    res.json({ cle: !!process.env.ELEVENLABS_API_KEY });
  });

  r.get('/voix', async (req, res) => {
    if (!admin(req, res)) return;
    const c = await cle();
    if (!c) return res.status(409).json({ error: 'Collez d’abord la clé ElevenLabs.' });
    try { res.json({ voix: await voixDuCompte(c.cle), choisie: await voixChoisie(c.cle) }); } catch (e) { res.status(502).json({ error: lisible(e) }); }
  });

  r.put('/reglage', express.json({ limit: '4kb' }), async (req, res) => {
    if (!admin(req, res)) return;
    const v = String(req.body && req.body.voix || '');
    if (!ID_VOIX.test(v)) return res.status(400).json({ error: 'Voix inconnue.' });
    await setSetting(db, 'voix_eleven_reglage', { voix: v, nom: String(req.body.nom || '').slice(0, 80) });
    travail.file = []; travail.erreur = null;
    res.json({ ok: true });
  });

  // Court essai de la voix (non gardé), pour choisir à l'oreille.
  r.post('/echantillon', express.json({ limit: '4kb' }), async (req, res) => {
    if (!admin(req, res)) return;
    const c = await cle(), v = String(req.body && req.body.voix || '');
    if (!c) return res.status(409).json({ error: 'Collez d’abord la clé ElevenLabs.' });
    if (!ID_VOIX.test(v)) return res.status(400).json({ error: 'Voix inconnue.' });
    try { const lu = await lire(c.cle, v, ECHANTILLON); res.set('Cache-Control', 'no-store').type('audio/mpeg').send(lu.data); }
    catch (e) { res.status(502).json({ error: lisible(e) }); }
  });

  // Lance la lecture des phrases qui n'ont pas encore de voix. phrases : [{ h: empreinte, t: texte }], dans l'ordre des modules.
  r.post('/generer', express.json({ limit: '400kb' }), async (req, res) => {
    if (!admin(req, res)) return;
    const c = await cle();
    if (!c) return res.status(409).json({ error: 'Collez d’abord la clé ElevenLabs.' });
    const liste = Array.isArray(req.body && req.body.phrases) ? req.body.phrases.slice(0, MAX_LOT) : [];
    let voix;
    try { voix = await voixChoisie(c.cle); } catch (e) { return res.status(502).json({ error: lisible(e) }); }
    const deja = new Set((await db.all('SELECT hash FROM formation_voix WHERE voix = ?', voix)).map((x) => x.hash));
    if (travail.voix !== voix) { travail.file = []; travail.voix = voix; }
    const enFile = new Set(travail.file.map((p) => p.h));
    let ajout = 0;
    for (const p of liste) {
      const t = typeof (p && p.t) === 'string' ? p.t.trim() : '';
      if (!t || t.length > MAX_PHRASE || empreinte(p.t) !== p.h || deja.has(p.h) || enFile.has(p.h)) continue;
      travail.file.push({ h: p.h, t }); enFile.add(p.h); ajout++;
    }
    if (ajout && req.body.reprendre) travail.erreur = null;
    suivante();
    res.json({ ajout, reste: travail.file.length + travail.enCours, erreur: travail.erreur });
  });

  // Fichier MP3 d'une phrase : le nom porte l'empreinte et la voix, il ne change jamais.
  r.get('/:cle.mp3', async (req, res) => {
    const row = await db.get('SELECT data FROM formation_voix WHERE cle = ?', String(req.params.cle).slice(0, 40));
    if (!row) return res.status(404).end();
    res.set('Cache-Control', 'private, max-age=31536000, immutable').type('audio/mpeg').send(Buffer.from(row.data));
  });

  return r;
}
