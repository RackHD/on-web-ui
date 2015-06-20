'use strict';
/* global gulp */

var runSequence = require('run-sequence');

gulp.task('build', ['clean'], function(cb) {
  runSequence(['assets', 'less', 'bundle'], cb);
});
