'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorate from 'common-web-ui/lib/decorate';
/* eslint-enable no-unused-vars */

import GraphCanvasWorld from './GraphCanvasWorld';
import './GraphCanvas.less';

@decorate({
  propTypes: {
    initialNodes: PropTypes.any,
    initialLinks: PropTypes.any,
    initialScale: PropTypes.number,
    initialX: PropTypes.number,
    initialY: PropTypes.number,
    worldWidth: PropTypes.number,
    worldHeight: PropTypes.number,
    viewWidth: PropTypes.number,
    viewHeight: PropTypes.number
  },
  defaultProps: {
    initialNodes: [],
    initialLinks: [],
    initialScale: 1,
    initialX: 0,
    initialY: 0,
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
