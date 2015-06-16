'use strict';

var minimist = require('minimist');

module.exports = function(slice) {
  slice = slice || 1;
  var argv = minimist(process.argv.slice(slice)),
      params = {argv: argv};

  // Settings
  params.RELEASE = !!argv.release; // Minimize and optimize during a build?

  return params;
};
