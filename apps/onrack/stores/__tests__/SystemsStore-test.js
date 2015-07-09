'use strict';
/* global describe, it, expect */
/* eslint-disable no-unused-expressions */

import SystemsStore from '../SystemsStore';

describe('SystemsStore', function() {
  this.timeout(5000);

  it('can be instantiated', function() {
    var store = new SystemsStore();
    expect(store).to.be.ok;
  });

});
