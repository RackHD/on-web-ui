// Copyright 2015, EMC, Inc.

const karmaConf = require('./karma.conf');

module.exports = (config) => {
  karmaConf(config);

  config.browsers = config.browsers.filter(browser => browser !== 'Firefox');
  config.plugins = config.plugins.filter(plugin => plugin !== 'karma-firefox-launcher');

  config.set({
    files: [
      'test/src/integration_specs.js'
    ]
  });
};
