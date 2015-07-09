'use strict';
/* global describe, it, expect, beforeEach */
/* eslint-disable no-unused-expressions */

import Rectangle from '../Rectangle';
import Graph from '../Graph';

import jsonGraph from './Graph-fixture';

describe('Graph', function() {
  this.timeout(5000);

  beforeEach(function() {
    this.subject = new Graph({
      bounds: new Rectangle(0, 0, 100, 100)
    });
  });

  describe('json', function() {
    beforeEach(function () {
      this.subject.json = jsonGraph;
    });

    it('can be set', function() {
      console.log(this.subject);
      expect(this.subject.nodes.length).to.be.ok;
      expect(this.subject.links.length).to.be.ok;
    });

    it('can be got', function() {
      var json = this.subject.json;
      expect(json.cache.nodes.length).to.be.ok;
      expect(json.cache.links.length).to.be.ok;
    });

    it('can associate links', function() {
      var links = this.subject.nodes[0].links;
      console.log(links);
      expect(links).to.be.ok;
    });
  });

});
