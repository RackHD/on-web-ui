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
      height: '18px',
      width: '14px'
    },
    root: {
      position: 'relative',
      padding: '5px',
      fontSize: '12px',
      lineHeight: '18px',
      display: 'table',
      tableLayout: 'fixed'
    },
    row: {},
    xAxis: {
      height: '18px',
    },
    xAxisKey: {
      textAlign: 'center',
      height: '18px',
    },
    yAxis: {
      width: '14px',
    },
    yAxisKey: {
      position: 'relative',
      top: '-9px',
      height: '18px',
      width: '14px',
    }
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
      return bins.map(bin => bin.component.props);
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

    let cssCol = [this.css.col, this.props.css.col],
        cssRow = [this.css.row, this.props.css.row];

    bins = bins.map(bin => {
      return (<div className="bin-cell" style={[{width: (bin.component.props.size * 14) - 2, padding: '0 1px'}].concat(cssCol)}>
        {bin}
      </div>);
    })

    let css = {
      bins: [{}].concat(cssCol.concat([this.css.bins, this.props.css.bins])),
      col: [{}].concat(cssCol),
      corner: [{}].concat(cssCol.concat([this.css.corner, this.props.css.corner])),
      root: [{}, this.css.root, this.props.css.root, this.props.style],
      row: [{}, this.css.row, this.props.css.row],
      xAxis: [{}].concat(cssRow.concat([this.css.xAxis, this.props.css.xAxis])),
      xAxisKey: [{}].concat(cssCol.concat([this.css.xAxisKey, this.props.css.xAxisKey])),
      yAxis: [{}].concat(cssCol.concat([this.css.yAxis, this.props.css.yAxis])),
      yAxisKey: [{}, this.css.yAxisKey, this.props.css.yAxisKey]
    };

    let lines = yKeys.map((key, i) => {
      return (
        <div className="line" style={{
          height: 1,
          width: '95%',
          left: '5%',
          borderTop: '1px dotted #000',
          position: 'absolute',
          top: i * 18 + 4.5
        }} />
      );
    });

    return (
      <div className="histogram" style={css.root}>
        <div className="bins" style={css.row}>
          <div className="y-axis" style={css.yAxis}>
            {yKeys.map(key =>
              <div className="y-axis-key" style={css.yAxisKey}>{key}</div>
            ).reverse()}
          </div>
          {bins}
        </div>
        <div className="x-axis" style={css.xAxis}>
          <div className="corner" style={css.corner} />
          {xKeys.map(key =>
            <span
                className="x-axis-key"
                style={css.xAxisKey.concat([{width: (key.size * 14) - 2, padding: '0 1px'}])}>
              {key.label || key.value}
            </span>
          )}
        </div>
        {lines}
      </div>
    );
  }

}
