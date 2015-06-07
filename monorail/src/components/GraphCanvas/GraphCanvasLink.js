'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorateComponent from 'common-web-ui/lib/decorateComponent';
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
    var props = this.props,
        gutter = 5,
        stroke = 3;

    var styles = {
      top: props.top - gutter,
      left: props.left - gutter,
      width: props.width + gutter + gutter,
      height: props.height + gutter + gutter
    };

    var minX = 0 + gutter,
        minY = 0 + gutter,
        maxX = styles.width - gutter,
        maxY = styles.height - gutter,
        halfX = styles.width / 2,
        halfY = styles.height / 2,
        // a1X = props.width * 0.25,
        // q1Y = props.height * 0.25,
        // q2X = props.width * 0.75,
        // q2Y = props.height * 0.75,
        hover = this.state.hover ? 'hover ' : '',
        path = '';

    if (props.dirX === 1 && props.dirY === 1) {
      path = ['M', minX, maxY, 'Q', halfX, maxY, halfX, halfY, 'T', maxX, minY].join(' ');
    }
    else if (props.dirX === -1 && props.dirY === -1) {
      path = ['M', maxX, minY, 'Q', halfX, minY, halfX, halfY, 'T', minX, maxY].join(' ');
    }
    else if (props.dirX === 1 && props.dirY === -1) {
      path = ['M', maxX, maxY, 'Q', halfX, maxY, halfX, halfY, 'T', minX, minY].join(' ');
    }
    else if (props.dirX === -1 && props.dirY === 1) {
      path = ['M', minX, minY, 'Q', halfX, minY, halfX, halfY, 'T', maxX, maxY].join(' ');
    }

    var transform = 'translate(' + styles.left + ' ' + styles.top + ')';

    // <g>
    return (
      <svg className={'GraphCanvasLink ' + hover /*+ border + align*/}
           width={styles.width}
           height={styles.height}
           data-canvasref={props.canvasRef}
           onDoubleClick={this.removeLink}
           viewBox={[
             minX - gutter, minY - gutter,
             maxX + gutter, maxY + gutter
           ].join(' ')}
           preserveAspectRatio="none"
           xmlns="http://www.w3.org/2000/svg">
        <g transform={transform}>
          <path d={path}
                fill="transparent"
                stroke="black"
                strokeWidth={stroke}
                strokeLinecap="round"
                onMouseOver={this.onHoverCurve.bind(this)}
                onMouseMove={this.onHoverCurve.bind(this)}
                onMouseOut={this.onLeaveCurve.bind(this)} />
          {/*<text x={halfX} y={halfY}>{
            'X: ' + props.dirX + ' ' +
            'Y: ' + props.dirY
          }</text>*/}
        </g>
      </svg>
    );
    // <circle
    //   cx={props.startX}
    //   cy={props.startY}
    //   r={10}
    //   fill="rgba(255, 0, 0, 0.5)" />
    // <circle
    //   cx={props.endX}
    //   cy={props.endY}
    //   r={10}
    //   fill="rgba(255, 0, 0, 0.5)" />
    // </g>
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
