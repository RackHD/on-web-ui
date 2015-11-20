// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';

import { DropDownMenu, MenuItem } from 'material-ui';

export default class WEViewMenu extends Component {

  static contextTypes = {
    layout: PropTypes.any,
    editor: PropTypes.any
  };

  state = {};

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    var viewMenuItems = [
      {text: 'View', type: MenuItem.Types.SUBHEADER},
      {text: 'View Selected'},
      {text: 'Go Home'}
    ];
    return (
      <DropDownMenu ref="root"
          className="ViewMenu"
          menuItems={viewMenuItems}
          onChange={this.triggerViewAction.bind(this)} />
    );
  }

  triggerViewAction(e, selectedIndex, menuItem) {
    console.log(menuItem);
    if (selectedIndex !== 0) {
      setTimeout(() => {
        this.refs.root._setSelectedIndex({selectedIndex: 0});
      }, 500);
    }
  }

}
