// Copyright 2015, EMC, Inc.
/* global describe, it, expect, before, after */
/* eslint-disable prefer-arrow-callback */

import React from 'react';
import { findDOMNode } from 'react-dom';

import TestWrapper from '../TestWrapper';
import Console from '../Console';

xdescribe('Console', function() {
  this.timeout(5000);

  describe('component', function() {

    before(function(done) {
      this.wrapper = TestWrapper.testRender(Console, {}, (err, component) => {
        this.console = component;
        done(err);
      }, true);
    });

    after(function(done) {
      this.timeout(500);
      setTimeout(() => this.wrapper.cleanup(done), 100);
    });

    it('can be rendered.', function() {
      expect(this.wrapper).to.be.ok;
      expect(this.console).to.be.ok;
    });

    describe('rows', function () {

      it('can be appened', function () {
        this.console.state.rows.length.should.equal(0);
        this.console.addRows(['a', 'b', 'c']);
        this.console.state.rows.length.should.equal(3);
        let element = findDOMNode(this.console);
        element.childNodes.length.should.equal(2);
        element.childNodes[1].childNodes.length.should.equal(3);
      });

    });

  });

});
