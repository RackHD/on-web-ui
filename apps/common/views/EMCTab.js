'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component } from 'react';
import radium from 'radium';
import decorate from '../lib/decorate';

@radium
@decorate({
  propTypes: {},
  defaultProps: {}
})
export default class AppHeader extends Component {

  render() {
    return (
      <a
          className="emc-tab right"
          href="http://emc.com">

        <img
            className="emc-logo"
            src="/common/WhiteLogoLarge.png"
            alt="EMC" />

      </a>
    );
  }

}
