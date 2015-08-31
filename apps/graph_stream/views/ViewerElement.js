'use strict';

import { Component } from 'mach-react';

import DragEventHelpers from '../mixins/DragEventHelpers';
import Vector from '../lib/Vector';

export default class GSViewerElement extends Component {

  static mixins = [ DragEventHelpers ]

  static defaultProps = {
    className: 'GSViewer',
    css: {},
    style: {}
  }

  get canvas() { return this.context.canvas; }

  state = this.props.state

  render(React) {
    try {
      var state = this.state;
      // console.log(this.state.size, this.state, new Error().stack);
      // debugger;
      var css = {
        userSelect: 'none',
        boxSizing: 'border-box',
        position: 'absolute',
        top: 1000 - (this.state.size[1] / 2) + this.state.position[1],
        left: 1000 - (this.state.size[0] / 2) + this.state.position[0],
        width: this.state.size[0],
        height: this.state.size[1],
        background: 'rgba(0, 0, 0, 0.25)',
        border: '2px solid #000'
      };
      return (
        <div
            className={this.props.className}
            onMouseDown={this.translateView()}
            style={css}>
          {this.props.id}
        </div>
      );
    } catch (err) {
      console.error(err.stack || err);
    }
  }

  translateView() {
    return this.setupClickDrag(this.translateViewListeners);
  }

  get position() {
    return new Vector(this.state.position)
  }

  get translateViewListeners() {
    // var pushFrame = (event, dragState) => {
    //   dragState.frames = dragState.frames || [];
    //   var index = dragState.frames.length,
    //       frame = {position: this.position, time: event.timeStamp || Date.now()},
    //       lastFrame = dragState.frames[index - 1] || frame,
    //       timeLapse = (frame.time - lastFrame.time) || 1;
    //   frame.velocity = frame.position.sub(lastFrame.position).squish(timeLapse).finite();
    //   frame.duration = timeLapse;
    //   dragState.frames.push(frame);
    //   if (dragState.frames.length >= 12) { dragState.frames.shift(); }
    // };
    return {
      down: (event, dragState) => {
        event.stopPropagation();
        dragState.startTime = event.timeStamp || Date.now();
        dragState.start = new Vector(this.position);
        // pushFrame(event, dragState);
        // clearTimeout(this.physicsScrollTimer);
        // this.stopPhysicsScroll = true;
      },
      move: (event, dragState) => {
        event.stopPropagation();
        clearInterval(this.moveRepeat);
        var scale = this.canvas.scale,
            start = dragState.start;
        // pushFrame(event, dragState);
        this.canvas.updateViewPosition(this, {
          x: start.x + (event.diffX / scale),
          y: start.y + (event.diffY / scale)
        });
        // this.moveRepeat = setInterval(() => {
        //   pushFrame(event, dragState);
        // }, 32);
      },
      up: (event, dragState) => {
        event.stopPropagation();
        // clearInterval(this.moveRepeat);
        // pushFrame(event, dragState);
        // var velocitySum = dragState.frames.reduce(function (lastValue, currFrame) {
        //   return (lastValue.velocity || lastValue).add(currFrame.velocity);
        // });
        // velocitySum = velocitySum.squish(dragState.frames.length / 2);
        // this.stopPhysicsScroll = false;
        // var tick = () => {
        //   if (Math.abs(velocitySum.x) < 0.0001 &&
        //       Math.abs(velocitySum.y) < 0.0001) { return; }
        //   let position = new Vector(this.position);
        //   this.canvas.updateViewPosition(this, {
        //     x: position.x + velocitySum.x,
        //     y: position.y + velocitySum.y
        //   });
        //   velocitySum = velocitySum.scale(0.95);
        //   if (!this.stopPhysicsScroll) {
        //     this.physicsScrollTimer = setTimeout(tick, 16);
        //   }
        // };
        // tick();
      }
    };
  }

}
