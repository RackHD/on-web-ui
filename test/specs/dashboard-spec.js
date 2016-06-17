// Copyright 2016, EMC, Inc.
/* global describe, it, expect, before, after */
/* eslint-disable prefer-arrow-callback */

describe('Dashboard', function() {
  this.timeout(5000);

  before(function(done) {
    window.location.hash = '#/mc/dashboard';
    setTimeout(done, 50);
  });

  after(function(done) {
    done();
  });

  it('is ok', function() {
    let dashboardContainer = document.querySelector('.Dashboard');
    expect(dashboardContainer).to.be.ok;
  });
});
