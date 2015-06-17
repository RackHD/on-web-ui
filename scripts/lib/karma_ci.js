'use strict';

var karmaBaseConfig = require('./karma_local');

module.exports = function (config) {
  karmaBaseConfig(config);

  config.set({
    autoWatch: false,
    browsers: [ 'Chrome' ],
    singleRun: true
  });
};
