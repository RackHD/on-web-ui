// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import radium from 'radium';

import { Dialog } from 'material-ui';

/**
# ConfirmDialog

@object
  @type class
  @extends React.Component
  @name ConfirmDialog
  @desc
*/

@radium
export default class ConfirmDialog extends Component {

  static propTypes = {
    callback: PropTypes.func,
    className: PropTypes.string,
    modal: PropTypes.bool,
    defaultOpen: PropTypes.bool,
    style: PropTypes.any,
    title: PropTypes.string
  };

  static defaultProps = {
    callback: null,
    className: '',
    modal: false,
    defaultOpen: true,
    style: {},
    title: 'Confirm'
  };

  static create(props, parent) {
    // TODO: dry this code
    props = props || {};
    parent = parent || document.body;

    var container = document.createElement('div');
    props.container = container;
    parent.appendChild(container);

    var component = <this {...props}/>;
    return render(component, container);
  }

  state = {};

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    let confirmActions = [
      { text: 'Cancel', onTouchTap: this.dismiss.bind(this, false) },
      { text: 'OK', onTouchTap: this.dismiss.bind(this, true), ref: 'ok' }
    ];

    return (
      <Dialog ref="root"
        actions={confirmActions}
        actionFocus="ok"
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        contentClassName={this.props.className}
        contentStyle={this.props.style}
        modal={this.props.modal}
        defaultOpen={this.props.defaultOpen}
        title={this.props.title}>
        {this.props.children}
      </Dialog>
    );
  }

  remove() {
    // TODO: dry this code
    unmountComponentAtNode(this.props.container);
    this.props.container.parentNode.removeChild(this.props.container);
  }

  dismiss(acknowledged) {
    this.refs.root.dismiss();
    if (this.props.callback) { this.props.callback(acknowledged); }
    this.remove();
  }

  show() {
    this.refs.root.show();
  }

}
