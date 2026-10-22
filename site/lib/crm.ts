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
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const conf = () => {
  const url = process.env.CRM_URL?.replace(/\/$/, '');
  const key = process.env.CRM_SITE_KEY;
  return url && key ? { url, key } : null;
};

export const crmConfigured = () => conf() !== null;

/** Délai court pour l'affichage des créneaux (le site se rabat sur les créneaux théoriques). */
export const DELAI_COURT = 8_000;
/** Délai d'une réservation ou d'une demande : un CRM hébergé gratuitement peut mettre une minute à se réveiller. */
export const DELAI_LONG = 90_000;
const PAUSE = 3_000;
// Réponses d'un CRM en train de démarrer : on réessaie jusqu'au délai.
const REVEIL = new Set([502, 503, 504]);

async function call<T>(method: 'GET' | 'POST', path: string, body?: unknown, delai = DELAI_COURT): Promise<T> {
  const c = conf();
  if (!c) throw new CrmError('CRM non configuré (CRM_URL, CRM_SITE_KEY).', 503);
  const fin = Date.now() + delai;
  for (;;) {
    const reste = fin - Date.now();
    let res: Response;
    try {
      res = await fetch(c.url + path, {
        method,
        headers: { Authorization: `Bearer ${c.key}`, 'Content-Type': 'application/json', 'X-Requested-With': 'blackstart', Accept: 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
        cache: 'no-store',
        signal: AbortSignal.timeout(Math.max(reste, 1)),
      });
    } catch (e) {
      // Réseau coupé ou CRM qui ne répond pas encore : nouvel essai tant qu'il reste du temps.
      if (fin - Date.now() > PAUSE) { await new Promise((r) => setTimeout(r, PAUSE)); continue; }
      throw e;
    }
    const json = (await res.json().catch(() => null)) as ({ error?: string } & T) | null;
    // Page d'attente de l'hébergeur (pas du JSON) ou passerelle pas encore prête : le CRM se réveille.
    if ((json === null || REVEIL.has(res.status)) && fin - Date.now() > PAUSE) { await new Promise((r) => setTimeout(r, PAUSE)); continue; }
    if (!res.ok) throw new CrmError((json && json.error) || `CRM : erreur ${res.status}`, res.status);
    if (json === null) throw new CrmError('CRM : réponse illisible.', 502);
    return json as T;
  }
}

/** Créneaux déjà réservés entre deux dates (incluses). */
export async function bookedSlots(from: string, to: string, delai = DELAI_COURT) {
  if (!crmConfigured()) return [] as { date: string; heure: string }[];
  const r = await call<{ pris: { date: string; heure: string }[] }>('GET', `/api/site/creneaux?from=${from}&to=${to}`, undefined, delai);
  return r.pris;
}

/** Crée (ou complète) le prospect dans le CRM, avec une tâche de rappel. Lève CrmError 409 si le créneau est pris. */
export async function pushLead(lead: CrmLead) {
  if (!crmConfigured()) {
    console.warn('[crm] CRM_URL / CRM_SITE_KEY absents : lead non transmis', { type: lead.type, email: lead.email });
    return { prospectId: null as string | null, skipped: true };
  }
  const r = await call<{ prospectId: string }>('POST', '/api/site/leads', lead, DELAI_LONG);
  return { prospectId: r.prospectId, skipped: false };
}
