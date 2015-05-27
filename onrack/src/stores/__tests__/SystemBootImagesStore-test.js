'use strict';
/* global describe, it, expect */
/* eslint-disable no-unused-expressions */

import SystemBootImagesStore from '../SystemBootImagesStore';

describe('SystemBootImagesStore', function() {

  it('can be instantiated', function() {
    var store = new SystemBootImagesStore();
    expect(store).to.be.ok;
  });

});
