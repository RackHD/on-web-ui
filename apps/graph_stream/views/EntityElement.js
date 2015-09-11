'use strict';

import { Component } from 'mach-react';

import DragEventHelpers from '../mixins/DragEventHelpers';
import Vector from '../lib/Vector';

import Histogram from './Histogram';
import HistogramBin from './HistogramBin';
import HistogramSet from './HistogramSet';

export default class GSEntityElement extends Component {

  static mixins = [ DragEventHelpers ]

  static defaultProps = {
    className: 'GSInlineFrame',
    css: {},
    style: {}
  }

  get canvas() { return this.context.canvas; }

  render(React) {
    try {
      let test = (<HistogramSet>
        <Histogram
            orient="horizontal"
            minCount={0}
            maxCount={10}>
          <HistogramBin size={1} count={0} value={0} label="1long" />
          <HistogramBin size={1} count={1} value={1} label="2" />
          <HistogramBin size={1} count={2} value={2} label="3" />
          <HistogramBin size={1} count={8} value={3} label="4long" />
          <HistogramBin size={1} count={2} value={4} label="5" />
          <HistogramBin size={1} count={1} value={5} label="6" />
          <HistogramBin size={1} count={0} value={6} label="7" />
          <HistogramBin size={2} count={0} value={0} label="1" color="#ccc" />
          <HistogramBin size={2} count={1} value={1} label="2" color="#ccc" />
          <HistogramBin size={2} count={2} value={2} label="3" color="#ccc" />
          <HistogramBin size={2} count={8} value={3} label="4long" color="#ccc" />
          <HistogramBin size={2} count={2} value={4} label="5" color="#ccc" />
          <HistogramBin size={2} count={1} value={5} label="6" color="#ccc" />
          <HistogramBin size={2} count={0} value={6} label="7longlong" color="#ccc" />
        </Histogram>
        <Histogram
            orient="vertical"
            minCount={1}
            maxCount={10}>
          <HistogramBin size={1} count={0} value={0} label="1long" />
          <HistogramBin size={1} count={1} value={1} label="2" />
          <HistogramBin size={1} count={2} value={2} label="3" />
          <HistogramBin size={1} count={8} value={3} label="4long" />
          <HistogramBin size={1} count={2} value={4} label="5" />
          <HistogramBin size={1} count={1} value={5} label="6" />
          <HistogramBin size={1} count={0} value={6} label="7" />
          <HistogramBin size={2} count={0} value={0} label="1" color="#ccc" />
          <HistogramBin size={2} count={1} value={1} label="2" color="#ccc" />
          <HistogramBin size={2} count={2} value={2} label="3" color="#ccc" />
          <HistogramBin size={2} count={8} value={3} label="4long" color="#ccc" />
          <HistogramBin size={2} count={2} value={4} label="5" color="#ccc" />
          <HistogramBin size={2} count={1} value={5} label="6" color="#ccc" />
          <HistogramBin size={2} count={0} value={6} label="7longlong" color="#ccc" />
        </Histogram>
      </HistogramSet>);
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
        background: 'rgba(255, 255, 255, 0.25)',
        border: '2px solid #000'
      };
      return (
        <div
            className={this.props.className}
            onMouseDown={this.translateEntity()}
            style={css}>
          {test}
          {this.props.children}
        </div>
      );
    } catch (err) {
      console.error(err.stack || err);
    }
  }

  translateEntity() {
    return this.setupClickDrag(this.translateEntityListeners);
  }

  get position() {
    return new Vector(this.state.position)
  }

  get translateEntityListeners() {
    return {
      down: (event, dragState) => {
        event.stopPropagation();
      },
      move: (event, dragState) => {
        event.stopPropagation();
        clearInterval(this.moveRepeat);
        var scale = this.canvas.scale,
            offset = new Vector([event.diffX / scale, event.diffY / scale]);
        this.canvas.offsetElementPosition(this, offset);
      },
      up: (event, dragState) => {
        event.stopPropagation();
      }
    };
  }

  offsetPosition(offset) {
    this.props.position[0] += offset[0];
    this.props.position[1] += offset[1];
    this.queueUpdate();
    // this.setProps({position: new Vector(this.props.position).add(offset)});
  }

}
