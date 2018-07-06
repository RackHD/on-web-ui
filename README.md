# Table of Content

* [Introduction](README.md#introduction)
* [User Guide]( README.md#user-guide)
  * [Installing dependencies](README.md#dependencies)
  * [Installing](README.md#installing)
  * [Running the app](README.md#running-the-app)
* [Configuration](README.md#configuration)
* [Deployment](docs/deployment.md)
* [Katalist Coding convention & Best Practise](docs/development-guide.md)
* [Copyright](README.md#copy-right)



# Introduction

on-web-ui is a web utility provided to help user to try out RackHD APIs in a handy graphic interface. We developed Gen1 of on-web-ui since 2015. In order to purse better user experience, we rewrote whole on-web-ui code with new designed UI to evolve this project to Gen2 on 2018.

* on-web-ui Gen1 (version below v2.33.0)
  - Based on React
  - All source codes are kept in repo branch "on-web-ui_1.0" and could be accessed at https://github.com/RackHD/on-web-ui/tree/on-web-ui_1.0

* on-web-ui Gen2 (version above v3.0.0)
  - Based on Angular5 + Clarify
  - All source codes are kept in master branch. 
  - This README file only contains information about on-web-ui Gen2.

# User Guide
## Dependencies
What you need to run this app:
* `node` and `npm` (`brew install node`)
* Ensure you're running the latest versions Node `v8.x.x` and NPM `5.x.x`+

> If you have `nvm` installed, which is highly recommended (`brew install nvm`) you can do a `nvm install --lts && nvm use` in `$` to run with the latest Node LTS. You can also have this `zsh` done for you [automatically](https://github.com/creationix/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file)

Once you have those, you should install these globals with `npm install --global`:
* `webpack` (`npm install --global webpack`)
* `webpack-dev-server` (`npm install --global webpack-dev-server`)
* `karma` (`npm install --global karma-cli`)
* `protractor` (`npm install --global protractor`)
* `typescript` (`npm install --global typescript`)

## Installing
* `fork` this repo
* `clone` your fork
* `npm install webpack-dev-server rimraf webpack -g` to install required global dependencies
* `npm install` to install all dependencies or `yarn`
* `npm run server` to start the dev server in another tab

## Running the app
After you have installed all dependencies you can now run the app. Run `npm run server` to start a local server using `webpack-dev-server` which will watch, build (in-memory), and reload for you. The port will be displayed to you as `http://0.0.0.0:3000` (or if you prefer IPv6, if you're using `express` server, then it's `http://[::1]:3000/`).

### server
```bash
# development
npm run server
# production
npm run build:prod
npm run server:prod
```

## Other commands

### build files
```bash
# development
npm run build:dev
# production (jit)
npm run build:prod
# AoT
npm run build:aot
```

### hot module replacement
```bash
npm run server:dev:hmr
```

### watch and build files
```bash
npm run watch
```

### run unit tests
```bash
npm run test
```

### watch and run our tests
```bash
npm run watch:test
```

### run end-to-end tests
```bash
# update Webdriver (optional, done automatically by postinstall script)
npm run webdriver:update
# this will start a test server and launch Protractor
npm run e2e
```

### continuous integration (run unit tests and e2e tests together)
```bash
# this will test both your JIT and AoT builds
npm run ci
```

### run Protractor's elementExplorer (for end-to-end)
```bash
npm run e2e:live
```

### build Docker
```bash
npm run build:docker
```

# Configuration
Configuration files live in `config/` we are currently using webpack, karma, and protractor for different stages of your application

# Copyright
Copyright 2017, Dell EMC
