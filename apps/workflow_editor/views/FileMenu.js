'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
/* eslint-enable no-unused-vars */

import {
    DropDownMenu,
    MenuItem
  } from 'material-ui';

@mixin.decorate(RouteHelpers)
export default class WEFileMenu extends Component {

  state = {};

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    var fileMenuItems = [
      {text: 'File', type: MenuItem.Types.SUBHEADER},
      {text: 'New'},
      {text: 'Clone'},
      {text: 'Load'}
    ];

    return (
      <DropDownMenu ref="root" className="FileMenu"
          menuItems={fileMenuItems}
          onChange={this.triggerFileAction.bind(this)} />
    );
  }

  triggerFileAction(e, selectedIndex, menuItem) {
    console.log(menuItem);
    if (selectedIndex !== 0) {
      setTimeout(() => {
        this.refs.root._setSelectedIndex({selectedIndex: 0});
      }, 500);
    }
  }

}
