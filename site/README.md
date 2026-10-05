# Site internet Blackstart AI

Site vitrine de l'agence : **Accueil**, **Services**, **À propos**, **Contact**, **Prise de rendez-vous**
(et mentions légales). Next.js 15 (App Router), TypeScript, Tailwind CSS 4, composants shadcn/ui.

Les demandes de contact et les rendez-vous **arrivent dans le CRM** comme leads à rappeler, et des e-mails
automatiques partent au visiteur et à l'équipe.

## Démarrer

```bash
cd site
cp .env.example .env.local   # puis renseigner les variables
npm install
npm run dev                  # http://localhost:3000 (lancer le CRM sur un autre port, ex. PORT=3001 npm start)
```

| Commande | Rôle |
|---|---|
| `npm run build` / `npm start` | Version de production |
| `npm run lint` · `npm run typecheck` | ESLint, TypeScript |
| `npm test` | Créneaux, fuseau horaire, validation des formulaires |

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Adresse publique (URL canoniques, sitemap, Open Graph) |
| `CRM_URL` | Adresse du serveur du CRM (version équipe) |
| `CRM_SITE_KEY` | Clé partagée, identique à `SITE_API_KEY` sur le serveur du CRM |
| `RESEND_API_KEY` | Clé [Resend](https://resend.com) pour les e-mails |
| `EMAIL_FROM` | Expéditeur, sur un domaine vérifié dans Resend (`Blackstart AI <bonjour@…>`) |
| `EMAIL_AGENCE` | Qui reçoit les alertes de nouvelle demande (séparer par des virgules) |

Sans `CRM_URL`/`CRM_SITE_KEY`, les demandes ne vont pas au CRM ; sans clé Resend, aucun e-mail ne part
(un avertissement est écrit dans les journaux). Si le CRM ne répond pas mais que les e-mails sont configurés,
la demande est quand même acceptée et l'alerte envoyée à l'équipe le signale (« à saisir à la main »).

## Ce qui se passe à l'envoi

**Contact** → dans le CRM : prospect « À appeler » (canal *Site internet*, priorité haute, relance aujourd'hui),
message dans les notes et l'historique, tâche « Rappeler … ». E-mails : accusé de réception au visiteur,
alerte à l'équipe (répondre = répondre au visiteur).

**Rendez-vous** → dans le CRM : prospect « RDV pris » à la date et l'heure choisies (visible dans l'Agenda),
tâche « Audit : appeler … ». E-mails : confirmation au visiteur avec invitation `.ics`, alerte à l'équipe.

Un prospect déjà connu (même e-mail ou même téléphone) est complété, pas dupliqué. Un renvoi de la même demande
(double clic, réseau) ne crée rien de plus. Les créneaux déjà pris (tous les « RDV pris » du CRM, y compris ceux
fixés par téléphone) ne sont plus proposés ; un RDV déplacé ou annulé dans le CRM libère son créneau.

## Personnaliser

- **Textes, services, coordonnées** : `lib/site.ts` (textes provisoires, tout est là).
- **Horaires, durée des RDV, jours fermés, délai de prévenance** : `lib/slots.ts` (`booking`).
- **Couleurs** : jetons en tête de `app/globals.css` (clair et sombre).
- **E-mails** : gabarits dans `lib/email.ts`.
- Mentions légales à compléter : `app/mentions-legales/page.tsx`.

## Organisation

```
app/                 Pages (App Router), sitemap, robots, image de partage, /api/creneaux
actions/             Server Actions : contact, réservation
components/ui/       Composants shadcn/ui (button, input, calendar…)
components/layout/   En-tête, pied de page, thème
components/sections/ Blocs de page
components/forms/    Formulaires (react-hook-form + zod)
lib/                 Contenu, créneaux, validation, CRM, e-mails, SEO
tests/               Tests (node --test)
```

## Déploiement

Vercel (dossier racine : `site`) ou n'importe quel hébergeur Node.js (`npm run build && npm start`, sortie
`standalone` disponible dans `.next/standalone`). Le serveur du CRM doit être joignable depuis le serveur du site
(pas besoin qu'il soit public si les deux sont sur la même machine ou le même réseau privé).

## Lighthouse

Mesuré sur la version de production (Lighthouse 12, mobile et ordinateur) : Accessibilité, Bonnes pratiques et
SEO à 100 sur toutes les pages ; Performance à 100 sur ordinateur et 96 à 98 sur mobile.
