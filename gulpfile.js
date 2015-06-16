'use strict';

// NOTE: The eventemitter3 npm module is required for browserSync to function.
process.on('uncaughtException', console.error.bind(console));

// Include Gulp and other build automation tools and utilities
// See: https://github.com/gulpjs/gulp/blob/master/docs/API.md

global.gulp = require('gulp');
global.path = require('path');

global.watch = false;
global.browserSync = null;
global.parameters = require('./config/parameters')(2);

require('./tasks/assets');
require('./tasks/build');
require('./tasks/bundle');
require('./tasks/clean');
require('./tasks/css');
require('./tasks/deploy');
require('./tasks/server');
require('./tasks/sync');
require('./tasks/templates');
require('./tasks/test');
require('./tasks/watch');

global.gulp.task('default', ['sync']);
