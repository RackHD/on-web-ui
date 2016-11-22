// Copyright 2015, EMC, Inc.

import chaiSpies from 'chai-spies';
import chai from 'chai';
import React from 'react';
import reactDom from 'react-dom';

global.chaiSpies = chaiSpies;

global.chai = chai;
global.expect = chai.expect;
chai.should();
chai.use(global.chaiSpies);

global.React = global.React || React;
global.reactDom = reactDom;
