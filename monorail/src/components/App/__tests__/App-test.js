'use strict';
/* global describe, it, expect */
/* eslint-disable no-unused-expressions */

import React from 'react';
import TestUtils from 'react/addons/TestUtils';

import App from '../App';

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

    expect(appElement).to.be.ok;
    expect(headerElement).to.be.ok;
    expect(contentElement).to.be.ok;
    expect(footerElement).to.be.ok;

    // expect(appComponent.state.viewport).to.equal(appComponent.props.initialViewport);
  });

});
