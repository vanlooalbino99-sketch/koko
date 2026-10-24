import type { z } from 'zod';

// État renvoyé par une action serveur à son formulaire (useActionState).
export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string | string[]>;
  ok?: string;
};

export const initialFormState: FormState = {};

// Erreurs Zod → { "prospect.name": "message" }, au premier problème par champ.
export function fieldErrorsFrom(error: z.ZodError, message: (issue: z.core.$ZodIssue) => string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.');
    out[key] ??= message(issue);
  }
  return out;
}

// Valeurs saisies renvoyées au formulaire pour ne rien perdre après une erreur (jamais les mots de passe).
export function echo(formData: FormData, omit: string[] = []): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  for (const key of new Set(formData.keys())) {
    if (omit.includes(key) || key.startsWith('$')) continue;
    const all = formData.getAll(key).filter((v): v is string => typeof v === 'string');
    out[key] = all.length > 1 ? all : (all[0] ?? '');
  }
  return out;
}
