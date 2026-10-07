// /api/site : passerelle du site internet de l'agence (dossier site/) vers le CRM.
// Les messages de contact et les rendez-vous réservés en ligne deviennent des prospects « à rappeler »,
// avec une tâche de rappel et, pour un rendez-vous, l'heure dans l'agenda. L'équipe les voit apparaître
// d'elle-même (synchronisation habituelle des données, voir data.js).
//
// Authentification : en-tête « Authorization: Bearer <SITE_API_KEY> » (clé partagée avec le serveur du site,
// jamais exposée au navigateur). Sans SITE_API_KEY, la passerelle est désactivée.
import { Router } from 'express';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { EMAIL_RE } from '../auth.js';
import { DATA_KEY, writeKv } from './data.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const CANAL = 'Site internet';

const sha = (s) => createHash('sha256').update(String(s)).digest();
const newId = () => Date.now().toString(36) + randomBytes(4).toString('hex').slice(0, 6);
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const digits = (s) => String(s || '').replace(/\D/g, '');
const parse = (s) => { try { return JSON.parse(s); } catch { return undefined; } };
const minutes = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
const validDate = (s) => DATE_RE.test(s) && new Date(s + 'T00:00:00Z').toISOString().startsWith(s);

// Date et heure dans le fuseau de l'agence (le CRM affiche des dates locales AAAA-MM-JJ).
export function zoned(timeZone, at = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(at).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}

const money = (v) => (Number.isFinite(Number(v)) ? Math.min(Math.max(Math.round(Number(v)), 0), 1_000_000) : 0);

export function validateLead(b) {
  const errors = [];
  const lead = {
    type: b.type,
    requestId: str(b.requestId, 64),
    nom: str(b.nom, 120),
    prenom: str(b.prenom, 60),
    nomFamille: str(b.nomFamille, 60),
    entreprise: str(b.entreprise, 120),
    pays: str(b.pays, 60),
    codePostal: str(b.codePostal, 12),
    ville: str(b.ville, 80),
    email: str(b.email, 160).toLowerCase(),
    telephone: str(b.telephone, 30),
    message: str(b.message, 2000),
    sujet: str(b.sujet, 80),
    service: str(b.service, 80),
    page: str(b.page, 80),
    date: str(b.date, 10),
    heure: str(b.heure, 5),
    // Offre choisie sur le site : étiquette de la fiche et montants (mise en place, mensuel).
    pack: str(b.pack, 40),
    dealValue: money(b.dealValue),
    mrrValue: money(b.mrrValue),
  };
  if (lead.type !== 'contact' && lead.type !== 'rdv') errors.push('Type inconnu (contact ou rdv).');
  if (!/^[\w-]{8,64}$/.test(lead.requestId)) errors.push('Identifiant de demande invalide.');
  if (lead.nom.length < 2) errors.push('Nom manquant.');
  if (!EMAIL_RE.test(lead.email)) errors.push('E-mail invalide.');
  if (digits(lead.telephone).length < 9) errors.push('Téléphone invalide.');
  if (lead.type === 'rdv' && (!validDate(lead.date) || !TIME_RE.test(lead.heure))) errors.push('Date ou heure du rendez-vous invalide.');
  return { lead, errors };
}

export function siteRoutes({ db, apiKey, timeZone = 'Europe/Paris', slotMinutes = 30 }) {
  const r = Router();
  const keyHash = apiKey ? sha(apiKey) : null;

  r.use((req, res, next) => {
    if (!keyHash) return res.status(503).json({ error: 'Passerelle du site désactivée (SITE_API_KEY non définie).' });
    const m = /^Bearer (.+)$/.exec(req.get('Authorization') || '');
    if (!m || !timingSafeEqual(sha(m[1]), keyHash)) return res.status(401).json({ error: 'Clé du site invalide.' });
    next();
  });

  const readData = async () => {
    const row = await db.get('SELECT value, version FROM kv WHERE key = ?', DATA_KEY);
    const value = row ? parse(row.value) : undefined;
    if (row && (value === undefined || value === null || typeof value !== 'object')) {
      const e = new Error('Données du CRM illisibles.');
      e.status = 500;
      throw e;
    }
    return { data: value || {}, version: row ? row.version : 0 };
  };

  // Créneaux pris : tous les prospects au statut « RDV pris » avec une date et une heure dans la période,
  // qu'ils viennent du site ou d'un appel. Un rendez-vous déplacé ou annulé par l'équipe libère donc son créneau.
  function takenSlots(from, to, data) {
    const seen = new Set();
    return (Array.isArray(data.prospects) ? data.prospects : [])
      .filter((p) => p && p.statut === 'rdv_pris' && validDate(p.prochaineRelance) && p.prochaineRelance >= from && p.prochaineRelance <= to && TIME_RE.test(p.prochaineRelanceHeure || ''))
      .map((p) => ({ date: p.prochaineRelance, heure: p.prochaineRelanceHeure }))
      .filter((x) => !seen.has(x.date + x.heure) && seen.add(x.date + x.heure))
      .sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure));
  }

  r.get('/creneaux', async (req, res) => {
    const { from, to } = req.query;
    if (!validDate(from) || !validDate(to) || from > to) return res.status(400).json({ error: 'Période invalide (from, to : AAAA-MM-JJ).' });
    res.json({ pris: takenSlots(from, to, (await readData()).data) });
  });

  r.post('/leads', async (req, res) => {
    const { lead, errors } = validateLead(req.body || {});
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });

    const out = await db.tx(async () => {
      // Renvoi de la même demande (double clic, nouvel essai réseau) : rien n'est recréé.
      const dup = await db.get('SELECT prospect_id FROM site_requests WHERE id = ?', lead.requestId);
      if (dup) return { status: 200, body: { prospectId: dup.prospect_id, duplicate: true } };

      const { data, version } = await readData();
      if (lead.type === 'rdv' && takenSlots(lead.date, lead.date, data).some((s) => Math.abs(minutes(s.heure) - minutes(lead.heure)) < slotMinutes)) {
        return { status: 409, body: { error: 'Ce créneau est déjà réservé.' } };
      }

      const now = zoned(timeZone);
      const ts = new Date().toISOString();
      const prospects = Array.isArray(data.prospects) ? data.prospects : [];
      const tasks = Array.isArray(data.tasks) ? data.tasks : [];
      const isRdv = lead.type === 'rdv';
      const quand = isRdv ? `${lead.date.split('-').reverse().join('/')} à ${lead.heure}` : '';
      const resume = isRdv
        ? `RDV réservé sur le site : ${quand}${lead.service ? ` (${lead.service})` : ''}`
        : `Message reçu via le site${lead.sujet ? ` (${lead.sujet})` : ''}`;
      // Coordonnées postales du formulaire de rendez-vous (pays, code postal, ville).
      const lieu = [[lead.codePostal, lead.ville].filter(Boolean).join(' '), lead.pays].filter(Boolean).join(', ');
      const qui = lead.prenom || lead.nomFamille ? `${lead.prenom} ${lead.nomFamille}`.trim() : '';
      const coords = qui || lieu ? `Coordonnées : ${[qui, lieu].filter(Boolean).join(' · ')}` : '';
      const note = [resume, coords, lead.message && `« ${lead.message} »`].filter(Boolean).join('\n');
      const adresse = {
        ...(lead.ville ? { ville: lead.ville } : {}),
        ...(lieu ? { adresse: lieu } : {}),
        ...(lead.codePostal ? { codePostal: lead.codePostal } : {}),
        ...(lead.pays ? { pays: lead.pays } : {}),
        ...(lead.prenom ? { prenom: lead.prenom } : {}),
        ...(lead.nomFamille ? { nomFamille: lead.nomFamille } : {}),
      };
      const event = { id: newId(), ts, date: now.date, time: now.time, type: isRdv ? 'relance' : 'email', text: note };
      const relance = isRdv ? { prochaineRelance: lead.date, prochaineRelanceHeure: lead.heure } : { prochaineRelance: now.date, prochaineRelanceHeure: null };

      // Prospect déjà connu (même e-mail ou même téléphone) : on le complète au lieu de créer un doublon.
      const tel = digits(lead.telephone).slice(-9);
      const existing = prospects.find((p) => (p.email && String(p.email).toLowerCase() === lead.email) || (tel && digits(p.telephone).slice(-9) === tel));
      let prospect;
      let next;
      if (existing) {
        // Un prospect déjà avancé (audit, proposition, client) garde son statut ; un rendez-vous déjà fixé
        // n'est pas écrasé par un simple message.
        const early = ['a_appeler', 'injoignable', 'perdu', 'resilie'].includes(existing.statut);
        const keepRdv = !isRdv && existing.statut === 'rdv_pris';
        prospect = {
          ...existing,
          ...(keepRdv ? {} : relance),
          statut: early ? (isRdv ? 'rdv_pris' : 'a_appeler') : existing.statut,
          email: existing.email || lead.email,
          telephone: existing.telephone || lead.telephone,
          contact: existing.contact || lead.nom,
          // Adresse et identité : complétées seulement si la fiche ne les avait pas.
          ...Object.fromEntries(Object.entries(adresse).filter(([k]) => !existing[k])),
          tags: Array.from(new Set([...(Array.isArray(existing.tags) ? existing.tags : []), 'Site', ...(lead.pack ? [lead.pack] : [])])),
          ...(lead.dealValue && !Number(existing.dealValue) ? { dealValue: lead.dealValue } : {}),
          ...(lead.mrrValue && !Number(existing.mrrValue) ? { mrrValue: lead.mrrValue } : {}),
          events: [event, ...(Array.isArray(existing.events) ? existing.events : [])].slice(0, 200),
          updatedAt: now.date,
        };
        next = prospects.map((p) => (p.id === existing.id ? prospect : p));
      } else {
        prospect = {
          id: newId(),
          entreprise: lead.entreprise || lead.nom,
          secteur: 'Autre',
          contact: lead.nom,
          telephone: lead.telephone,
          email: lead.email,
          ville: '', adresse: '', siret: '', site: '',
          ...adresse,
          canal: CANAL,
          statut: isRdv ? 'rdv_pris' : 'a_appeler',
          priorite: 'haute',
          tags: ['Site', ...(lead.pack ? [lead.pack] : [])],
          notes: note,
          dealValue: lead.dealValue, mrrValue: lead.mrrValue, signedAt: null, resilieAt: null,
          ...relance,
          createdAt: now.date,
          updatedAt: now.date,
          callLog: [],
          events: [event, { id: newId(), ts, date: now.date, time: now.time, type: 'create', text: `Prospect créé depuis le site (${lead.page || CANAL})` }],
        };
        next = [prospect, ...prospects];
      }
      const task = {
        id: newId(),
        title: isRdv ? `Audit : appeler ${lead.nom}${lead.entreprise ? ` (${lead.entreprise})` : ''}` : `Rappeler ${lead.nom}${lead.entreprise ? ` (${lead.entreprise})` : ''} : message du site`,
        prospectId: prospect.id,
        due: isRdv ? lead.date : now.date,
        heure: isRdv ? lead.heure : '',
        priorite: 'haute',
        notes: [lead.telephone, lead.email, note].filter(Boolean).join('\n'),
        done: false,
        createdAt: now.date,
      };

      await writeKv(db, DATA_KEY, JSON.stringify({ ...data, version: data.version || 4, prospects: next, tasks: [task, ...tasks] }), version + 1, null);
      await db.run('INSERT INTO site_requests (id, kind, prospect_id, rdv_date, rdv_time, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        lead.requestId, lead.type, prospect.id, isRdv ? lead.date : null, isRdv ? lead.heure : null, ts);
      return { status: 201, body: { prospectId: prospect.id, taskId: task.id, existing: Boolean(existing) } };
    });
    res.status(out.status).json(out.body);
  });

  return r;
}
