// Copyright 2016, EMC, Inc.
/* global describe, it, expect, before, after */
/* eslint-disable prefer-arrow-callback */

describe('Dashboard', function() {
  this.timeout(2500);

  before(function(done) {
    window.location.hash = '#/mc/dashboard';
    const check = () => {
      let dashboardContainer = document.querySelector('.Dashboard'),
          managementConsoleContainer = document.querySelector('.ManagementConsole');
      if (dashboardContainer && managementConsoleContainer) return done();
      setTimeout(check, 50);
    };
    check();
  });

  after(function(done) {
    done();
  });

  it('is ok', function() {
    expect(true).to.be.ok;
  });
});
