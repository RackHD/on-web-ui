'use strict';
/* global describe, it, expect */
/* eslint-disable no-unused-expressions */

var SystemsStore = require('../SystemsStore');

describe('SystemsStore', function() {

  it('can be instantiated', function() {
    var store = new SystemsStore();
    expect(store).to.be.ok;
  });

});
