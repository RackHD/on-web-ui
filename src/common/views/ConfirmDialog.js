// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import radium from 'radium';

import { Dialog, FlatButton } from 'material-ui';

@radium
export default class ConfirmDialog extends Component {

  static propTypes = {
    callback: PropTypes.func,
    className: PropTypes.string,
    modal: PropTypes.bool,
    open: PropTypes.bool,
    style: PropTypes.any,
    title: PropTypes.string
  };

  static defaultProps = {
    callback: null,
    className: '',
    modal: false,
    open: true,
    style: {},
    title: 'Confirm'
  };

  state = {
    open: this.props.open
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.open && nextProps.open !== this.state.open) {
      this.setState({open: nextProps.open});
    }
  }

  render() {
    const confirmActions = [
      <FlatButton
          label="Cancel"
          secondary={true}
          onTouchTap={this.dismiss.bind(this, false)} />,
      <FlatButton ref="ok"
          label="Submit"
          primary={true}
          keyboardFocused={true}
          onTouchTap={this.dismiss.bind(this, true)} />
    ];

    return (
      <Dialog ref="root"
        open={this.state.open}
        actions={confirmActions}
        actionFocus="ok"
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        contentClassName={this.props.className}
        contentStyle={this.props.style}
        modal={this.props.modal}
        title={this.props.title}>
        {this.props.children}
      </Dialog>
    );
  }

  dismiss(acknowledged) {
    this.setState({open: false}, () => {
      if (this.props.callback) { this.props.callback(acknowledged); }
    });
  }

  show() {
    this.setState({open: true});
  }

}
