// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import mixin from 'common-web-ui/lib/mixin';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
import UserLogin from 'common-web-ui/views/UserLogin';

import LoginAPI from '../messengers/LoginAPI';

@mixin(RouteHelpers)
export default class OnRackUserLogin extends UserLogin {

  state = UserLogin.getInitialState(state => {
    state.loginHeader = 'OnRack Login';
  });

  componentWillMount() {
    if (window.localStorage['onrack-auth-token']) {
      this.routeTo('dash');
    }
  }

  onCancel() {
    this.routeTo('dash');
  }

  onSubmit() {
    LoginAPI.auth(this.user, this.pass).then(
      res => this.routeTo('dash'),
      err => console.error(err));
  }

  render() {
    return this.renderLogin();
  }

}
