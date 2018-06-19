// Copyright 2015, EMC, Inc.

import './bootsrap';

global.isUnitTesting = true;

const src = require.context('../../src/', true, /-test\.js$/);
src.keys().forEach(src);
