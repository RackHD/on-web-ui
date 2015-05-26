'use strict';
/* global describe, it, expect */
/* eslint-disable no-unused-expressions */

import React from 'react/addons';
var { TestUtils } = React.addons;

var UserLogin = require('../UserLogin');

describe('UserLogin', function() {

  it('can be rendered.', function() {
    var userLogin = TestUtils.renderIntoDocument(
      React.createElement(UserLogin, {})
    );

    var userLoginElem = TestUtils.findRenderedDOMComponentWithClass(userLogin, 'UserLogin');

    expect(userLogin).to.be.ok;
    expect(userLoginElem).to.be.ok;
  });

});
