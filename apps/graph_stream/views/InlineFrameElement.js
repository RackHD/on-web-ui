'use strict';

import { Component } from 'mach-react';

import DragEventHelpers from '../mixins/DragEventHelpers';
import Vector from '../lib/Vector';

export default class GSInlineFrameElement extends Component {

  static mixins = [ DragEventHelpers ]

  static defaultProps = {
    className: 'GSInlineFrame',
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
        paddingTop: '20px',
        background: 'rgba(0, 0, 0, 0.25)',
        border: '2px solid #000'
      };
      return (
        <div
            className={this.props.className}
            onMouseDown={this.translateView()}
            style={css}>
          <iframe src="http://www.emc.com/en-us/index.htm" width="100%" height="100%" />
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
        event.stopPropagation();
      },
      move: (event, dragState) => {
        event.stopPropagation();
        clearInterval(this.moveRepeat);
        var scale = this.canvas.scale,
            offset = new Vector([event.diffX / scale, event.diffY / scale]);
        this.offsetPosition(offset);
      },
      up: (event, dragState) => {
        event.stopPropagation();
      }
    };
  }

  offsetPosition(offset) {
    this.setProps({position: new Vector(this.props.position).add(offset)});
  }

}
