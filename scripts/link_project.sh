# Copyright 2015, EMC, Inc.

printf '\n\nNPM link common-web-ui:\n\n'
cd apps/common
npm link
cd ../../
npm link common-web-ui

printf '\n\nNPM link graph-canvas-web-ui:\n\n'
cd apps/graph_canvas
npm link
cd ../../
npm link graph-canvas-web-ui

printf '\n\nNPM link monorail-web-ui:\n\n'
cd apps/monorail
npm link
cd ../../
npm link monorail-web-ui

printf '\n\nNPM link onrack-web-ui:\n\n'
cd apps/onrack
npm link
cd ../../
npm link onrack-web-ui

printf '\n\nNPM link slush-app:\n\n'
cd scripts
npm link
cd ../
npm link slush-app

printf '\n\nSetup material-ui module:\n\n'
cd node_modules/material-ui
npm install
rm -rf node_modules/react
if [ ! -f ./lib/index.js ]; then
  ./node_modules/.bin/babel --stage 1 ./src --out-dir ./lib
fi
cd ../../
