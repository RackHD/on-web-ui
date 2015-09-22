// Copyright 2015, EMC, Inc.

'use strict';
/* global describe, it, expect */
/* eslint-disable no-unused-expressions */

import SystemResetTypesStore from '../SystemResetTypesStore';

describe('SystemResetTypesStore', function() {
  this.timeout(5000);

  it('can be instantiated', function() {
    var store = new SystemResetTypesStore();
    expect(store).to.be.ok;
  });

});
