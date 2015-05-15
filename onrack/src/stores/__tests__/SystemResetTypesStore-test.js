'use strict';
/* global jest, describe, it, expect */

jest.autoMockOff();

var SystemResetTypesStore = require('../SystemResetTypesStore');

describe('SystemResetTypesStore', function() {

  it('can be instantiated', function() {
    var store = new SystemResetTypesStore();
    expect(store).toBeDefined();
  });

});
