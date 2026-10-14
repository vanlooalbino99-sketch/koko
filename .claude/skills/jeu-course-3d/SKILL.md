---
name: jeu-course-3d
description: Construire ou améliorer un jeu de course automobile 3D jouable dans le navigateur (un seul fichier HTML, Three.js), au rendu « AAA » de type Need for Speed (désert à l'heure dorée, voitures vernies, poussière, flou de vitesse). À utiliser quand on demande un jeu de voiture, de course, de drift ou de rallye en 3D, ou d'améliorer Nitro Canyon (jeux/nitro-canyon.html).
---

# Jeu de course 3D navigateur (méthode Nitro Canyon)

Objectif : un jeu de course complet, fluide, dans **un seul fichier HTML** ouvrable d'un double-clic,
avec un rendu qui vise les jeux de course commerciaux. Référence existante : `jeux/nitro-canyon.html`.

Sois honnête sur la limite : un jeu web procédural (sans modèles 3D ni textures photo) ne dépasse pas
un jeu AAA sur toute la ligne. On gagne sur la direction artistique, la lumière, les effets et la fluidité ;
dis-le à l'utilisateur au lieu de promettre « plus beau que NFS ».

## Architecture en morceaux (pour travailler à plusieurs agents)

Le fichier final est la concaténation, dans un seul `<script type="module">`, de morceaux qui partagent la portée du module :

| Morceau | Rôle | Noms publics |
|---|---|---|
| `a.html` | HTML, CSS, HUD, panneaux, import map | ids du DOM |
| `b_core.js` | imports Three.js, outils (bruit, textures canvas), qualité `Q`, `PAL`, `SUN_DIR`, `initEngine`, ciel `Sky` + reflets PMREM, soleil à ombres qui suit la voiture | `initEngine`, `updateSun`, `stdMat`, `ctex`… |
| `c_world.js` | circuit (spline fermée, sections), terrain, décor instancié | `buildWorld()` → `{ track, ground, update }` |
| `c_cars.js` | modèles de voitures, physique, IA | `CAR_TYPES`, `buildCarModel`, `createVehicle`, `createAI` |
| `c_fxhud.js` | particules, traces de pneus, son synthétisé, HUD | `createFX`, `createAudio`, `createHUD` |
| `c_garage.js` | garage néon de nuit (hangar, néons, sol miroir `Reflector`, verrière) qui remplace le ciel, le soleil et les reflets puis les restitue | `buildGarage()` → `{ enter, exit, update, carPos, shots }` |
| `d_game.js` | post-traitement, garage, course, caméra, commandes, sauvegarde | tout est dans un bloc `{ … }` |

Règles du contrat (à recopier dans le prompt de chaque agent) :
- mètres, Y vers le haut ; cap `h` : avant = `(sin h, cos h)`, `rotation.y = h` ; droite = `(-tz, tx)` ; `lat > 0` à droite ; tourner à droite = `h` diminue ;
- un morceau ne redéclare aucun nom d'un autre ; aides internes dans des fonctions ;
- pas de lumière ajoutée hors du socle (éclairage cohérent) ; émissifs autorisés.

Avec 4 cœurs, l'outil Workflow n'exécute que 2 agents à la fois : lance 3 agents (monde, voitures, effets/son/HUD)
et écris toi-même le socle puis `d_game.js` pendant qu'ils travaillent.

## Barre de qualité graphique (à vérifier sur captures)

- Ciel physique (`three/addons/objects/Sky.js`), soleil bas, reflets d'environnement générés depuis ce ciel (`PMREMGenerator.fromScene`).
- ACES, exposition ~0,6 avec le ciel physique ; brouillard exponentiel couleur d'horizon ; halo de soleil en sprite additif.
- Ombres PCF douces, carte 4096 en haute qualité, caméra d'ombre de ±70 m qui suit la voiture, alignée sur les texels.
- Post-traitement : rendu HDR (HalfFloat, MSAA 4 en haute) → flou radial de vitesse + aberration chromatique légère + étalonnage chaud + vignettage → halo (UnrealBloomPass) → `OutputPass`.
- Voitures : carrosserie lissée par sections (loft) avec passages de roues découpés, `MeshPhysicalMaterial` vernis + paillettes, livrée peinte sur canvas, jantes à branches, étriers, feux émissifs.
- Décor : asphalte usé avec marquages, piste de terre à ornières, sable à micro-relief, roches rouges stratifiées, pylônes à haute tension avec câbles en chaînette, poteaux en bois, végétation instanciée, montagnes dans la brume.
- Effets : gros nuages de poussière teintés par le soleil sur la terre, fumée de pneus, traces au sol, étincelles, flammes de nitro.
- Budgets : < 450 appels de dessin et < 2 M triangles en haute ; trois niveaux de qualité avec baisse automatique si < 28 i/s.

## Copier un rendu de référence (capture d'un jeu AAA)

Étudie la capture avec l'outil Read, liste ce qui fait le rendu (lumière, couleurs dominantes, matériaux, effets), puis donne la capture en référence aux agents.
Garde les noms et logos de marques réelles hors du jeu. Après assemblage, baisse l'exposition et le halo : les aperçus des agents n'ont pas de post-traitement, et le même éclairage paraît surexposé dans le jeu.

## Gameplay attendu

Physique arcade lourde (6 rapports, adhérence par surface, dérapage au frein à main qui remplit la nitro, rebonds sur les murs),
5 adversaires IA (vitesse cible selon la courbure à venir, évitement, petit élastique), compte à rebours, tours, classement,
mini-carte, compteur, radio scénarisée, garage avec 3 voitures et peintures, résultats, records sauvegardés,
clavier + manette (API Gamepad) + boutons tactiles.

## Tester sans carte graphique

Chromium sans écran rend avec SwiftShader (lent : une image peut prendre plusieurs secondes).
`scripts/shot.cjs` assemble des morceaux et capture une image :

```bash
node .claude/skills/jeu-course-3d/scripts/shot.cjs sortie.png b_core.js c_cars.js z_apercu.js --w 960 --h 540
```

Le dernier morceau construit la scène, fait 2 rendus puis pose `window.__previewReady = true`.
Le script redirige le CDN de Three.js vers un `node_modules/three@0.160.0` local (variable `THREE_DIR` en tête du script, à adapter).
Regarde chaque capture et corrige ; vérifie qu'aucune ligne `erreur:` ou `pageerror` n'apparaît.
Pour le jeu complet, pilote-le par `window.__nc` (startRace, CARS, setQuality) et simule la physique sans rendu.

## Pièges déjà rencontrés

- Un test d'atterrissage doit ignorer la poussée latérale des plateformes qu'on survolait à l'image précédente (sinon on glisse hors des petites plateformes).
- Une fonction « hauteur du sol » utilisée pour placer des objets ne doit pas tenir compte des troncs, poteaux ou maisons.
- `renderer.info` ne compte que le dernier rendu : mesure les appels de dessin avec `info.autoReset = false`.
- Sur mobile : qualité moyenne par défaut, `touch-action: none` sur le canvas, boutons tactiles gros et espacés.

## Livraison

1. Les sources de Nitro Canyon sont dans `sources/` de ce skill. Assembler : `cd .claude/skills/jeu-course-3d/sources && cat a.html b_core.js c_world.js c_cars.js c_fxhud.js c_garage.js d_game.js > ../../../../jeux/nitro-canyon.html`, puis vérifier la syntaxe du module (`node --check` sur le contenu du script).
2. Publier en Artifact la partie comprise entre `<!--ARTIFACT-START-->` et `<!--ARTIFACT-END-->`, sans les lignes `</head>` et `<body>` (marqueurs `HEAD-END` / `BODY-START`).
3. Committer sur la branche de travail et donner le lien de l'Artifact.
