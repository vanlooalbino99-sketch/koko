// Remplace {nom} par sa valeur : « Bonjour {name} » → « Bonjour Albino ». Séparé des dictionnaires pour que
// les composants du navigateur puissent l'importer sans embarquer toutes les traductions.
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

// « il y a 5 minutes », « hier », « il y a 3 jours » dans la langue de l'interface (tag : fr-FR ou en-GB).
export function timeAgo(d: Date, now: Date, tag: string): string {
  const rtf = new Intl.RelativeTimeFormat(tag, { numeric: 'auto' });
  const minutes = Math.round((d.getTime() - now.getTime()) / 60_000);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
  return rtf.format(Math.round(hours / 24), 'day');
}
