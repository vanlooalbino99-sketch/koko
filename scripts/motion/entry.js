// Motion (motion.dev) pour les animations de la Formation : ressorts physiques et cascades.
// Les scènes de la formation tournent sur une horloge qu'on peut avancer, reculer ou mettre en pause ; on prend donc
// à Motion sa physique (ressort → easing natif linear(…) + durée) et ses cascades, appliquées par l'API Web Animations.
// Assemblé par `npm run build:motion` → app/modules/bs-motion.js (fichier généré, à committer).
import { spring, stagger } from 'motion';

const cache = {};
// o : { duree (s, durée perçue), rebond (0 à 1) } ou { raideur, amorti, masse }.
function ressort(o) {
  o = o || {};
  const cle = JSON.stringify(o);
  if (cache[cle]) return cache[cle];
  const opts = { keyframes: [0, 1] };
  if (o.raideur != null || o.amorti != null) {
    if (o.raideur != null) opts.stiffness = o.raideur;
    if (o.amorti != null) opts.damping = o.amorti;
    if (o.masse != null) opts.mass = o.masse;
  } else {
    opts.visualDuration = o.duree == null ? 0.6 : o.duree;
    opts.bounce = o.rebond == null ? 0.3 : o.rebond;
  }
  const m = /^(\d+(?:\.\d+)?)ms (linear\(.*\))$/.exec(String(spring(opts)));
  return (cache[cle] = m ? { d: Math.round(+m[1]), easing: m[2] } : { d: 650, easing: 'cubic-bezier(.34,1.56,.64,1)' });
}
// Délais en cascade (ms) : stagger de Motion, depuis le début, la fin ou le centre.
function cascade(n, pas, depuis) {
  const f = stagger(pas / 1000, { from: depuis || 'first' });
  return Array.from({ length: n }, (_, i) => Math.round(f(i, n) * 1000));
}
window.bsMotion = { ressort, cascade };
