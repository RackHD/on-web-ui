// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';

import {
    Toolbar,
    ToolbarGroup,
  } from 'material-ui';

import WEFileMenu from './FileMenu';

export default class WEToolbar extends Component {

  static contextTypes = {
    layout: PropTypes.any,
    editor: PropTypes.any
  };

  state = {};

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <Toolbar style={null}>
        <ToolbarGroup key={0} float="left" style={{height: 'inherit'}}>
          <WEFileMenu ref="file" />
        </ToolbarGroup>
      </Toolbar>
    );
  }

}
