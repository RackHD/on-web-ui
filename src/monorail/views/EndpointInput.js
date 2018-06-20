// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import { TextField } from 'material-ui';

@radium
export default class EndpointInput extends Component {

  static defaultProps = {
    check: () => {},
    checkWait: 500,
    floatingLabelText: 'Floating Label Text',
    hintText: 'Hint Text',
    onChange: ({ checkCallback }) => { checkCallback(); },
    value: ''
  };

  state = {
    errorStyle: {},
    errorText: ''
  };

  resolve = (reason, cb) => {
    this.setState({
      errorStyle: {color: 'green'},
      errorText: reason
    }, cb);
  }

  reject = (reason, cb) => {
    this.setState({
      errorStyle: {color: 'red'},
      errorText: reason
    }, cb);
  }

  render() {
    let { check, checkWait, floatingLabelText, hintText, onChange, value } = this.props,
        { errorStyle, errorText } = this.state;

    let checkTimer;
    const checkCallback = () => {
      clearTimeout(checkTimer);
      checkTimer = setTimeout(() => {
        check({
          resolve: this.resolve,
          reject: this.reject
        });
      }, checkWait);
    };

    return (
      <TextField
        errorStyle={errorStyle}
        errorText={errorText}
        floatingLabelText={floatingLabelText}
        fullWidth={true}
        hintText={hintText}
        onChange={(e) => {
          onChange({
            checkCallback,
            event: e,
            value: e.target.value
          });
        }}
        value={value}
      />
    );
  }

}
