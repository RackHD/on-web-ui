'use strict';

var webpack = require('webpack');

module.exports = function (config) {
  config.set({
    autoWatch: false,
    browsers: [ 'Chrome' ],
    // captureTimeout: 60000,
    // browserDisconnectTimeout: 5000,
    // browserNoActivityTimeout: 30000,
    singleRun: true,
    frameworks: [ 'mocha' ],
    files: [
      { pattern: 'tests.webpack.js', watched: false, included: true, serverd: true },
      { pattern: 'common/**/*.js', watched: true, included: false, served: false },
      { pattern: 'monorail/src/**/*.js', watched: true, included: false, served: false },
      { pattern: 'onrack/src/**/*.js', watched: true, included: false, served: false }
    ],
    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ] //preprocess with webpack and our sourcemap loader
    },
    logLevel: config.LOG_DEBUG,
    reporters: [ 'dots' ], // report results in this format
    webpack: { // kind of a copy of webpack config files
      cache: true,
      debug: true,
      devtool: '#inline-source-map',
      stats: { colors: true, reasons: true },
      plugins: [ new webpack.optimize.OccurenceOrderPlugin() ],
      resolve: { extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx'] },
      module: {
        preLoaders: [
          { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
        ],
        loaders: [
          { test: /\.css$/, loader: 'style-loader!css-loader' },
          { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
          { test: /\.gif/, loader: 'url-loader?limit=10000&mimetype=image/gif' },
          { test: /\.jpg/, loader: 'url-loader?limit=10000&mimetype=image/jpg' },
          { test: /\.png/, loader: 'url-loader?limit=10000&mimetype=image/png' },
          { test: /\.svg/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
          { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ }
        ]
      }
    },
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
