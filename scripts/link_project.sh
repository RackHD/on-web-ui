cd apps/common
npm link
cd ../../
npm link common-web-ui

cd apps/monorail
npm link
cd ../../
npm link monorail-web-ui

cd apps/onrack
npm link
cd ../../
npm link onrack-web-ui

cd scripts
npm link
cd ../
npm link slush-app

cd node_modules/material-ui
npm install
rm -rf node_modules/react
if [ ! -f ./lib/index.js ]; then
  ./node_modules/.bin/babel --stage 1 ./src --out-dir ./lib
fi
cd ../../
