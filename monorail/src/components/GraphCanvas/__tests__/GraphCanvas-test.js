'use strict';
/* global describe, it, expect, beforeEach */
/* eslint-disable no-unused-expressions */

import React from 'react';
import { addons } from 'react/addons';
var { TestUtils } = addons;

import GraphCanvas from '../GraphCanvas';
import Vector from '../lib/Vector';

var props = {
  worldWidth: 240,
  worldHeight: 200,
  screenWidth: 120,
  screenHeight: 100
};

describe('GraphCanvas', function() {

  it('can be rendered.', function() {
    var graphCanvas = TestUtils.renderIntoDocument(
      React.createElement(GraphCanvas, props));
    var graphCanvasElem =
      TestUtils.findRenderedDOMComponentWithClass(graphCanvas, 'GraphCanvas');
    expect(graphCanvas).to.be.ok;
    expect(graphCanvasElem).to.be.ok;
  });

  describe('coordinates', function() {
    beforeEach(function() {
      this.subject = new GraphCanvas(props);
    });

    it('should have a screen size', function() {
      expect(this.subject.screenSize).to.be.an.instanceof(Vector);
      this.subject.screenSize.x.should.equal(props.screenWidth);
      this.subject.screenSize.y.should.equal(props.screenHeight);
    });

    it('should have a world size', function() {
      expect(this.subject.worldSize).to.be.an.instanceof(Vector);
      this.subject.worldSize.x.should.equal(props.worldWidth);
      this.subject.worldSize.y.should.equal(props.worldHeight);
    });

    it('should have a screen position', function() {
      expect(this.subject.screenPosition).to.be.an.instanceof(Vector);
      this.subject.screenPosition.x.should.equal(0);
      this.subject.screenPosition.y.should.equal(0);
    });

    it('should have a world position', function() {
      expect(this.subject.worldPosition).to.be.an.instanceof(Vector);
      this.subject.worldPosition.x.should.equal(-60);
      this.subject.worldPosition.y.should.equal(-50);
    });

    it('should be able to convert betwen world space and screen space', function() {
      var a = new Vector(5, 5),
          b = a.transform(this.subject.worldSpaceTransform),
          c = a.transform(this.subject.screenSpaceTransform);
      b.x.should.equal(-55);
      b.y.should.equal(-45);
      c.x.should.equal(65);
      c.y.should.equal(55);
    });
  });

});
