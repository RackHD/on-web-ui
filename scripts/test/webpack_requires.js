'use strict';
require('./bootsrap');

var apps = require.context('../../apps/', true, /-test\.js$/);
apps.keys().forEach(apps);
