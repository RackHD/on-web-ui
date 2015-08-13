'use strict';

import { Component, mixin } from 'mach-react';

import colors from '../config/colors';

let defaultStyles = {
  root: {}
};

export default class Histogram extends Component {

  props = this.assignObject({
    style: {},
    css: {},
    orient: 'horizontal',
    minCount: 0,
    maxCount: 10
  }, this.props);

  state = {};

  css = {
    bins: {
      alignItems: 'flex-end',
      display: 'flex',
      flexDirection: 'row'
    },
    col: {
      display: 'table-cell',
      verticalAlign: 'bottom'
    },
    corner: {
      height: '1em',
      width: '1em'
    },
    root: {},
    row: {
      display: 'table',
      tableLayout: 'fixed',
      width: '100%'
    },
    xAxis: {
      height: '1em',
    },
    xAxisKey: {},
    yAxis: {
      width: '1em',
    },
    yAxisKey: {}
  };

  getChildContext() {
    return {
      parentHistogram: this
    }
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {}

  get bins() {
    return this.props.children.slice(0);
  }

  getXKeys(bins) {
    if (this.props.orient === 'horizontal') {
      return bins.map(bin => ({value: bin.component.props.value, size: bin.component.props.size}));
    }
  }

  getYKeys(bins) {
    if (this.props.orient === 'horizontal') {
      let keys = [],
          len = this.props.maxCount,
          i = this.props.minCount;
      for (; i < len; i += 1) {
        keys.push(i.toString());
      }
      return keys;
    }
  }

  render(React) {
    let bins = this.bins;

    bins = bins.sort((binA, binB) => {
      return binA.component.props.value - binB.component.props.value;
    });

    let xKeys = this.getXKeys(bins),
        yKeys = this.getYKeys(bins);

    let cssCol = [this.css.col, this.props.css.col];

    let css = {
      bins: [{}].concat(cssCol.concat([this.css.bins, this.props.css.bins])),
      col: [{}].concat(cssCol),
      corner: [{}].concat(cssCol.concat([this.css.corner, this.props.css.corner])),
      root: [{}, this.css.root, this.props.css.root, this.props.style],
      row: [{}, this.css.row, this.props.css.row],
      xAxis: [{}].concat(cssCol.concat([this.css.xAxis, this.props.css.xAxis])),
      xAxisKey: [{}, this.css.xAxisKey, this.props.css.xAxisKey],
      yAxis: [{}].concat(cssCol.concat([this.css.yAxis, this.props.css.yAxis])),
      yAxisKey: [{}, this.css.yAxisKey, this.props.css.yAxisKey]
    };

    return (
      <div className="histogram" style={css.root}>
        <div className="row">
          <div className="y-axis" style={css.yAxis}>
            {yKeys.map(key =>
              <div className="y-axis-key" style={css.yAxisKey}>{key}</div>
            ).reverse()}
          </div>
          <div className="col" style={css.col}>
            <div className="bins" style={css.bins}>
              {bins}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="corner" style={css.corner} />
          <div className="x-axis" style={css.xAxis}>
            {xKeys.map(key =>
              <span
                  className="x-axis-key"
                  style={css.xAxisKey.concat([{width: key.size}])}>
                {key.value}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

}
