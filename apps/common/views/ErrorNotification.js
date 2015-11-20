// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';

import { Snackbar } from 'material-ui';

export default class ErrorNotification extends Component {

  static propTypes = {
    autoDismiss: PropTypes.number,
    className: PropTypes.string,
    initialError: PropTypes.any,
    style: PropTypes.object
  };

  static defaultProps = {
    autoDismiss: 10000,
    className: '',
    initialError: '',
    style: {}
  };

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
