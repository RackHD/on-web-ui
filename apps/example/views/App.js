'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component } from 'react';

import AppContainer from 'common-web-ui/components/AppContainer';

export default class App extends Component {

  navigationItems = [
    { text: 'Login', route: '/' },
    { text: 'Not Found', route: '404' },
    { text: 'Canvas', route: 'canvas' }
  ];

  render() {
    return (
      <AppContainer
          ref="container"
          className="app"
          navigationItems={this.navigationItems} />
    );
  }

}
