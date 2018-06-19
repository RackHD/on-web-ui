// Copyright 2015, EMC, Inc.
/* global gulp, path */

const less = require('gulp-less'),
      autoprefixer = require('gulp-autoprefixer'),
      minifyCss = require('gulp-minify-css');

const autoprefixerBrowsers = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('less', () => {
  return gulp.src(path.join(__dirname, '..', 'less', 'monorail.less'))
    .pipe(less({
      // sourceMap: !params.RELEASE,
      // sourceMapBasepath: path.join(__dirname, '..')
    }))
    .on('error', console.error.bind(console))
    .pipe(autoprefixer({browsers: autoprefixerBrowsers}))
    .pipe(minifyCss())
    .pipe(gulp.dest(path.join(__dirname, '..', 'static')));
});
