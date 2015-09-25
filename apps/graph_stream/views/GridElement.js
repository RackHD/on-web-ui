// Copyright 2015, EMC, Inc.

'use strict';

import { Component } from 'mach-react';

export default class GSGridElement extends Component {

  static defaultProps = {
    bounds: null,
    className: 'GSGridElement',
    style: {}
  }

  get canvas() { return this.context.canvas; }

  shouldComponentUpdate() { return false; }

  render(React) {
    var props = this.props,
        bounds = props.bounds,
        worldBoundingBox;

    if (!bounds) {
      worldBoundingBox = this.canvas.worldBoundingBox;
      bounds = {
        top: worldBoundingBox.top,
        left: worldBoundingBox.left,
        width: worldBoundingBox.width,
        height: worldBoundingBox.height
      };
    }

    return (
      <svg
          svg={true}
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
        <g svg={true}>
          <defs svg={true}>
            <pattern svg={true} id="smallGrid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path svg={true} d="M 25 0 L 0 0 0 25 25 25 Z" fill="none" stroke="#ddd" strokeWidth="0.25"/>
            </pattern>
            <pattern svg={true} id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect svg={true} width="100" height="100" x="0" y="0" fill="url(#smallGrid)"/>
              <path svg={true} d="M 100 0 L 0 0 0 100 100 100 Z" fill="none" stroke="#bbb" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect
              svg={true}
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
