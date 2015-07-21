'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DragEventHelpers from '../mixins/DragEventHelpers';

import Vector from '../lib/Vector';

/**
# GCViewport

@object
  @type class
  @extends React.Component
  @name GCViewport
  @desc
*/

@radium
@mixin.decorate(DragEventHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    css: PropTypes.object,
    style: PropTypes.object
  },
  defaultProps: {
    className: 'GraphCanvasViewport',
    css: {},
    style: {}
  },
  contextTypes: {
    graphCanvas: PropTypes.any
  }
})
export default class GCViewport extends Component {

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  shouldComponentUpdate() {
    return true;
  }

  state = {};

  css = {
    root: {
      position: 'relative',
      width: 'inherit',
      height: 'inherit',
      cursor: 'crosshair'//,
      // overflow: 'hidden'
    }
  };

  /**
  @method
    @name render
    @desc
  */
  render() {
    try {
      var props = this.props,
          css = [this.css.root, props.css.root, props.style];
      return (
        <div
            className={props.className}
            onWheel={this.scaleWorld.bind(this)}
            onMouseDown={this.translateWorld()}
            style={css}>
          {this.props.children}
        </div>
      );
    } catch (err) {
      console.error(err.stack || err);
    }
  }

  translateWorld() {
    return this.setupClickDrag(this.translateWorldListeners);
  }

  get translateWorldListeners() {
    var pushFrame = (event, dragState) => {
      dragState.frames = dragState.frames || [];
      var index = dragState.frames.length,
          frame = {position: this.graphCanvas.position, time: event.timeStamp || Date.now()},
          lastFrame = dragState.frames[index - 1] || frame,
          timeLapse = (frame.time - lastFrame.time) || 1;
      frame.velocity = frame.position.sub(lastFrame.position).squish(timeLapse).finite();
      frame.duration = timeLapse;
      dragState.frames.push(frame);
      if (dragState.frames.length >= 12) { dragState.frames.shift(); }
    };
    return {
      down: (event, dragState) => {
        // if (event.shiftKey) {
        //   this.drawNode(null, {shiftKey: (dragState.shiftKey = true)})(event);
        // }
        // if (event.which === 2 || event.which === 3 || dragState.shiftKey) { return; } // only left click
        event.stopPropagation();
        dragState.startTime = event.timeStamp || Date.now();
        dragState.start = new Vector(this.graphCanvas.position);
        // var max = Infinity
        // dragState.min = new Vector(-1000, -1000);
        // dragState.max = new Vector(1000, 1000);
        pushFrame(event, dragState);
        // TODO: fix these clamps
        // var scale = this.state.scale;
        // dragState.min = new Vector(
          // (this.worldBoundingBox.left / 2) - (this.screenSize.x / 2 / scale),
          // (this.worldBoundingBox.top / 2) - (this.screenSize.y / 2 / scale)
        // );
        // dragState.max = new Vector(
          // (this.worldBoundingBox.right / 2) + (this.screenSize.x / 2 / scale),
          // (this.worldBoundingBox.bottom / 2) + (this.screenSize.y / 2 / scale)
        // );
        // console.log(this.worldBoundingBox.toArray());
        // console.log(dragState.start.toArray());
        // console.log(dragState.min.toArray(), dragState.max.toArray());
        clearTimeout(this.physicsScrollTimer);
        this.stopPhysicsScroll = true;
      },
      move: (event, dragState) => {
        // if (event.which === 2 || event.which === 3 || dragState.shiftKey) { return; } // only left click
        event.stopPropagation();
        clearInterval(this.moveRepeat);
        var scale = this.graphCanvas.scale,
            start = dragState.start;//,
            // min = dragState.min,
            // max = dragState.max;
        pushFrame(event, dragState);
        this.graphCanvas.updatePosition({
          // x: Math.min(max.x, Math.max(min.x, start.x - (event.diffX / scale))),
          // y: Math.min(max.y, Math.max(min.y, start.y - (event.diffY / scale)))
          x: start.x - (event.diffX / scale),
          y: start.y - (event.diffY / scale)
        });
        this.moveRepeat = setInterval(() => {
          pushFrame(event, dragState);
        }, 32);
      },
      up: (event, dragState) => {
        // if (event.which === 2 || event.which === 3 || dragState.shiftKey) { return; } // only left click
        event.stopPropagation();
        clearInterval(this.moveRepeat);
        // var dragDuration = (event.timeStamp || Date.now()) - dragState.startTime;
        // if (dragDuration < 150) { this.unselectAllNodes(); }
        pushFrame(event, dragState);
        var velocitySum = dragState.frames.reduce(function (lastValue, currFrame) {
          return (lastValue.velocity || lastValue).add(currFrame.velocity);
        });
        velocitySum = velocitySum.squish(dragState.frames.length / 2);
        this.stopPhysicsScroll = false;
        var tick = () => {
          if (Math.abs(velocitySum.x) < 0.000001 &&
              Math.abs(velocitySum.y) < 0.000001) { return; }
          let position = this.graphCanvas.position;
          this.graphCanvas.updatePosition({
            x: position.x + velocitySum.x,
            y: position.y + velocitySum.y
          });
          velocitySum = velocitySum.scale(0.95);
          if (!this.stopPhysicsScroll) {
            this.physicsScrollTimer = setTimeout(tick, 16);
          }
        };
        tick();
      }
    };
  }

  scaleWorld(event) {
    event.stopPropagation();
    event.preventDefault();
    this.offsetEventXY(event);
    var scale = this.graphCanvas.scale,
        force = Math.max(0.05, scale / 5);
    if (event.deltaY < 0) {
      scale = Math.max(0.2, scale - force);
    }
    else {
      scale = Math.min(8, scale + force);
    }
    this.graphCanvas.updateScale(scale);
  }

}
