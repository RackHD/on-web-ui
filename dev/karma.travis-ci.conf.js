// Copyright 2015, EMC, Inc.

'use strict';

exports = module.exports = require('./lib/karma_ci');

exports.browsers = exports.browsers.filter(browser => browser !== 'Chrome');
exports.plugins = exports.plugins.filter(plugin => plugin !== 'karma-chrome-launcher');
