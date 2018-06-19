// Copyright 2015, EMC, Inc.

import React, { Component } from 'react';

import {
    TextField,
    RaisedButton,
    FlatButton
  } from 'material-ui';

export default class UserLogin extends Component {

  static defaultProps = {
    header: 'Login',
    onSubmit: null,
    submitLabel: 'Submit'
  };

  state = {
    disabled: false
  };

  render() {
    let header = null;
    return (
      <div className="UserLogin">
        {this.props.header}
        <TextField
            ref="user"
            name="user"
            hintText="Ralph"
            floatingLabelText="User Name"
            style={{width: '100%'}}
            disabled={this.state.disabled} />
        <TextField
            ref="pass"
            name="pass"
            hintText="Secret"
            floatingLabelText="Password"
            style={{width: '100%'}}
            type="password"
            disabled={this.state.disabled} />
        <div className="buttons">
          {this.props.cancel}
          <RaisedButton
              onClick={this.onSubmit.bind(this)}
              className="button"
              label={this.props.submitLabel}
              disabled={this.state.disabled} />
        </div>
      </div>
    );
  }

  get user() {
    return this.refs.user.getValue();
  }

  get pass() {
    return this.refs.pass.getValue();
  }

  disable() {
    this.setState({disabled: true});
  }

  enable() {
    this.setState({disabled: false});
  }

  onSubmit() {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.user, this.pass);
    }
  }

}
