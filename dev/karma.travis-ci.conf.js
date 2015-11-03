// Copyright 2015, EMC, Inc.

'use strict';

let karmaCI = require('./lib/karma_ci');

module.exports = function (config) {
  karmaCI(config);
  config.browsers = config.browsers.filter(browser => browser !== 'Chrome');
  config.plugins = config.plugins.filter(plugin => plugin !== 'karma-chrome-launcher');
};
