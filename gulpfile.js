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

// global.apps = null;

require('./scripts/tasks/assets');
require('./scripts/tasks/build');
require('./scripts/tasks/bundle');
require('./scripts/tasks/clean');
require('./scripts/tasks/css');
require('./scripts/tasks/deploy');
require('./scripts/tasks/server');
require('./scripts/tasks/sync');
require('./scripts/tasks/templates');
require('./scripts/tasks/watch');

global.gulp.task('default', ['sync']);
