'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorate from '../lib/decorate';
/* eslint-enable no-unused-vars */

import { Snackbar } from 'material-ui';

@decorate({
  propTypes: {
    autoDismiss: PropTypes.number,
    className: PropTypes.string,
    initialError: PropTypes.any,
    style: PropTypes.object
  },
  defaultProps: {
    autoDismiss: 10000,
    className: '',
    initialError: '',
    style: {}
  }
})
export default class ErrorNotification extends Component {

  state = {error: this.props.initialError};

  componentDidUpdate() {
    if (this.state.error) {
      this.refs.snackbar.show();
      setTimeout(this.dismissError.bind(this), this.props.autoDismiss);
    }
  }

  render() {
    return (
      <Snackbar
        ref="snackbar"
        action="dismiss"
        className={'ErrorNotification ' + this.props.className}
        message={this.state.error || 'Unknown error.'}
        style={this.props.style}
        onActionTouchTap={this.dismissError.bind(this)} />
    );
  }

  showError(error) { this.setState({error: error.message || error}); }

  dismissError() {
    this.refs.snackbar.dismiss();
    this.setState({error: null});
  }

}
