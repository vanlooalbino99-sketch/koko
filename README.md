# Blackstart AI — CRM

## Version Premium de la v3 — `Blackstart_CRM_App_v3_Premium.html`

**Même interface que la v3** (mêmes écrans, mêmes boutons, mêmes emplacements, mêmes données), avec une finition haut de gamme :
icônes duotone nettes en haute définition, tuiles d'icônes en relief 3D, cartes avec profondeur, inclinaison 3D au survol et liseré lumineux animé,
micro-animations d'icônes (téléphone qui sonne, avion qui s'envole…), effet d'onde au toucher, entrées en cascade, fenêtres « ressort », écran de démarrage 3D.
Les réglages d'animation existants (Apparence › Mouvement) et « réduire les animations » du système sont respectés.

Sources : `premium/premium.css` et `premium/premium.js`, injectés dans `archive/Blackstart_CRM_App_v3.html` par `npm run build:premium`.

# Blackstart AI — CRM v4

Application de prospection **en un seul fichier HTML** : `Blackstart_CRM_App_v4.html`.
Ouvrez-le dans un navigateur (ordinateur ou mobile) — aucune installation, aucun serveur.
Les données restent dans le navigateur (même stockage que la v3 : vos prospects, devis et réglages sont repris automatiquement).

## Fonctionnalités

- **Aujourd'hui** : file d'appels (retards en premier), **session d'appels enchaînés**, tâches du jour, objectifs de la semaine.
- **Écran d'appel** : chrono, composition du numéro, script d'appel, notes, compte-rendu avec relance en un clic.
- **Agenda** jour / semaine / mois (relances + tâches), planification de créneaux.
- **Prospects** : tableau triable, filtres (statut, secteur, priorité), actions groupées, export CSV, détection de doublons.
- **Pipeline** kanban avec glisser-déposer.
- **Fiche prospect** : historique complet, tâches, documents, appel / email / SMS / WhatsApp.
- **Devis & factures** : numérotation automatique, remise, TVA multi-taux, document A4 imprimable / PDF, conversion devis → facture, suivi des paiements.
- **Clients**, **Paiements** (liens Stripe / PayPal / Payoneer, IBAN), **Tableau de bord**, **Rapports** (graphiques 6 mois, meilleurs créneaux, conversion par canal).
- **Outils** : enregistreur d'appels et documents conservés sur l'appareil, script d'appel et modèles d'email éditables, intégrations.
- **Réglages** : entreprise, objectifs, thèmes clair/sombre/auto, accent, police, densité, sauvegarde / restauration JSON.
- Recherche globale **Ctrl/⌘ + K**, raccourcis clavier (`N`, `T`, `G` puis une lettre, `?`), annulation des suppressions.

## Développement

```bash
npm install
npm run build   # génère Blackstart_CRM_App_v4.html (JS + CSS intégrés)
```

Sources dans `src/` (Preact + JSX, CSS sans framework). La version précédente est conservée dans `archive/`.
