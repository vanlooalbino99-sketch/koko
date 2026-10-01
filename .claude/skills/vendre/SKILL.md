---
name: vendre
description: Workflow commercial de l'agence Blackstart AI — de la cible jusqu'à la proposition signée. À utiliser pour « trouver des clients », « préparer un RDV », « faire l'audit de X », « faire une proposition/un devis pour X », ou planifier la prospection de la semaine.
argument-hint: "<cible | nom-du-prospect> [étape : cibler | rdv | audit | proposition]"
---

# Vendre — pipeline commercial

Arguments : `$ARGUMENTS`

Le pipeline suit les statuts du CRM Blackstart (`src/lib/constants.js`) :
**À appeler → RDV pris → Audit réalisé → Proposition envoyée → Client actif**.

Détermine l'étape demandée (ou la prochaine étape logique pour ce prospect) et mobilise l'équipe correspondante avec l'outil Agent. Les documents d'un prospect vont dans `agence/clients/<nom-prospect>/`.

| Étape | Équipe | Livrable |
|---|---|---|
| Cibler | `chasseur-prospects` | ICP, liste CSV importable dans le CRM, script d'appel, séquence email/LinkedIn |
| Préparer le RDV | `consultant-audit` | recherche sur l'entreprise + 10 questions de découverte |
| Audit | `consultant-audit` | `audit.md` avec ROI chiffré et recommandation |
| Proposition | `redacteur-propositions` | `proposition.md` (3 options de prix), message d'envoi, 2 relances |
| Visibilité | `marketing-contenu` | posts, études de cas, pages de vente |

Règles :
- Ne passe pas à « proposition » sans audit ou brief suffisant : demande les informations manquantes au fondateur.
- Aucun fait inventé sur un prospect, aucun chiffre sans hypothèse visible.
- Termine par la prochaine action commerciale concrète, datée, à saisir dans le CRM (relance, RDV, tâche).
