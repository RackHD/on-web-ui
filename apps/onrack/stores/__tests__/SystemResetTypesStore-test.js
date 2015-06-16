'use strict';
/* global describe, it, expect */
/* eslint-disable no-unused-expressions */

import SystemResetTypesStore from '../SystemResetTypesStore';

describe('SystemResetTypesStore', function() {

  it('can be instantiated', function() {
    var store = new SystemResetTypesStore();
    expect(store).to.be.ok;
  });

});
