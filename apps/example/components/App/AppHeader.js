'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import { AppBar } from 'material-ui';

import AppMenuNav from './AppMenuNav';

export default class AppHeader extends Component {

  _onLeftIconButtonTouchTap = this.onLeftIconButtonTouchTap.bind(this);

  render() {
    var title = 'On Web UI - Examples';

    var emcTab = (
      <a className="emc-tab right"
         href="http://emc.com">
        <img className="emc-logo"
             src="WhiteLogoLarge.png"
             alt="EMC" />
      </a>
    );

    var stylesAppBar = {
      position: 'fixed'
    };

    return (
      <div className="AppHeader">
        <AppBar className="header"
                onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap}
                title={title}
                style={stylesAppBar}
                zDepth={0}
                iconElementRight={emcTab}
                />

        <AppMenuNav ref="menuNav" />
      </div>
    );
  }

  onLeftIconButtonTouchTap() {
    this.refs.menuNav.toggle();
  }

}
