'use server';

import { contactSchema, fieldErrors, isBot, labelOf, SUJETS } from '@/lib/validation';
import { pushLead } from '@/lib/crm';
import { agencyNotification, agencyRecipients, contactConfirmation, emailConfigured, sendMail } from '@/lib/email';
import { rateLimited } from '@/lib/rate-limit';
import { safeRequestId, type ActionResult } from './result';

/** Formulaire de contact : lead « à rappeler » dans le CRM, accusé de réception au visiteur, alerte à l'équipe. */
export async function submitContact(input: unknown, rawRequestId?: string): Promise<ActionResult> {
  if (await rateLimited('contact')) return { ok: false, error: 'Trop d’envois en peu de temps. Réessayez dans quelques minutes.' };
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Certains champs sont à corriger.', fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;
  if (isBot(d)) return { ok: true }; // robot : on fait comme si de rien n'était
  const requestId = safeRequestId(rawRequestId);

  let crmNote = 'Ajouté au CRM : à rappeler aujourd’hui.';
  try {
    const r = await pushLead({ type: 'contact', requestId, nom: d.nom, entreprise: d.entreprise, email: d.email, telephone: d.telephone, sujet: labelOf(SUJETS, d.sujet), message: d.message, page: '/contact' });
    if (r.skipped) crmNote = 'CRM non configuré : lead à saisir à la main.';
  } catch (e) {
    console.error('[contact] CRM indisponible', e);
    if (!emailConfigured()) return { ok: false, error: 'Envoi impossible pour le moment. Appelez-nous ou réessayez plus tard.' };
    crmNote = '⚠ CRM indisponible : lead NON enregistré, à saisir à la main.';
  }

  const confirmation = contactConfirmation({ nom: d.nom, message: d.message });
  const notif = agencyNotification({
    titre: `Nouveau message : ${d.nom}${d.entreprise ? ` (${d.entreprise})` : ''}`,
    crm: crmNote,
    details: [['Sujet', labelOf(SUJETS, d.sujet)], ['Nom', d.nom], ['Entreprise', d.entreprise], ['E-mail', d.email], ['Téléphone', d.telephone], ['Message', d.message]],
  });
  await Promise.allSettled([
    sendMail({ to: [d.email], ...confirmation, idempotencyKey: `contact-client-${requestId}` }),
    sendMail({ to: agencyRecipients(), ...notif, replyTo: d.email, idempotencyKey: `contact-agence-${requestId}` }),
  ]);
  return { ok: true };
}
