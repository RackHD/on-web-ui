'use strict';

import { Component } from 'mach-react';

import DragEventHelpers from '../mixins/DragEventHelpers';
import Vector from '../lib/Vector';

/**
# GSViewport

@object
  @type class
  @extends React.Component
  @name GCViewport
  @desc
*/

export default class GCViewport extends Component {

  static mixins = [ DragEventHelpers ]

  static defaultProps = {
    className: 'GraphCanvasViewport',
    css: {},
    style: {}
  }

  get canvas() {
    return this.context.canvas;
  }

  state = {};

  css = {
    root: {
      position: 'relative',
      width: 'inherit',
      height: 'inherit',
      cursor: 'crosshair'
    }
  };

  /**
  @method
    @name render
    @desc
  */
  render(React) {
    try {
      var props = this.props,
          css = [this.css.root, props.css.root, props.style];
      return (
        <div
            className={props.className}
            onWheel={this.scaleWorld.bind(this)}
            onMouseDown={this.translateWorld()}
            style={css}>
          {this.canvas.id}
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
          frame = {position: this.canvas.position, time: event.timeStamp || Date.now()},
          lastFrame = dragState.frames[index - 1] || frame,
          timeLapse = (frame.time - lastFrame.time) || 1;
      frame.velocity = frame.position.sub(lastFrame.position).squish(timeLapse).finite();
      frame.duration = timeLapse;
      dragState.frames.push(frame);
      if (dragState.frames.length >= 12) { dragState.frames.shift(); }
    };
    return {
      down: (event, dragState) => {
        event.stopPropagation();
        dragState.startTime = event.timeStamp || Date.now();
        dragState.start = new Vector(this.canvas.position);
        pushFrame(event, dragState);
        clearTimeout(this.physicsScrollTimer);
        this.stopPhysicsScroll = true;
      },
      move: (event, dragState) => {
        event.stopPropagation();
        clearInterval(this.moveRepeat);
        var scale = this.canvas.scale,
            start = dragState.start;
        pushFrame(event, dragState);
        this.canvas.updatePosition({
          x: start.x - (event.diffX / scale),
          y: start.y - (event.diffY / scale)
        });
        this.moveRepeat = setInterval(() => {
          pushFrame(event, dragState);
        }, 32);
      },
      up: (event, dragState) => {
        event.stopPropagation();
        clearInterval(this.moveRepeat);
        pushFrame(event, dragState);
        var velocitySum = dragState.frames.reduce(function (lastValue, currFrame) {
          return (lastValue.velocity || lastValue).add(currFrame.velocity);
        });
        velocitySum = velocitySum.squish(dragState.frames.length / 2);
        this.stopPhysicsScroll = false;
        var tick = () => {
          if (Math.abs(velocitySum.x) < 0.0001 &&
              Math.abs(velocitySum.y) < 0.0001) { return; }
          let position = this.canvas.position;
          this.canvas.updatePosition({
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
    var scale = this.canvas.scale,
        force = Math.max(0.05, scale / 5);
    if (event.deltaY < 0) {
      scale = Math.max(0.2, scale - force);
    }
    else {
      scale = Math.min(8, scale + force);
    }
    this.canvas.updateScale(scale);
  }

}
