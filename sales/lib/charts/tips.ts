// Textes des bulles des graphiques (« 12 – 18 oct. », « 5 appels », « 72 / 100 »), dans la langue de l'interface.
// Les graphiques reçoivent les chaînes toutes prêtes : ils ne connaissent ni les dates ni les unités.
import type { Locale } from '../domain.ts';
import { format, type Dictionary } from '../i18n/index.ts';

const DAY = 24 * 60 * 60 * 1000;

export function chartTips(t: Dictionary, locale: Locale) {
  const tag = locale === 'fr' ? 'fr-FR' : 'en-GB';
  const c = t.charts;
  const num = new Intl.NumberFormat(tag, { maximumFractionDigits: 1 });
  const day = new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'short', timeZone: 'UTC' });
  // En français, 0 et 1 prennent le singulier (« 0 appel »).
  const many = (forms: { one: string; other: string }, n: number) => format((locale === 'fr' ? n < 2 : n === 1) ? forms.one : forms.other, { n: num.format(n) });
  // Jours from à to (inclus) d'une série quotidienne qui commence à since.
  const days = (since: Date, from: number, to: number) => {
    const a = day.format(new Date(since.getTime() + from * DAY));
    return from === to ? a : `${a} – ${day.format(new Date(since.getTime() + to * DAY))}`;
  };
  // Tranche i sur n de la période [since, now] (grille de points) : son jour, ou ses jours si elle en couvre plusieurs.
  // Pas d'heure : le serveur ne connaît pas le fuseau du navigateur.
  const slice = (since: Date, now: Date, i: number, n: number) => {
    const size = (now.getTime() - since.getTime()) / n;
    const a = day.format(new Date(since.getTime() + i * size));
    const b = day.format(new Date(since.getTime() + (i + 1) * size - 1));
    return a === b ? a : `${a} – ${b}`;
  };
  const score = (n: number) => format(c.outOf100, { n: Math.round(n) });
  // Appels from à to (numérotés à partir de 1) d'une série appel par appel.
  const callsLabel = (from: number, to: number) => (from === to ? format(c.call, { n: from + 1 }) : format(c.callRange, { from: from + 1, to: to + 1 }));
  return {
    num,
    many,
    days,
    slice,
    score,
    callsLabel,
    calls: (n: number) => many(c.calls, n),
    minutes: (n: number) => format(c.minutes, { n: num.format(n) }),
    day: (d: Date) => day.format(d),
  };
}
