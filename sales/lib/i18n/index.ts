import { LOCALES, isOneOf, type Locale } from '../domain.ts';
import { en } from './en.ts';
import { fr, type Dictionary } from './fr.ts';

export type { Dictionary };
export const LOCALE_COOKIE = 'bs_locale';

const DICTIONARIES: Record<Locale, Dictionary> = { fr, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

// Remplace {nom} par sa valeur : « Bonjour {name} » → « Bonjour Albino ».
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

// Choix de la langue : préférence du compte, sinon cookie, sinon en-tête du navigateur, sinon français.
export function resolveLocale(options: { user?: string | null; cookie?: string | null; acceptLanguage?: string | null }): Locale {
  if (isOneOf(LOCALES, options.user)) return options.user;
  if (isOneOf(LOCALES, options.cookie)) return options.cookie;
  const accepted = (options.acceptLanguage ?? '')
    .split(',')
    .map((part) => part.split(';')[0].trim().slice(0, 2).toLowerCase());
  return accepted.find((lang): lang is Locale => isOneOf(LOCALES, lang)) ?? 'fr';
}

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}
