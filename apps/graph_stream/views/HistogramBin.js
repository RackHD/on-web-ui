'use strict';

import { Component, mixin } from 'mach-react';

import colors from '../config/colors';

export default class HistogramBin extends Component {

  props = this.assignObject({
    styles: {
      root: {}
    },
    css: {},
    size: 1,
    min: null,
    max: null,
    count: 0,
    value: 0,
    label: '0'
  }, this.props);

  state = {};

  css = {
    root: {
      background: '#000'
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
    let css = {
      root: [this.css.root, this.props.css.root, this.props.style, {
        width: this.props.size + 'ex',
        height: this.props.count + 'em'
      }]
    };

    return (
      <div className="histogram-bin" style={css.root}></div>
    );
  }

}
