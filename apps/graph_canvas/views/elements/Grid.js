'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorate from 'common-web-ui/lib/decorate';
/* eslint-enable no-unused-vars */

@decorate({
  propTypes: {
    bounds: PropTypes.shape({
      top: PropTypes.number,
      left: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number
    }),
    className: PropTypes.string,
    style: PropTypes.object
  },
  defaultProps: {
    bounds: null,
    className: 'GraphCanvasGridElement',
    style: {}
  },
  contextTypes: {
    graphCanvas: PropTypes.any
  }
})
export default class GCGridLayer extends Component {

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  render() {
    var props = this.props,
        bounds = props.bounds,
        worldBoundingBox;

    if (!bounds) {
      worldBoundingBox = this.graphCanvas.worldBoundingBox;
      bounds = {
        top: worldBoundingBox.top,
        left: worldBoundingBox.left,
        width: worldBoundingBox.width,
        height: worldBoundingBox.height
      };
    }

    return (
      <svg
          className={props.className}
          style={props.style}
          width={bounds.width}
          height={bounds.height}
          viewBox={[
            bounds.left,
            bounds.top,
            bounds.left + bounds.width,
            bounds.top + bounds.height
          ].join(' ')}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg">
        <g>
          <defs>
            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10 10 10 Z" fill="none" stroke="#ddd" strokeWidth="0.25"/>
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" x="0" y="0" fill="url(#smallGrid)"/>
              <path d="M 100 0 L 0 0 0 100 100 100 Z" fill="none" stroke="#bbb" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect
              width={bounds.width}
              height={bounds.height}
              x={bounds.top}
              y={bounds.left}
              fill="url(#grid)" />
        </g>
      </svg>
    );
  }

}
