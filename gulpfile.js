'use strict';

// NOTE: The eventemitter3 npm module is required for browserSync to function.
process.on('uncaughtException', console.error.bind(console));

// Include Gulp and other build automation tools and utilities
// See: https://github.com/gulpjs/gulp/blob/master/docs/API.md

global.gulp = require('gulp');
global.path = require('path');

global.parameters = require('./scripts/lib/parameters')(2);
global.browserSync = null;
global.watch = false;

// build
require('./scripts/tasks/build');
require('./scripts/tasks/clean');

// build assets
require('./scripts/tasks/assets');
require('./scripts/tasks/less');
require('./scripts/tasks/templates');

// build bundle
require('./scripts/tasks/bundle');

// build run
require('./scripts/tasks/serve');

// build run dev
require('./scripts/tasks/sync');
require('./scripts/tasks/watch');

// build deploy
require('./scripts/tasks/deploy');


global.gulp.task('default', ['sync']);
