// Copyright 2015, EMC, Inc.

'use strict';

// NOTE: The eventemitter3 npm module is required for browserSync to function.
process.on('uncaughtException', function (err) {
  console.error(err.stack || err);
});

// Include Gulp and other build automation tools and utilities
// See: https://github.com/gulpjs/gulp/blob/master/docs/API.md

global.gulp = require('gulp');
global.path = require('path');

global.parameters = require('./lib/parameters')(2);
global.browserSync = null;
global.watch = false;

// build
require('./tasks/build');
require('./tasks/clean');

// build assets
require('./tasks/assets');
require('./tasks/less');

// build bundle
require('./tasks/bundle');

// build run
require('./tasks/serve');

// build run dev
require('./tasks/sync');
require('./tasks/watch');

// deploy
require('./tasks/deploy');

global.gulp.task('default', ['sync']);
