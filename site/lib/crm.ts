import 'server-only';
// Liaison avec le CRM Blackstart (version équipe) : les demandes du site y deviennent des leads à rappeler.
// API côté CRM : server/src/routes/site.js (authentification par clé partagée).

export type CrmLead = {
  type: 'contact' | 'rdv';
  /** Identifiant unique de la demande : un renvoi ne crée pas de doublon. */
  requestId: string;
  /** Nom complet (prénom et nom), lu par toutes les versions du CRM. */
  nom: string;
  prenom?: string;
  nomFamille?: string;
  entreprise?: string;
  pays?: string;
  codePostal?: string;
  ville?: string;
  email: string;
  telephone: string;
  message?: string;
  sujet?: string;
  service?: string;
  date?: string;
  heure?: string;
  page?: string;
  /** Offre choisie sur le site : étiquette de la fiche, mise en place et mensuel en euros. */
  pack?: string;
  dealValue?: number;
  mrrValue?: number;
};

export class CrmError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

const conf = () => {
  const url = process.env.CRM_URL?.replace(/\/$/, '');
  const key = process.env.CRM_SITE_KEY;
  return url && key ? { url, key } : null;
};

export const crmConfigured = () => conf() !== null;

async function call<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
  const c = conf();
  if (!c) throw new CrmError('CRM non configuré (CRM_URL, CRM_SITE_KEY).', 503);
  const res = await fetch(c.url + path, {
    method,
    headers: { Authorization: `Bearer ${c.key}`, 'Content-Type': 'application/json', 'X-Requested-With': 'blackstart' },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  });
  const json = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new CrmError(json.error || `CRM : erreur ${res.status}`, res.status);
  return json as T;
}

/** Créneaux déjà réservés entre deux dates (incluses). */
export async function bookedSlots(from: string, to: string) {
  if (!crmConfigured()) return [] as { date: string; heure: string }[];
  const r = await call<{ pris: { date: string; heure: string }[] }>('GET', `/api/site/creneaux?from=${from}&to=${to}`);
  return r.pris;
}

/** Crée (ou complète) le prospect dans le CRM, avec une tâche de rappel. Lève CrmError 409 si le créneau est pris. */
export async function pushLead(lead: CrmLead) {
  if (!crmConfigured()) {
    console.warn('[crm] CRM_URL / CRM_SITE_KEY absents : lead non transmis', { type: lead.type, email: lead.email });
    return { prospectId: null as string | null, skipped: true };
  }
  const r = await call<{ prospectId: string }>('POST', '/api/site/leads', lead);
  return { prospectId: r.prospectId, skipped: false };
}
