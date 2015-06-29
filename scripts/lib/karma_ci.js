'use strict';

var karmaBaseConfig = require('./karma_local');

module.exports = function (config) {
  karmaBaseConfig(config);

  config.set({
    plugins: config.plugins.concat([
      'karma-junit-reporter'
    ]),
    autoWatch: false,
    browsers: [ 'Chrome', 'Firefox' ],
    singleRun: true,
    reporters: [ 'dots', 'junit' ], // report results in this format
    junitReporter: {
      outputFile: 'xunit.xml'
    }
  });
};
