'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import decorateComponent from '../../../../common/lib/decorateComponent';
import DragEventHelpers from './mixins/DragEventHelpers';
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
@mixin.decorate(DragEventHelpers)
export default class GraphCanvasNode extends Component {

  state = {};
  removeNode = this.removeNode.bind(this);

  render() {
    var styles = {
      top: this.state.top || this.props.top,
      left: this.state.left || this.props.left,
      width: this.props.width,
      height: this.props.height
    };
    return (
      <div className="GraphCanvasNode"
           style={styles}
           data-canvasref={this.props.canvasRef}
           onMouseDown={this.drawLink()}>
        <div onMouseDown={this.moveNode()}>MOVE</div>
        <div onMouseDown={this.resizeNode()}>RESIZE</div>
        <div onClick={this.removeNode}>DELETE</div>
      </div>
    );
  }

  drawLink() {
    return this.props.canvas.setupClickDrag({
      down: (event, dragState, e) => this.props.canvas.drawLinkStart(event, dragState, e),
      move: (event, dragState, e) => this.props.canvas.drawLinkContinue(event, dragState, e),
      up: (event, dragState, e) => this.props.canvas.drawLinkFinish(event, dragState, e)
    });
  }

  moveNode() {
    return this.props.canvas.setupClickDrag({
      down: (event, dragState) => {
        event.stopPropagation();
        dragState.nextMove = -1;
        dragState.lastMove = {
          x: event.relX,
          y: event.relY
        };
      },
      move: (event, dragState) => {
        event.stopPropagation();
        var lastX = dragState.lastMove.x,
            lastY = dragState.lastMove.y;
        dragState.lastMove = {
          x: event.relX,
          y: event.relY
        };
        this.props.canvas.moveNode(
          this.props.canvasRef,
          lastX - event.relX,
          lastY - event.relY);
      },
      up: (event) => event.stopPropagation()
    });
  }

  resizeNode() {
    return this.setupClickDrag({
      down: (event) => event.stopPropagation(),
      move: (event) => event.stopPropagation(),
      up: (event) => event.stopPropagation()
    });
  }

  removeNode(event) {
    event.stopPropagation();
    event.preventDefault();
    if (!window.confirm('Are you sure?')) { return; } // eslint-disable-line no-alert
    this.props.canvas.removeNode(this);
  }

}
