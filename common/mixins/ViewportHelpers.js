'use strict';

import { PropTypes } from 'react';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';

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
    if (!canUseDOM) { return; }
    var resizeTimer = null;
    this.handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(this.updateViewport.bind(this), 300);
    };
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);
  },

  unwatchViewport() {
    if (!canUseDOM) { return; }
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    this.handleResize = null;
  },

  updateViewport() {
    if (!canUseDOM) { return; }
    let viewport = {width: window.innerWidth, height: window.innerHeight};
    if (this.state.viewport.width !== viewport.width ||
      this.state.viewport.height !== viewport.height) {
      this.setState({viewport: viewport});
    }
  }

};
