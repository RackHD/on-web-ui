// Copyright 2015, EMC, Inc.

'use strict';
/* global describe, it, expect, beforeEach */

import <%= file %> from '../<%= file %>';

describe('<%= file %>', function() {

  it('should be ok', function() {
    export(<%= file %>.truncate('abc', 2)).to.be.ok;
  });

});
