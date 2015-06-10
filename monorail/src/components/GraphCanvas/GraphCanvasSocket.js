'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import decorateComponent from 'common-web-ui/lib/decorateComponent';
import DragEventHelpers from './mixins/DragEventHelpers';
/* eslint-enable no-unused-vars */

import {
  } from 'material-ui';

@decorateComponent({
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
    var typeCell = (
      <div key="type" className="cell">
        <span className="type">{this.props.model.type}</span>
      </div>
    );

    var socketCell = (
      <div key="socket" className="cell">
        <span className="GraphCanvasSocketIcon socket fa fa-circle-o"
              onMouseDown={this.drawLink()} />
      </div>
    );

    var dir = this.props.model.dir,
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
      <div className="GraphCanvasSocket ungrid">
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
