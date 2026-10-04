// Fusion à trois voies des données du CRM, quand deux personnes enregistrent en même temps.
//
// base   : la version que le navigateur avait chargée,
// mine   : ce que ce navigateur envoie,
// theirs : ce qui est en base (enregistré entre-temps par quelqu'un d'autre).
//
// Règles : ce qu'une seule des deux parties a changé est gardé ; les listes d'objets à identifiant
// (prospects, devis, factures, tâches, historique d'un prospect…) sont fusionnées élément par élément,
// puis champ par champ ; un élément supprimé d'un côté mais modifié de l'autre est conservé (aucune perte) ;
// sur un même champ modifié des deux côtés, le dernier enregistrement l'emporte (sauf base inconnue : la base gagne).

export function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (!Object.prototype.hasOwnProperty.call(b, k) || !deepEqual(a[k], b[k])) return false;
  return true;
}

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isIdList = (v) => Array.isArray(v) && v.every((x) => isObj(x) && (typeof x.id === 'string' || typeof x.id === 'number'));

export function merge3(base, mine, theirs) {
  if (deepEqual(mine, base)) return theirs;
  if (deepEqual(theirs, base)) return mine;
  if (deepEqual(mine, theirs)) return mine;
  if (isIdList(mine) && isIdList(theirs) && (base === undefined || isIdList(base))) return mergeList(base || [], mine, theirs);
  if (isObj(mine) && isObj(theirs) && (base === undefined || isObj(base))) {
    const out = {};
    const keys = new Set([...Object.keys(mine), ...Object.keys(theirs)]);
    for (const k of keys) {
      const v = merge3(base ? base[k] : undefined, mine[k], theirs[k]);
      if (v !== undefined) out[k] = v;
    }
    return out;
  }
  // Même valeur modifiée des deux côtés : le dernier enregistrement l'emporte… sauf si l'on ignore d'où partait
  // ce navigateur (version trop ancienne) : on garde alors ce qui est en base, pour ne rien écraser à l'aveugle.
  return base === undefined ? theirs : mine;
}

function mergeList(base, mine, theirs) {
  const B = new Map(base.map((x) => [x.id, x]));
  const T = new Map(theirs.map((x) => [x.id, x]));
  const seen = new Set();
  const out = [];
  for (const m of mine) {
    if (seen.has(m.id)) continue;
    seen.add(m.id);
    if (T.has(m.id)) out.push(merge3(B.get(m.id), m, T.get(m.id)));
    else if (!B.has(m.id) || !deepEqual(m, B.get(m.id))) out.push(m); // ajouté ici, ou modifié ici mais supprimé là-bas
  }
  // Éléments que seule l'autre partie a : ajoutés là-bas, ou supprimés ici sans y avoir été modifiés là-bas.
  theirs.forEach((t, i) => {
    if (seen.has(t.id)) return;
    seen.add(t.id);
    if (B.has(t.id) && deepEqual(t, B.get(t.id))) return; // supprimé ici, inchangé là-bas : suppression gardée
    out.splice(Math.min(i, out.length), 0, t);
  });
  return out;
}
