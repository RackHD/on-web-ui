'use strict';
/* global gulp, path */

var runSequence = require('run-sequence');

var getFolders = require('../lib/getFolders');

// Build and start watching for modifications
gulp.task('watch', function(cb) {
  global.watch = true;

  var assets = [],
      styles = [],
      templates = [];

  var apps = getFolders(path.join(__dirname, '..', '..', 'apps'));
  apps.forEach(function (appName) {
    var appDir = path.join('apps', appName);

    assets.push(path.join(appDir, 'assets', '**'));
    styles.push(path.join(appDir, 'styles', '**', '*.{css,less}'));
    templates.push(path.join(appDir, 'templates', '**', '*.*'));
  });

  runSequence('build', function() {
    gulp.watch(assets, ['assets']);
    gulp.watch(styles, ['css']);
    gulp.watch(templates, ['templates']);
    cb();
  });
});
