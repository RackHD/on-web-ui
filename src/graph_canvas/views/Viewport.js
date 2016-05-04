// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import radium from 'radium';
import mixin from 'src-common/lib/mixin';

import DragEventHelpers from '../mixins/DragEventHelpers';

import Vector from '../lib/Vector';

@radium
@mixin(DragEventHelpers)
export default class GCViewport extends Component {

  static propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    style: PropTypes.object
  };

  static defaultProps = {
    className: 'GraphCanvasViewport',
    css: {},
    style: {}
  };

  static contextTypes = {
    graphCanvas: PropTypes.any
  };

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  state = {};

  css = {
    root: {
      position: 'relative',
      width: 'inherit',
      height: 'inherit',
      cursor: 'crosshair',
      transition: 'width 1s'
    }
  };

  render() {
    let { props } = this;

    let css = [this.css.root, props.css.root, props.style];

    return (
      <div
          className={props.className}
          onWheel={this.scaleWorld.bind(this)}
          onMouseDown={this.translateWorld()}
          style={css}>
        {this.props.children}
      </div>
    );
  }

  translateWorld() {
    return this.setupClickDrag(this.translateWorldListeners);
  }

  get translateWorldListeners() {
    let pushFrame = (event, dragState) => {
      dragState.frames = dragState.frames || [];
      let index = dragState.frames.length,
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
        if (event.which === 2 || event.which === 3 || dragState.shiftKey) { return; } // only left click
        event.stopPropagation();
        dragState.startTime = event.timeStamp || Date.now();
        dragState.start = new Vector(this.graphCanvas.position);
        // let max = Infinity
        // dragState.min = new Vector(-1000, -1000);
        // dragState.max = new Vector(1000, 1000);
        pushFrame(event, dragState);
        // TODO: fix these clamps
        // let scale = this.state.scale;
        // dragState.min = new Vector(
          // (this.worldBoundingBox.left / 2) - (this.screenSize.x / 2 / scale),
          // (this.worldBoundingBox.top / 2) - (this.screenSize.y / 2 / scale)
        // );
        // dragState.max = new Vector(
          // (this.worldBoundingBox.right / 2) + (this.screenSize.x / 2 / scale),
          // (this.worldBoundingBox.bottom / 2) + (this.screenSize.y / 2 / scale)
        // );
        clearTimeout(this.physicsScrollTimer);
        this.stopPhysicsScroll = true;
      },
      move: (event, dragState) => {
        if (event.which === 2 || event.which === 3 || dragState.shiftKey) { return; } // only left click
        event.stopPropagation();
        event.preventDefault();
        clearInterval(this.moveRepeat);
        let scale = this.graphCanvas.scale,
            start = dragState.start;
        // let min = dragState.min,
        //     max = dragState.max;
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
        if (event.which === 2 || event.which === 3 || dragState.shiftKey) { return; } // only left click
        event.stopPropagation();
        clearInterval(this.moveRepeat);
        // let dragDuration = (event.timeStamp || Date.now()) - dragState.startTime;
        // if (dragDuration < 150) { this.unselectAllNodes(); }
        pushFrame(event, dragState);
        let velocitySum = dragState.frames.reduce((lastValue, currFrame) => {
          return (lastValue.velocity || lastValue).add(currFrame.velocity);
        });
        velocitySum = velocitySum.squish(dragState.frames.length / 2);
        this.stopPhysicsScroll = false;
        let tick = () => {
          if (Math.abs(velocitySum.x) < 0.0001 &&
              Math.abs(velocitySum.y) < 0.0001) { return; }
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

  scrollBuffer = null;
  scaleWorld(event) {
    if (event.stopPropagation) { event.stopPropagation(); }
    if (event.preventDefault) { event.preventDefault(); }
    let sampleDuration = 100,
        factor = 1.25;
    event.timeStamp = event.timeStamp || Date.now();
    if (!this.scrollBuffer) {
      this.scrollBuffer = [];
      this.scrollBuffer.timeStamp = event.timeStamp + sampleDuration;
    }
    if (this.scrollBuffer.wait) { return; }
    if (event.deltaY) { this.scrollBuffer.push(event.deltaY); }
    clearTimeout(this.scrollBuffer.timer);
    if (this.scrollBuffer.timeStamp <= event.timeStamp) {
      let scale = this.graphCanvas.scale,
          force = this.scrollBuffer.length && this.scrollBuffer.reduce((a, b) => a + b);
      scale = Math.max(0.0001, Math.min(100,
        Math.abs(force < 0 ? scale / factor : scale * factor)
      ));
      if (isNaN(scale) || !isFinite(scale)) {
        scale = this.graphCanvas.scale;
      }
      this.scrollBuffer.wait = true;
      this.graphCanvas.updateScale(Math.abs(scale), () => {
        this.scrollBuffer = null;
      });
    }
    else {
      this.scrollBuffer.timer = setTimeout(
        this.scaleWorld.bind(this, {deltaY: 0, timeStamp: this.scrollBuffer.timeStamp}),
        this.scrollBuffer.timeStamp - event.timeStamp);
    }
  }

}
