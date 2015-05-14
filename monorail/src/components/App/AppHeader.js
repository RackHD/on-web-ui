'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import { AppBar } from 'material-ui';

import AppMenuNav from './AppMenuNav';

export default class AppHeader extends Component {

  _onMenuIconButtonTouchTap = this.onMenuIconButtonTouchTap.bind(this);

  render() {
    var title = 'Monorail Web UI';

    var emcTab = (
      <a className="emc-tab right"
         href="http://emc.com">
        <img className="emc-logo"
             src="WhiteLogoLarge.png"
             alt="EMC" />
      </a>
    );

    return (
      <div className="AppHeader">
        <AppBar className="header"
                onMenuIconButtonTouchTap={this._onMenuIconButtonTouchTap}
                title={title}
                zDepth={0}
                iconElementRight={emcTab}
                />

        <AppMenuNav ref="menuNav" />
      </div>
    );
  }

  onMenuIconButtonTouchTap() {
    this.refs.menuNav.toggle();
  }

}
