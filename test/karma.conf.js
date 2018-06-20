// Copyright 2015, EMC, Inc.

const webpack = require('../webpack.config.babel.js');

// Fixes error from chai-spies.
global.chai = require('chai');

module.exports = (config) => {
  config.set({
    plugins: [
      'karma-chai-spies',
      'karma-chai',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-junit-reporter',
      'karma-mocha-reporter',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack'
    ],

    autoWatch: true,

    basePath: '../',

    client: {
      mocha: {
        reporter: 'html'
      }
    },

    frameworks: ['mocha', 'chai-spies', 'chai'],
    reporters: ['mocha'],

    browsers: ['Chrome', 'Firefox'],

    singleRun: false,

    files: [
      'test/src/unit_tests.js'
    ],

    preprocessors: {
      'test/src/**/*.js': ['webpack'],
      'src/**/*.js': ['webpack'],
      '**/*.js': ['sourcemap']
    },

    webpack,

    webpackMiddleware: { noInfo: true }
  });
};
