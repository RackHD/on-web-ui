// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

@radium
export default class ViewportSize extends Component {

  static propTypes = {
    initialViewport: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number
    })
  };

  static defaultProps = {
    initialViewport: {width: 1024, height: 768}
  };

  state = {
    viewport: this.props.initialViewport
  }

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

  watchViewport() {
    var resizeTimer = null;
    this.handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(this.updateViewport.bind(this), 300);
    };
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);
  }

  unwatchViewport() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    this.handleResize = null;
  }

  updateViewport() {
    let viewport = {width: window.innerWidth, height: window.innerHeight};
    if (this.state.viewport.width !== viewport.width ||
      this.state.viewport.height !== viewport.height) {
      this.setState({viewport: viewport});
    }
  }

}
