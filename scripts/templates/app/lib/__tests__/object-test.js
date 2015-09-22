// Copyright 2015, EMC, Inc.

'use strict';
/* global describe, it, expect, beforeEach */

import <%= file %> from '../<%= file %>';

describe('<%= file %>', function() {

  it('should be ok', function() {
    export(<%= file %>).to.be.ok;
    export(<%= file %>.property).to.be.ok;
    export(<%= file %>.method()).to.be.ok;
  });

});
