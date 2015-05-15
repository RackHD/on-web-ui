'use strict';
/* global jest, describe, it, expect */

jest.autoMockOff();

var ChassisStore = require('../ChassisStore');

describe('ChassisStore', function() {

  it('can be instantiated', function() {
    var store = new ChassisStore();
    expect(store).toBeDefined();
  });

});
