// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';

// Based on http://www.mbates.com/play/ReactJsonEditor/

export default class JsonEditor extends Component {

  static propTypes = {
    rows: PropTypes.number,
    cols: PropTypes.number,
    disabled: PropTypes.bool,
    initialValue: PropTypes.any,
    updateParentState: PropTypes.func
  };

  static defaultProps = {
    rows: 12,
    cols: 120,
    disabled: false
  };

  state = {
    value: null,
    error: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialValue !== this.props.initialValue) {
      this.setState({value: nextProps.initialValue});
    }
  }

  handleChange(newValue) {
    try {
      var newState = JSON.parse(newValue);
      this.setState({rawValue: null, value: newState, error: false});
    }

    catch (err) {
      this.setState({rawValue: newValue, error: err});
    }

    if (this.props.updateParentState) {
      this.props.updateParentState(newState);
    }
  }

  linkState() {
    return {
      value: this.state.rawValue ? this.state.rawValue : JSON.stringify(this.state.value, null, 2),
      requestChange: this.handleChange.bind(this)
    };
  }

  render() {
    if (this.state.value === null) {
      this.state.value = this.props.initialValue;
    }
    return (
      <div className={'JsonEditor' + (this.props.disabled ? ' disabled' : '')}>
        {this.state.error ? (
          <div className="error">{JSON.stringify(this.state.error.message)}</div>
        ) : null}
        <textarea valueLink={this.linkState()}
                  rows={this.props.rows}
                  cols={this.props.cols}
                  disabled={this.props.disabled}
                  style={this.props.style || {width: '99%', height: 300}} />
      </div>
    );
  }

}
