// Copyright 2015, EMC, Inc.
/* global describe, it, expect */
/* eslint-disable prefer-arrow-callback */

import generateId from '../generateId';

describe('GC: generateId', function() {
  it('returns a string', function() {
    expect(generateId()).to.be.a.string;
  });

  it('returns a different value every time', function() {
    let list = [
      generateId(), generateId(), generateId(), generateId(),
      generateId(), generateId(), generateId(), generateId(),
      generateId(), generateId(), generateId(), generateId()
    ];
    let id;
    while ((id = list.pop())) {
      list.forEach(other => expect(id).to.not.equal(other));
    }
  });
});
