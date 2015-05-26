'use strict';
/* global describe, it, expect */
/* eslint-disable no-unused-expressions */

var ChassisStore = require('../ChassisStore');

describe('ChassisStore', function() {

  it('can be instantiated', function() {
    var store = new ChassisStore();
    expect(store).to.be.ok;
  });

});
