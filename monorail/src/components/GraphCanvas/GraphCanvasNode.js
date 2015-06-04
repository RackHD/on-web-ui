'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import decorateComponent from 'common-web-ui/lib/decorateComponent';
import DragEventHelpers from './mixins/DragEventHelpers';
/* eslint-enable no-unused-vars */

import {
    Paper,
    IconButton
  } from 'material-ui';
import GraphCanvasPort from './GraphCanvasPort.js';

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
  toggleFlip = this.toggleFlip.bind(this);

  render() {
    var styles = {
      top: this.state.top || this.props.top,
      left: this.state.left || this.props.left,
      width: this.props.width,
      height: this.props.height
    };
    var className = 'GraphCanvasNode',
        zDepth = 2;
    if (this.props.active) {
      className += ' active';
    }
    if (this.state.moving) {
      className += ' moving';
      zDepth = 4;
    }
    if (this.state.flip) {
      className += ' flip';
    }
    var ports = [
      <GraphCanvasPort canvas={this.props.canvas} />,
      <GraphCanvasPort canvas={this.props.canvas} />,
      <GraphCanvasPort canvas={this.props.canvas} />
    ];
    return (
      <Paper className={className}
             zDepth={zDepth}
             style={styles}
             data-canvasref={this.props.canvasRef}>
        <div className="container">
          <div className="header"
               onMouseDown={this.moveNode()}>
            <IconButton className="left"
                        iconClassName={'fa fa-info' + (this.state.flip ? '-circle' : '')}
                        tooltip="Flip"
                        onClick={this.toggleFlip} />
            <span className="name">Name</span>
            <IconButton className="right"
                        iconClassName="fa fa-remove"
                        tooltip="Remove"
                        onClick={this.removeNode} />
          </div>
          <div className="flipper">
            <div className="front">
              {ports}
            </div>
            <div className="back">
              Selete Type
            </div>
          </div>
        </div>
      </Paper>
    );
  }

  moveNode() {
    return this.props.canvas.setupClickDrag({
      down: (event, dragState) => {
        this.setState({moving: true});
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
      up: (event) => {
        this.setState({moving: false});
        event.stopPropagation();
      }
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

  toggleFlip() {
    this.setState({flip: !this.state.flip});
  }

}
