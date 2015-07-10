'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorate from 'common-web-ui/lib/decorate';
/* eslint-enable no-unused-vars */

import GraphCanvasWorld from './GraphCanvas/World';
import './GraphCanvas.less';

@decorate({
  propTypes: {
    initialGraph: PropTypes.any,
    initialNodes: PropTypes.any,
    initialLinks: PropTypes.any,
    initialScale: PropTypes.number,
    initialX: PropTypes.number,
    initialY: PropTypes.number,
    getNodeTypes: PropTypes.func,
    worldWidth: PropTypes.number,
    worldHeight: PropTypes.number,
    viewWidth: PropTypes.number,
    viewHeight: PropTypes.number
  },
  defaultProps: {
    initialGraph: null,
    initialNodes: [],
    initialLinks: [],
    initialScale: 1,
    initialX: 0,
    initialY: 0,
    getNodeTypes: null,
    worldWidth: 2000,
    worldHeight: 2000,
    viewWidth: 800,
    viewHeight: 600
  }
})
export default class GraphCanvas extends Component {

  render() {
    try {
      var props = this.props,
          cssViewSize = {
            width: props.viewWidth,
            height: props.viewHeight
          };
      return (
        <div className="GraphCanvas" style={cssViewSize}>
          <div className="GraphCanvasView" ref="view">
            <GraphCanvasWorld ref="world"
                selectionHandler={this.selectionHandler.bind(this)} {...props} />
          </div>
        </div>
      );
    } catch (err) { console.error(err.stack || err); }
  }

  onSelect(callback) {
    this.selectionCallbacks = this.selectionCallbacks || [];
    this.selectionCallbacks.push(callback);
  }

  selectionHandler(selection) {
    this.selectionCallbacks = this.selectionCallbacks || [];
    this.selectionCallbacks.forEach(callback => callback.call(this, selection));
  }

}
