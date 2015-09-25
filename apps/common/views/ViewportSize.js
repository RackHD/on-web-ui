// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react'; // eslint-disable-line no-unused-vars

import radium from 'radium';
import mixin from 'common-web-ui/lib/mixin';

import ViewportHelpers from '../mixins/ViewportHelpers';
import decorate from '../lib/decorate';

@radium
@mixin(ViewportHelpers)
@decorate({

  propTypes: ViewportHelpers.viewportPropTypes({
    className: PropTypes.string,
    style: PropTypes.any
  }),

  defaultProps: ViewportHelpers.viewportDefaultProps({
    className: '',
    style: {}
  })

})
export default class ViewportSize extends Component {

  state = this.viewportState()

  componentDidMount() {
    this.updateViewport();
    this.watchViewport();
  }

  componentWillUnmount() {
    this.unwatchViewport();
  }

  render() {
    return (
      <span
          className={this.props.className}
          style={this.props.style}>
        {this.printViewportSize()}
      </span>
    );
  }

  printViewportSize() {
    var viewport = this.state && this.state.viewport || this.props.initialViewport;
    return 'Viewport: ' + viewport.width + 'x' + viewport.height;
  }

}
