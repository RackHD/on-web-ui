'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';
import DragEventHelpers from './mixins/DragEventHelpers';
/* eslint-enable no-unused-vars */

import {
  } from 'material-ui';

@decorate({
  propTypes: {
    canvas: PropTypes.any,
    model: PropTypes.any
  },
  defaultProps: {
    canvas: null,
    model: null
  }
})
@mixin.decorate(DragEventHelpers)
export default class GraphCanvasSocket extends Component {

  state = {};

  render() {
    var model = this.props.model;

    var typeCell = (
      <div key="type" className="cell">
        <span className="type">{model.type}</span>
      </div>
    );

    var socketClassName = 'GraphCanvasSocketIcon socket fa ';
    var links = model.links;
    socketClassName += (links.length) ?
      'fa-dot-circle-o' : 'fa-circle-o';

    var socketCell = (
      <div key="socket" className="cell">
        <span className={socketClassName}
              onMouseDown={this.drawLink()} />
      </div>
    );

    var dir = model.dir,
        cells;

    if (dir.x === -1) {
      cells = [socketCell, typeCell];
    }
    else if (dir.x === 1) {
      cells = [typeCell, socketCell];
    }
    else {
      console.error(new Error('Invalid socket dir').stack);
    }

    return (
      <div className="GraphCanvasSocket ungrid"
           data-id={model.id}>
        <div className="line">
          {cells}
        </div>
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

}
