// Copyright 2015, EMC, Inc.

'use strict';

import { Component } from 'react';

import AppContainer from 'common-web-ui/views/AppContainer';

export default class App extends Component {

  state = {
    title: this.title
  };

  render() {
    return (
      <AppContainer
          ref="container"
          className="app"
          header={null}
          title={this.state.title}
          children={this.props.children}
          styles={{content: {padding: 0}}} />
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
