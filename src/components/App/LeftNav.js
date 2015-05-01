'use strict';

import React, { Component, PropTypes } from 'react'; // eslint-disable-line no-unused-vars

import { MenuItem, LeftNav } from 'material-ui';

let menuItems = [
  { route: 'get-started', text: 'Get Started' },
  { route: 'customization', text: 'Customization' },
  { route: 'components', text: 'Components' },
  { type: MenuItem.Types.SUBHEADER, text: 'Resources' },
  { type: MenuItem.Types.LINK, payload: 'https://github.com/callemall/material-ui', text: 'GitHub' },
  { type: MenuItem.Types.LINK, payload: 'http://facebook.github.io/react', text: 'React' },
  { type: MenuItem.Types.LINK, payload: 'https://www.google.com/design/spec/material-design/introduction.html', text: 'Material Design' }
];

class LeftNav extends Component {

  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
    // this.getSelectedIndex = this.getSelectedIndex.bind(this);
    // this.onLeftNavChange = this.onLeftNavChange.bind(this);
    // this.onHeaderClick = this.onHeaderClick.bind(this);
  }

  render() {
    var header = <div className="logo" onClick={this.onHeaderClick}>material ui</div>;

    return (
      <LeftNav
        ref="leftNav"
        docked={false}
        isInitiallyOpen={false}
        header={header}
        menuItems={menuItems}
        selectedIndex={this.getSelectedIndex()}
        onChange={this.onLeftNavChange} />
    );
  }

  toggle() {
    this.refs.leftNav.toggle();
  }

  getSelectedIndex() {
    var currentItem;

    try {
      for (var i = menuItems.length - 1; i >= 0; i--) {
        currentItem = menuItems[i];
        if (currentItem.route && this.context.router.isActive(currentItem.route)) { return i; }
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  onLeftNavChange(e, key, payload) {
    this.context.router.transitionTo(payload.route);
  }

  onHeaderClick() {
    this.context.router.transitionTo('root');
    this.refs.leftNav.close();
  }

}


LeftNav.contextTypes = {
  router: PropTypes.func
};

export default LeftNav;
