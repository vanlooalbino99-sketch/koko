#!/bin/sh
# Démarrage de l'image : un disque monté sur /data (Render, Railway…) appartient souvent à root ;
# on le rend au compte « node » puis on lance le serveur sous ce compte, jamais en root.
set -e
if [ "$(id -u)" = "0" ]; then
  mkdir -p "$DATA_DIR"
  chown -R node:node "$DATA_DIR"
  # su de busybox : -p garde les variables d'environnement (PORT, DATA_DIR, clés…) ; « -- » laisse les options
  # de node à node.
  exec su -p -s /bin/sh -c 'exec "$@"' -- node sh "$@"
fi
exec "$@"
