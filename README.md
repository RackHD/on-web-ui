# On Web UI

### Quick Guide

```shell
$ git clone ssh://git@hwstashprd01.isus.emc.com:7999/onrack/on-web-ui.git
$ cd on-web-ui
$ npm install                   # Install Node.js modules.
$ npm install gulp -g
$ gulp                          # Run gulp to run on-web-ui
```

This will start a lightweight development server with LiveReload and
synchronized browsing across multiple devices and browsers.

Goto http://localhost:3000 to see a list of available apps.

##### Documentation
Once `gulp` is running with and the build is being served you can access the handbook app for additional documentation.
http://localhost:3000/handbook
Note: You must run the code server. See "Development Servers" section.

##### Build
```shell
$ gulp build                    # or, `gulp build --release`
```
```shell
$ gulp assets less bundle       # a more verbose way to build
```
By default, it builds in debug mode. If you need to build in release mode, add
`--release` flag.

##### Test
Run unit tests powered by [Karma](http://karma-runner.github.io/),
    [Mocha](http://mochajs.org/), and
    [Chai](http://chaijs.com/), with [Spies](https://github.com/chaijs/chai-spies)
```shell
$ npm install karma-cli -g
$ karma start karma.conf.js
```
Test any javascript module by creating a `__tests__/` directory where
the file is. Name the test by appending `-test.js` to the JavaScript file.

### File Organization
```
.
├── apps              # Directory of separated applications.
│   └── {app}
│       ├── api           # API requests for application data.
│       ├── assets        # Static files to be made public.
│       ├── config        #
│       ├── lib           # Reusable JavaScript code.
│       ├── messengers    # Actions modules delegate calls to stores.
│       ├── mixins        # React component mixin definitions.
│       ├── views         # React views.
│       ├── stores        # Stores contain persisted application data.
│       ├── less          # Less and CSS files.
│       ├── templates     # HTML files.
│       ├── bundle.js     # Main application entry point.
│       └── config.js     # Client configuration file.
│
├── build             # Output folder for built code.
│   ├── {app}         # Compiled CSS, HTML and assets go in app folders.
│   └── bundle        # Compiled JavaScript code for all apps go here.
│
├── node_modules      # External dependencies.
│
├── scripts               # Scripts for dev, build, and test.
│   ├── generators        #
│   ├── lib               # Reusable JavaScript code.
│   ├── tasks             # Gulp task definitions.
│   ├── templates         #
│   ├── test              # Test bootstrap files.
│   ├── tools             # Development utilities.
│   ├── link_project.sh   #
│   └── slushfile.js      #
│
├── .babelrc          # BabelJS configuration file.
├── .eslintrc         # eslint configuration file.
├── .gitignore        # git ignored files.
│
├── gulpfile.js       # Gulpfile for project gulp tasks.
│
├── HWIMO-BUILD       # Build script.
├── HWIMO-DOC         # Doc script.
├── HWIMO-TEST        # Test script.
│
├── karma.ci.conf.js  # Karma configuration for continuous integration.
├── karma.conf.js     # Karma test running configuration for development.
│
├── package.json      # NPM package, dependency file.
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
 * [Slush](http://slushjs.github.io/)
 * [Karma](http://karma-runner.github.io/)

## Development Servers
#### Code Server for Handbook App.
```shell
$ sudo node ./script/tools/code_server.js         # Runs code api on port 7000
```
#### Build Server.
```shell
$ sudo node ./script/tools/build_server.js        # Runs code api on port 5000
```
#### Mock API Server for MonoRail App.
```shell
$ sudo node ./script/tools/mock_api.js            # Runs mock api on port 80
```
#### Proxy OnRack API Server
```shell
$ sudo node ./script/tools/proxy_onrack_api.js    # Runs proxy api on port 2000
```
