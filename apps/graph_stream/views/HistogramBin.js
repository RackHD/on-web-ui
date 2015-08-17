'use strict';

import { Component, mixin } from 'mach-react';

import colors from '../config/colors';

export default class HistogramBin extends Component {

  props = this.assignObject({
    style: {},
    css: {},
    size: 1,
    min: null,
    max: null,
    count: 0,
    value: 0,
    label: '0',
    color: '#000'
  }, this.props);

  state = {};

  css = {
    root: {
      background: this.props.color
    }
  };

  getChildContext() {
    return {
      parentHistogramBin: this
    }
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  get childBins() {
    return this.props.children;
  }

  render(React) {
    if (this.context.parentHistogram.props.orient === 'horizontal') {
      return this.renderHorizontal(React);
    }
    return this.renderVertical(React);
  }

  renderHorizontal(React) {
    let css = {
      root: [this.css.root, this.props.css.root, this.props.style, {
        width: (this.props.size * 14) - 2,
        height: (this.props.count * 18)
      }]
    };

    return (
      <div className="histogram-bin" style={css.root}></div>
    );
  }

  renderVertical(React) {
    let css = {
      root: [this.css.root, this.props.css.root, this.props.style, {
        width: (this.props.count * 18),
        height: (this.props.size * 14) - 2
      }]
    };

    return (
      <div className="histogram-bin" style={css.root}></div>
    );
  }

}
