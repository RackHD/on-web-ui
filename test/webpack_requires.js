'use strict';
require('./bootsrap');

var common = require.context('../common/', true, /-test\.js$/);
common.keys().forEach(common);

var monorail = require.context('../monorail/src/', true, /-test\.js$/);
monorail.keys().forEach(monorail);

var onrack = require.context('../onrack/src/', true, /-test\.js$/);
onrack.keys().forEach(onrack);
