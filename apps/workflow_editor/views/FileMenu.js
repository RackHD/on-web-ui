'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
/* eslint-enable no-unused-vars */

import {
    DropDownMenu,
    MenuItem
  } from 'material-ui';

@mixin.decorate(RouteHelpers)
@decorate({
  propTypes: {},
  defaultProps: {},
  contextTypes: {
    layout: PropTypes.any,
    editor: PropTypes.any
  }
})
export default class WEFileMenu extends Component {

  get weLayout() {
    return this.context.weLayout;
  }

  state = {};

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    var fileMenuItems = [
      {text: 'File', type: MenuItem.Types.SUBHEADER},
      {text: 'New'}//,
      // {text: 'Clone'},
      // {text: 'Load'}
    ];

    return (
      <DropDownMenu ref="root"
          className="FileMenu"
          menuItems={fileMenuItems}
          onChange={this.triggerFileAction.bind(this)} />
    );
  }

  triggerFileAction(e, selectedIndex, menuItem) {
    if (menuItem.text === 'New') {
      this.context.layout.resetWorkflow();
      this.routeTo('');
    }
    if (selectedIndex !== 0) {
      setTimeout(() => {
        this.refs.root._setSelectedIndex({selectedIndex: 0});
      }, 500);
    }
  }

}
