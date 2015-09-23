// Copyright 2015, EMC, Inc.

'use strict';
/* global gulp, path */

var runSequence = require('run-sequence');

var getFolders = require('../lib/getFolders');

// Build and start watching for modifications
gulp.task('watch', function(cb) {
  global.watch = true;

  var assets = [],
      less = [];

  var apps = getFolders(path.join(__dirname, '..', '..', 'apps'));
  apps.forEach(function (appName) {
    var appDir = path.join('apps', appName);

    assets.push(path.join(appDir, 'assets', '**'));
    less.push(path.join(appDir, 'less', '**', '*.{css,less}'));
  });

  runSequence('build', function() {
    gulp.watch(assets, ['assets']);
    gulp.watch(less, ['less']);
    cb();
  });
});
