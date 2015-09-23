// Copyright 2015, EMC, Inc.

'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import decorate from 'common-web-ui/lib/decorate';

import {
    DropDownMenu,
    MenuItem
  } from 'material-ui';

@decorate({
  propTypes: {},
  defaultProps: {},
  contextTypes: {
    layout: PropTypes.any,
    editor: PropTypes.any
  }
})
export default class WEEditMenu extends Component {

  state = {};

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    var editMenuItems = [
      {text: 'Edit', type: MenuItem.Types.SUBHEADER},
      {text: 'Auto Layout'},
      {text: 'Delete Selected'}
    ];
    return (
      <DropDownMenu ref="root" className="EditMenu"
          menuItems={editMenuItems}
          onChange={this.triggerEditAction.bind(this)} />
    );
  }

  triggerEditAction(e, selectedIndex, menuItem) {
    console.log(menuItem);
    if (selectedIndex !== 0) {
      setTimeout(() => {
        this.refs.root._setSelectedIndex({selectedIndex: 0});
      }, 500);
    }
  }

}
