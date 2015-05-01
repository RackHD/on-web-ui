'use strict';/* global jest, describe, it, expect */

jest.dontMock('../App');

describe('App', function() {

  it('sets class name', function() {
    var React = require('react/addons');
    var TestUtils = React.addons.TestUtils;

    var App = require('../App');
    var Component = TestUtils.renderIntoDocument(React.createElement(App));

    var element = TestUtils.findRenderedDOMComponentWithClass(Component, 'App');
    expect(element).toBeDefined();
  });

});
