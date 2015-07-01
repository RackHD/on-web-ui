'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component } from 'react';

import {
    Toolbar,
    ToolbarGroup,
  } from 'material-ui';

import WEFileMenu from './FileMenu';
import WEEditMenu from './EditMenu';

export default class WEToolbar extends Component {

  state = {};

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <Toolbar>
        <ToolbarGroup key={0} float="left" style={{height: 'inherit'}}>
          <WEFileMenu editor={this.props.editor} />
          <WEEditMenu editor={this.props.editor} />
        </ToolbarGroup>
      </Toolbar>
    );
  }

}
