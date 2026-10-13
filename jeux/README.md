# Koko et la Grande Lanterne

Jeu d'aventure en 3D dans un seul fichier : [`koko-la-grande-lanterne.html`](koko-la-grande-lanterne.html).
Il remplace l'ancien runner « Opus Rush » par un monde ouvert à explorer, avec de vrais personnages en 3D
(têtes rondes en feutrine, gros yeux brillants, antennes qui rebondissent) dans un village de nuit.

## Lancer le jeu

Double-clic sur le fichier HTML : il s'ouvre dans le navigateur (Chrome, Edge, Firefox ou Safari récents).
Une connexion internet est nécessaire au premier chargement (moteur 3D Three.js et polices).
La progression est sauvegardée dans le navigateur.

## L'histoire

La veille de la Fête des Lucioles, la Grande Lanterne de Koko-Ville s'est éteinte : ses cinq éclats d'étoile
se sont envolés. On choisit son héros (Barbo, Koko ou Lumi) puis on retrouve les éclats :

| Éclat | Où | Comment |
|---|---|---|
| Grand Arbre | Au nord | Grimper l'escalier de champignons jusqu'à la cime |
| Mira la boulangère | Boulangerie | Cueillir 3 baies lumineuses dans la forêt de l'Est |
| Tito | Près du puits | Retrouver Pompon dans les fleurs de la colline et le ramener |
| Lanternes | Chemin du Sud | Allumer les 4 lanternes pour ouvrir le coffre de la colline |
| Île de l'étang | À l'ouest | Sauter de nénuphar en nénuphar |

On rapporte ensuite les éclats à la Grande Lanterne pour lancer la fête (feux d'artifice, musique).
Bonus : 60 graines d'or cachées dans la vallée. Les Ombrelins se chassent en leur sautant dessus.

## Commandes

| Clavier / souris | Mobile | Action |
|---|---|---|
| ZQSD, WASD ou flèches (Maj pour courir) | Joystick à gauche | Marcher |
| Espace | Bouton Saut | Sauter |
| E | Bouton Action | Parler, ramasser, allumer |
| Glisser la souris, molette, C | Glisser à droite | Caméra, zoom, recentrer |
| Échap ou P | Bouton pause | Pause, qualité graphique, sons |

La qualité graphique (Basse, Moyenne, Haute) se règle dans la pause ; le jeu la baisse tout seul
si l'ordinateur ou le téléphone peine.

# Nitro Canyon

Jeu de course 3D dans un seul fichier : [`nitro-canyon.html`](nitro-canyon.html) (double-clic pour jouer, connexion internet au premier chargement).
Désert à l'heure dorée, 6 pilotes, 2 tours sur un circuit de 3,2 km : autoroute bordée de lignes à haute tension,
canyon de roche rouge, piste de terre. Trois voitures (Kitsune S15, Stallion 67, Taiga R) et six peintures au garage.

| Clavier | Manette | Tactile | Action |
|---|---|---|---|
| ZQSD, WASD ou flèches | gâchettes + stick | Gaz, Frein, ◀ ▶ | Conduire |
| Espace | B | Drift | Frein à main (les dérapages remplissent la nitro) |
| Maj | A | Nitro | Nitro |
| C | Y | — | Caméra |
| R / Échap | — / Start | II | Revenir sur la route / pause |

Les sources découpées en morceaux et la méthode pour l'améliorer sont dans le skill
[`.claude/skills/jeu-course-3d`](../.claude/skills/jeu-course-3d/SKILL.md).
