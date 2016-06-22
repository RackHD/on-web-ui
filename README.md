# [On Web UI](http://rackhd.github.io/on-web-ui) [![Build Status](https://travis-ci.org/RackHD/on-web-ui.svg?branch=master)](https://travis-ci.org/RackHD/on-web-ui) [![Code Climate](https://codeclimate.com/github/RackHD/on-web-ui/badges/gpa.svg)](https://codeclimate.com/github/RackHD/on-web-ui) [![Coverage Status](https://coveralls.io/repos/RackHD/on-web-ui/badge.svg?branch=master&service=github)](https://coveralls.io/github/RackHD/on-web-ui?branch=master)

Copyright 2015, EMC, Inc.

### Publicly hosted on GitHub page.

A live version of the UI can be used at:

**[Live RackHD UI](http://rackhd.github.io/on-web-ui)**

You can change the API endpoints from the settings page. Look for the gear icon.

A zip file of the live version can always be downloaded from the `gh-pages` branch:

**[Download latest build](https://github.com/RackHD/on-web-ui/archive/gh-pages.zip)**

Extract the zip file to any directory served over HTTP. This is done automatically by `on-http` with `npm install`.

### Quick getting started guide.

**Requires Node v6 or greater to run on-web-ui dev tools.**

```bash
$ git clone https://github.com/RackHD/on-web-ui.git
$ cd on-web-ui
$ npm install
$ npm start             # Start development server at http://127.0.0.1:3000.
$ npm test              # Run automated tests.
```

### How to configure API endpoints.

You can change the RackHD API endpoint dynamically from the UI. Look for the settings link in the main navigation. This will open the Settings page where you can specify API endpoints.

The default API endpoints can be configured by renaming `src/config/custom.json.example` to `src/config/custom.json`, editing the  API endpoint properties, and rebuilding the UI.

Note, that the endpoint URL is stored in your browsers local storage. This means that changing the default endpoint may not change the endpoint for your session. It is better to use the Settings page to update the endpoint in your browser.

### How to build On Web UI applications.

```bash
$ npm run build         # Build `static/monorail.css` & `static/monorail.js` for production.
```

```bash
$ npm run build-css     # Build minified `static/monorail.css` from `less/monorail.less`.
```

```bash
$ npm run build-js      # Build production `static/monorail.js`.
```

### Automated Testing.

Run unit tests powered by [Karma](http://karma-runner.github.io/), [Mocha](http://mochajs.org/), and [Chai](http://chaijs.com/), with [Spies](https://github.com/chaijs/chai-spies)

Tests are designed to run in a real web browser such as Chrome or FireFox. By default Chrome must be present when running the tests.

```bash
$ npm test              # Or, `npm run-script test-ci` for Jenkins.
```

Test any javascript module by creating a `__tests__/` directory where
the file is. Name the test by appending `-test.js` to the JavaScript file.

### Core Technologies
 * [BabelJS](http://babeljs.io/docs/learn-es2015/#ecmascript-6-features')
 * [React](https://facebook.github.io/react/docs/getting-started.html)
 * [Radium](http://projects.formidablelabs.com/radium/)
 * [Material UI](http://material-ui.com/#/components/appbar)
 * [Webpack](http://webpack.github.io/)
 * [Karma](http://karma-runner.github.io/)
