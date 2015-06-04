'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import mixin from 'react-mixin';
import decorateComponent from 'common-web-ui/lib/decorateComponent';
import StyleHelpers from 'common-web-ui/mixins/StyleHelpers';
import DragEventHelpers from './mixins/DragEventHelpers';
import CoordinateHelpers from './mixins/CoordinateHelpers';
/* eslint-enable no-unused-vars */

import Vector from './lib/Vector';
import GraphCanvasWorld from './GraphCanvasWorld';
import './GraphCanvasView.less';

@decorateComponent({
  propTypes: {
    initialViewX: PropTypes.number,
    initialViewY: PropTypes.number,
    initialScale: PropTypes.number,
    worldWidth: PropTypes.number,
    worldHeight: PropTypes.number,
    viewWidth: PropTypes.number,
    viewHeight: PropTypes.number
  },
  defaultProps: {
    initialViewX: 0,
    initialViewY: 0,
    initialScale: 1,
    worldWidth: 800,
    worldHeight: 600,
    viewWidth: 400,
    viewHeight: 300
  }
})
@mixin.decorate(CoordinateHelpers)
@mixin.decorate(DragEventHelpers)
@mixin.decorate(StyleHelpers)
export default class GraphCanvasView extends Component {

  state = {};

  render() { try {
    var props = this.props,
        viewSize = this.viewSize,
        cssViewSize = {
          width: viewSize.x,
          height: viewSize.y
        };
    return (
      <div
          className="GraphCanvasView"
          onMouseDown={this.translateWorld()}
          onWheel={this.scaleWorld.bind(this)}
          style={cssViewSize}>
        <div
            ref="view"
            className="view"
            style={cssViewSize}>
          <GraphCanvasWorld
              ref="world"
              {...props} />
        </div>
      </div>
    );
  } catch (err) { console.error(err.stack || err); } }

  translateWorld() {
    return this.setupClickDrag(this.translateWorldListeners);
  }

  get translateWorldListeners() {
    return {
      down: (event, dragState) => {
        if (event.shiftKey) {
          this.drawNode(null, {shiftKey: (dragState.shiftKey = true)})(event);
        }
        if (event.which === 2 || event.which === 3 || dragState.shiftKey) { return; } // only left click
        event.stopPropagation();
        // var scale = this.state.scale;
        dragState.start = new Vector(this.refs.world.position);
        dragState.min = new Vector(-1000, -1000);
        dragState.max = new Vector(1000, 1000);
      },
      move: (event, dragState) => {
        if (event.which === 2 || event.which === 3 || dragState.shiftKey) { return; } // only left click
        event.stopPropagation();
        var scale = this.refs.world.scale,
            start = dragState.start,
            min = dragState.min,
            max = dragState.max;
        this.refs.world.updatePosition({
          x: Math.min(max.x, Math.max(min.x, start.x - (event.diffX / scale))),
          y: Math.min(max.y, Math.max(min.y, start.y - (event.diffY / scale)))
        });
      },
      up: (event, dragState) => {
        if (event.which === 2 || event.which === 3 || dragState.shiftKey) { return; } // only left click
        event.stopPropagation();
      }
    };
  }

  scaleWorld(event) {
    event.stopPropagation();
    event.preventDefault();
    this.offsetEventXY(event);
    var scale = this.refs.world.scale,
        // viewPosition = this.viewPosition,
        // mousePosition = new Vector(event.relX, event.relY),
        force = Math.max(0.1, scale / 5);
    // console.log(event.deltaY);
    if (event.deltaY < 0) {
      scale = Math.max(0.5, scale - force);
    }
    else {
      scale = Math.min(5, scale + force);
    }
    // console.log(this.viewBoundingBox);
    this.refs.world.updateScale(scale);
  }

}
