'use strict';

global.chaiSpies = require('chai-spies');
global.chai = require('chai');
global.chai.should();
global.chai.use(global.chaiSpies);
global.expect = global.chai.expect;

// Make sure you have your directory and regex test set correctly!

var common = require.context('./common/', true, /-test\.js$/);
common.keys().forEach(common);

var monorail = require.context('./monorail/src/', true, /-test\.js$/);
monorail.keys().forEach(monorail);

var onrack = require.context('./onrack/src/', true, /-test\.js$/);
onrack.keys().forEach(onrack);
