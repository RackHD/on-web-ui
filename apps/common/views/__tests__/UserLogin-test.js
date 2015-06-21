'use strict';
/* global describe, it, expect, before, after */
/* eslint-disable no-unused-expressions */

import React from 'react'; // eslint-disable-line no-unused-vars
import { addons } from 'react/addons';
var { TestUtils } = addons;

import TestWrapper from 'common-web-ui/views/TestWrapper';
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
      this.timeout(200);
      setTimeout(() => this.wrapper.cleanup(done), 100);
    });

    it('can be rendered.', function() {
      expect(this.wrapper).to.be.ok;
      expect(this.userLogin).to.be.ok;
      expect(TestUtils.findRenderedDOMComponentWithClass(
        this.userLogin, 'UserLogin')).to.be.ok;
    });
  });

});
