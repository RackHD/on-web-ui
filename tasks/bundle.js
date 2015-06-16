'use strict';
/* global gulp, path */

var async = require('async'),
    gulpUtil = require('gulp-util'),
    webpack = require('webpack');

var getFolders = require('./lib/getFolders'),
    webpackBundler = require('../config/webpack_bundler');

// Bundle
gulp.task('bundle', function (done) {
  var bundles = getFolders(path.join(__dirname, '..', 'apps'));

  bundles = bundles.map(function (appName) {
    return createBundle.bind(null, appName); // eslint-disable-line no-use-before-define
  });

  async.parallel(bundles, done);
});

function createBundle(appName, callback) {
  var bundle = webpack(webpackBundler({appName: appName})),
      started = false;

  function handler(err, stats) {
    if (err) {
      return callback(new gulpUtil.PluginError('webpack', err));
    }

    if (global.parameters.argv.verbose) {
      gulpUtil.log('[webpack ' + appName + ']', stats.toString({colors: true}));
    }

    if (!started) {
      started = true;
      return callback();
    }
  }

  if (global.watch) {
    bundle.watch(200, handler);
  }

  else {
    bundle.run(handler);
  }
}
