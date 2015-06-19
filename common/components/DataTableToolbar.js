'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorate from '../lib/decorate';
/* eslint-enable no-unused-vars */

import {
    Toolbar,
    ToolbarGroup
  } from 'material-ui';

@decorate({
  propTypes: {
    className: PropTypes.string,
    count: PropTypes.number,
    label: PropTypes.any,
    style: PropTypes.object
  },
  defaultProps: {
    className: '',
    label: 'Header',
    count: 0,
    style: {}
  }
})
export default class DataTableToolbar extends Component {

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
