// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import lodash from 'lodash'

export default class JsonEditor extends Component {

  static propTypes = {
    cols: PropTypes.number,
    disabled: PropTypes.bool,
    rows: PropTypes.number,
    updateParentState: PropTypes.func,
    value: PropTypes.any
  };

  static defaultProps = {
    rows: 12,
    cols: 120,
    disabled: false
  };

  state = {
    value: this.props.value,
    error: false
  };

  componentWillReceiveProps(nextProps) {
    if (!lodash.isEqual(nextProps.value, this.props.value)){
      this.setState({value: nextProps.value});
    }
  }

  handleChange(event) {
    let newState;

    try {
      newState = JSON.parse(event.target.value);
      this.setState({rawValue: null, value: newState, error: false});
    }

    catch (err) {
      this.setState({rawValue: event.target.value, error: err});
    }

    if (this.props.updateParentState) {
      this.props.updateParentState(newState);
    }
  }

  get currentValue() {
    return this.state.rawValue ?
      this.state.rawValue : JSON.stringify(this.state.value, null, 2);
  }

  render() {
    return (
      <div className={'JsonEditor' + (this.props.disabled ? ' disabled' : '')}>
        {this.state.error ? (
          <div className="error">{JSON.stringify(this.state.error.message)}</div>
        ) : null}
        <textarea ref="textarea"
                  defaultValue={this.props.value}
                  value={this.currentValue}
                  onChange={this.handleChange.bind(this)}
                  rows={this.props.rows}
                  cols={this.props.cols}
                  disabled={this.props.disabled}
                  style={this.props.style || {width: '99%', height: 300}} />
      </div>
    );
  }

}
