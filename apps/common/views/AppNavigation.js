// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import mixin from '../lib/mixin';
import RouteHelpers from '../mixins/RouteHelpers';

import { LeftNav } from 'material-ui';

@radium
@mixin(RouteHelpers)
export default class AppMenuNav extends Component {

  static propTypes = {
  };

  static defaultProps = {
  };

  render() {
    return (
      <LeftNav ref="leftNav"
          className="AppMenuNav"
          open={this.state.open}
          docked={false}
          onRequestChange={open => this.setState({open})}>
        {this.props.children}
      </LeftNav>
    );
  }

  toggleLeftNav() {
    this.setState({open: true});
  }

  // isActive(item) {
  //   let end = window.location.hash.lastIndexOf('?'),
  //       active = window.location.hash.substring(2, end).split('/')[0];
  //   if (Array.isArray(item.route)) {
  //     return item.route.indexOf(active) !== -1;
  //   }
  //   return item.route && item.route == active;
  // }
  //
  // getSelectedIndex() {
  //   var menuItems = this.props.menuItems,
  //       currentItem;
  //
  //   for (var i = menuItems.length - 1; i >= 0; i--) {
  //     currentItem = menuItems[i];
  //     if (this.isActive(currentItem)) { return i; }
  //   }
  // }

}
