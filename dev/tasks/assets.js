// Copyright 2015, EMC, Inc.

'use strict';
/* global gulp, path */

var merge = require('merge-stream'),
    changed = require('gulp-changed'),
    size = require('gulp-size');

var getFolders = require('../lib/getFolders');

// Build static asset files
gulp.task('assets', function() {
  var streams = [];

  var indexSource = path.join('..', 'apps', 'index.html'),
      indexTarget = path.join('..', 'build');
  streams.push(
    gulp.src(indexSource)
      .pipe(changed(indexTarget))
      .pipe(gulp.dest(indexTarget))
      .pipe(size({title: 'index.html'}))
  );

  // Copy app assets into build directory.
  var apps = getFolders(path.join(__dirname, '..', '..', 'apps'));
  apps.forEach(function (appName) {
    var appDir = path.join('..', 'apps', appName),
        target = path.join('..', 'build', appName);
    streams.push(
      gulp.src(path.join(appDir, 'assets', '**'))
        .pipe(changed(target))
        .pipe(gulp.dest(target))
        .pipe(size({title: appName + ' assets'}))
    );
  });

  return merge(streams);
});
