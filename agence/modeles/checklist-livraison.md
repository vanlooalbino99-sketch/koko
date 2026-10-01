# Checklist de livraison

> À cocher avant d'annoncer une livraison au client. Chaque case cochée doit avoir une preuve (lien, capture, sortie de test).

## Fonctionnel
- [ ] Chaque critère d'acceptation des specs vérifié par `qa-testeur` (rapport joint)
- [ ] Zéro bug bloquant ou majeur ouvert
- [ ] Testé sur mobile (375 px), tablette et ordinateur
- [ ] États vides, erreurs et chargements gérés
- [ ] Données existantes du client importées et vérifiées par échantillon

## Sécurité et conformité
- [ ] Revue `auditeur-securite` : aucune faille critique ou élevée ouverte
- [ ] Aucun secret dans le code, l'historique git ou le front-end
- [ ] Droits d'accès vérifiés côté serveur ; isolation entre clients testée (si multi-tenant)
- [ ] RGPD : mentions d'information, export et suppression des données possibles, sous-traitants listés
- [ ] Agents IA : jeu d'évaluation passé, score et limites documentés, actions sensibles confirmées par un humain

## Mise en ligne
- [ ] Production et préproduction en ligne, HTTPS actif
- [ ] Sauvegardes automatiques actives et restauration testée
- [ ] Supervision et alertes actives
- [ ] Procédure de retour arrière écrite et testée
- [ ] Comptes (domaine, hébergement, outils) au nom du client ou transférables
- [ ] Coût mensuel d'exploitation communiqué au client

## Passation
- [ ] Guide utilisateur remis
- [ ] Formation réalisée
- [ ] `exploitation.md` à jour
- [ ] Contrat de maintenance proposé
- [ ] Suivi à 30 jours planifié dans le CRM
- [ ] Demande de témoignage planifiée (après résultat mesurable)
