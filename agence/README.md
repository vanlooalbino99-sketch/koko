# Blackstart AI — Organisation de l'agence

Agence IA : **CRM sur mesure, SaaS, logiciels métier, sites web et agents IA** pour les entreprises.

L'agence fonctionne avec 16 agents spécialisés (sous-agents Claude Code définis dans `.claude/agents/`), répartis en 5 équipes. Chaque agent a un rôle précis, une méthode, des standards et une définition de « terminé » vérifiable.

## Les équipes

| Équipe | Agents | Rôle | Indicateur de résultat |
|---|---|---|---|
| **Direction** | `directeur-projet`, `architecte-solutions` | Cadrer, découper, arbitrer, concevoir l'architecture | Projets livrés à temps, dans le budget |
| **Croissance** | `chasseur-prospects`, `consultant-audit`, `redacteur-propositions`, `marketing-contenu` | Trouver les clients, diagnostiquer, vendre, se faire connaître | RDV/semaine, taux de signature, CA signé |
| **Produit & Design** | `product-manager`, `designer-ui-ux` | Spécifier ce qu'il faut construire et le rendre simple à utiliser | Specs sans ambiguïté, adoption par les utilisateurs |
| **Ingénierie** | `dev-frontend`, `dev-backend`, `ingenieur-ia`, `integrateur-crm-automatisation` | Construire | Fonctionnalités livrées et vérifiées |
| **Qualité & Ops** | `qa-testeur`, `auditeur-securite`, `devops-deploiement` | Vérifier, sécuriser, mettre en ligne | Zéro bug bloquant chez le client, zéro fuite |
| **Client** | `success-client` | Onboarding, formation, suivi, renouvellement | Rétention, maintenance récurrente, témoignages |

## Le cycle complet d'un client

```
Prospection ─► RDV ─► Audit ─► Proposition ─► Signature
 chasseur      consultant      rédacteur
                                    │
                                    ▼
 Cadrage ─► Specs ─► Architecture ─► Design ─► Développement ─► QA + Sécurité ─► Mise en ligne ─► Suivi
 directeur  product  architecte     designer   dev-* / ia /      qa / auditeur   devops           success-client
                                                integrateur                                         │
                                                                                                    ▼
                                                                      Étude de cas (marketing) ─► nouveaux prospects
```

Les étapes commerciales correspondent aux statuts du pipeline du CRM Blackstart : *À appeler → RDV pris → Audit réalisé → Proposition envoyée → Client actif*.

## Comment s'en servir (dans Claude Code)

**Workflows prêts à l'emploi :**

- `/vendre <cible ou prospect> [cibler|rdv|audit|proposition]` — tout le pipeline commercial
- `/nouveau-projet <client> <besoin>` — un projet client de bout en bout, avec validation du fondateur après le cadrage
- `/controle-qualite [cible]` — recette + sécurité + déploiement, verdict « prêt à livrer »

**Appeler une équipe directement**, en langage naturel :

> « Utilise l'agent consultant-audit pour préparer mon RDV de demain avec la boulangerie Dupont »
>
> « Demande à ingenieur-ia de concevoir un agent qui répond aux demandes de devis reçues par email »

**Commencer par le directeur de projet** en cas de doute : il décide quelles équipes mobiliser.

## Organisation des fichiers

```
agence/
├── README.md               ← ce document
├── modeles/                ← modèles à copier pour chaque client
│   ├── brief-client.md
│   ├── plan-projet.md
│   └── checklist-livraison.md
└── clients/
    └── <nom-client>/       ← un dossier par client
        ├── brief.md
        ├── audit.md
        ├── proposition.md
        ├── plan.md
        ├── specs.md
        ├── architecture.md
        ├── exploitation.md
        └── ...
```

> Ne versionnez jamais de mots de passe, clés d'API ou données personnelles de clients dans ce dépôt. Les fichiers clients doivent contenir des informations de projet, pas des fichiers de données brutes (exports CSV de contacts, etc.).

## Ce qui rend ces agents plus efficaces qu'un assistant généraliste

Un agent ne peut pas être « plus intelligent » que le modèle qui le fait tourner. Ce qui fait la différence, c'est l'organisation :

1. **Spécialisation** : chaque agent ne reçoit que son rôle et ses standards — pas de dispersion.
2. **Contexte propre** : chaque agent travaille dans une fenêtre de contexte neuve, concentrée sur sa tâche.
3. **Définition de « terminé » vérifiable** : les développeurs doivent lancer et tester ; le QA ne croit que ce qu'il voit fonctionner.
4. **Contre-pouvoirs** : ceux qui construisent ne sont pas ceux qui valident (QA et sécurité sont indépendants).
5. **Livrables écrits** : chaque étape produit un document que l'étape suivante lit, ce qui évite les pertes d'information.

Les agents sont configurés avec `model: inherit` : ils utilisent le modèle choisi pour la session. Choisissez le modèle le plus performant disponible (commande `/model`) pour que toute l'équipe en profite. Pour réduire les coûts, vous pouvez fixer un modèle plus léger sur certains agents (ex. `chasseur-prospects`) en modifiant le champ `model:` de leur fichier.
