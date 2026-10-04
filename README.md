# Blackstart AI — CRM

CRM de prospection : file d'appels, agenda, prospects, pipeline, devis et factures, paiements, tableau de bord,
rapports avec courbes de tendance, formations, ambiances animées, icônes du menu personnalisables.

Le projet fournit **deux façons de l'utiliser, à partir des mêmes sources** :

| | Version autonome | Version équipe (serveur) |
|---|---|---|
| Ce que c'est | Un seul fichier HTML | Un serveur Node.js qui sert le CRM |
| Données | Dans le navigateur, sur l'appareil | Sur le serveur (SQLite), partagées |
| Comptes | — | Administrateurs et membres |
| Travail à plusieurs | — | Synchronisation en direct, fusion des modifications simultanées |
| Sauvegardes | Export JSON manuel | 100 dernières versions, restauration en un clic |
| Ambiances, icônes | Pour ce navigateur | Partagées par l'équipe |

---

## Version autonome

`npm run build` produit `dist/Blackstart_CRM_App.html`, à ouvrir dans n'importe quel navigateur.
Les versions livrées sont aussi rangées dans [`versions/`](versions/), et chaque étiquette `v*` publie le fichier
dans les **Releases** GitHub.

## Version équipe

### Démarrage rapide

```bash
npm install
npm start            # http://localhost:3000
```

Au premier lancement, la page de connexion propose de **créer le compte administrateur**.
Il invite ensuite l'équipe dans **Réglages › Équipe & compte**.

### Sur Windows (CMD)

Prérequis : [Node.js LTS](https://nodejs.org/fr/download) (22.5 ou plus récent).

```bat
cd chemin\vers\koko
demarrer
```

`demarrer.cmd` (double-clic possible) vérifie Node.js, installe les dépendances la première fois, lance le serveur
et ouvre http://localhost:3000. Les données sont rangées dans le dossier `data\` du projet.
Équivalent manuel : `npm install` puis `npm start`.

### Avec Docker

```bash
docker compose up -d                  # construit l'image et garde les données dans un volume
# ou, avec l'image publiée par GitHub Actions :
docker run -d -p 3000:3000 -v blackstart-data:/data ghcr.io/vanlooalbino99-sketch/koko:latest
```

### Configuration

Variables d'environnement (voir [`.env.example`](.env.example)) :

| Variable | Rôle | Par défaut |
|---|---|---|
| `PORT` | Port HTTP | `3000` |
| `DATA_DIR` | Base SQLite et images d'ambiance | `./data` (`/data` dans Docker) |
| `TRUST_PROXY` | Nombre de proxys HTTPS devant le serveur (Nginx, Caddy, hébergeur) | désactivé |
| `COOKIE_SECURE` | `1` : cookies de session réservés au HTTPS | `0` |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Crée le premier administrateur au démarrage (déploiement sans écran) | — |

### Déploiement

N'importe quel hébergement qui fait tourner une image Docker **avec un disque persistant** monté sur `/data` :
un VPS (Docker Compose + Caddy ou Nginx pour le HTTPS), Railway, Fly.io, Render (avec disque)…
Derrière un proxy HTTPS, mettre `TRUST_PROXY=1` et `COOKIE_SECURE=1`.

### Sauvegardes

- Dans l'application : **Réglages › Équipe & compte › Sauvegardes** (administrateurs) liste les 100 dernières
  versions des données et les restaure.
- Sur le serveur : tout est dans `DATA_DIR` (`blackstart.db` et le dossier `ambiance/`). Pour une copie à chaud :
  `sqlite3 data/blackstart.db ".backup sauvegarde.db"`, ou arrêter le conteneur et copier le volume.

---

## Comment ça marche

```
app/                      Le CRM (navigateur), découpé en fichiers
  index.html              Coquille : chaque <script src> / <link> marqué data-inline est intégré au build
  core/app.min.js         Interface principale (Preact, déjà compilée)
  core/pre-theme.js       Thème appliqué avant l'affichage (pas de flash)
  core/pilote-4d.js       Relief et reflets au survol
  modules/bs-logo.js      Logo Blackstart AI (SVG)
  modules/bs-serveur.js   Version équipe : synchronisation + Réglages › Équipe & compte
  modules/bs-ambiance.js  Images d'ambiance animées, mode immersion
  modules/bs-galerie.js   Galerie d'ambiances dessinées dans le navigateur
  modules/bs-anim.js      Apparition animée des graphiques, mode présentation
  modules/bs-tendance.js  Courbes de tendance des graphiques en barres
  modules/bs-icones*.js   Icônes du menu (≈ 1 000 icônes, styles, couleurs)
  modules/bs-reglement.js Règlement des devis et factures, QR codes
  styles/*.css
scripts/build.mjs         Assemble app/ en un seul fichier HTML
server/src/               Serveur Express
  app.js                  Routes, page de connexion, CRM servi avec sa configuration
  auth.js                 Mots de passe (scrypt), sessions, CSRF, limitation des essais
  db.js                   SQLite (node:sqlite) et migrations
  merge.js                Fusion à trois voies des données
  routes/                 auth, users, data, ambiance
server/test/              Tests de l'API et de la fusion (node --test)
e2e/                      Test de bout en bout dans Chromium (deux sessions en parallèle)
legacy/                   Sources des versions 3 et 4 (historique)
versions/                 Fichiers HTML livrés
```

**Synchronisation.** Le serveur injecte `window.BS_SERVER` dans la page ; `bs-serveur.js` fournit alors
`window.storage`, que l'interface utilise à la place du stockage du navigateur. Chaque enregistrement part en
arrière-plan avec la version sur laquelle il s'appuie. Si quelqu'un a enregistré entre-temps, le serveur fusionne
(`server/src/merge.js`) : prospects, devis, factures, tâches et historiques sont fusionnés élément par élément puis
champ par champ ; rien n'est perdu quand une même fiche est supprimée d'un côté et modifiée de l'autre. Les
modifications des collègues arrivent toutes seules (vérification toutes les 20 s et au retour sur l'onglet).
Hors connexion, les modifications attendent dans le navigateur et partent au retour du réseau.

**Sécurité.** Mots de passe hachés avec scrypt ; session dans un cookie `HttpOnly` / `SameSite=Lax` (seule son
empreinte est en base) ; toute écriture sur l'API exige l'en-tête `X-Requested-With: blackstart` (protection CSRF) ;
10 essais de connexion par quart d'heure ; seuls les administrateurs gèrent l'équipe, les ambiances, les icônes et
les restaurations.

## Développement

```bash
npm run dev        # serveur qui ré-assemble app/ à chaque chargement de page
npm run build      # dist/Blackstart_CRM_App.html
npm test           # API et fusion
npm run test:e2e   # navigateur (installer d'abord : npx playwright install chromium)
```

`app/core/app.min.js` est du code compilé (ses sources ne sont pas dans ce dépôt) : les nouveautés s'ajoutent de
préférence dans `app/modules/`, branchées sur les points d'accroche prévus (`window.bsAmbiance`, `window.bsIcones`,
`window.bsTendance`, `window.bsEquipe`…).

## GitHub

- **CI** (`.github/workflows/ci.yml`) : à chaque push, build, tests de l'API et test de bout en bout ;
  le fichier HTML autonome est joint au résultat.
- **Publication** (`.github/workflows/release.yml`) : image Docker sur `ghcr.io/vanlooalbino99-sketch/koko` à chaque
  push sur la branche par défaut ; pour une étiquette `v5.6.5` par exemple, une Release avec le fichier HTML.
- Les workflows s'activent une fois arrivés sur la branche par défaut du dépôt.

## Versions

- **5.6.6** — Logo Blackstart AI (symbole vectoriel) dans le menu, la barre mobile, l'écran de chargement,
  l'icône d'onglet et la page de connexion.
- **5.6.5** — Projet full-stack : serveur d'équipe (comptes, synchronisation, fusion, sauvegardes, ambiances
  partagées), Docker, CI GitHub. Couleurs des icônes du menu (personnalisée, par rubrique). Menu blanc en mode sombre.
- **5.6.4** — Courbes de tendance (graphiques plats), images d'ambiance animées.
- **5.6.3** — Graphiques plats (retrait des colonnes 3D).
- **4 / 3 Premium** — voir `legacy/` et `versions/`.
