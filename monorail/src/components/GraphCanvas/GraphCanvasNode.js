'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import decorateComponent from 'common-web-ui/lib/decorateComponent';
import DragEventHelpers from './mixins/DragEventHelpers';
/* eslint-enable no-unused-vars */

import {
    Paper
  } from 'material-ui';
import GraphCanvasPort from './GraphCanvasPort.js';

@decorateComponent({
  propTypes: {
    active: PropTypes.bool,
    canvas: PropTypes.any,
    model: PropTypes.any
  },
  defaultProps: {
    active: false,
    canvas: null,
    model: null
  },
  childContextTypes: {
    muiTheme: PropTypes.object
  }
})
@mixin.decorate(DragEventHelpers)
export default class GraphCanvasNode extends Component {

  state = {};
  removeNode = this.removeNode.bind(this);
  toggleFlip = this.toggleFlip.bind(this);

  render() {
    // if (!this.props.model || !this.props.model.bounds) {
    //   console.error(new Error('Invalid node').stack);
    //   console.log(this.props);
    //   return null;
    // }
    var dir = this.props.model.bounds.dir;
    var style = {
      top: this.props.model.bounds[dir.y > 0 ? 'top' : 'bottom'],
      left: this.props.model.bounds[dir.x > 0 ? 'left' : 'right'],
      width: this.props.model.bounds.width,
      height: this.props.model.bounds.height,
      transition: null,
      borderRadius: null,
      backgroundColor: null
    };
    var className = 'GraphCanvasNode',
        zDepth = 2;
    if (this.props.active) {
      className += ' active';
    }
    else {
      style.width = Math.max(80, style.width);
      style.height = Math.max(80, style.height);
    }
    if (this.state.moving) {
      className += ' moving';
      zDepth = 4;
    }
    if (this.state.flip) {
      className += ' flip';
    }
    if (this.state.flipping) {
      className += ' flipping' + this.state.flipping;
    }
    var ports = [];
    this.props.model.forEachPort(port => {
      ports.push(<GraphCanvasPort key={port.name} canvas={this.props.canvas} model={port} />);
    });
    return (
      <Paper className={className}
             rounded={false}
             zDepth={zDepth}
             style={style}
             data-canvasref={this.props.model.id}>
        <div className="container">
          <div className="header"
               onMouseDown={this.moveNode()}>
            <a className={'left fa fa-info' + (this.state.flip ? '-circle' : '')}
                onClick={this.toggleFlip} />
            <span className="name">Task Node</span>
            <a className="right fa fa-remove"
                onClick={this.removeNode} />
          </div>
          <div className="flipper">
            <div className="front">
              {ports}
            </div>
            <div className="back">
              Edit Task:
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
          this.props.model.id,
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
    this.props.canvas.removeNode(this.props.model);
  }

  toggleFlip() {
    if (this.state.flipping) { return; }
    this.setState({
      flipping: this.state.flip ? 'Back' : 'Front',
      flip: !this.state.flip
    });
    // TODO: use css transition end event for this:
    setTimeout(() => this.setState({flipping: null}), 750);
  }

}
