'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorateComponent from 'common-web-ui/lib/decorateComponent';
/* eslint-enable no-unused-vars */

import './GraphCanvas.less';

@decorateComponent({
  propTypes: {
    top: PropTypes.number,
    left: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    style: PropTypes.object
  },
  defaultProps: {
    top: 0,
    left: 0,
    width: 1000,
    height: 1000,
    style: {}
  }
})
export default class GraphCanvasGrid extends Component {

  state = {};

  render() {
    var props = this.props;
    return (
      <svg
          className="GraphCanvasGrid"
          style={props.style}
          width={props.width}
          height={props.height}
          viewBox={[
            props.left,
            props.top,
            props.left + props.width,
            props.top + props.bottom
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
              width={props.width}
              height={props.height}
              x={props.top}
              y={props.left}
              fill="url(#grid)" />
        </g>
      </svg>
    );
  }

}
