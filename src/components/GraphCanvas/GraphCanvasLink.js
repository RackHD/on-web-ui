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

  state = {hover: false};
  removeLink = this.removeLink.bind(this);

  render() {
    var styles = {
      top: this.props.top,
      left: this.props.left,
      width: this.props.width,
      height: this.props.height
    };

    var riseOverRun = this.props.height / this.props.width,
        svgArea = this.props.width * this.props.height,
        border = '',
        hover = this.state.hover ? 'hover ' : '',
        align = '',
        path = '';

    if (svgArea < 500 || riseOverRun > 1 || riseOverRun < 0.35) {
      border = 'border ';
    }

    if (this.props.dirX === 1 && this.props.dirY === 1) {
      align = 'br';
      if (!border) {
        path = 'M 0 100 Q 0 50, 50 50 T 100 0';
      }
    }
    else if (this.props.dirX === 1 && this.props.dirY === -1) {
      align = 'bl';
      if (!border) {
        path = 'M 0 0 Q 0 50, 50 50 T 100 100';
      }
    }
    else if (this.props.dirX === -1 && this.props.dirY === 1) {
      align = 'tr';
      if (!border) {
        path = 'M 100 100 Q 100 50, 50 50 T 0 0';
      }
    }
    else if (this.props.dirX === -1 && this.props.dirY === -1) {
      align = 'tl';
      if (!border) {
        path = 'M 100 0 Q 100 50, 50 50 T 0 100';
      }
    }

    // styles.width += 100;
    // styles.height += 100;
    // styles.left -= 50;
    // styles.top -= 50;

    return (
      <div className={'GraphCanvasLink ' + hover + border + align}
           style={styles}
           data-canvasref={this.props.canvasRef}
           onDoubleClick={this.removeLink}>
        <svg width="100%"
             height="100%"
             viewBox="0 0 100 100"
             preserveAspectRatio="none"
             xmlns="http://www.w3.org/2000/svg">

          <path d={path}
                fill="transparent"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                onMouseOver={this.onHoverCurve.bind(this)}
                onMouseOut={this.onLeaveCurve.bind(this)} />
        </svg>
        X: &nbsp; {this.props.dirX}&nbsp; | &nbsp;
        Y: &nbsp; {this.props.dirY}&nbsp; | &nbsp;
        R: &nbsp; {riseOverRun}
      </div>
    );
  }

  onHoverCurve() {
    this.setState({hover: true});
  }

  onLeaveCurve() {
    this.setState({hover: false});
  }

  removeLink(event) {
    var e = event.nativeEvent || event;
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm('Are you sure?')) { return; } // eslint-disable-line no-alert
    this.props.canvas.removeLink(this);
  }

}
