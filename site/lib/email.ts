import 'server-only';
// E-mails automatiques, envoyés par Resend (API HTTP, sans dépendance).
// Variables : RESEND_API_KEY, EMAIL_FROM, EMAIL_AGENCE. Sans clé, rien n'est envoyé (journal seulement).
import { escapeHtml as esc } from './utils';
import { site } from './site';

type Mail = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: { filename: string; content: string; content_type?: string }[];
  idempotencyKey?: string;
};

export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
export const agencyRecipients = () => (process.env.EMAIL_AGENCE || '').split(',').map((s) => s.trim()).filter(Boolean);

export async function sendMail(mail: Mail) {
  if (!emailConfigured() || mail.to.length === 0) {
    console.warn('[email] RESEND_API_KEY / EMAIL_FROM absents : e-mail non envoyé —', mail.subject);
    return { sent: false };
  }
  // RESEND_API_URL : seulement pour les tests (faux serveur d'envoi).
  const res = await fetch(process.env.RESEND_API_URL || 'https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      ...(mail.idempotencyKey ? { 'Idempotency-Key': mail.idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      reply_to: mail.replyTo,
      attachments: mail.attachments,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    console.error('[email] Resend a refusé l’envoi', res.status, await res.text().catch(() => ''));
    return { sent: false };
  }
  return { sent: true };
}

// ------------------------------------------------------------------ gabarits

/** Mise en page commune : tableau centré, styles en ligne (compatibles avec les messageries). */
function layout(title: string, body: string) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(title)}</title></head>
<body style="margin:0;background:#f1f4f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0b1220">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:14px;border:1px solid #e2e7ef">
<tr><td style="padding:24px 28px;border-bottom:1px solid #e2e7ef;font-weight:700;font-size:18px;letter-spacing:-.01em">
<span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:#2563c9;margin-right:8px"></span>${esc(site.name)}</td></tr>
<tr><td style="padding:28px;font-size:15px;line-height:1.6">${body}</td></tr>
<tr><td style="padding:18px 28px;border-top:1px solid #e2e7ef;font-size:12px;color:#4a5568">${esc(site.name)} · ${esc(site.phoneDisplay)} · <a href="${site.url}" style="color:#2563c9">${esc(site.url.replace(/^https?:\/\//, ''))}</a></td></tr>
</table></td></tr></table></body></html>`;
}

const rows = (pairs: [string, string | undefined][]) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:16px 0;border-collapse:collapse">${pairs
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:8px 0;color:#4a5568;width:38%;vertical-align:top;border-top:1px solid #eef1f6">${esc(k)}</td><td style="padding:8px 0;border-top:1px solid #eef1f6;white-space:pre-wrap">${esc(v!)}</td></tr>`)
    .join('')}</table>`;

const textRows = (pairs: [string, string | undefined][]) => pairs.filter(([, v]) => v).map(([k, v]) => `${k} : ${v}`).join('\n');

export function contactConfirmation(p: { nom: string; message: string }) {
  const subject = `Nous avons bien reçu votre message — ${site.name}`;
  const html = layout(subject, `<p>Bonjour ${esc(p.nom)},</p>
<p>Merci pour votre message. Un membre de l’équipe vous rappelle <strong>sous 24 h ouvrées</strong>.</p>
<p style="margin:20px 0;padding:14px 16px;background:#f1f4f9;border-radius:10px;color:#4a5568;white-space:pre-wrap">${esc(p.message)}</p>
<p>Vous préférez fixer un moment ? <a href="${site.url}/rendez-vous" style="color:#2563c9">Réservez votre audit gratuit</a>.</p>
<p>À très vite,<br>L’équipe ${esc(site.name)}</p>`);
  const text = `Bonjour ${p.nom},\n\nMerci pour votre message. Un membre de l’équipe vous rappelle sous 24 h ouvrées.\n\n« ${p.message} »\n\nRéserver un audit : ${site.url}/rendez-vous\n\nL’équipe ${site.name}`;
  return { subject, html, text };
}

export function bookingConfirmation(p: { nom: string; quand: string; service: string }) {
  const subject = `Votre rendez-vous est confirmé — ${p.quand}`;
  const html = layout(subject, `<p>Bonjour ${esc(p.nom)},</p>
<p>Votre <strong>audit gratuit</strong> est confirmé :</p>
<p style="margin:20px 0;padding:16px;background:#e8f0fc;border-radius:10px;font-size:17px;font-weight:600;color:#163f85">${esc(p.quand)}<br><span style="font-size:14px;font-weight:400">${esc(p.service)} · 20 à 30 minutes, par téléphone</span></p>
<p>Nous vous appelons au numéro indiqué. L’invitation est jointe pour l’ajouter à votre agenda.</p>
<p>Un empêchement ? Répondez simplement à cet e-mail ou appelez le ${esc(site.phoneDisplay)}.</p>
<p>À bientôt,<br>L’équipe ${esc(site.name)}</p>`);
  const text = `Bonjour ${p.nom},\n\nVotre audit gratuit est confirmé : ${p.quand}.\n${p.service}, 20 à 30 minutes, par téléphone.\n\nNous vous appelons au numéro indiqué. Un empêchement ? Répondez à cet e-mail ou appelez le ${site.phoneDisplay}.\n\nL’équipe ${site.name}`;
  return { subject, html, text };
}

export function agencyNotification(p: { titre: string; details: [string, string | undefined][]; crm: string }) {
  const subject = `[Site] ${p.titre}`;
  const html = layout(subject, `<p style="font-size:17px;font-weight:600;margin:0 0 4px">${esc(p.titre)}</p>
<p style="margin:0;color:#4a5568">${esc(p.crm)}</p>${rows(p.details)}`);
  const text = `${p.titre}\n${p.crm}\n\n${textRows(p.details)}`;
  return { subject, html, text };
}
