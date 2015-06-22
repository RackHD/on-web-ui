'use strict';
/* global describe, it, expect, beforeEach */

import <%= file %> from '../<%= file %>';

describe('<%= file %>', function() {

  beforeEach(function() {
    this.subject = <%= name %>();
  });

  it('should be ok', function() {
    export(this.subject).to.be.ok;
  });

});
