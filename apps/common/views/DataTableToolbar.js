// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';

import { Toolbar, ToolbarGroup } from 'material-ui';

export default class DataTableToolbar extends Component {

  static propTypes = {
    className: PropTypes.string,
    count: PropTypes.number,
    label: PropTypes.any,
    style: PropTypes.object
  };

  static defaultProps = {
    className: '',
    label: 'Header',
    count: 0,
    style: {}
  };

  render() {
    return (
      <Toolbar className={this.props.className} style={this.props.style}>
        <ToolbarGroup key={0} float="left">
          <h3>{this.props.label} &nbsp; ({this.props.count})</h3>
        </ToolbarGroup>
        <ToolbarGroup key={1} float="right" style={{zIndex: 1}}>
          {this.props.children}
        </ToolbarGroup>
      </Toolbar>
    );
  }

}
