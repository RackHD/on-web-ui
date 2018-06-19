// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

export default class GCGridElement extends Component {

  static propTypes = {
    bounds: PropTypes.shape({
      top: PropTypes.number,
      left: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number
    }),
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    bounds: null,
    className: 'GraphCanvasGridElement',
    style: {}
  };

  static contextTypes = {
    graphCanvas: PropTypes.any
  };

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    // console.log('RENDER GRID');

    let props = this.props,
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
            <pattern id="smallGrid" width="500" height="500" patternUnits="userSpaceOnUse">
              <path d="M 500 0 L 0 0 0 500 500 500 Z" fill="none" stroke="rgba(127, 127, 127, 0.25)" strokeWidth="2"/>
            </pattern>
            <pattern id="grid" width="1000" height="1000" patternUnits="userSpaceOnUse">
              <rect width="1000" height="1000" x="0" y="0" fill="url(#smallGrid)"/>
              <path d="M 1000 0 L 0 0 0 1000 1000 1000 Z" fill="none" stroke="rgba(127, 127, 127, 0.5)" strokeWidth="4"/>
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
