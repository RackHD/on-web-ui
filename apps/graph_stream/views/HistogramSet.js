'use strict';

import { Component, mixin } from 'mach-react';

import colors from '../config/colors';

let defaultStyles = {
  root: {}
};

export default class HistogramSet extends Component {

  props = this.assignObject({
    styles: {
      root: {}
    }
  }, this.props);

  state = {};

  getChildContext() {
    return {
      parentHistogramSet: this
    }
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  get histograms() {
    return this.props.children;
  }

  render(React) {
    let histograms = this.histograms;
    return (
      <div className="histogram-set">
        {histograms}
      </div>
    );
  }

}
