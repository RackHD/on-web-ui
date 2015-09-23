// Copyright 2015, EMC, Inc.

'use strict';
/* global gulp */

// Deploy via Git
gulp.task('deploy', function(cb) {
  var push = require('git-push');
  // TODO:
  var remote = 'https://github.com/{user}/{repo}.git';
  push('./build', remote, cb);
});
