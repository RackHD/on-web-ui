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
    return {
      down: (event, dragState) => {
        event.stopPropagation();
      },
      move: (event, dragState) => {
        event.stopPropagation();
        var scale = this.canvas.scale,
            offset = new Vector([event.diffX / scale, event.diffY / scale]);
        this.canvas.offsetPosition(offset);
      },
      up: (event, dragState) => {
        event.stopPropagation();
      }
    };
  }

  scaleWorld(event) {
    event.stopPropagation();
    event.preventDefault();
    this.offsetEventXY(event);
    // console.log(event.deltaY, event.deltaMode);
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
