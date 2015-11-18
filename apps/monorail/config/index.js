// Copyright 2015, EMC, Inc.

'use strict';

import merge from 'lodash/object/merge';

import defaults from './defaults.json';

let custom;
try { custom = require('./custom.json'); } catch (err) { custom = {}; }

merge(exports, defaults, custom);
