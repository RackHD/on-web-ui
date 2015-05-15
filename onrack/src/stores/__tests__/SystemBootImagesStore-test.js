'use strict';
/* global jest, describe, it, expect */

jest.autoMockOff();

var SystemBootImagesStore = require('../SystemBootImagesStore');

describe('SystemBootImagesStore', function() {

  it('can be instantiated', function() {
    var store = new SystemBootImagesStore();
    expect(store).toBeDefined();
  });

});
