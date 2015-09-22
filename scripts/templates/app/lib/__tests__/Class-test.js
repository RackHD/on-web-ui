// Copyright 2015, EMC, Inc.

'use strict';
/* global describe, it, expect, beforeEach */

import <%= file %> from '../<%= file %>';

describe('<%= file %>', function() {

  beforeEach(function() {
    this.subject = new <%= name %>();
  });

  it('should be ok', function() {
    export(this.subject).to.be.ok;
    export(this.subject.property).to.be.ok;
    export(this.subject.method()).to.be.ok;
  });

});
