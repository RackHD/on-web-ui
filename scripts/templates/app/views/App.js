'use strict';

import { Component } from 'react';

import AppContainer from 'common-web-ui/views/AppContainer';

import { navigation } from '../config/routes';

export default class <%= file %> extends Component {

  state = {
    title: this.title,
    navigation
  };

  render() {
    return (
      <AppContainer
          ref="container"
          className="app"
          title={this.state.title}
          navigation={this.state.navigation}
          children={this.props.children} />
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
