'use strict';

import React, {// eslint-disable-line no-unused-vars
  Component,
  PropTypes } from 'react';
import radium from 'radium';
import decorate from '../lib/decorate';

import { LeftNav } from 'material-ui';

@radium
@decorate({
  propTypes: {
    menuItems: PropTypes.array
  },
  defaultProps: {
    menuItems: []
  },
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
           onClick={this.onHeaderClick}>OnRack Web UI</div>
    );

    return (
      <LeftNav
        className="AppMenuNav"
        ref="leftNav"
        docked={false}
        isInitiallyOpen={false}
        header={header}
        menuItems={this.props.menuItems}
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
    var menuItems = this.props.menuItems,
        currentItem;

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

// .AppMenuNav {
//   color: @emc-off-white;
//
//   .mui-menu, .mui-left-nav-menu {
//     background-color: black !important;
//   }
//
//   .mui-left-nav-menu .mui-menu a.mui-menu-item {
//     color: white !important;
//   }
//
//   .nav-logo {
//     padding: 10px 0;
//     font-weight: bold;
//     text-align: center;
//     border-bottom: 1px solid #ddd;
//   }
// }
