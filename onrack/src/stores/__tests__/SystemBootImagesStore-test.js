'use strict';
/* global describe, it, expect */
/* eslint-disable no-unused-expressions */

var SystemBootImagesStore = require('../SystemBootImagesStore');

describe('SystemBootImagesStore', function() {

  it('can be instantiated', function() {
    var store = new SystemBootImagesStore();
    expect(store).to.be.ok;
  });

});
