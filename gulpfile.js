// Copyright 2015, EMC, Inc.

process.on('uncaughtException', (err) => {
  console.error(err.stack || err);
});

global.gulp = require('gulp');
global.path = require('path');

global.watch = false;

require('./tasks/less');
require('./tasks/deploy');

global.gulp.task('default', ['less']);
