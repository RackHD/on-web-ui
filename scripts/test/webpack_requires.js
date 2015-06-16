'use strict';
require('./bootsrap');

var common = require.context('../../common/', true, /-test\.js$/);
common.keys().forEach(common);

var monorail = require.context('../../apps/monorail/', true, /-test\.js$/);
monorail.keys().forEach(monorail);

var onrack = require.context('../../apps/onrack/', true, /-test\.js$/);
onrack.keys().forEach(onrack);
