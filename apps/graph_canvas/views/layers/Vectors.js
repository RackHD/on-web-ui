'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import radium from 'radium';
import decorate from 'common-web-ui/lib/decorate';

import GCGridElement from '../elements/Grid';

@radium
@decorate({
  propTypes: {
    className: PropTypes.string,
    css: PropTypes.object,
    style: PropTypes.object
  },
  defaultProps: {
    className: 'GraphCanvasVectorsLayer',
    css: {},
    style: {}
  },
  contextTypes: {
    graphCanvas: PropTypes.any
  }
})
export default class GCVectorsLayer extends Component {

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  render() {
    try {
      var worldSize = this.graphCanvas.worldSize,
          worldBoundingBox = this.graphCanvas.worldBoundingBox,
          cssWorldSize = this.graphCanvas.cssWorldSize;
      return (
        <svg
            className={this.props.className}
            width={worldSize.x}
            height={worldSize.y}
            style={[cssWorldSize, {
              overflow: 'visible',
              position: 'absolute',
              left: 0,
              top: 0
            }]}
            viewBox={worldBoundingBox.toSVGViewBox()}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg">
          <GCGridElement />
          {this.props.children}
        </svg>
      );
    } catch (err) {
      console.error(err.stack || err);
    }
  }

}
