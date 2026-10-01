# Blackstart AI

Dépôt de l'agence Blackstart AI (CRM sur mesure, SaaS, logiciels métier, sites web, agents IA pour les entreprises). Langue de travail : **français**.

## Contenu
- `src/`, `premium/`, `build*.mjs` : le CRM Blackstart (Preact + JSX, esbuild, application mono-fichier HTML). Voir `README.md`.
  - Build : `npm install && npm run build` → `Blackstart_CRM_App_v4.html`
  - Compatibilité des données : ne pas changer les clés de stockage ni les identifiants de statuts de `src/lib/constants.js` sans migration.
- `agence/` : organisation de l'agence, modèles de documents, dossiers clients. Voir `agence/README.md`.
- `.claude/agents/` : les 16 agents spécialisés (5 équipes).
- `.claude/skills/` : workflows `/vendre`, `/nouveau-projet`, `/controle-qualite`.
- `agence/projet-claude/` : kit du Projet claude.ai ; après modification d'un agent, lancer `npm run projet`.

## Les équipes travaillent à chaque demande
Le fondateur a demandé que **ses équipes traitent chacune de ses demandes**. Pour toute demande de travail (pas pour une simple question de fait ou une conversation) :
1. Annoncer en une ligne quelle(s) équipe(s) prennent la demande.
2. Confier le travail à l'agent compétent avec l'outil Agent, en lui donnant tout le contexte utile (il repart de zéro) :

| Demande | Agent |
|---|---|
| Trouver des clients, script d'appel, emails/LinkedIn de prospection | `chasseur-prospects` |
| Préparer un RDV, audit d'une entreprise, calcul de ROI | `consultant-audit` |
| Proposition commerciale, devis, prix, relances | `redacteur-propositions` |
| Posts, SEO, études de cas, positionnement, page de vente (contenu) | `marketing-contenu` |
| Specs, user stories, définir une V1 | `product-manager` |
| Maquettes, design, amélioration d'une interface | `designer-ui-ux` |
| Choix techniques, architecture, coûts d'hébergement | `architecte-solutions` |
| Coder une interface ou un site | `dev-frontend` |
| API, base de données, authentification, paiements | `dev-backend` |
| Agent IA, chatbot, Claude API, RAG | `ingenieur-ia` |
| CRM sur mesure, import de données, automatisations (n8n, Make, Zapier) | `integrateur-crm-automatisation` |
| Tester avant livraison | `qa-testeur` |
| Sécurité, RGPD | `auditeur-securite` |
| Mise en ligne, domaine, CI/CD, sauvegardes | `devops-deploiement` |
| Onboarding, formation, guide utilisateur, suivi client | `success-client` |
| Demande qui touche plusieurs équipes, nouveau projet, demande floue | `directeur-projet` (ou `/nouveau-projet`) |

3. Lancer en parallèle les agents dont les travaux sont indépendants ; enchaîner ceux qui dépendent les uns des autres.
4. Restituer au fondateur le résultat en français clair : ce qui a été produit (chemins des fichiers), ce qui a été vérifié, les décisions à prendre.

## Façon de travailler
- Pour un nouveau projet ou une demande floue, commencer par l'agent `directeur-projet` (ou `/nouveau-projet`).
- Ceux qui construisent ne valident pas leur propre travail : `qa-testeur` et `auditeur-securite` vérifient avant toute livraison.
- « Terminé » = lancé et vérifié, pas seulement écrit. Dire précisément ce qui a été vérifié et ce qui ne l'a pas été.
- Jamais de secrets, mots de passe ou données personnelles de clients dans le dépôt.
