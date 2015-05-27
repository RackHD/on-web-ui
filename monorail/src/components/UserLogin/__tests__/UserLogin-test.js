'use strict';
/* global describe, it, expect, before, after */
/* eslint-disable no-unused-expressions */

import React from 'react'; // eslint-disable-line no-unused-vars
import TestUtils from 'react/addons/TestUtils';

import TestWrapper from 'common-web-ui/components/TestWrapper';
import UserLogin from '../UserLogin';

describe('UserLogin', function() {

  describe('component', function() {
    before(function(done) {
      this.wrapper = TestWrapper.testRender(UserLogin, {}, (err, component) => {
        this.userLogin = component;
        done(err);
      });
    });

    after(function(done) {
      this.wrapper.cleanup(done);
    });

    it('can be rendered.', function() {
      expect(this.wrapper).to.be.ok;
      expect(this.userLogin).to.be.ok;
      expect(TestUtils.findRenderedDOMComponentWithClass(
        this.userLogin, 'UserLogin')).to.be.ok;
    });
  });

});
