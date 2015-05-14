'use strict';
/* global jest, describe, it, expect */

import React from 'react/addons';
var { TestUtils } = React.addons;

// TODO: auto mocking is not working properly.
//       jest is not correctly mocking react components.
jest.autoMockOff();

var UserLogin = require('../UserLogin');

describe('UserLogin', function() {

  it('can be rendered.', function() {
    var userLogin = TestUtils.renderIntoDocument(
      React.createElement(UserLogin, {})
    );

    var userLoginElem = TestUtils.findRenderedDOMComponentWithClass(userLogin, 'UserLogin');

    expect(userLogin).toBeDefined();
    expect(userLoginElem).toBeDefined();
  });

});
