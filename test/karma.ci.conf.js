// Copyright 2015, EMC, Inc.

const karmaConf = require('./karma.conf');

module.exports = config => {
  karmaConf(config);

  config.set({
    plugins: config.plugins.concat([
      'karma-junit-reporter'
    ]),

    autoWatch: false,

    browsers: [ 'Chrome', 'Firefox' ],

    singleRun: true,

    reporters: [ 'mocha', 'junit' ],

    junitReporter: {
      outputFile: '../xunit.xml'
    }
  });
};
