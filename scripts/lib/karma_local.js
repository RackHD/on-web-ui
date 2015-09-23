// Copyright 2015, EMC, Inc.

'use strict';

var path = require('path');

var webpackBundler = require('./webpack_bundler');

var baseDir = path.join(__dirname, '..', '..');

module.exports = function (config) {
  var webpackConfig = webpackBundler.baseConfig();
  webpackConfig.output = null;

  var testsEntryPath = path.join(baseDir, 'scripts', 'test', 'webpack_requires.js'),
      preprocessors = {};

  // preprocess with webpack and our sourcemap loader
  preprocessors[testsEntryPath] = [ 'webpack', 'sourcemap' ];

  config.set({
    plugins: [
      'karma-mocha',
      'karma-webpack',
      'karma-sourcemap-loader',
      'karma-chrome-launcher',
      'karma-firefox-launcher'
    ],
    autoWatch: true,
    browsers: [ 'Chrome' ],
    // captureTimeout: 60000,
    // browserDisconnectTimeout: 5000,
    // browserNoActivityTimeout: 30000,
    singleRun: false,
    frameworks: [ 'mocha' ],
    files: [
      { pattern: testsEntryPath,
        watched: true,
        included: true,
        serverd: true },
      { pattern: path.join(baseDir, 'apps', '**', '*.js'),
        watched: true,
        included: false,
        served: false }
    ],
    preprocessors: preprocessors,
    logLevel: config.LOG_DEBUG,
    reporters: [ 'dots' ], // report results in this format
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true // less logging
    },
    client: {
      mocha: {
        reporter: 'html'
      }
    }
  });
};
