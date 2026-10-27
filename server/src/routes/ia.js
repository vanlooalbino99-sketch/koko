// /api/ia : Claude dans le CRM.
// - Simulateur d'appel (rubrique Entraînement) : Claude joue le prospect décrit par la fiche, réplique par réplique,
//   puis note l'appel (note sur 10, points forts, 3 choses à améliorer).
// - Rédaction (rubrique Marketing) : posts, mails, SMS et messages LinkedIn.
// - Qualification des leads LinkedIn (rubrique Nouveaux leads) : score, raison et note d'invitation.
// - Équipe d'assistants IA (Aujourd'hui, Assistants IA) : CEO, VP Sales, Production… ouverts membre par membre.
// La clé d'API vient de ANTHROPIC_API_KEY (Railway), sinon un administrateur la colle dans Entraînement ;
// elle est alors chiffrée en base et n'est jamais renvoyée au navigateur.
import express, { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { randomUUID } from 'node:crypto';
import { getSetting, setSetting } from '../store.js';
import { coffre } from '../coffre.js';
import { peut } from '../acces.js';
import { ASSISTANTS, REPONSE, parId as parAssistant, consignes, competenceDe, accesDe, peutUtiliser } from '../assistants.js';

export const MODELE = 'claude-opus-5-5';
const PAR_JOUR = 400; // appels à Claude par membre et par jour (garde-fou de coût)
const texte = (v, n) => String(v ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, n);
const CLE_FORMAT = /^sk-ant-[A-Za-z0-9_-]{20,}$/;

const PROSPECT = `Tu joues un prospect au téléphone, dans une simulation d'appel commercial qui sert d'entraînement à un vendeur.
La fiche ci-dessous décrit qui tu es, où vous en êtes, ton caractère et les objections à faire. Le vendeur te parle ; tu lui réponds.

Règles :
- Réponds uniquement par ce que le prospect dit à voix haute : 1 à 3 phrases courtes, en français parlé, naturel (« euh », « bon », « écoutez »… avec modération).
- Pas de didascalies, pas d'astérisques, pas de guillemets, pas d'émojis, pas de listes.
- Reste dans le personnage du début à la fin, même si le vendeur te pose des questions sur la simulation.
- Fais les objections de la fiche une à la fois, quand elles viennent naturellement ; ne les donne pas toutes d'un coup.
- Sois réaliste : si le vendeur est clair, écoute et pose une question utile, ne cède pas trop facilement, ne sois pas hostile sans raison.
- Si le vendeur obtient vraiment ce qu'il vise (par exemple un rendez-vous avec une date et une heure), accepte.
- Quand l'appel se termine (accord, refus net, tu raccroches), dis ta dernière phrase puis écris [FIN] à la toute fin.
- Ne note pas l'appel et ne donne pas de conseils : la notation se fait à part.`;

const COACH = `Tu es un coach commercial exigeant mais bienveillant. Tu notes un appel de prospection B2B en français qui vient d'être fait en simulation face à un prospect joué par une IA.
Juge le vendeur seulement (pas le prospect) : accroche et présentation, découverte (questions sur le besoin), écoute et reformulation, traitement de chaque objection, clarté de la proposition, demande d'engagement (rendez-vous avec date et heure), ton et longueur des répliques.
Note sur 10 : 5 = correct sans plus, 7 = bon, 9 ou 10 = excellent et objectif atteint proprement. Un appel très court ou abandonné ne dépasse pas 3.
Donne aussi un score de 0 à 100 pour six compétences : ouverture (accroche, présentation), écoute active (reformule, rebondit), questions (découverte du besoin), proposition de valeur (bénéfices concrets pour ce prospect), objections (chacune traitée), conclusion (demande d'engagement claire).
Écris en français, en vouvoyant le vendeur, avec des phrases courtes et concrètes, en citant ses mots quand c'est utile.`;

// Les six barres de l'analyse de performance (page Simulations IA).
const COMPETENCES = ['ouverture', 'ecoute', 'questions', 'valeur', 'objections', 'conclusion'];

const NOTE = {
  type: 'object',
  properties: {
    note: { type: 'integer', description: 'Note de 0 à 10' },
    verdict: { type: 'string', description: 'Une phrase qui résume l’appel' },
    objectif_atteint: { type: 'boolean' },
    points_forts: { type: 'array', items: { type: 'string' }, description: '1 à 3 points forts' },
    a_ameliorer: { type: 'array', items: { type: 'string' }, description: 'Les 3 choses à améliorer en priorité' },
    objections: {
      type: 'array', description: 'Chaque objection faite par le prospect',
      items: { type: 'object', properties: { objection: { type: 'string' }, bien_traitee: { type: 'boolean' }, conseil: { type: 'string' } }, required: ['objection', 'bien_traitee', 'conseil'], additionalProperties: false },
    },
    phrase_a_essayer: { type: 'string', description: 'Une phrase que le vendeur peut dire au prochain appel' },
    competences: {
      type: 'object', description: 'Score de 0 à 100 par compétence',
      properties: Object.fromEntries(COMPETENCES.map((k) => [k, { type: 'integer' }])),
      required: COMPETENCES, additionalProperties: false,
    },
  },
  required: ['note', 'verdict', 'objectif_atteint', 'points_forts', 'a_ameliorer', 'objections', 'phrase_a_essayer', 'competences'],
  additionalProperties: false,
};

const REDACTION = {
  post: 'Un post LinkedIn (ou réseau social) : une accroche forte sur la première ligne, des phrases courtes, des sauts de ligne, un appel à commenter ou à écrire en message privé, 3 hashtags maximum à la fin, 1300 caractères maximum.',
  email: 'Un e-mail de prospection : première ligne « Objet : … », puis le corps (120 mots maximum), personnel, une seule demande claire, signature avec {{moi}}.',
  sms: 'Un SMS : 300 caractères maximum, direct et poli, sans lien raccourci.',
  linkedin: 'Un message privé LinkedIn : 600 caractères maximum, personnel, pas de pitch agressif, une question pour ouvrir la discussion.',
};

// Qualification des leads LinkedIn (rubrique Nouveaux leads). Les noms ne sont jamais envoyés à Claude : il écrit
// « {{prenom}} » et le CRM le remplace.
const QUALIFIEUR = `Tu qualifies des leads B2B trouvés sur LinkedIn pour une agence française qui crée des CRM sur mesure et fait de la génération de leads pour des TPE et PME.
Pour chaque lead (poste, entreprise, lieu), dis s'il correspond à la cible décrite : un décideur (gérant, fondateur, dirigeant, directeur commercial…) d'une petite entreprise du secteur et de la zone visés, qui peut acheter un CRM ou de la prospection.
Écarte les salariés sans pouvoir de décision, les étudiants, les personnes en recherche d'emploi, les grands groupes, les concurrents (agences CRM, éditeurs de logiciels, cabinets de génération de leads) et les profils trop vagues pour juger.
Score de 0 à 100 : 70 et plus = qualifié, 40 à 69 = à vérifier, moins de 40 = hors cible.
La raison tient en une phrase courte, factuelle, en français.
Le message est une note d'invitation LinkedIn en français, 280 caractères au plus, qui commence par « Bonjour {{prenom}}, », vouvoie, dit que vous avez vu son profil sur LinkedIn, cite son métier ou son entreprise, ne vend rien d'emblée et finit par une question simple. N'écris jamais le nom de la personne : garde {{prenom}} tel quel.`;

const QUALIF = {
  type: 'object',
  properties: {
    leads: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          score: { type: 'integer', description: 'De 0 à 100' },
          categorie: { type: 'string', enum: ['qualifie', 'a_verifier', 'hors_cible'] },
          raison: { type: 'string' },
          message: { type: 'string', description: 'Note d’invitation LinkedIn, 280 caractères au plus' },
        },
        required: ['id', 'score', 'categorie', 'raison', 'message'],
        additionalProperties: false,
      },
    },
  },
  required: ['leads'],
  additionalProperties: false,
};

// Erreur du SDK Claude → statut HTTP et phrase claire pour le CRM.
export function erreurClaude(e) {
  if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError)
    return { status: 400, error: 'La clé Claude est refusée : vérifiez-la sur console.anthropic.com (API Keys) puis collez-la de nouveau dans Entraînement.' };
  if (e instanceof Anthropic.RateLimitError) return { status: 429, error: 'Claude reçoit trop de demandes pour cette clé : réessayez dans une minute.' };
  if (e instanceof Anthropic.BadRequestError)
    return { status: 400, error: 'Claude a refusé la demande. Vérifiez qu’il reste du crédit sur votre compte Claude (console.anthropic.com, rubrique Billing).' };
  if (e instanceof Anthropic.APIConnectionError) return { status: 502, error: 'Claude ne répond pas pour le moment : réessayez.' };
  if (e instanceof Anthropic.APIError && Number(e.status) >= 500) return { status: 503, error: 'Claude est surchargé : réessayez dans un instant.' };
  return { status: 502, error: 'Claude n’a pas pu répondre : réessayez.' };
}

// Actions proposées par un assistant : types connus, champs bornés, 10 au plus. Le navigateur les applique au clic.
const TYPES_ACTION = ['tache', 'relance', 'statut', 'note', 'email', 'modele'];
const STATUTS_ACTION = ['a_appeler', 'injoignable', 'rdv_pris', 'audit_realise', 'proposition_envoyee', 'client_signe', 'perdu'];
const CANAUX = ['email', 'sms', 'linkedin', 'whatsapp', 'appel'];
export function nettoyerActions(l) {
  return (Array.isArray(l) ? l : []).filter((x) => x && TYPES_ACTION.includes(x.type)).slice(0, 10).map((x) => ({
    type: x.type,
    prospect: (/^P\d{1,4}$/.exec(String(x.prospect || '').replace(/[[\]\s]/g, '')) || [''])[0],
    titre: texte(x.titre, 200),
    date: /^\d{4}-\d{2}-\d{2}$/.test(String(x.date || '')) ? x.date : '',
    heure: /^\d{2}:\d{2}$/.test(String(x.heure || '')) ? x.heure : '',
    statut: STATUTS_ACTION.includes(x.statut) ? x.statut : '',
    objet: texte(x.objet, 200),
    texte: texte(x.texte, 5000),
    canal: CANAUX.includes(x.canal) ? x.canal : '',
  }));
}
const textes = (r) => (r.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('').trim();

export function iaRoutes({ db, dataDir, creer = (apiKey) => new Anthropic({ apiKey, maxRetries: 1, timeout: 90000 }) }) {
  const r = Router();
  const { chiffrer, dechiffrer } = coffre(dataDir);
  const quotas = new Map(); // membre → { jour, n }

  async function cle() {
    if (process.env.ANTHROPIC_API_KEY) return { cle: process.env.ANTHROPIC_API_KEY, source: 'env' };
    const g = await getSetting(db, 'ia_claude', null);
    if (!g || !g.cle) return null;
    try { return { cle: dechiffrer(g.cle), source: 'crm', at: g.at }; } catch { return null; }
  }
  async function client(res) {
    const c = await cle();
    if (!c) { res.status(409).json({ error: 'Claude n’est pas encore branché : un administrateur doit coller la clé Claude dans Entraînement.', code: 'SANS_CLE' }); return null; }
    return creer(c.cle);
  }
  function quota(req, res) {
    const jour = new Date().toISOString().slice(0, 10), q = quotas.get(req.user.id);
    const n = q && q.jour === jour ? q.n + 1 : 1;
    if (n > PAR_JOUR) { res.status(429).json({ error: 'Limite du jour atteinte pour Claude (garde-fou de coût) : réessayez demain.' }); return false; }
    quotas.set(req.user.id, { jour, n });
    // Compteur des requêtes envoyées à Claude (accueil des administrateurs) ; sans effet sur la réponse.
    db.run('INSERT INTO ia_usage (id, user_id, kind, created_at) VALUES (?, ?, ?, ?)', randomUUID(), req.user.id, String(req.path).slice(0, 60), new Date().toISOString())
      .catch((e) => console.error('[ia] compteur :', e && e.message));
    return true;
  }
  // Appel à Claude, avec repli automatique sur un autre modèle si Claude décline (fallbacks côté serveur).
  async function demander(c, params) {
    const rep = await c.beta.messages.create({ model: MODELE, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default', cache_control: { type: 'ephemeral' }, ...params });
    if (rep.stop_reason === 'refusal') throw Object.assign(new Error('refus'), { refus: true });
    return rep;
  }
  const echec = (res, e) => {
    if (e && e.refus) return res.status(422).json({ error: 'Claude a préféré ne pas répondre à cette demande : reformulez-la.' });
    const x = erreurClaude(e);
    if (x.status >= 500) console.error('[ia]', e && e.message);
    return res.status(x.status).json({ error: x.error });
  };
  const admin = (req, res) => { if (req.user.role === 'admin') return true; res.status(403).json({ error: 'Réservé aux administrateurs.' }); return false; };
  const entrainement = (req, res) => { if (peut(req.user, 'entrainement')) return true; res.status(403).json({ error: 'Accès à l’Entraînement non autorisé.' }); return false; };

  r.get('/etat', async (req, res) => {
    const c = await cle();
    res.json({ ia: !!c, source: c ? c.source : null, admin: req.user.role === 'admin', modele: MODELE });
  });

  r.put('/cle', express.json({ limit: '4kb' }), async (req, res) => {
    if (!admin(req, res)) return;
    if (process.env.ANTHROPIC_API_KEY) return res.status(409).json({ error: 'La clé Claude est déjà réglée sur le serveur (variable ANTHROPIC_API_KEY).' });
    const k = texte(req.body && req.body.cle, 300).replace(/\s+/g, '');
    if (!CLE_FORMAT.test(k)) return res.status(400).json({ error: 'Ce n’est pas une clé Claude : elle commence par « sk-ant- » (console.anthropic.com, rubrique API Keys).' });
    try { await creer(k).models.retrieve(MODELE); } catch (e) { return echec(res, e); }
    await setSetting(db, 'ia_claude', { cle: chiffrer(k), at: new Date().toISOString(), par: req.user.id });
    res.json({ ia: true, source: 'crm' });
  });

  r.delete('/cle', async (req, res) => {
    if (!admin(req, res)) return;
    await db.run('DELETE FROM settings WHERE key = ?', 'ia_claude');
    res.json({ ia: !!process.env.ANTHROPIC_API_KEY });
  });

  // Une réplique du prospect. messages : [{ de: 'vendeur'|'prospect', texte }], le dernier venant du vendeur.
  r.post('/simulation/repondre', express.json({ limit: '200kb' }), async (req, res) => {
    if (!entrainement(req, res)) return;
    const b = req.body || {};
    const fiche = texte(b.fiche, 6000);
    const msgs = (Array.isArray(b.messages) ? b.messages : []).slice(-80).map((m) => ({ de: m && m.de === 'prospect' ? 'prospect' : 'vendeur', texte: texte(m && m.texte, 2000) })).filter((m) => m.texte);
    if (!fiche) return res.status(400).json({ error: 'La fiche du prospect est vide.' });
    if (!msgs.length || msgs[msgs.length - 1].de !== 'vendeur') return res.status(400).json({ error: 'C’est au vendeur de parler.' });
    const c = await client(res); if (!c || !quota(req, res)) return;
    const messages = [{ role: 'user', content: '(Le téléphone sonne, tu décroches.)' }]
      .concat(msgs.map((m) => ({ role: m.de === 'prospect' ? 'assistant' : 'user', content: m.texte })));
    try {
      const rep = await demander(c, { max_tokens: 2000, output_config: { effort: 'low' }, system: PROSPECT + '\n\nFiche du scénario :\n' + fiche, messages });
      const brut = textes(rep);
      const fin = /\[FIN\]/i.test(brut);
      const dit = brut.replace(/\[FIN\]/gi, '').replace(/\*[^*]*\*/g, '').replace(/^[«"\s]+|[»"\s]+$/g, '').replace(/\s+/g, ' ').trim();
      res.json({ texte: dit || (fin ? 'Au revoir.' : '…'), fin });
    } catch (e) { echec(res, e); }
  });

  // Note de l'appel terminé.
  r.post('/simulation/noter', express.json({ limit: '200kb' }), async (req, res) => {
    if (!entrainement(req, res)) return;
    const b = req.body || {};
    const fiche = texte(b.fiche, 6000);
    const msgs = (Array.isArray(b.messages) ? b.messages : []).slice(-80).map((m) => ({ de: m && m.de === 'prospect' ? 'Prospect' : 'Vendeur', texte: texte(m && m.texte, 2000) })).filter((m) => m.texte);
    if (!msgs.some((m) => m.de === 'Vendeur')) return res.status(400).json({ error: 'L’appel est vide : il n’y a rien à noter.' });
    const c = await client(res); if (!c || !quota(req, res)) return;
    const duree = Math.max(0, Math.min(7200, Number(b.duree) || 0));
    const contenu = 'Scénario donné au prospect :\n' + fiche + '\n\nTranscription de l’appel' + (duree ? ' (' + Math.round(duree / 60) + ' min)' : '') + ' :\n' + msgs.map((m) => m.de + ' : ' + m.texte).join('\n');
    try {
      const rep = await demander(c, { max_tokens: 8000, output_config: { effort: 'medium', format: { type: 'json_schema', schema: NOTE } }, system: COACH, messages: [{ role: 'user', content: contenu }] });
      let n;
      try { n = JSON.parse(textes(rep)); } catch { return res.status(502).json({ error: 'La note de Claude est illisible : réessayez.' }); }
      n.note = Math.max(0, Math.min(10, Math.round(Number(n.note) || 0)));
      const comp = n.competences && typeof n.competences === 'object' ? n.competences : {};
      n.competences = Object.fromEntries(COMPETENCES.map((k) => [k, Math.max(0, Math.min(100, Math.round(Number(comp[k]) || 0)))]));
      res.json(n);
    } catch (e) { echec(res, e); }
  });

  // Qualification de leads LinkedIn : 25 au plus par demande, sans les noms.
  r.post('/linkedin/qualifier', express.json({ limit: '100kb' }), async (req, res) => {
    if (!peut(req.user, 'leads')) return res.status(403).json({ error: 'Accès aux Nouveaux leads non autorisé.' });
    const b = req.body || {};
    const vus = new Set();
    const leads = (Array.isArray(b.leads) ? b.leads : []).map((l) => ({
      id: texte(l && l.id, 80), poste: texte(l && l.poste, 300), entreprise: texte(l && l.entreprise, 160), lieu: texte(l && l.lieu, 120),
    })).filter((l) => l.id && (l.poste || l.entreprise) && !vus.has(l.id) && vus.add(l.id));
    if (!leads.length) return res.status(400).json({ error: 'Aucun lead à qualifier.' });
    if (leads.length > 25) return res.status(400).json({ error: 'Pas plus de 25 leads à la fois.' });
    const c = b.cible || {};
    const cible = [
      ['Offre', texte(c.offre, 600)], ['Postes visés', texte(c.postes, 600)], ['Secteurs visés', texte(c.secteurs, 600)],
      ['Zone visée', texte(c.zone, 200)], ['À écarter', texte(c.exclure, 600)],
    ].filter((x) => x[1]).map((x) => x[0] + ' : ' + x[1]).join('\n');
    const cli = await client(res); if (!cli || !quota(req, res)) return;
    const contenu = 'Cible :\n' + (cible || 'Décideurs de TPE et PME françaises.') + '\n\nLeads à qualifier (JSON) :\n' + JSON.stringify(leads);
    try {
      const rep = await demander(cli, { max_tokens: 12000, output_config: { effort: 'low', format: { type: 'json_schema', schema: QUALIF } }, system: QUALIFIEUR, messages: [{ role: 'user', content: contenu }] });
      let q;
      try { q = JSON.parse(textes(rep)); } catch { return res.status(502).json({ error: 'La réponse de Claude est illisible : réessayez.' }); }
      const parId = new Map((Array.isArray(q && q.leads) ? q.leads : []).map((x) => [String(x && x.id), x]));
      const CAT = ['qualifie', 'a_verifier', 'hors_cible'];
      res.json({
        leads: leads.filter((l) => parId.has(l.id)).map((l) => {
          const x = parId.get(l.id), score = Math.max(0, Math.min(100, Math.round(Number(x.score) || 0)));
          return { id: l.id, score, categorie: CAT.includes(x.categorie) ? x.categorie : score >= 70 ? 'qualifie' : score >= 40 ? 'a_verifier' : 'hors_cible', raison: texte(x.raison, 300), message: texte(x.message, 300) };
        }),
      });
    } catch (e) { echec(res, e); }
  });

  // L'équipe d'assistants IA (CEO, VP Sales, Production…). Chaque membre ne voit que ceux qui lui sont ouverts ;
  // un administrateur les voit tous et choisit qui y a accès.
  const reglageAssistants = () => getSetting(db, 'ia_assistants', {});
  r.get('/assistants', async (req, res) => {
    const reg = await reglageAssistants(), estAdmin = req.user.role === 'admin';
    res.json({
      ia: !!(await cle()),
      assistants: ASSISTANTS.filter((a) => peutUtiliser(req.user, reg, a)).map((a) => ({
        id: a.id, nom: a.nom, titre: a.titre, description: a.description, icone: a.icone, couleur: a.couleur, suggestions: a.suggestions,
        competences: (a.competences || []).map((c) => ({ id: c.id, titre: c.titre, resume: c.resume, methode: c.methode, consigne: c.consigne, ...(c.amorce ? { amorce: c.amorce } : {}) })),
        ...(estAdmin ? { acces: accesDe(reg, a) } : {}),
      })),
    });
  });

  r.put('/assistants/:id/acces', express.json({ limit: '20kb' }), async (req, res) => {
    if (!admin(req, res)) return;
    const a = parAssistant(req.params.id);
    if (!a) return res.status(404).json({ error: 'Assistant inconnu.' });
    const b = req.body || {};
    const ids = new Set((await db.all('SELECT id FROM users')).map((u) => u.id));
    const membres = [...new Set((Array.isArray(b.membres) ? b.membres : []).filter((x) => typeof x === 'string' && ids.has(x)))];
    const reg = await reglageAssistants();
    reg[a.id] = { tous: !!b.tous, membres };
    await setSetting(db, 'ia_assistants', reg);
    res.json({ acces: accesDe(reg, a) });
  });

  // Conversation avec un assistant. contexte : les chiffres et l'état du CRM vus par le membre (entreprises, statuts,
  // montants), jamais les noms, téléphones ni e-mails des contacts : le navigateur ne les envoie pas.
  r.post('/assistants/:id', express.json({ limit: '80kb' }), async (req, res) => {
    const a = parAssistant(req.params.id);
    if (!a) return res.status(404).json({ error: 'Assistant inconnu.' });
    if (!peutUtiliser(req.user, await reglageAssistants(), a)) return res.status(403).json({ error: 'Cet assistant n’est pas ouvert à votre compte : demandez l’accès à un administrateur.' });
    const b = req.body || {};
    const msgs = (Array.isArray(b.messages) ? b.messages : []).slice(-24).map((m) => ({ role: m && m.de === 'ia' ? 'assistant' : 'user', content: texte(m && m.texte, 4000) })).filter((m) => m.content);
    while (msgs.length && msgs[0].role !== 'user') msgs.shift();
    if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return res.status(400).json({ error: 'Posez votre question.' });
    const ctx = texte(b.contexte, 30000);
    const c = await client(res); if (!c || !quota(req, res)) return;
    const qui = texte(req.user.name, 80) + (req.user.role === 'admin' ? ' (administrateur)' : ' (membre de l’équipe)');
    const comp = competenceDe(a, typeof b.competence === 'string' ? b.competence : '');
    const system = consignes(a, comp && comp.id) + '\n\nTu parles avec : ' + qui + '.' + (ctx ? '\n\nÉtat du CRM aujourd’hui :\n' + ctx : '')
      // Interface en anglais : l'assistant répond en anglais (les données du CRM restent en français).
      + (b.langue === 'en' ? '\n\nRéponds en anglais (English) : le membre utilise le CRM en anglais.' : '');
    try {
      // Une compétence lancée demande plus de réflexion qu'une question rapide.
      const rep = await demander(c, { max_tokens: 16000, output_config: { effort: comp ? 'medium' : 'low', format: { type: 'json_schema', schema: REPONSE } }, system, messages: msgs });
      let j;
      try { j = JSON.parse(textes(rep)); } catch { return res.status(502).json({ error: 'La réponse de Claude est illisible : réessayez.' }); }
      res.json({ texte: texte(j && j.texte, 8000), actions: nettoyerActions(j && j.actions) });
    } catch (e) { echec(res, e); }
  });

  // Rédaction pour le Marketing.
  r.post('/rediger', express.json({ limit: '20kb' }), async (req, res) => {
    const b = req.body || {};
    const type = REDACTION[b.type] ? b.type : 'post';
    const consigne = texte(b.consigne, 4000);
    if (!consigne) return res.status(400).json({ error: 'Dites à Claude ce qu’il doit écrire.' });
    const c = await client(res); if (!c || !quota(req, res)) return;
    const system = 'Tu rédiges en français pour une agence qui crée des CRM sur mesure et fait de la génération de leads pour des petites entreprises françaises. ' +
      'Réponds uniquement avec le texte demandé, prêt à copier, sans titre, sans commentaire et sans markdown. Garde tels quels les champs entre doubles accolades comme {{prenom}} ou {{entreprise}}.\n\nFormat : ' + REDACTION[type];
    try {
      const rep = await demander(c, { max_tokens: 4000, output_config: { effort: 'low' }, system, messages: [{ role: 'user', content: consigne }] });
      res.json({ texte: textes(rep) });
    } catch (e) { echec(res, e); }
  });

  return r;
}
