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
    title: PropTypes.string,
    menuItems: PropTypes.array,
    brandStyle: PropTypes.object
  };

  static defaultProps = {
    title: 'Dashboard',
    menuItems: [],
    brandStyle: {}
  };

  toggleLeftNav = this.toggleLeftNav.bind(this);
  getSelectedIndex = this.getSelectedIndex.bind(this);
  onLeftNavChange = this.onLeftNavChange.bind(this);

  render() {
    return (
      <LeftNav
        className="AppMenuNav"
        ref="leftNav"
        docked={false}
        isInitiallyOpen={false}
        menuItems={this.props.menuItems}
        selectedIndex={this.getSelectedIndex()}
        onChange={this.onLeftNavChange} />
    );
  }

  isActive(item) {
    let end = window.location.hash.lastIndexOf('?'),
        active = window.location.hash.substring(2, end).split('/')[0];
    if (Array.isArray(item.route)) {
      return item.route.indexOf(active) !== -1;
    }
    return item.route && item.route == active;
  }

  toggleLeftNav() {
    this.refs.leftNav.toggle();
  }

  getSelectedIndex() {
    var menuItems = this.props.menuItems,
        currentItem;

    for (var i = menuItems.length - 1; i >= 0; i--) {
      currentItem = menuItems[i];
      if (this.isActive(currentItem)) { return i; }
    }
  }

  onLeftNavChange(e, key, payload) {
    this.routeTo(Array.isArray(payload.route) ? payload.route[0] : payload.route);
  }

}
