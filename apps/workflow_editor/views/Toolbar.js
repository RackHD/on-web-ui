// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';

import {
    Toolbar,
    ToolbarGroup,
  } from 'material-ui';

import WEFileMenu from './FileMenu';
import WEEditMenu from './EditMenu';
import WEViewMenu from './ViewMenu';

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
      <Toolbar style={{background: '#333', borderBottom: '2px solid #999'}}>
        <ToolbarGroup key={0} float="left" style={{height: 'inherit'}}>
          <WEFileMenu ref="file" />
          {/*<WEEditMenu ref="edit" />
          <WEViewMenu ref="view" />*/}
        </ToolbarGroup>
      </Toolbar>
    );
  }

}
