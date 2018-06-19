// Copyright 2015, EMC, Inc.

import merge from 'lodash/merge';

let env = (typeof process !== 'undefined') && process.env || {};

let defaults = require('./defaults.json');

let custom;
try { custom = require('./custom.json'); }
catch (err) { custom = {}; }

let local = {};
Object.keys(defaults).forEach(key => {
  let value = window.localStorage.getItem(key);
  if (value) {
    local[key] = value;
  }
});

merge(exports, defaults, custom, local);

exports.check = function (property, target='true') {
  return this[property] === target;
};
