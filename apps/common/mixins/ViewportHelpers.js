// Copyright 2015, EMC, Inc.

'use strict';

import { PropTypes } from 'react';

export default {

  viewportPropTypes(propTypes) {
    propTypes = propTypes || {};
    propTypes.initialViewport = propTypes.initialViewport || PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number
    });
    return propTypes;
  },

  viewportDefaultProps(defaultProps) {
    defaultProps = defaultProps || {};
    defaultProps.initialViewport = defaultProps.initialViewport || {width: 1024, height: 768};
    return defaultProps;
  },

  viewportState(state) {
    state = state || {};
    state.viewport = this.props.initialViewport;
    return state;
  },

  watchViewport() {
    var resizeTimer = null;
    this.handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(this.updateViewport.bind(this), 300);
    };
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);
  },

  unwatchViewport() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    this.handleResize = null;
  },

  updateViewport() {
    let viewport = {width: window.innerWidth, height: window.innerHeight};
    if (this.state.viewport.width !== viewport.width ||
      this.state.viewport.height !== viewport.height) {
      this.setState({viewport: viewport});
    }
  }

};
