'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorateComponent from '../lib/decorateComponent';
/* eslint-enable no-unused-vars */

@decorateComponent({
  propTypes: {
    top: PropTypes.number,
    left: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    canvas: PropTypes.any,
    canvasRef: PropTypes.string
  },
  defaultProps: {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    canvas: null
  }
})
export default class GraphCanvasNode extends Component {

  moveX = null;
  moveY = null;
  resizeX = null;
  resizeY = null;

  drawStart = this.drawStart.bind(this);
  drawContinue = this.drawContinue.bind(this);
  drawFinish = this.drawFinish.bind(this);

  moveStart = this.drawStart.bind(this);
  moveContinue = this.drawContinue.bind(this);
  moveFinish = this.drawFinish.bind(this);

  resizeStart = this.drawStart.bind(this);
  resizeContinue = this.drawContinue.bind(this);
  resizeFinish = this.drawFinish.bind(this);

  removeNode = this.removeNode.bind(this);

  render() {
    var styles = {
      top: this.props.top,
      left: this.props.left,
      width: this.props.width,
      height: this.props.height
    };
    return (
      <div className="GraphCanvasNode"
           style={styles}
           data-canvasref={this.props.canvasRef}
           onMouseDown={this.drawStart}
           onMouseMove={this.drawContinue}
           onMouseUp={this.drawFinish}>
        <div onMouseDown={this.moveStart}
             onMouseMove={this.moveContinue}
             onMouseUp={this.moveFinish}>MOVE</div>
        <div onMouseDown={this.resizeStart}
             onMouseMove={this.resizeContinue}
             onMouseUp={this.resizeFinish}>RESIZE</div>
        <div onClick={this.removeNode}>DELETE</div>
      </div>
    );
  }

  drawStart(event) {
    this.props.canvas.drawLinkStart(event);
  }

  drawContinue(event) {
    this.props.canvas.drawLinkContinue(event);
  }

  drawFinish(event) {
    this.props.canvas.drawLinkFinish(event);
  }

  moveStart(event) {
    var e = event.nativeEvent || event;
    e.stopPropagation();
    e.preventDefault();
  }

  moveContinue(event) {
    var e = event.nativeEvent || event;
    e.stopPropagation();
    e.preventDefault();
  }

  moveFinish(event) {
    var e = event.nativeEvent || event;
    e.stopPropagation();
    e.preventDefault();
  }

  resizeStart(event) {
    var e = event.nativeEvent || event;
    e.stopPropagation();
    e.preventDefault();
  }

  resizeContinue(event) {
    var e = event.nativeEvent || event;
    e.stopPropagation();
    e.preventDefault();
  }

  resizeFinish(event) {
    var e = event.nativeEvent || event;
    e.stopPropagation();
    e.preventDefault();
  }

  removeNode(event) {
    var e = event.nativeEvent || event;
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm('Are you sure?')) { return; } // eslint-disable-line no-alert
    this.props.canvas.removeNode(this);
  }

}
