'use strict';
/* global describe, it, expect, before, after */
/* eslint-disable no-unused-expressions */

import React from 'react'; // eslint-disable-line no-unused-vars
import { addons } from 'react/addons';
var { TestUtils } = addons;

import TestWrapper from 'common-web-ui/views/TestWrapper';
import App from '../App';

describe('OnRack App', function() {

  describe('component', function() {
    before(function(done) {
      this.wrapper = TestWrapper.testRender(App, {
        headerOverride: <div className="header">No header.</div>,
        currentView: 'No content.'
      }, (err, component) => {
        this.app = component;
        done(err);
      }, true);
    });

    after(function(done) {
      this.wrapper.cleanup(done);
    });

    it('can be rendered.', function() {
      expect(this.wrapper).to.be.ok;
      expect(this.app).to.be.ok;
      expect(TestUtils.findRenderedDOMComponentWithClass(
        this.app, 'App')).to.be.ok;
    });

    it('has a header', function() {
      expect(TestUtils.findRenderedDOMComponentWithClass(
        this.app, 'header')).to.be.ok;
    });

    it('has content', function() {
      expect(TestUtils.findRenderedDOMComponentWithClass(
        this.app, 'content')).to.be.ok;
    });

    it('has a footer', function() {
      expect(TestUtils.findRenderedDOMComponentWithClass(
        this.app, 'footer')).to.be.ok;
    });

    xit('viewport', function() {
      expect(this.app.state.viewport).to.equal(this.app.props.initialViewport);
    });
  });

});
