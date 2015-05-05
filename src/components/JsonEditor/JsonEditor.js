'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

// Based on http://www.mbates.com/play/ReactJsonEditor/

import './JsonEditor.less';

export default class JsonEditor extends Component {

  state = {
    value: null,
    error: false
  };

  handleChange(newValue) {
    try {
      var newState = JSON.parse(newValue);
      this.setState({value: newState, error: false});
    }

    catch (err) {
      this.setState({error: err});
    }

    if (this.props.updateParentState) {
      this.props.updateParentState(newState);
    }
  }

  linkState() {
    return {
      value: JSON.stringify(this.state.value, null, 2),
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
                  rows={this.props.rows || 12}
                  cols={this.props.cols || 120}
                  disabled={this.props.disabled} />
      </div>
    );
  }

}
