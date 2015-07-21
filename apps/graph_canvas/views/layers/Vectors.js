'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import radium from 'radium';
import decorate from 'common-web-ui/lib/decorate';

import Vector from '../../lib/Vector';

import GCGridElement from '../elements/Grid';

@radium
@decorate({
  propTypes: {
    bounds: PropTypes.object,
    className: PropTypes.string,
    css: PropTypes.object,
    grid: PropTypes.object,
    style: PropTypes.object
  },
  defaultProps: {
    bounds: null,
    className: 'GraphCanvasVectorsLayer',
    css: {},
    grid: null,
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
      let props = this.props,
          bounds = props.bounds,
          size = this.graphCanvas.worldSize,
          cssSize = this.graphCanvas.cssWorldSize,
          boundingBox = this.graphCanvas.worldBoundingBox,

          grid = null;
      if (props.grid) {
        grid = <GCGridElement {...props.grid} />;
      }
      if (bounds) {
        size = new Vector(bounds.width, bounds.height);
        cssSize = {width: size.x, height: size.y};
        boundingBox = bounds;
      }
      return (
        <svg
            className={this.props.className}
            width={size.x}
            height={size.y}
            style={[cssSize, {
              overflow: 'visible',
              position: 'absolute',
              left: 0,
              top: 0
            }]}
            viewBox={boundingBox.toSVGViewBox()}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg">
          {grid}
          {this.props.children}
        </svg>
      );
    } catch (err) {
      console.error(err.stack || err);
    }
  }

}
