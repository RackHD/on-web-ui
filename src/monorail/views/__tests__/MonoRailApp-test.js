// Copyright 2015, EMC, Inc.
/* global describe, it, expect, before, after */
/* eslint-disable prefer-arrow-callback */

import React from 'react';
import { findDOMNode } from 'react-dom';

import TestWrapper from 'src-common/views/TestWrapper';
import App from '../MonoRailApp';

describe('MonoRail App', function() {
  this.timeout(5000);

  describe('component', function() {
    before(function(done) {
      this.wrapper = TestWrapper.testRender(App, {
        children: 'No content'
      }, (err, component) => {
        this.subject = component;
        done(err);
      }, true);
    });

    after(function(done) {
      this.wrapper.cleanup(done);
    });

    it('can be rendered.', function() {
      expect(this.wrapper).to.be.ok;
      expect(this.subject).to.be.ok;
      expect(findDOMNode(this.subject)).to.be.ok;
    });
  });

});
