'use strict';

process.on('uncaughtException', console.error.bind(console));

global.gulp = require('gulp');
global.path = require('path');

global.parameters = require('./scripts/lib/parameters')(2);

require('./scripts/templates/app');
require('./scripts/templates/asset');
require('./scripts/templates/code');
require('./scripts/templates/config');
require('./scripts/templates/less');
require('./scripts/templates/messenger');
require('./scripts/templates/mixin');
require('./scripts/templates/readme');
require('./scripts/templates/store');
require('./scripts/templates/view');
