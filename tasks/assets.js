'use strict';
/* global gulp, path */

var merge = require('merge-stream'),
    changed = require('gulp-changed'),
    size = require('gulp-size');

var getFolders = require('./lib/getFolders');

// Build static asset files
gulp.task('assets', function() {
  var streams = [];

  // Copy app assets into build directory.
  var apps = getFolders(path.join(__dirname, '..', 'apps'));
  apps.forEach(function (appName) {
    var appDir = path.join('apps', appName),
        target = path.join('build', appName);
    streams.push(
      gulp.src(path.join(appDir, 'assets', '**'))
        .pipe(changed(target))
        .pipe(gulp.dest(target))
        .pipe(size({title: appName + ' assets'}))
    );
  });

  // Copy common assets into build directory
  var commonTarget = path.join('build', 'common');
  streams.push(
    gulp.src(path.join('common', 'assets', '**'))
      .pipe(changed(commonTarget))
      .pipe(gulp.dest(commonTarget))
      .pipe(size({title: 'common assets'}))
  );

  return merge(streams);
});
