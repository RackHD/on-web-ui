// Copyright 2015, EMC, Inc.
/* global describe, it, expect, before, after, beforeEach */
/* eslint-disable prefer-arrow-callback */

import React from 'react';
import { findDOMNode } from 'react-dom';

import TestWrapper from 'src-common/views/TestWrapper';
import GraphCanvas from '../GraphCanvas';
import Vector from '../../lib/Vector';

let props = {
  x: 0,
  y: 0,
  scale: 1,
  worldWidth: 240,
  worldHeight: 200,
  viewWidth: 120,
  viewHeight: 100
};

describe('GraphCanvas', function() {
  this.timeout(5000);

  describe('component', function() {
    before(function(done) {
      let handler = (err, component) => {
        this.subject = component;
        this.element = findDOMNode(this.subject);
        done(err);
      };
      this.wrapper = TestWrapper.testRender(GraphCanvas, props, handler);
    });

    after(function(done) {
      this.timeout(1000);
      setTimeout(() => this.wrapper.cleanup(done), 500);
    });

    it('can be rendered', function () {
      expect(this.wrapper).to.be.ok;
      expect(this.subject).to.be.ok;
      expect(this.element).to.be.ok;
    });
  });

  describe('coordinates', function() {
    beforeEach(function() {
      this.subject = new GraphCanvas(props);
    });

    it('should have a screen size', function() {
      expect(this.subject.viewSize).to.be.an.instanceof(Vector);
      this.subject.viewSize.x.should.equal(props.viewWidth);
      this.subject.viewSize.y.should.equal(props.viewHeight);
    });

    it('should have a world size', function() {
      expect(this.subject.worldSize).to.be.an.instanceof(Vector);
      this.subject.worldSize.x.should.equal(props.worldWidth);
      this.subject.worldSize.y.should.equal(props.worldHeight);
    });

    it('should have a screen position', function() {
      expect(this.subject.position).to.be.an.instanceof(Vector);
      this.subject.position.x.should.equal(0);
      this.subject.position.y.should.equal(0);
    });

    it('should be able to convert betwen world space and screen space', function() {
      let a = new Vector(5, 5),
          w = this.subject.worldSpaceTransform,
          v = this.subject.viewSpaceTransform;
      let b = a.transform(w),
          c = a.transform(v);
      b.x.should.equal(-55);
      b.y.should.equal(-45);
      c.x.should.equal(65);
      c.y.should.equal(55);
    });
  });

});
