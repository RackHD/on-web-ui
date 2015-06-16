'use strict';
/* global gulp, path */

var browserSync = require('browser-sync');

// Launch BrowserSync development server
gulp.task('sync', ['serve'], function(cb) {
  global.browserSync = browserSync;

  browserSync({
    ui: {
      port: 3001,
      weinre: {
        port: 8080
      }
    },
    port: 3000,
    logPrefix: '',
    notify: false,
    // Run as an https by setting 'https: true'
    // NOTE: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    https: false,
    // Informs browser-sync to proxy our Express app which would run
    // at the following location
    proxy: 'localhost:5000'
  }, cb);

  process.on('exit', function() {
    browserSync.exit();
  });

  gulp.watch(['build/**/*.*'].concat(
    global.serverSrc ? ['!' + global.serverSrc] : []
  ), function(file) {
    browserSync.reload(path.relative(
      path.join(__dirname, '..', '..'),
      file.path
    ));
  });
});
