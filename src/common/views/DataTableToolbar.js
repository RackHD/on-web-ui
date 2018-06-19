// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

import { Toolbar, ToolbarGroup } from 'material-ui';

export default class DataTableToolbar extends Component {

  static propTypes = {
    className: PropTypes.string,
    count: PropTypes.number,
    icon: PropTypes.any,
    label: PropTypes.any,
    style: PropTypes.object
  };

  static defaultProps = {
    className: '',
    count: 0,
    icon: null,
    label: 'Header',
    style: {}
  };

  static contextTypes = {
    muiTheme: PropTypes.any
  };

  render() {
    let emcTheme = this.context.muiTheme;
    return (
      <Toolbar className={this.props.className} style={this.props.style}>
        <ToolbarGroup key={0} firstChild={true}>
          <h3 style={{margin: '15px 0', color: emcTheme.rawTheme.palette.textColor}}>
            {this.props.icon} &nbsp; {this.props.label} &nbsp; ({this.props.count})
          </h3>
        </ToolbarGroup>
        <ToolbarGroup key={1} lastChild={true} style={{zIndex: 1}}>
          {this.props.children}
        </ToolbarGroup>
      </Toolbar>
    );
  }

}
