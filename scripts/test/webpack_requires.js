'use strict';
require('./bootsrap');

var common = require.context('../../common/', true, /-test\.js$/);
common.keys().forEach(common);

var apps = require.context('../../apps/', true, /-test\.js$/);
apps.keys().forEach(apps);
