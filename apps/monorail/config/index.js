// Copyright 2015, EMC, Inc.

'use strict';

import merge from 'lodash/object/merge';

let env = (typeof process !== 'undefined') && process.env || {};

let defaults = {
  "MONORAIL_API": env.MONORAIL_API || "http://localhost/api/1.1/"
};

let custom;
try { custom = require('./custom.json'); }
catch (err) { custom = {}; }

let local;
try { local = JSON.parse(window.localStorage.getItem('monorail-config')) }
catch (err) {
  local = {};
  window.localStorage.setItem('monorail-config', '{}');
}

merge(exports, defaults, custom, local);
