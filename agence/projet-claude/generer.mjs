// Génère agence/projet-claude/equipes.md : les fiches des 16 agents et les modèles
// réunis en un seul fichier à déposer dans un Projet de l'app Claude.
// Usage : npm run projet
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const EQUIPES = [
  ['Direction', ['directeur-projet', 'architecte-solutions']],
  ['Croissance', ['chasseur-prospects', 'consultant-audit', 'redacteur-propositions', 'marketing-contenu']],
  ['Produit & Design', ['product-manager', 'designer-ui-ux']],
  ['Ingénierie', ['dev-frontend', 'dev-backend', 'ingenieur-ia', 'integrateur-crm-automatisation']],
  ['Qualité & Ops', ['qa-testeur', 'auditeur-securite', 'devops-deploiement']],
  ['Client', ['success-client']],
];

const agentsDir = join(root, '.claude', 'agents');
const disponibles = readdirSync(agentsDir).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3));
const listes = EQUIPES.flatMap(([, agents]) => agents);
const oublies = disponibles.filter((a) => !listes.includes(a));
const manquants = listes.filter((a) => !disponibles.includes(a));
if (oublies.length || manquants.length) {
  console.error(`Agents non rangés dans une équipe : ${oublies.join(', ') || '—'} ; agents introuvables : ${manquants.join(', ') || '—'}`);
  process.exit(1);
}

function fiche(nom) {
  const brut = readFileSync(join(agentsDir, `${nom}.md`), 'utf8');
  const [, entete, corps] = brut.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const description = entete.match(/^description: (.*)$/m)[1];
  // Les titres de la fiche descendent de deux niveaux pour rester sous le titre de l'agent.
  return `### \`${nom}\`\n\n> ${description}\n\n${corps.trim().replace(/^## /gm, '#### ')}\n`;
}

const modeles = ['brief-client', 'plan-projet', 'checklist-livraison'].map((m) => {
  const texte = readFileSync(join(root, 'agence', 'modeles', `${m}.md`), 'utf8').trim();
  // Le titre du modèle est remplacé par « Modèle : … » ; ses sections descendent de deux niveaux.
  return `### Modèle : ${m}\n\n${texte.replace(/^# .*\n+/, '').replace(/^## /gm, '#### ')}\n`;
});

const sortie = [
  '# Blackstart AI — Fiches des équipes',
  '',
  '> Fichier généré par `npm run projet` à partir de `.claude/agents/` et `agence/modeles/`. Ne pas modifier à la main.',
  '',
  ...EQUIPES.flatMap(([equipe, agents]) => [`## Équipe ${equipe}`, '', ...agents.map(fiche)]),
  '## Modèles de documents',
  '',
  ...modeles,
].join('\n');

writeFileSync(join(root, 'agence', 'projet-claude', 'equipes.md'), sortie);
console.log(`equipes.md généré : ${listes.length} agents, ${modeles.length} modèles.`);
