// Copyright 2015, EMC, Inc.
/* global describe, it, expect, before, after */
/* eslint-disable prefer-arrow-callback */

import React from 'react';

import TestWrapper from '../TestWrapper';
import UserLogin from '../UserLogin';

describe('UserLogin', function() {
  this.timeout(5000);

  describe('component', function() {
    before(function(done) {
      this.wrapper = TestWrapper.testRender(UserLogin, {}, (err, component) => {
        this.userLogin = component;
        done(err);
      });
    });

    after(function(done) {
      this.timeout(500);
      setTimeout(() => this.wrapper.cleanup(done), 100);
    });

    it('can be rendered.', function() {
      expect(this.wrapper).to.be.ok;
      expect(this.userLogin).to.be.ok;
      // expect(TestUtils.findRenderedDOMComponentWithClass(
      //   this.userLogin, 'UserLogin')).to.be.ok;
    });
  });

});
