'use strict';
/* global jest, describe, it, expect */

import React from 'react/addons';
var { TestUtils } = React.addons;

// TODO: auto mocking is not working properly.
//       jest is not correctly mocking react components.
jest.autoMockOff();
// jest.mock('../AppHeader');

var App = require('../App');

describe('App', function() {

  it('can be rendered into a viewport with a header, content, and footer.', function() {
    var appComponent = TestUtils.renderIntoDocument(
      React.createElement(App, {
        headerOverride: <div className="header">No header.</div>,
        currentView: 'No content.'
      })
    );

    var appElement = TestUtils.findRenderedDOMComponentWithClass(appComponent, 'App'),
        headerElement = TestUtils.findRenderedDOMComponentWithClass(appComponent, 'header'),
        contentElement = TestUtils.findRenderedDOMComponentWithClass(appComponent, 'content'),
        footerElement = TestUtils.findRenderedDOMComponentWithClass(appComponent, 'footer');

    expect(appElement).toBeDefined();
    expect(headerElement).toBeDefined();
    expect(contentElement).toBeDefined();
    expect(footerElement).toBeDefined();

    expect(appComponent.state.viewport).toEqual(appComponent.props.initialViewport);
  });

});
