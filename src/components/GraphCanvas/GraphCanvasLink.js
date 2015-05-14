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

    var gutter = 5,
        stroke = 5,
        minX = 0 + gutter,
        minY = 0 + gutter,
        maxX = this.props.width - gutter,
        maxY = this.props.height - gutter,
        halfX = this.props.width / 2,
        halfY = this.props.height / 2,
        riseOverRun = this.props.height / this.props.width,
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
        path = ['M', minX, maxY, 'Q', minX, halfY, halfX, halfY, 'T', maxX, minY].join(' ');
      }
    }
    else if (this.props.dirX === 1 && this.props.dirY === -1) {
      align = 'bl';
      if (!border) {
        path = ['M', minX, minY, 'Q', minX, halfY, halfX, halfY, 'T', maxX, maxY].join(' ');
      }
    }
    else if (this.props.dirX === -1 && this.props.dirY === 1) {
      align = 'tr';
      if (!border) {
        path = ['M', maxX, maxY, 'Q', maxX, halfY, halfX, halfY, 'T', minX, minY].join(' ');
      }
    }
    else if (this.props.dirX === -1 && this.props.dirY === -1) {
      align = 'tl';
      if (!border) {
        path = ['M', maxX, minY, 'Q', maxX, halfY, halfX, halfY, 'T', minX, maxY].join(' ');
      }
    }

    return (
      <div className={'GraphCanvasLink ' + hover + border + align}
           style={styles}
           data-canvasref={this.props.canvasRef}
           onDoubleClick={this.removeLink}>
        <svg width="100%"
             height="100%"
             viewBox={[
               minX - gutter, minY - gutter,
               maxX + gutter, maxY + gutter
             ].join(' ')}
             preserveAspectRatio="none"
             xmlns="http://www.w3.org/2000/svg">

          <path d={path}
                fill="transparent"
                stroke="black"
                strokeWidth={stroke}
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
