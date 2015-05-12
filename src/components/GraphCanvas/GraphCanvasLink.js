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
    var border = '',
        align,
        path;
    if (this.props.dirX === 1 && this.props.dirY === 1) {
      align = 'br';
      path = 'M 0 100 L 100 0 z';
    }
    else if (this.props.dirX === 1 && this.props.dirY === -1) {
      align = 'bl';
      path = 'M 0 0 L 100 100 z';
    }
    else if (this.props.dirX === -1 && this.props.dirY === 1) {
      align = 'tr';
      path = 'M 0 0 L 100 100 z';
    }
    else if (this.props.dirX === -1 && this.props.dirY === -1) {
      align = 'tl';
      path = 'M 0 100 L 100 0 z';
    }
    var riseOverRun = this.props.height / this.props.width;
    if (riseOverRun > 2) {
      border = 'border ';
      path = 'M 50 0 L 50 100 z';
    }
    else if (riseOverRun < 0.2) {
      border = 'border ';
      path = 'M 0 50 L 100 50 z';
    }
    // styles.width += 100;
    // styles.height += 100;
    // styles.left -= 50;
    // styles.top -= 50;
    return (
      <div className={'GraphCanvasLink ' + border + align}
           style={styles}
           data-canvasref={this.props.canvasRef}
           onDoubleClick={this.removeLink}>
        <svg width="100%"
             height="100%"
             viewBox="0 0 100 100"
             preserveAspectRatio="none"
             xmlns="http://www.w3.org/2000/svg">

          <path d={path}
                stroke="black"
                strokeWidth="2" />
        </svg>
        X: &nbsp; {this.props.dirX}&nbsp; | &nbsp;
        Y: &nbsp; {this.props.dirY}&nbsp; | &nbsp;
        R: &nbsp; {riseOverRun}
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
