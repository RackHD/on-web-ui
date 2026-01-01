$ gh repo clone Web4application/Web4-playground
cd web4-playground

$ git clone https://github.com/RackHD/on-web-ui.git
$ cd on-web-ui
$ npm install
$ npm start             # Start development server at http://127.0.0.1:3000.
$ npm test              # Run automated tests.
# development
npm run server
# production
npm run build:prod
npm run server:prod
$ npm run build-js      # Build production `static/monorail.js`.
$ npm run build-css     # Build minified `static/monorail.css` from `less/monorail.less`.
$ npm run build         # Build `static/monorail.css` & `static/monorail.js` for production.

$ nvm use 16
Now using node v16.9.1 (npm v7.21.1)
$ node -v
v16.9.1
$ nvm use 14
Now using node v14.18.0 (npm v6.14.15)
$ node -v
v14.18.0
$ nvm install 12
Now using node v12.22.6 (npm v6.14.5)
$ node -v
v12.22.6
