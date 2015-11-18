// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import AppContainer from 'common-web-ui/views/AppContainer';

import { navigation } from '../config/routes';

export default class App extends Component {

  state = {
    navigation
  };

  render() {
    return (
      <AppContainer
          ref="container"
          navigation={this.state.navigation}
          {...this.props} />
    );
  }

}
