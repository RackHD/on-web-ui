// Copyright 2015, EMC, Inc.

'use strict';
/* global gulp, path */

var gulpUtil = require('gulp-util'),
    webpack = require('webpack');

var getFolders = require('../lib/getFolders'),
    webpackBundler = require('../lib/webpack_bundler');

var rootDir = path.join(__dirname, '..', '..');

// Bundle
gulp.task('bundle', function (done) {
  var bundles = getFolders(path.join(rootDir, 'apps'));

  var entry = {};

  bundles = bundles.map(function (appName) {
    entry[appName] = path.join(rootDir, 'apps', appName, 'bundle.js');
  });

  createBundle(// eslint-disable-line no-use-before-define
    webpackBundler({
      entry: entry,
      commonsChunkPlugins: [
        new webpack.optimize.CommonsChunkPlugin('common', 'common.js')
      ]
    }),
    done);
});

function createBundle(config, callback) {
  var bundle = webpack(config),
      started = false;

  function handler(err, stats) {
    if (err) {
      return callback(new gulpUtil.PluginError('webpack', err));
    }

    if (global.parameters.argv.verbose) {
      gulpUtil.log('[webpack]', stats.toString({
        colors: true,
        chunks: false
      }));
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
