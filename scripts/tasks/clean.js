// Copyright 2015, EMC, Inc.

'use strict';
/* global gulp */

var del = require('del');

// Clean output directory
gulp.task('clean',
  del.bind(null,
    ['.tmp', 'build/*', '!build/.git'],
    {dot: true}
));
