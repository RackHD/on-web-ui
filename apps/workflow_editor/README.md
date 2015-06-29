# WorkflowEditor

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Get development environment started.

```shell
$ gulp dev WorkflowEditor
```

## Understanding configuration.

`apps/WorkflowEditor/config/colors.js` --

`apps/WorkflowEditor/config/custom.js` --

`apps/WorkflowEditor/config/defaults.js` --

`apps/WorkflowEditor/config/index.js` --

`apps/WorkflowEditor/config/routes.js` --

### About feature flags.

The UI has feature flags to allow features to be toggled on or off. They are set in the config file and can be overridden in the query string of a URL.

For example if you want to disable the `dev` flag you can add: `?dev=false` to the url and it will disable the flag.

 * dev - Enables profiling.

### How to run automated tests?

Run unit tests powered by Karma, Mocha, and Chai:
  * [Karma - Spectacular Test Runner](http://karma-runner.github.io/)
  * [Mocha](http://mochajs.org/)
  * [Chai](http://chaijs.com/)
  * [chai-spies](https://github.com/chaijs/chai-spies)


[npm](https://www.npmjs.org/doc/misc/npm-scripts.html) command:

```shell
$ gulp test WorkflowEditor
```

### How to create a custom test?

Test any JavaScript module by creating a `__tests__/` directory where
the file is. Name the test by appending `-test.js` to the JavaScript file.

### How to build and deploy?

```shell
$ gulp build WorkflowEditor --release    # Builds the project in release mode
$ gulp deploy WorkflowEditor             # or, `gulp deploy --production`
```

### Application Directory Structure

```
.
├── assets                    #
|   └── index.html            #
├── config                    #
|   ├── colors.js             #
|   ├── custom.json.example   #
|   ├── defaults.js           #
|   ├── index.js              #
|   └── routes.js             #
├── less                      #
|   └── main.less             #
├── lib                       #
├── messengers                #
├── mixins                    #
├── stores                    #
├── views                     #
|   └── App.js                #
├── bundle.js                 #
├── package.json              #
└── README.md                 #
```
