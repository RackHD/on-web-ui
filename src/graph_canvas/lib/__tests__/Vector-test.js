// Copyright 2015, EMC, Inc.
/* global describe, it, expect, beforeEach */
/* eslint-disable prefer-arrow-callback */

import Vector from '../Vector';

describe('GC: Vector', function() {
  beforeEach(function() {
    this.subject = new Vector(0, 1);
  });

  it('has two values', function() {
    expect(this.subject[0]).to.equal(0);
    expect(this.subject[1]).to.equal(1);
    expect(this.subject.length).to.equal(2);
  });

  it('has an x, and y', function() {
    expect(this.subject.x).to.equal(this.subject[0]);
    expect(this.subject.y).to.equal(this.subject[1]);
  });

  it('can be cloned', function() {
    let clone = this.subject.clone();
    expect(this.subject).to.not.equal(clone);
    expect(this.subject.x).to.equal(clone.x);
    expect(this.subject.y).to.equal(clone.y);
  });
});
