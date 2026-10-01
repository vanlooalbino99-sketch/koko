# Blackstart AI

Dépôt de l'agence Blackstart AI (CRM sur mesure, SaaS, logiciels métier, sites web, agents IA pour les entreprises). Langue de travail : **français**.

## Contenu
- `src/`, `premium/`, `build*.mjs` : le CRM Blackstart (Preact + JSX, esbuild, application mono-fichier HTML). Voir `README.md`.
  - Build : `npm install && npm run build` → `Blackstart_CRM_App_v4.html`
  - Compatibilité des données : ne pas changer les clés de stockage ni les identifiants de statuts de `src/lib/constants.js` sans migration.
- `agence/` : organisation de l'agence, modèles de documents, dossiers clients. Voir `agence/README.md`.
- `.claude/agents/` : les 16 agents spécialisés (5 équipes).
- `.claude/skills/` : workflows `/vendre`, `/nouveau-projet`, `/controle-qualite`.

## Façon de travailler
- Pour un nouveau projet ou une demande floue, commencer par l'agent `directeur-projet` (ou `/nouveau-projet`).
- Ceux qui construisent ne valident pas leur propre travail : `qa-testeur` et `auditeur-securite` vérifient avant toute livraison.
- « Terminé » = lancé et vérifié, pas seulement écrit. Dire précisément ce qui a été vérifié et ce qui ne l'a pas été.
- Jamais de secrets, mots de passe ou données personnelles de clients dans le dépôt.
