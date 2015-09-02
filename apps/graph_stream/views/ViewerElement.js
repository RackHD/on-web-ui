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

  render(React) {
    try {
      var state = this.state;
      var css = {
        userSelect: 'none',
        boxSizing: 'border-box',
        position: 'absolute',
        top: 1000 - (this.props.size[1] / 2) + this.props.position[1],
        left: 1000 - (this.props.size[0] / 2) + this.props.position[0],
        width: this.props.size[0],
        height: this.props.size[1],
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
    return {
      down: (event, dragState) => {
        if (!event.shiftKey) return;
        event.stopPropagation();
      },
      move: (event, dragState) => {
        if (!event.shiftKey) return;
        event.stopPropagation();
        clearInterval(this.moveRepeat);
        var scale = this.canvas.scale,
            offset = new Vector([event.diffX / scale, event.diffY / scale]);
        this.canvas.offsetViewPosition(this, offset);
      },
      up: (event, dragState) => {
        if (!event.shiftKey) return;
        event.stopPropagation();
      }
    };
  }

  offsetPosition(offset) {
    this.setProps({position: new Vector(this.props.position).add(offset)});
  }

}
