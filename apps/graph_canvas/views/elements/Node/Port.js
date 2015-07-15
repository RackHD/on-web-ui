'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';
import DragEventHelpers from '../../../mixins/DragEventHelpers';
/* eslint-enable no-unused-vars */

import {
  } from 'material-ui';
import GraphCanvasSocket from './Socket';

@decorate({
  propTypes: {
    canvas: PropTypes.any,
    model: PropTypes.any
  },
  defaultProps: {
    canvas: null,
    model: null
  },
  contextTypes: {
    graphCanvas: PropTypes.any
  }
})
@mixin.decorate(DragEventHelpers)
export default class GraphCanvasPort extends Component {

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  state = {};

  render() {
    var leftSockets = [],
        rightSockets = [];
    this.props.model.forEachSocket(socket => {
      var element = <GraphCanvasSocket
        key={socket.type} ref={socket.type} canvas={this.graphCanvas} model={socket} />;
      if (socket.dir.x === -1) {
        leftSockets.push(element);
      }
      else if (socket.dir.x === 1) {
        rightSockets.push(element);
      }
      else {
        console.error(new Error('Invalid socket dir').stack);
      }
    });
    return (
      <div className="GraphCanvasPort ungrid"
           data-id={this.props.model.id}>
        <div className="line">
          <div className="cell">{leftSockets}</div>
          <div className="cell">
            <span className="name" style={{color: this.props.model.color}}>{this.props.model.name}</span>
          </div>
          <div className="cell">{rightSockets}</div>
        </div>
      </div>
    );
  }

}
