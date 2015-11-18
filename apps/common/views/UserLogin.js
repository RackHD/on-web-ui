// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import {
    TextField,
    RaisedButton,
    FlatButton
  } from 'material-ui';

export default class UserLogin extends Component {

  state = UserLogin.getInitialState();

  static getInitialState(cb) {
    let state = {
      disabled: false,
      loginHeader: 'Login'
    };

    if (cb) cb(state);

    return state;
  }

  render() {
    return this.renderLogin();
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

  onCancel() {}

  onSubmit() {}

  renderLogin() {
    return (
      <div className="UserLogin container">
        <div className="row" style={{padding: '0 0 20px 0'}}>
          <div className="one-third column">&nbsp;</div>
          <div className="one-third column">
            <h3>{this.state.loginHeader}</h3>
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
            <div className="buttons container center">
              <div className="one-half column">
                <FlatButton
                    onClick={this.onCancel.bind(this)}
                    className="button"
                    label="Cancel"
                    disabled={this.state.disabled} />
              </div>
              <div className="one-half column">
                <RaisedButton
                    onClick={this.onSubmit.bind(this)}
                    className="button"
                    label="Submit"
                    disabled={this.state.disabled} />
              </div>
            </div>
          </div>
          <div className="one-third column">&nbsp;</div>
        </div>
      </div>
    );
  }

}
