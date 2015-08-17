'use strict';

import { Component, mixin } from 'mach-react';

import colors from '../config/colors';

export default class Histogram extends Component {

  props = this.assignObject({
    style: {},
    css: {},
    orient: 'horizontal',
    minCount: 0,
    maxCount: 10
  }, this.props);

  state = {};

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

  sortBins(bins) {
    return bins.sort((binA, binB) => {
      let propsA = binA.component.props,
          propsB = binB.component.props;
      return propsA.value - propsB.value ||
             propsA.size - propsB.size ||
             propsA.count - propsB.count;
    });
  }

  getBinProps(bins) {
    return bins.map(bin => bin.component.props);
  }

  getCountKeys() {
    let keys = [],
        len = this.props.maxCount,
        i = this.props.minCount;
    for (; i < len; i += 1) keys.push(i.toString());
    return keys;
  }

  render(React) {
    if (this.props.orient === 'horizontal') {
      return this.renderHorizontal(React);
    }
    return this.renderVertical(React);
  }

  horizontalCSS = {
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
      width: '14px'
    }
  };

  renderHorizontal(React) {
    let props = this.props,
        bins = this.bins,
        css = this.horizontalCSS;

    bins = this.sortBins(bins);

    let xKeys = this.getBinProps(bins),
        yKeys = this.getCountKeys();

    let cssCol = [css.col, props.css.col],
        cssRow = [css.row, props.css.row];

    bins = bins.map(bin => {
      let binProps = bin.component.props;
      return (
        <div
            className="bin-cell"
            style={[{width: (binProps.size * 14) - 2, padding: '0 1px'}].concat(cssCol)}>
          {bin}
        </div>
      );
    });

    let cssMix = {
      bins: cssCol.concat([css.bins, props.css.bins]),
      col: cssCol,
      corner: cssCol.concat([css.corner, props.css.corner]),
      root: [css.root, props.css.root, props.style],
      row: [css.row, props.css.row],
      xAxis: cssRow.concat([css.xAxis, props.css.xAxis]),
      xAxisKey: cssCol.concat([css.xAxisKey, props.css.xAxisKey]),
      yAxis: cssCol.concat([css.yAxis, props.css.yAxis]),
      yAxisKey: [css.yAxisKey, props.css.yAxisKey]
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
      <div className="histogram" style={cssMix.root}>
        <div className="bins" style={cssMix.row}>
          <div className="y-axis" style={cssMix.yAxis}>
            {yKeys.map(key =>
              <div className="y-axis-key" style={cssMix.yAxisKey}>{key}</div>
            ).reverse()}
          </div>
          {bins}
        </div>
        <div className="x-axis" style={cssMix.xAxis}>
          <div className="corner" style={cssMix.corner} />
          {xKeys.map(key =>
            <span
                className="x-axis-key"
                style={cssMix.xAxisKey.concat([{width: (key.size * 14) - 2, padding: '0 1px'}])}>
              {key.label || key.value}
            </span>
          )}
        </div>
        {lines}
      </div>
    );
  }

  verticalCSS = {
    col: {
      display: 'table-cell',
      verticalAlign: 'middle'
    },
    corner: {
      height: '18px',
      width: '27px'
    },
    root: {
      position: 'relative',
      padding: '5px',
      fontSize: '12px',
      lineHeight: '12px',
      display: 'table',
      tableLayout: 'fixed'
    },
    row: {},
    xAxis: {},
    xAxisKey: {
      textAlign: 'center',
      height: '18px',
    },
    yAxisKey: {
      width: '18px'
    }
  };

  renderVertical(React) {
    let props = this.props,
        bins = this.bins,
        css = this.verticalCSS;

    bins = this.sortBins(bins);

    let xKeys = this.getCountKeys(),
        yKeys = this.getBinProps(bins);

    let cssCol = [css.col, props.css.col],
        cssRow = [css.row, props.css.row];

    let cssMix = {
      col: cssCol,
      corner: cssCol.concat([css.corner, props.css.corner]),
      root: [css.root, props.css.root, props.style],
      row: [css.row, props.css.row],
      xAxis: cssRow.concat([css.xAxis, props.css.xAxis]),
      xAxisKey: cssCol.concat([css.xAxisKey, props.css.xAxisKey]),
      yAxisKey: cssCol.concat([css.yAxisKey, props.css.yAxisKey])
    };

    let lines = xKeys.map((key, i) => {
      return (
        <div className="line" style={{
          width: 1,
          height: '92%',
          left: i * 18 + 40,
          borderLeft: '1px dotted #000',
          position: 'absolute',
          bottom: '8%'
        }} />
      );
    });

    let rows = [];

    bins.forEach((bin, i) => {
      let binProps = bin.component.props,
          baseCss = {height: (binProps.size * 14) - 2, padding: '1px 0'},
          key = yKeys[i];
      rows.push(
        <div className="bin-row" style={cssMix.row}>
          <div
              className="y-axis-key"
              style={[baseCss].concat(cssMix.yAxisKey)}>
            {key.label || key.value}
          </div>
          <div
              className="bin-cell"
              style={[baseCss].concat(cssCol)}>
            {bin}
          </div>
        </div>
      );
    });

    return (
      <div className="histogram" style={cssMix.root}>
        {rows}
        <div className="x-axis" style={cssMix.xAxis}>
          <div className="corner" style={cssMix.corner} />
          {xKeys.map(key =>
            <div
                className="x-axis-key"
                style={cssMix.xAxisKey.concat([{width: 16, textAlign: 'center', padding: '0 1px'}])}>
              {key}
            </div>
          )}
        </div>
        {lines}
      </div>
    );
  }

}
