// Rubriques ouvertes à chaque membre. users.acces garde la liste AUTORISÉE en JSON ; NULL = tout le CRM
// (y compris les rubriques ajoutées plus tard). Les administrateurs ont toujours tout.
// Réglages (Mon compte, mot de passe, apparence, notifications) reste toujours ouvert.
export const ACCES = ['today', 'agenda', 'prospects', 'leads', 'pipeline', 'tasks', 'mail', 'devis', 'clients', 'payments',
  'messages', 'groupes', 'visio', 'dashboard', 'reports', 'carte', 'formations', 'tools',
  'settings.company', 'settings.goals', 'settings.data'];

// Valeur enregistrée → liste (null = tout). Illisible : rien d'ouvert (fermé par prudence).
export function lireAcces(text) {
  if (text === null || text === undefined || text === '') return null;
  try {
    const v = JSON.parse(text);
    if (!Array.isArray(v)) return [];
    return ACCES.filter((k) => v.includes(k));
  } catch { return []; }
}

// Valeur envoyée par l'administrateur → { liste } (null = tout) ou { error }.
export function validerAcces(v) {
  if (v === null) return { liste: null };
  if (!Array.isArray(v) || v.some((k) => typeof k !== 'string')) return { error: 'Accès : liste de rubriques attendue.' };
  const inconnue = v.find((k) => !ACCES.includes(k));
  if (inconnue) return { error: `Rubrique inconnue : ${inconnue.slice(0, 40)}.` };
  return { liste: ACCES.filter((k) => v.includes(k)) };
}

// user.acces est déjà la valeur effective (null pour un administrateur).
export function peut(user, cle) {
  if (!user) return false;
  if (user.role === 'admin' || !Array.isArray(user.acces) || !ACCES.includes(cle)) return true;
  return user.acces.includes(cle);
}

export const REFUS = { error: 'Rubrique non ouverte à votre compte : demandez l’accès à un administrateur.', code: 'acces' };

export function requireAcces(...cles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Session expirée : reconnectez-vous.' });
    if (cles.some((k) => peut(req.user, k))) return next();
    res.status(403).json(REFUS);
  };
}
