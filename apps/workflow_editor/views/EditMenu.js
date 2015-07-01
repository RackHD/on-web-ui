'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component } from 'react';

import {
    DropDownMenu,
    MenuItem
  } from 'material-ui';

export default class WEEditMenu extends Component {

  state = {};

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    var workflowMenuItems = [
      {text: 'Edit', type: MenuItem.Types.SUBHEADER},
      {text: 'View JSON Source'}
    ];
    return (
      <DropDownMenu ref="root" className="WorkflowsFileMenu"
          menuItems={workflowMenuItems}
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
