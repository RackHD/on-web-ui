// Copyright 2015, EMC, Inc.

'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import radium from 'radium';
import mixin from '../../lib/mixin';
import decorate from '../../lib/decorate';

import DeveloperHelpers from '../../mixins/DeveloperHelpers';
import MUIContextHelpers from '../../mixins/MUIContextHelpers';

import {
    Dialog
  } from 'material-ui';

/**
# AlertDialog

@object
  @type class
  @extends React.Component
  @name AlertDialog
  @desc
*/

@radium
@mixin(DeveloperHelpers)
@mixin(MUIContextHelpers)
@decorate({
  propTypes: {
    callback: PropTypes.func,
    className: PropTypes.string,
    container: PropTypes.any,
    modal: PropTypes.bool,
    defaultOpen: PropTypes.bool,
    style: PropTypes.any,
    title: PropTypes.string
  },

  defaultProps: {
    callback: null,
    className: '',
    container: null,
    modal: false,
    defaultOpen: true,
    style: {},
    title: 'Alert'
  },
  childContextTypes: MUIContextHelpers.muiContextTypes()
})
export default class AlertDialog extends Component {

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

  getChildContext() {
    return this.muiContext();
  }

  render() {
    let alertActions = [
      { text: 'OK', onTouchTap: this.dismiss.bind(this), ref: 'ok' }
    ];

    return (
      <Dialog ref="root"
        actions={alertActions}
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
    unmountComponentAtNode(this.props.container);
    this.props.container.parentNode.removeChild(this.props.container);
  }

  dismiss() {
    this.refs.root.dismiss();
    if (this.props.callback) { this.props.callback(true); }
    this.remove();
  }

  show() {
    this.refs.root.show();
  }

}
