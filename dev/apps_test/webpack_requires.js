// Copyright 2015, EMC, Inc.
'use strict';
require('./bootsrap');
var apps = require.context('../../apps/', true, /-test\.js$/);
apps.keys().forEach(apps);
