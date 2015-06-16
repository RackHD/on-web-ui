'use strict';
/* global gulp, path */

var merge = require('merge-stream'),
    plumber = require('gulp-plumber'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    csscomb = require('gulp-csscomb'),
    gulpIf = require('gulp-if'),
    minifyCss = require('gulp-minify-css'),
    size = require('gulp-size');

var params = global.parameters || require('../lib/parameters')(2);

var getFolders = require('../lib/getFolders'),
    autoprefixerBrowsers = require('../lib/autoprefixer').browsers;

// CSS style sheets
gulp.task('css', function() {
  var streams = [];

  var apps = getFolders(path.join(__dirname, '..', '..', 'apps'));

  function compileLess(src) {
    return src
      .pipe(plumber())
      .pipe(less({
        sourceMap: !params.RELEASE,
        sourceMapBasepath: path.join(__dirname, '..', '..')
      }))
      .on('error', console.error.bind(console))
      .pipe(autoprefixer({browsers: autoprefixerBrowsers}))
      .pipe(csscomb())
      .pipe(gulpIf(params.RELEASE, minifyCss()));
  }

  apps.forEach(function (appName) {
    var appDir = path.join('apps', appName),
        target = path.join('build', appName);
    streams.push(
      compileLess(gulp.src(path.join(appDir, 'styles', 'main.less')))
        .pipe(gulp.dest(target))
        .pipe(size({title: appName + ' styles'}))
    );
  });

  // Copy common assets into build directory
  var commonTarget = path.join('build', 'common');
  streams.push(
    compileLess(gulp.src(path.join('common', 'styles', 'main.less')))
      .pipe(gulp.dest(commonTarget))
      .pipe(size({title: 'common styles'}))
  );

  return merge(streams);
});
