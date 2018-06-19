// Copyright 2015, EMC, Inc.
/* global describe, it, expect, beforeEach */
/* eslint-disable prefer-arrow-callback */

import Matrix from '../Matrix';

describe('GC: Matrix', function() {
  beforeEach(function() {
    this.subject = new Matrix(0, 1, 2, 3, 4, 5);
  });

  it('has six values', function() {
    expect(this.subject[0]).to.equal(0);
    expect(this.subject[1]).to.equal(1);
    expect(this.subject[2]).to.equal(2);
    expect(this.subject[3]).to.equal(3);
    expect(this.subject[4]).to.equal(4);
    expect(this.subject[5]).to.equal(5);
    expect(this.subject.length).to.equal(6);
  });

  it('has an a, b, c, d, tx, and ty', function() {
    expect(this.subject.a).to.equal(this.subject[0]);
    expect(this.subject.b).to.equal(this.subject[1]);
    expect(this.subject.c).to.equal(this.subject[2]);
    expect(this.subject.d).to.equal(this.subject[3]);
    expect(this.subject.tx).to.equal(this.subject[4]);
    expect(this.subject.ty).to.equal(this.subject[5]);
  });

  it('can be cloned', function() {
    let clone = this.subject.clone();
    expect(this.subject).to.not.equal(clone);
    expect(this.subject.a).to.equal(clone.a);
    expect(this.subject.b).to.equal(clone.b);
    expect(this.subject.c).to.equal(clone.c);
    expect(this.subject.d).to.equal(clone.d);
    expect(this.subject.tx).to.equal(clone.tx);
    expect(this.subject.ty).to.equal(clone.ty);
  });
});
