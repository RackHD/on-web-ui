// Copyright 2015, EMC, Inc.

'use strict';
/* global gulp, path */

var gulpUtil = require('gulp-util'),
    assign = require('lodash/object/assign'),
    cp = require('child_process');

// Launch a Node.js/Express server
gulp.task('serve', ['watch'], function(cb) {
  global.serverSrc = path.join('..', 'server', 'build_server.js');

  var started = false,
      server;

  function startup() {
    var child = cp.fork(global.serverSrc, {
      env: assign({NODE_ENV: 'development'}, process.env)
    });

    child.on('error', console.error.bind(console));

    child.once('message', function(message) {
      if (message.match(/^online$/)) {

        if (global.browserSync) {
          global.browserSync.reload();
        }

        if (!started) {
          started = true;

          gulp.watch(global.serverSrc, function() {
            gulpUtil.log('Restarting development server.');
            server.kill('SIGTERM');
            server = startup();
          });

          cb();
        }
      }
    });

    return child;
  }

  server = startup();

  process.on('exit', function() {
    server.kill('SIGTERM');
  });
});
