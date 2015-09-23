// Copyright 2015, EMC, Inc.

'use strict';
/* global describe, it, expect */
/* eslint-disable no-unused-expressions */

import ChassisStore from '../ChassisStore';

describe('ChassisStore', function() {
  this.timeout(5000);

  it('can be instantiated', function() {
    var store = new ChassisStore();
    expect(store).to.be.ok;
  });

});
