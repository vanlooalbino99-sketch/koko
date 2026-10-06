// Schémas des formulaires, partagés par le navigateur (messages en direct) et le serveur (contrôle final).
import { z } from 'zod';
import { isDate, isTime } from './slots.ts';

const phoneDigits = (s: string) => s.replace(/\D/g, '').length;

const nom = z.string().trim().min(2, 'Indiquez votre nom (2 caractères minimum).').max(80, '80 caractères maximum.');
const entreprise = z.string().trim().max(120, '120 caractères maximum.');
const email = z.string().trim().toLowerCase().pipe(z.email('Adresse e-mail invalide.')).pipe(z.string().max(160, 'Adresse trop longue.'));
const telephone = z
  .string()
  .trim()
  .regex(/^[+0-9 ().-]*$/, 'Numéro invalide : chiffres, espaces et + uniquement.')
  .refine((s) => phoneDigits(s) >= 9 && phoneDigits(s) <= 15, 'Numéro de téléphone invalide.');
const prenom = z.string().trim().min(1, 'Indiquez votre prénom.').max(60, '60 caractères maximum.');
const nomFamille = z.string().trim().min(1, 'Indiquez votre nom.').max(60, '60 caractères maximum.');
const ville = z.string().trim().min(2, 'Indiquez votre ville.').max(80, '80 caractères maximum.');

/** Pays proposés pour un rendez-vous (France en premier) ; « Autre pays » reste possible. */
export const PAYS = [
  'France', 'Belgique', 'Suisse', 'Luxembourg', 'Monaco', 'Canada', 'Maroc', 'Algérie', 'Tunisie', 'Sénégal', 'Côte d’Ivoire',
  'Cameroun', 'Madagascar', 'Maurice', 'Espagne', 'Italie', 'Allemagne', 'Portugal', 'Royaume-Uni', 'Pays-Bas', 'États-Unis', 'Autre pays',
] as const;
/** Format du code postal selon le pays (5 chiffres en France et à Monaco, 4 en Belgique, Suisse, Luxembourg…). */
const CP_RULES: Partial<Record<(typeof PAYS)[number], [RegExp, string]>> = {
  France: [/^\d{5}$/, 'Code postal à 5 chiffres (ex. : 69003).'],
  Monaco: [/^980\d{2}$/, 'Code postal à 5 chiffres (ex. : 98000).'],
  Belgique: [/^\d{4}$/, 'Code postal à 4 chiffres (ex. : 1000).'],
  Suisse: [/^\d{4}$/, 'Code postal à 4 chiffres (ex. : 1201).'],
  Luxembourg: [/^(L-?)?\d{4}$/i, 'Code postal à 4 chiffres (ex. : 1611).'],
  Maroc: [/^\d{5}$/, 'Code postal à 5 chiffres.'],
  Algérie: [/^\d{5}$/, 'Code postal à 5 chiffres.'],
  Tunisie: [/^\d{4}$/, 'Code postal à 4 chiffres.'],
  Espagne: [/^\d{5}$/, 'Code postal à 5 chiffres.'],
  Italie: [/^\d{5}$/, 'Code postal à 5 chiffres.'],
  Allemagne: [/^\d{5}$/, 'Code postal à 5 chiffres.'],
  Portugal: [/^\d{4}-?\d{3}$/, 'Code postal au format 1000-001.'],
};
export function codePostalError(pays: string, cp: string): string | null {
  const v = cp.trim();
  if (!v) return 'Indiquez votre code postal.';
  const rule = CP_RULES[pays as (typeof PAYS)[number]];
  if (rule) return rule[0].test(v) ? null : rule[1];
  return /^[A-Za-z0-9][A-Za-z0-9 -]{1,9}$/.test(v) ? null : 'Code postal invalide.';
}

const consentement = z.boolean().refine((v) => v === true, 'Votre accord est nécessaire pour vous recontacter.');
/** Champ piège invisible : seuls les robots le remplissent (le serveur fait alors semblant d'accepter). */
const website = z.string().max(500).optional();
export const isBot = (d: { website?: string }) => Boolean(d.website);

export const contactSchema = z.object({
  nom,
  entreprise: entreprise.optional().default(''),
  email,
  telephone,
  sujet: z.enum(['information', 'devis', 'partenariat', 'autre']),
  message: z.string().trim().min(10, 'Votre message est un peu court (10 caractères minimum).').max(2000, '2 000 caractères maximum.'),
  consentement,
  website,
});

export const SERVICE_OPTIONS = [
  { value: 'assistant-telephonique', label: 'Assistant téléphonique IA' },
  { value: 'prise-de-rendez-vous', label: 'Prise de rendez-vous automatique' },
  { value: 'relances-automatisees', label: 'Relances et suivi client' },
  { value: 'audit-et-strategie', label: 'Audit et accompagnement' },
  { value: 'autre', label: 'Je ne sais pas encore' },
] as const;

export const SUJETS = [
  { value: 'information', label: 'Demande d’information' },
  { value: 'devis', label: 'Demande de devis' },
  { value: 'partenariat', label: 'Partenariat' },
  { value: 'autre', label: 'Autre' },
] as const;

export const bookingSchema = z
  .object({
    date: z.string().refine(isDate, 'Choisissez une date.'),
    heure: z.string().refine(isTime, 'Choisissez un créneau.'),
    prenom,
    nom: nomFamille,
    entreprise: entreprise.min(2, 'Indiquez le nom de votre entreprise.'),
    email,
    telephone,
    pays: z.enum(PAYS, 'Choisissez votre pays.'),
    codePostal: z.string().trim().toUpperCase().max(12, 'Code postal invalide.'),
    ville,
    service: z.enum(SERVICE_OPTIONS.map((o) => o.value) as [string, ...string[]]),
    message: z.string().trim().max(1000, '1 000 caractères maximum.').optional().default(''),
    consentement,
    website,
  })
  .superRefine((d, ctx) => {
    const err = codePostalError(d.pays, d.codePostal);
    if (err) ctx.addIssue({ code: 'custom', path: ['codePostal'], message: err });
  });

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
export type BookingInput = z.input<typeof bookingSchema>;
export type BookingData = z.output<typeof bookingSchema>;

/** Erreurs par champ, au format attendu par les formulaires. */
export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? '_');
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export const labelOf = (list: readonly { value: string; label: string }[], value: string) => list.find((o) => o.value === value)?.label ?? value;
