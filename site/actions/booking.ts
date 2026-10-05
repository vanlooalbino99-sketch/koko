'use server';

import { bookingSchema, fieldErrors, isBot, labelOf, SERVICE_OPTIONS } from '@/lib/validation';
import { bookedSlots, CrmError, pushLead } from '@/lib/crm';
import { agencyNotification, agencyRecipients, bookingConfirmation, emailConfigured, sendMail } from '@/lib/email';
import { bookingIcs } from '@/lib/ics';
import { rateLimited } from '@/lib/rate-limit';
import { formatSlot, isSlotAvailable } from '@/lib/slots';
import { site } from '@/lib/site';
import { safeRequestId, type ActionResult } from './result';

const TAKEN = 'Ce créneau vient d’être réservé. Choisissez-en un autre.';

/** Réservation : rendez-vous dans l'agenda du CRM (prospect « RDV obtenu »), confirmation avec invitation, alerte à l'équipe. */
export async function submitBooking(input: unknown, rawRequestId?: string): Promise<ActionResult<{ quand: string }>> {
  if (await rateLimited('booking')) return { ok: false, error: 'Trop de réservations en peu de temps. Réessayez dans quelques minutes.' };
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Certains champs sont à corriger.', fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;
  const quand = formatSlot(d.date, d.heure);
  if (isBot(d)) return { ok: true, quand };
  const requestId = safeRequestId(rawRequestId);
  const service = labelOf(SERVICE_OPTIONS, d.service);

  let crmNote = 'Ajouté au CRM : RDV dans l’agenda et tâche de rappel.';
  try {
    const taken = (await bookedSlots(d.date, d.date)).map((s) => s.heure);
    if (!isSlotAvailable(d.date, d.heure, taken)) return { ok: false, error: TAKEN, fieldErrors: { heure: TAKEN } };
    const r = await pushLead({ type: 'rdv', requestId, nom: d.nom, entreprise: d.entreprise, email: d.email, telephone: d.telephone, service, message: d.message, date: d.date, heure: d.heure, page: '/rendez-vous' });
    if (r.skipped) crmNote = 'CRM non configuré : RDV à saisir à la main.';
  } catch (e) {
    if (e instanceof CrmError && e.status === 409) return { ok: false, error: TAKEN, fieldErrors: { heure: TAKEN } };
    console.error('[rendez-vous] CRM indisponible', e);
    if (!isSlotAvailable(d.date, d.heure)) return { ok: false, error: TAKEN, fieldErrors: { heure: TAKEN } };
    if (!emailConfigured()) return { ok: false, error: 'Réservation impossible pour le moment. Appelez-nous ou réessayez plus tard.' };
    crmNote = '⚠ CRM indisponible : RDV NON enregistré, à saisir à la main (vérifier le créneau).';
  }

  const ics = bookingIcs({
    uid: `${requestId}@blackstart`,
    date: d.date,
    heure: d.heure,
    title: `Audit ${site.name}`,
    description: `${service}. Nous vous appelons au ${d.telephone}.`,
    organizer: site.email,
    location: `Appel téléphonique (${d.telephone})`,
  });
  const confirmation = bookingConfirmation({ nom: d.nom, quand, service });
  const notif = agencyNotification({
    titre: `Nouveau RDV : ${d.entreprise}, ${quand}`,
    crm: crmNote,
    details: [['Créneau', quand], ['Service', service], ['Nom', d.nom], ['Entreprise', d.entreprise], ['E-mail', d.email], ['Téléphone', d.telephone], ['Message', d.message]],
  });
  await Promise.allSettled([
    sendMail({
      to: [d.email],
      ...confirmation,
      attachments: [{ filename: 'rendez-vous-blackstart.ics', content: Buffer.from(ics).toString('base64'), content_type: 'text/calendar; charset=utf-8; method=PUBLISH' }],
      idempotencyKey: `rdv-client-${requestId}`,
    }),
    sendMail({ to: agencyRecipients(), ...notif, replyTo: d.email, idempotencyKey: `rdv-agence-${requestId}` }),
  ]);
  return { ok: true, quand };
}
