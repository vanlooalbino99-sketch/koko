---
name: nouveau-projet
description: Lance un nouveau projet client de l'agence Blackstart AI (CRM, SaaS, logiciel, site web, agent IA) de bout en bout — cadrage, spécification, architecture, design, développement, recette, sécurité, mise en ligne et passation. À utiliser quand le fondateur dit « nouveau client », « nouveau projet », « on démarre X » ou décrit un projet à réaliser.
argument-hint: <nom-du-client> <description du besoin>
---

# Nouveau projet client

Arguments : `$ARGUMENTS` (nom du client puis description du besoin).

Le dossier du client est `agence/clients/<nom-client>/` (nom en minuscules, tirets à la place des espaces). Crée-le s'il n'existe pas, en copiant `agence/modeles/brief-client.md` comme `brief.md` et en le remplissant avec ce que tu sais.

Enchaîne les équipes avec l'outil Agent, chacune lisant les documents produits par les précédentes. Exécute en parallèle les étapes indépendantes. Après chaque étape, vérifie que le livrable existe et répond à sa définition de « terminé » avant de passer à la suivante.

## Phase 1 — Cadrage (bloquante)
1. `directeur-projet` : reformulation, périmètre V1 / V2 / exclu, lots, risques → `plan.md` (à partir de `agence/modeles/plan-projet.md`).
2. **Arrête-toi et présente au fondateur** : le résumé, le périmètre, les décisions attendues et les questions pour le client. Ne lance pas la suite sans sa validation, sauf s'il a explicitement dit d'enchaîner.

## Phase 2 — Conception
3. `product-manager` → `specs.md`
4. `architecte-solutions` → `architecture.md` (peut démarrer en parallèle de 3 dès que le périmètre est validé)
5. `designer-ui-ux` → maquettes + note de design (après 3)

## Phase 3 — Réalisation
6. Selon les lots du plan, en parallèle quand c'est possible : `dev-frontend`, `dev-backend`, `ingenieur-ia`, `integrateur-crm-automatisation`. Chaque agent reçoit son lot précis, les chemins des specs, de l'architecture et des maquettes.

## Phase 4 — Validation (bloquante)
7. En parallèle : `qa-testeur` (critères d'acceptation, cas limites, mobile) et `auditeur-securite`.
8. Tout bug bloquant/majeur ou faille critique/élevée repart vers le développeur concerné, puis re-vérification par le même vérificateur. Boucle jusqu'au verdict « prêt à livrer ».

## Phase 5 — Livraison
9. `devops-deploiement` → mise en ligne + `exploitation.md`
10. `success-client` → guide utilisateur, plan de formation, email de livraison.
11. Passe la checklist `agence/modeles/checklist-livraison.md` et coche chaque point avec sa preuve.

## Compte rendu final au fondateur
Ce qui est livré (avec liens), ce qui a été vérifié et comment, ce qui reste ouvert, coût mensuel d'exploitation, et la proposition de suite (maintenance, V2).
