// Copyright 2015, EMC, Inc.

'use strict';
/* global gulp, path */

var ghPages = require('gulp-gh-pages');

var rootDir = path.join(__dirname, '..', '..');

gulp.task('deploy', function() {
  let buildSrc = path.join(rootDir, 'build', '**', '*');
  console.log(buildSrc);
  return gulp.src(buildSrc).pipe(ghPages({
    remoteUrl: 'https://github.com/RackHD/on-web-ui'
  }));
});
