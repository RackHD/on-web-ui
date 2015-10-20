// Copyright 2015, EMC, Inc.

'use strict';

const ellipsis = '\u2026';

export default {

  truncate: (val, size) => {
    size = size / 2;
    return val.substring(0, size) + ellipsis +
           val.substring(val.length - size, val.length);
  }

};
