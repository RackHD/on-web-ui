'use strict';
/* global jest, describe, it, expect */

jest.autoMockOff();

var SystemsStore = require('../SystemsStore');

describe('SystemsStore', function() {

  it('can be instantiated', function() {
    var store = new SystemsStore();
    expect(store).toBeDefined();
  });

});
