'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import radium from 'radium';
import decorate from 'common-web-ui/lib/decorate';

@radium
@decorate({
  propTypes: {
    className: PropTypes.string,
    css: PropTypes.object,
    style: PropTypes.object,
    width: PropTypes.any
  },
  defaultProps: {
    className: 'GraphCanvasElementsLayer',
    css: {},
    style: {},
    width: 'auto'
  },
  contextTypes: {
    graphCanvas: PropTypes.any
  }
})
export default class GCElementsLayer extends Component {

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({width: nextProps.width});
  }

  state = {
    width: this.props.width
  }

  render() {
    try {
      let props = this.props,
          width = this.state.width || this.graphCanvas.worldSize;
      return (
        <div
            className={props.className}
            style={{
              width: width,
              height: 0,
              overflow: 'visible',
              position: 'absolute',
              left: 0,
              top: 0
            }}>
          {props.children}
        </div>
      );
    } catch (err) {
      console.error(err.stack || err);
    }
  }

}
