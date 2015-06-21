'use strict';

import merge from 'lodash/object/merge';
import featureFlags from 'common-web-ui/lib/featureFlag';

import defaults from './defaults.json';

let custom;
try { custom = require('./custom.json'); } catch (err) { custom = {}; }

if (window.config) { console.warn(new Error('Existing config will be overwritten.').stack); }
window.config = exports;
merge(exports, defaults, custom);

let flags = {};
Object.keys(exports).forEach(flag =>
  flags[flag] = featureFlags(flag, exports));
exports.flags = flags;
