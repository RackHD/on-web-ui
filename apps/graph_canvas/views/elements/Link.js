'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorate from 'common-web-ui/lib/decorate';
/* eslint-enable no-unused-vars */

// import ConfirmDialog from 'common-web-ui/views/dialogs/Confirm';

@decorate({
  propTypes: {
    active: PropTypes.bool,
    model: PropTypes.any
  },
  defaultProps: {
    active: false,
    model: null
  },
  contextTypes: {
    graphCanvas: PropTypes.any
  }
})
export default class GCLinkElement extends Component {

  static isVector = true;

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  render() {
    return null;
  }

}
