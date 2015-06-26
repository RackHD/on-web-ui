'use strict';

global.isTesting = true;

global.chaiSpies = require('chai-spies');
global.chai = require('chai');
global.chai.should();
global.chai.use(global.chaiSpies);

global.expect = global.chai.expect;

global.React = global.React || require('react');
