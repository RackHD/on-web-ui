# On Web UI

### Documentation

- [Documentation Index](./docs/index.md)

### Directory Structure

```
.
├── apps              # Directory of separated applications.
│   └── {app}
│       ├── actions       # Actions modules delegate calls to stores.
│       ├── api           # API requests for application data.
│       ├── assets        # Static files to be made public.
│       ├── components    # React components.
│       ├── stores        # Stores contain persisted application data.
│       ├── styles        # Less and CSS files.
│       ├── templates     # HTML files.
│       ├── bundle.js     # Main application entry point.
│       └── config.js     # Client configuration file.
|
├── build             # Output folder for built code.
│   ├── {app}         # Compiled CSS, HTML and assets go in app folders.
│   └── bundle        # Compiled JavaScript code for all apps go here.
|
├── common            # Commonly used code goes here.
│   ├── components    # Common React components.
│   ├── lib           # Reusable JavaScript code.
│   ├── mixins        # React component mixin definitions.
│   ├── styles        # Base Less and CSS files.
│   ├── bundle.js     # Entry point for common code.
│   └── server.js     # Development server for apps.
|
├── docs              # Project documentation files.
|
├── node_modules      # External dependencies.
|
├── scripts           # Scripts for dev, build, and test.
│   ├── lib           # Reusable JavaScript code.
│   ├── tasks         # Gulp task definitions.
│   ├── test          # Test bootstrap files.
│   └── tools         # Development utilities.
|
├── .babelrc          # BabelJS configuration file.
├── .eslintrc         # eslint configuration file.
├── .gitignore        # git ignored files.
|
├── gulpfile.js       # Gulpfile for project gulp tasks.
|
├── HWIMO-BUILD       # Build script.
├── HWIMO-DOC         # Doc script.
├── HWIMO-TEST        # Test script.
|
├── karma.ci.conf.js  # Karma configuration for continuous integration.
├── karma.conf.js     # Karma test running configuration for development.
|
├── package.json      # NPM package, dependency file.
└── README.md         # Everything that follows is a result of what you see here.
```

### Getting Started

```shell
$ git clone ssh://git@hwstashprd01.isus.emc.com:7999/onrack/on-web-ui.git
$ cd on-web-ui
$ npm install                   # Install Node.js modules.
$ ./scripts/setup_project.sh    # Create config files from examples.
$ gulp                          # Run gulp to build and start browser-sync
```

#### Configuration

By default the application makes api calls to: `http://localhost/api/1.1`

This can be configured in `apps/{app}/config.js` after it is created from the example config.

##### Feature Flags

The UI has feature flags to allow features to be toggled on or off. They are set in the config file and can be overridden in the query string of the URL.

For example if you want to disable the `dev` flag you can add: `?dev=false` to the url and it will disable the flag.

###### Flags

  * dev - Enables profiling.

#### Mock API

```shell
$ sudo node ./mock_api.js       # Runs mock api on port 80
```

### How to Build

```shell
$ gulp build                    # or, `gulp build --release`
```

By default, it builds in debug mode. If you need to build in release mode, add
`--release` flag.

### How to Run

```shell
$ gulp                          # or, `gulp --release`
```

This will start a lightweight development server with LiveReload and
synchronized browsing across multiple devices and browsers.

### How to Deploy

NOTE: Currently not supported.

```shell
$ gulp build --release          # Builds the project in release mode
$ gulp deploy                   # or, `gulp deploy --production`
```

For more information see `deploy` task in `script/tasks/deploy.js`.

### How to Test

Run unit tests powered by Karma, Mocha, and Chai:
  * [Karma - Spectacular Test Runner](http://karma-runner.github.io/)
  * [Mocha](http://mochajs.org/)
  * [Chai](http://chaijs.com/)
  * [chai-spies](https://github.com/chaijs/chai-spies)


[npm](https://www.npmjs.org/doc/misc/npm-scripts.html) command:

```shell
$ npm test
```

Test any javascript module by creating a `__tests__/` directory where
the file is. Name the test by appending `-test.js` to the js file

### Build tools
 * [gulp.js](http://gulpjs.com/)
 * [webpack module bundler](http://webpack.github.io/)

### Learn More
 * [Getting Started with React.js](http://facebook.github.io/react/)
 * [React.js Wiki on GitHub](https://github.com/facebook/react/wiki)
 * [React.js Questions on StackOverflow](http://stackoverflow.com/questions/tagged/reactjs)
 * [React.js Discussion Board](https://groups.google.com/forum/#!forum/reactjs)
 * [The Future of React](https://github.com/reactjs/react-future)
 * [Flux Architecture for Building User Interfaces](http://facebook.github.io/flux/)
 * [Learn ES6](https://babeljs.io/docs/learn-es6/), [ES6 Features](https://github.com/lukehoban/es6features#readme)
