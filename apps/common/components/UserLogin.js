'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
/* eslint-enable no-unused-vars */

import {
    TextField,
    RaisedButton,
    FlatButton
  } from 'material-ui';

export default class UserLogin extends Component {

  state = {disabled: false};

  render() {
    return (
      <div className="UserLogin container">
        <div className="row">
          <div className="one-third column">&nbsp;</div>
          <div className="one-third column">
            <h3>Login</h3>
            <form action="/login" method="post">
              <TextField name="user"
                         hintText="Ralph"
                         floatingLabelText="User Name"
                         style={{width: '100%'}}
                         disabled={this.state.disabled} />
              <TextField name="pass"
                         hintText="Secret"
                         floatingLabelText="Password"
                         style={{width: '100%'}}
                         disabled={this.state.disabled} />
              <div className="buttons container center">
                <div className="one-half column">
                  <FlatButton className="button"
                              label="Cancel"
                              disabled={this.state.disabled} />
                </div>
                <div className="one-half column">
                  <RaisedButton className="button"
                                label="Submit"
                                disabled={this.state.disabled} />
                </div>
              </div>
            </form>
          </div>
          <div className="one-third column">&nbsp;</div>
        </div>
      </div>
    );
  }

}
