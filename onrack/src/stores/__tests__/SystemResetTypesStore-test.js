'use strict';
/* global describe, it, expect */
/* eslint-disable no-unused-expressions */

var SystemResetTypesStore = require('../SystemResetTypesStore');

describe('SystemResetTypesStore', function() {

  it('can be instantiated', function() {
    var store = new SystemResetTypesStore();
    expect(store).to.be.ok;
  });

});
