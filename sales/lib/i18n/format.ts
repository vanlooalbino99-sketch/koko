// Remplace {nom} par sa valeur : « Bonjour {name} » → « Bonjour Albino ». Séparé des dictionnaires pour que
// les composants du navigateur puissent l'importer sans embarquer toutes les traductions.
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
