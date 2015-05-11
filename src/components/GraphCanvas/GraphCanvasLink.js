'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorateComponent from '../lib/decorateComponent';
/* eslint-enable no-unused-vars */

@decorateComponent({
  propTypes: {
    from: PropTypes.string,
    to: PropTypes.string,
    top: PropTypes.number,
    left: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    canvas: PropTypes.any,
    canvasRef: PropTypes.string,
    startX: PropTypes.number,
    startY: PropTypes.number,
    endX: PropTypes.number,
    endY: PropTypes.number,
    dirX: PropTypes.number,
    dirY: PropTypes.number
  },
  defaultProps: {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    canvas: null
  }
})
export default class GraphCanvasLink extends Component {

  removeLink = this.removeLink.bind(this);

  render() {
    var styles = {
      top: this.props.top,
      left: this.props.left,
      width: this.props.width,
      height: this.props.height
    };
    var bclass = 'b-';
    if (this.props.dirX === 1 && this.props.dirY === 1) { bclass += 'br'; }
    else if (this.props.dirX === 1 && this.props.dirY === -1) { bclass += 'bl'; }
    else if (this.props.dirX === -1 && this.props.dirY === 1) { bclass += 'tr'; }
    else if (this.props.dirX === -1 && this.props.dirY === -1) { bclass += 'tl'; }
    return (
      <div className={'GraphCanvasLink ' + bclass}
           style={styles}
           data-canvasref={this.props.canvasRef}
           onDoubleClick={this.removeLink}>
        <svg width="100%"
             height="100%"
             style={{display: 'none'}}
             viewBox="0 0 400 400"
             xmlns="http://www.w3.org/2000/svg">

          <path d="M 100 100 L 300 100 L 200 300 z"
                fill="orange"
                stroke="black"
                strokeWidth="3" />
        </svg>
      </div>
    );
  }

  removeLink(event) {
    var e = event.nativeEvent || event;
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm('Are you sure?')) { return; } // eslint-disable-line no-alert
    this.props.canvas.removeLink(this);
  }

}
