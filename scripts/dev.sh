#!/bin/sh
# Ce Mac n'a pas Node.js installé globalement. On utilise ici une install
# Node.js locale et persistante dans ~/.local/node (partagée entre projets).
# Voir README pour installer Node.js proprement et te passer de ce script.
NODE_BIN_DIR="$HOME/.local/node/bin"
if [ -d "$NODE_BIN_DIR" ]; then
  export PATH="$NODE_BIN_DIR:$PATH"
fi
exec node node_modules/next/dist/bin/next "$@"
