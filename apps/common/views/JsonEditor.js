'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorate from '../lib/decorate';
/* eslint-enable no-unused-vars */

// Based on http://www.mbates.com/play/ReactJsonEditor/

@decorate({
  propTypes: {
    rows: PropTypes.number,
    cols: PropTypes.number,
    disabled: PropTypes.bool,
    initialValue: PropTypes.any,
    updateParentState: PropTypes.func
  },
  defaultProps: {
    rows: 12,
    cols: 120,
    disabled: false
  }
})
export default class JsonEditor extends Component {

  state = {
    value: null,
    error: false
  };

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
