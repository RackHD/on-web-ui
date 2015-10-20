// Copyright 2015, EMC, Inc.

'use strict';

var fs = require('fs'),
    path = require('path');

module.exports = function getFolders(dir) {
  return fs.readdirSync(dir).filter(function(file) {
    return fs.statSync(path.join(dir, file)).isDirectory();
  });
};
