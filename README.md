# On Web UI [![Build Status](https://travis-ci.org/RackHD/on-web-ui.svg?branch=master)](https://travis-ci.org/RackHD/on-web-ui) [![Code Climate](https://codeclimate.com/github/RackHD/on-web-ui/badges/gpa.svg)](https://codeclimate.com/github/RackHD/on-web-ui) [![Coverage Status](https://coveralls.io/repos/RackHD/on-web-ui/badge.svg?branch=master&service=github)](https://coveralls.io/github/RackHD/on-web-ui?branch=master)

Copyright 2015, EMC, Inc.

### Quick getting started guide.

**Requires Node v4 or greater to run on-web-ui dev tools.**

```bash
$ git clone https://github.com/RackHD/on-web-ui.git
$ cd on-web-ui
$ npm run uninstall             # Uninstall all node_modules from last install.
$ npm install                   # Install Node.js modules.
$ npm run install               # Run install script. (Not required on Mac)
$ npm start                     # Start on-web-ui development environment.
$ npm test                      # Runs all automated tests against On Web UI.
```

This will start a development server that will automatically refresh when code changes are made. It uses [BrowserSync](http://www.browsersync.io/) to accomplish this.

By default there will be two servers running. One on port `5000` which will be proxied by another on port `3000`.

 * http://localhost:3000 is the MonoRail Web UI.

### How to configure RackHD API endpoint.

You can change the RackHD API endpoint dynamically from the UI. There is a gear icon located at the top right corner of the UI. This will open the Settings Panel where you can type a custom Rack API endpoint URL.

The default API endpoint can be configured by renaming `apps/monorail/custom.json.example` to `apps/monorail/custom.json`, and then editing the `MONORAIL_API` property.

Note, that the endpoint URL is stored in your browsers local storage. This means that changing the default endpoint may not change the endpoint for your session. It is better to use the Settings Panel to update the endpoint in your browser.

### How to build On Web UI applications.

By default, builds run in debug mode. If you need to build in release mode, add the `--release` flag.

```bash
$ cd dev                        # Gulp tasks must be run from `dev/`.
$ gulp build                    # Or, `gulp build --release`.
```
This will generate a `build/` directory at the project root. The contents of this directory can be served by any HTTP file server in order to deploy all the On Web UI applications.

```bash
$ cd dev                        # Gulp tasks must be run from `dev/`.
$ gulp assets less bundle       # A more verbose way to build.
```

The `build` task actually runs three different tasks sequentially.
 * `gulp assets` -- Copies all assets in `apps/[app]/assets` to `build/[app]`.
 * `gulp less` -- Compiles less/css files in `apps/[app]/less` to `build/[app]`.
 * `gulp bundle` -- Compiles and bundles es6/7 javascript code from `apps/[app]/bundle.js` into `build/bundle/[app].js`.

### More on Automated Tests.

Run unit tests powered by [Karma](http://karma-runner.github.io/), [Mocha](http://mochajs.org/), and [Chai](http://chaijs.com/), with [Spies](https://github.com/chaijs/chai-spies)

Tests are designed to run in a real web browser such as Chrome or FireFox. By default Chrome must be present when running the tests.

```bash
$ npm test                       # Or, `npm run-script test-ci` for Jenkins.
```

Test any javascript module by creating a `__tests__/` directory where
the file is. Name the test by appending `-test.js` to the JavaScript file.

### Project Organization

```bash
.
├── apps              # Directory of separated applications.
│   │
│   ├── {app}
│   │   ├── assets        # Static files to be made public.
│   │   ├── config        # Application configuration files and routes.
│   │   ├── less          # Less and CSS files.
│   │   ├── lib           # Reusable JavaScript code.
│   │   ├── messengers    # Actions modules delegate calls to stores.
│   │   ├── mixins        # React component mixin definitions.
│   │   ├── node_modules  # External application dependencies.
│   │   ├── stores        # Stores contain persisted application data.
│   │   ├── views         # React views.
│   │   │
│   │   ├── bundle.js     # Main application entry point.
│   │   ├── package.json  # Application NPM package, dependency file.
│   │   └── README.md     # Application specific documentation.
│   │
│   ├── index.html    # Default app redirector HTML file.
│   └── README.md     # Generic application documentation.
│
├── build             # Output folder for built code.
│   │
│   ├── {app}         # Compiled CSS, HTML and assets go in app folders.
│   └── bundle        # Compiled JavaScript code for all apps go here.
│
├── node_modules      # External project dependencies.
|
├── debian            # Debian packaging directory.
│
├── dev                   # Scripts for dev, build, and test.
│   │
│   ├── app_tests         # Application tests bootstrap source code.
│   ├── lib               # Reusable JavaScript code for development.
│   │
│   ├── node_modules      # External development dependencies.
│   │
│   ├── slush_app         # [Optional] slush-app location.
│   │
│   ├── specs             # Specification documents.
│   ├── tasks             # Gulp task definitions.
│   ├── tools             # Miscellaneous development scripts.
│   │
│   ├── deb_package.sh    # Debian packaging script.
│   ├── Dockerfile        # Docker container configuration file.
│   ├── gulpfile.js       # Gulp file for project gulp tasks.
│   │
│   ├── karma.*ci.conf.js  # Karma configuration for continuous integration.
│   ├── karma.conf.js      # Karma test running configuration for development.
│   │
│   ├── package.json      # Development NPM package, dependency file.
│   ├── provision.sh      # Provision script for environment setup.
│   ├── README.md         # Project development documentation.
│   └── Vagrantfile       # Vagrant VM configuration file.
│
├── server                # Build server.
│   │
│   ├── node_modules      # External server dependencies.
│   │
│   ├── build_server.js   # Build server source file.
│   ├── package.json      # Server NPM dependency file.
│   └── README.md         # Server documentation.
|
├── .babelrc          # BabelJS configuration file.
├── .eslintrc         # eslint configuration file.
├── .gitignore        # git ignored files.
│
├── HWIMO-BUILD       # Build script.
├── HWIMO-DOC         # Doc script.
├── HWIMO-TEST        # Test script.
│
├── package.json      # Main NPM package, dependency file.
└── README.md         # Everything that follows is a result of what you see here.
```

### Core Technologies
 * [BabelJS](http://babeljs.io/docs/learn-es2015/#ecmascript-6-features')
 * [React](https://facebook.github.io/react/docs/getting-started.html)
 * [Radium](http://projects.formidablelabs.com/radium/)
 * [Material UI](http://material-ui.com/#/components/appbar)
 * [BrowserSync](http://www.browsersync.io/)
 * [Webpack](http://webpack.github.io/)
 * [Gulp](http://gulpjs.com/)
 * [Karma](http://karma-runner.github.io/)
