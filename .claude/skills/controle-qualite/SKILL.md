---
name: controle-qualite
description: Contrôle qualité avant livraison ou démo client — recette fonctionnelle, revue de sécurité et vérification du déploiement en parallèle, puis verdict « prêt à livrer » ou liste précise des corrections. À utiliser avant toute livraison, démo, mise en production, ou quand le fondateur demande « est-ce que c'est prêt ? ».
argument-hint: [chemin, fonctionnalité ou nom du client]
---

# Contrôle qualité

Cible : `$ARGUMENTS` (si vide : les changements en cours sur la branche, via `git diff` et `git log`).

Lance en parallèle avec l'outil Agent :
1. `qa-testeur` — critères d'acceptation (depuis `agence/clients/<client>/specs.md` s'il existe), cas limites, mobile, console sans erreur, en lançant réellement l'application.
2. `auditeur-securite` — failles exploitables et conformité RGPD sur le périmètre concerné.
3. `devops-deploiement` — seulement si une mise en ligne est prévue : build reproductible, variables d'environnement, sauvegardes, retour arrière.

Puis consolide un rapport unique :
- **Verdict** : PRÊT À LIVRER / NON PRÊT
- **Bloquants** (bugs bloquants/majeurs, failles critiques/élevées) avec responsable proposé pour la correction
- **À corriger ensuite** (mineurs)
- **Ce qui a été vérifié** et comment, et ce qui n'a pas pu l'être

Si le fondateur le demande, fais corriger les bloquants par le développeur concerné (`dev-frontend`, `dev-backend`, `ingenieur-ia`, `integrateur-crm-automatisation`) puis relance la vérification correspondante.
