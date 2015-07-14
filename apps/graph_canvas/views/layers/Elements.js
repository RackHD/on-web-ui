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
    style: PropTypes.object
  },
  defaultProps: {
    className: 'GraphCanvasElementsLayer',
    css: {},
    style: {}
  },
  contextTypes: {
    graphCanvas: PropTypes.any
  }
})
export default class GCElementsLayer extends Component {

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  render() {
    try {
      var worldSize = this.graphCanvas.worldSize;
      return (
        <div
            className={this.props.className}
            style={{
              width: worldSize.x,
              height: 0,
              overflow: 'visible',
              position: 'absolute',
              left: 0,
              top: 0
            }}>
          {this.props.children}
        </div>
      );
    } catch (err) {
      console.error(err.stack || err);
    }
  }

}
