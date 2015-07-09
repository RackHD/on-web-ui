'use strict';
/* global describe, it, expect, before, after */
/* eslint-disable no-unused-expressions */

import React from 'react'; // eslint-disable-line no-unused-vars
import { addons } from 'react/addons';
var { TestUtils } = addons;

import TestWrapper from '../TestWrapper';
import Console from '../Console';

describe('Console', function() {
  this.timeout(5000);

  describe('component', function() {

    before(function(done) {
      this.wrapper = TestWrapper.testRender(Console, {}, (err, component) => {
        this.console = component;
        done(err);
      }, true);
    });

    after(function(done) {
      this.timeout(200);
      setTimeout(() => this.wrapper.cleanup(done), 100);
    });

    it('can be rendered.', function() {
      expect(this.wrapper).to.be.ok;
      expect(this.console).to.be.ok;
      expect(TestUtils.findRenderedDOMComponentWithClass(
        this.console, 'Console')).to.be.ok;
    });

    describe('rows', function () {

      it('can be appened', function () {
        this.console.state.rows.length.should.equal(0);
        this.console.addRows(['a', 'b', 'c']);
        this.console.state.rows.length.should.equal(3);
        var element = React.findDOMNode(this.console);
        element.childNodes.length.should.equal(3);
        element.childNodes[0].className.should.equal('ConsoleRow');
        element.childNodes[0].innerHTML.should.equal('a');
        element.childNodes[1].innerHTML.should.equal('b');
        element.childNodes[2].innerHTML.should.equal('c');
      });

    });

  });

});
