// Copyright 2015, EMC, Inc.

'use strict';

// https://github.com/ai/autoprefixer
exports.browsers = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

exports.loader = '!autoprefixer-loader?{browsers:[' + [
  '"Android 2.3"',
  '"Android >= 4"',
  '"Chrome >= 20"',
  '"Firefox >= 24"',
  '"Explorer >= 8"',
  '"iOS >= 6"',
  '"Opera >= 12"',
  '"Safari >= 6"'
].join(', ') + ']}';
