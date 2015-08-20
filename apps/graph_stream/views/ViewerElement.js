'use strict';

import { Component } from 'mach-react';

export default class GSViewerElement extends Component {

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
      console.log(this.state.size, this.state, new Error().stack);
      // debugger;
      var css = {
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
            style={css}>
          {this.props.id}
        </div>
      );
    } catch (err) {
      console.error(err.stack || err);
    }
  }

}
