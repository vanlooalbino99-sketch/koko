# Vos équipes dans un Projet de l'app Claude

Ce dossier contient tout ce qu'il faut pour retrouver vos 16 agents dans un **Projet** de l'app Claude (claude.ai, sur ordinateur ou téléphone), en plus de Claude Code.

| Fichier | À quoi il sert |
|---|---|
| `INSTRUCTIONS.md` | Les instructions du Projet : à chaque demande, l'équipe compétente prend le travail |
| `equipes.md` | Les fiches complètes des 16 agents et les modèles de documents : connaissance du Projet |
| `generer.mjs` | Régénère `equipes.md` quand vous modifiez un agent (`npm run projet`) |

## Créer le Projet (5 minutes, une seule fois)

1. Sur claude.ai, ouvrez **Projets** et créez un nouveau projet nommé **Blackstart AI — Agence**.
2. Dans les **instructions du projet**, collez tout le contenu de `INSTRUCTIONS.md`.
3. Dans les **connaissances du projet**, ajoutez le fichier `equipes.md` (et, si vous voulez, `agence/README.md`).
4. Ouvrez une conversation dans ce projet et faites une demande, par exemple :
   > « Prépare mon RDV de jeudi avec un cabinet d'expertise comptable de 15 personnes à Lyon. »

   La réponse commence par « 🧭 Équipe mobilisée : consultant-audit », puis l'équipe travaille selon sa fiche.

## Projet de l'app Claude ou Claude Code : la différence

| | Projet claude.ai | Claude Code (ce dépôt) |
|---|---|---|
| Comment les équipes travaillent | Claude endosse le rôle de l'équipe compétente dans la conversation | Chaque équipe est un vrai sous-agent qui travaille séparément, en parallèle si besoin |
| Idéal pour | Prospection, audits, propositions, contenus, specs, conseils, depuis votre téléphone | Construire et tester des CRM, SaaS, sites, agents IA, avec fichiers et code |
| Mise en route | Automatique dans chaque conversation du projet | Automatique dans chaque session ouverte sur ce dépôt (règle inscrite dans `CLAUDE.md`) |

## Après une modification d'agent

Si vous modifiez un fichier de `.claude/agents/`, lancez `npm run projet`, puis remplacez `equipes.md` dans les connaissances du Projet.
