'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';
import radium from 'radium';
import decorate from '../lib/decorate';

import { AppBar } from 'material-ui';
import AppNavigation from './AppNavigation';
import EMCTab from './EMCTab';

@radium
@decorate({
  propTypes: {
    appBarStyle: PropTypes.object,
    className: PropTypes.string,
    navigation: PropTypes.array,
    style: PropTypes.any,
    title: PropTypes.string
  },
  defaultProps: {
    appBarStyle: {
      color: 'inherit',
      background: 'inherit',
      position: 'fixed'
    },
    className: '',
    navigation: [],
    style: [],
    title: 'On Web UI'
  }
})
export default class AppHeader extends Component {

  _onLeftIconButtonTouchTap = this.onLeftIconButtonTouchTap.bind(this);

  render() {
    var emcTab = <EMCTab />;

    return (
      <div
          className={this.props.className}
          style={this.props.style}>

        <AppBar
            onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap}
            iconElementRight={emcTab}
            title={this.props.title}
            style={this.props.appBarStyle}
            zDepth={0} />

        <AppNavigation
            ref="navigation"
            title={this.props.title}
            menuItems={this.props.navigation} />

      </div>
    );
  }

  onLeftIconButtonTouchTap() {
    this.refs.navigation.toggle();
  }

}
