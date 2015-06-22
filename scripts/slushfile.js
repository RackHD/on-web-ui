'use strict';

process.on('uncaughtException', console.error.bind(console));

global.gulp = require('gulp');
global.path = require('path');

global.parameters = require('./lib/parameters')(2);

require('./generators/app');
global.gulp.task('default', ['app']);

require('./generators/asset');
require('./generators/code');
require('./generators/config');
require('./generators/less');
require('./generators/messenger');
require('./generators/mixin');
require('./generators/readme');
require('./generators/store');
require('./generators/view');
