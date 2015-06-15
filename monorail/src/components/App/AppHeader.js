'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorateComponent from 'common-web-ui/lib/decorateComponent';
/* eslint-enable no-unused-vars */

import { AppBar } from 'material-ui';

import AppMenuNav from './AppMenuNav';

@decorateComponent({
  contextTypes: {
    muiTheme: PropTypes.object
  }
})
export default class AppHeader extends Component {

  _onLeftIconButtonTouchTap = this.onLeftIconButtonTouchTap.bind(this);

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
