'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';
import radium from 'radium';
import decorate from '../lib/decorate';
import { AppBar } from 'material-ui';

import emcColors from '../lib/emcColors';

import AppNavigation from './AppNavigation';
import EMCTab from './EMCTab';

@radium
@decorate({
  propTypes: {
    title: PropTypes.string,
    appBarStyles: PropTypes.object,
    className: PropTypes.string,
    navigationItems: PropTypes.array
  },
  defaultProps: {
    title: 'On Web UI',
    appBarStyles: {
      background: emcColors.mediumGrey.hexString(),
      color: emcColors.offWhite.hexString()
    },
    className: '',
    navigationItems: []
  }
})
export default class AppHeader extends Component {

  _onLeftIconButtonTouchTap = this.onLeftIconButtonTouchTap.bind(this);

  render() {
    var stylesAppBar = this.props.appBarStyles;
    stylesAppBar.position = 'fixed';

    var emcTab = <EMCTab />;

    return (
      <div
          className={this.props.className}>

        <AppBar
            onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap}
            iconElementRight={emcTab}
            title={this.props.title}
            style={stylesAppBar}
            zDepth={0} />

        <AppNavigation
            ref="navigation"
            menuItems={this.props.navigationItems} />

      </div>
    );
  }

  onLeftIconButtonTouchTap() {
    this.refs.navigation.toggle();
  }

}
