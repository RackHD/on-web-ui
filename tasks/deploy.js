// Copyright 2015, EMC, Inc.
/* global gulp, path */

const ghPages = require('gulp-gh-pages');

const rootDir = path.join(__dirname, '..');

gulp.task('deploy', () => {
  let buildSrc = path.join(rootDir, 'static', '**', '*');
  console.log(buildSrc);
  return gulp.src(buildSrc).pipe(ghPages({
    remoteUrl: 'https://github.com/RackHD/on-web-ui'
  }));
});
