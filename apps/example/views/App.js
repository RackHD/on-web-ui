'use strict';

import { Component } from 'react';

import AppContainer from 'common-web-ui/views/AppContainer';

export default class App extends Component {

  state = {
    title: this.title,
    navigation: [
      { text: 'Login', route: '/' },
      { text: 'Not Found', route: '404' },
      { text: 'Canvas', route: 'canvas' }
    ]
  };

  render() {
    return (
      <AppContainer
          ref="container"
          className="app"
          title={this.state.title}
          navigation={this.state.navigation} />
    );
  }

  get title() {
    return this.findTitle().innerHTML;
  }

  set title(title) {
    this.setState({ title });
    this.findTitle().innerHTML = title;
  }

  findTitle() {
    return document.head.querySelector('title');
  }

}
