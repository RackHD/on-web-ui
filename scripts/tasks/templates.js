'use strict';
/* global gulp, path */

// var merge = require('merge-stream'),
//     changed = require('gulp-changed'),
//     template = require('gulp-template'),
//     size = require('gulp-size');
//
// var getFolders = require('../lib/getFolders');

// Build static html files
gulp.task('templates', function() {
  path.join();
  // var streams = [];

  // Template data
  // var data = {
  //   body: '',
  //   description: '',
  //   title: 'On Web UI'
  // };

  // Copy app assets into build directory.
  // var apps = getFolders(path.join(__dirname, '..', '..', 'apps'));
  // apps.forEach(function (appName) {
  //   var appDir = path.join('apps', appName),
  //       target = path.join('build', appName);
  //   streams.push(
  //     gulp.src(path.join(appDir, 'templates', '**', '*.*'))
  //       .pipe(template(data))
  //       .pipe(changed(target))
  //       .pipe(gulp.dest(target))
  //       .pipe(size({title: appName + ' templates'}))
  //   );
  // });

  // return merge(streams);
});
