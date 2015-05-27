'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorateComponent from 'common-web-ui/lib/decorateComponent';
/* eslint-enable no-unused-vars */


import { MenuItem, LeftNav } from 'material-ui';

const menuItems = [
  { text: 'Dashboard', route: '/' },
  { text: 'Objects', type: MenuItem.Types.SUBHEADER },
  { text: 'Nodes', route: 'nodes' },
  { text: 'Workflows', route: 'workflows' },
  { text: 'Tools', type: MenuItem.Types.SUBHEADER },
  { text: 'Workflow Builder', route: 'builder' },
  { text: 'Other', type: MenuItem.Types.SUBHEADER },
  { text: 'EMC', type: MenuItem.Types.LINK, payload: 'http://emc.com' }
];

@decorateComponent({
  contextTypes: {
    router: PropTypes.func
  }
})
export default class AppMenuNav extends Component {

  toggle = this.toggle.bind(this);
  getSelectedIndex = this.getSelectedIndex.bind(this);
  onLeftNavChange = this.onLeftNavChange.bind(this);
  onHeaderClick = this.onHeaderClick.bind(this);

  render() {
    var header = (
      <div className="nav-logo"
           onClick={this.onHeaderClick}>Monorail Web UI</div>
    );

    return (
      <LeftNav
        className="AppMenuNav"
        ref="leftNav"
        docked={false}
        isInitiallyOpen={false}
        header={header}
        menuItems={menuItems}
        selectedIndex={this.getSelectedIndex()}
        onChange={this.onLeftNavChange} />
    );
  }

  isActive(item) {
    var router = this.context.router;
    return item.route && router && router.isActive(item.route);
  }

  toggle() {
    this.refs.leftNav.toggle();
  }

  getSelectedIndex() {
    var currentItem;

    for (var i = menuItems.length - 1; i >= 0; i--) {
      currentItem = menuItems[i];
      if (this.isActive(currentItem)) { return i; }
    }
  }

  onLeftNavChange(e, key, payload) {
    if (this.context.router) {
      this.context.router.transitionTo(payload.route);
    }
  }

  onHeaderClick() {
    if (this.context.router) {
      this.context.router.transitionTo('root');
      this.refs.leftNav.close();
    }
  }

}
