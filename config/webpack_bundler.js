'use strict';

var _ = require('lodash'),
    path = require('path'),
    webpack = require('webpack');

var params = global.parameters || require('./parameters')(1),
    DEBUG = !params.RELEASE;

var AUTOPREFIXER_LOADER = require('./autoprefixer').loader;

var GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  '__DEV__': DEBUG
};

// Returns client and server bundlers.

exports = module.exports = function (options) {
  options = options || {};
  return [
    exports.clientConfig(options.client, options)//,
    // exports.serverConfig(options.server, options)
  ];
};

//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

exports.baseConfig = function (options) {
  options = options || {};

  var autoprefixer = '';//options.hasOwnProperty('autoprefixer') ?
    // (options.autoprefixer || '') : AUTOPREFIXER_LOADER;

  var modulesDir = options.modulesDir ||
    path.join(__dirname, '..', 'node_modules');

  var outputPath = options.outputPath ||
    path.join(__dirname, '..', 'build', options.appName || '', '');

  return {
    output: {
      path: outputPath,
      publicPath: './',
      sourcePrefix: '  '
    },

    cache: DEBUG,
    debug: DEBUG,
    devtool: DEBUG ? '#inline-source-map' : false,

    stats: {
      colors: true,
      reasons: DEBUG
    },

    plugins: [
      new webpack.optimize.OccurenceOrderPlugin()
    ],

    resolve: {
      fallback: modulesDir,
      modulesDirectories: ['node_modules'],
      extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
    },

    resolveLoader: {
      fallback: modulesDir
    },

    module: {
      preLoaders: [
        { test: /\.js$/,
          loader: 'eslint-loader', exclude: /node_modules/ }
      ],

      loaders: [
        { test: /\.css$/,
          loader: 'style-loader!css-loader' + autoprefixer },
        { test: /\.less$/,
          loader: 'style-loader!css-loader' + autoprefixer + '!less-loader' },
        { test: /\.gif/,
          loader: 'url-loader?limit=10000&mimetype=image/gif' },
        { test: /\.jpg/,
          loader: 'url-loader?limit=10000&mimetype=image/jpg' },
        { test: /\.png/,
          loader: 'url-loader?limit=10000&mimetype=image/png' },
        { test: /\.svg/,
          loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
        { test: /\.jsx?$/,
          loader: 'babel-loader', exclude: /node_modules/ }
      ]
    }
  };
};

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------

exports.clientConfig = function (overrides, options) {
  var baseConfig = exports.baseConfig(options),
      localGlobals = _.merge(GLOBALS, {'__SERVER__': false}),
      globalsPlugin = new webpack.DefinePlugin(localGlobals);

  return _.merge({}, baseConfig, {
    entry: './apps/' + options.appName + '/client.js',
    output: {
      filename: 'client.js'
    },
    plugins: baseConfig.plugins.concat([globalsPlugin].concat(DEBUG ? [] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
    ]))
  }, overrides);
};

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

// exports.serverConfig = function (overrides, options) {
//   var baseConfig = exports.baseConfig(options),
//       localGlobals = _.merge(GLOBALS, {'__SERVER__': true}),
//       globalsPlugin = new webpack.DefinePlugin(localGlobals);
//
//   return _.merge({}, baseConfig, {
//     entry: './apps/' + options.appName + '/src/server.js',
//     output: {
//       filename: 'server.js',
//       libraryTarget: 'commonjs2'
//     },
//     target: 'node',
//     externals: /^[a-z][a-z\.\-0-9]*$/,
//     node: {
//       console: false,
//       global: false,
//       process: false,
//       Buffer: false,
//       __filename: false,
//       __dirname: false
//     },
//     plugins: baseConfig.plugins.concat(globalsPlugin),
//     module: {
//       loaders: baseConfig.module.loaders.map(function(loader) {
//         // Remove style-loader
//         return _.merge(loader, {
//           loader: loader.loader = loader.loader.replace('style-loader!', '')
//         });
//       })
//     }
//   }, overrides);
// };
