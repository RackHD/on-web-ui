// Copyright 2015, EMC, Inc.

'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import decorate from 'common-web-ui/lib/decorate';

import {
    Toolbar,
    ToolbarGroup,
  } from 'material-ui';

import WEFileMenu from './FileMenu';
import WEEditMenu from './EditMenu';
import WEViewMenu from './ViewMenu';

@decorate({
  propTypes: {},
  defaultProps: {},
  contextTypes: {
    layout: PropTypes.any,
    editor: PropTypes.any
  }
})
export default class WEToolbar extends Component {

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
