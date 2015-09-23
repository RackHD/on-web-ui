// Copyright 2015, EMC, Inc.

'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from '../../lib/decorate';

import DeveloperHelpers from '../../mixins/DeveloperHelpers';
import MUIContextHelpers from '../../mixins/MUIContextHelpers';

import {
    Dialog
  } from 'material-ui';

import JsonEditor from '../JsonEditor';

/**
# PromptDialog

@object
  @type class
  @extends React.Component
  @name PromptDialog
  @desc
*/

@radium
@mixin.decorate(DeveloperHelpers)
@mixin.decorate(MUIContextHelpers)
@decorate({
  propTypes: {
    callback: PropTypes.string,
    className: PropTypes.string,
    modal: PropTypes.bool,
    object: PropTypes.object,
    openImmediately: PropTypes.bool,
    style: PropTypes.any,
    title: PropTypes.string,
    updateParentState: PropTypes.func
  },

  defaultProps: {
    callback: null,
    className: '',
    modal: false,
    object: null,
    openImmediately: true,
    style: {},
    title: 'Prompt',
    updateParentState: null
  },
  childContextTypes: MUIContextHelpers.muiContextTypes()
})
export default class EditJsonDialog extends Component {

  static create(props, parent) {
    // TODO: dry this code
    props = props || {};
    parent = parent || document.body;

    var container = document.createElement('div');
    props.container = container;
    parent.appendChild(container);

    var component = <this {...props}/>;
    return React.render(component, container);
  }

  state = {};

  componentDidMount() {}

  componentWillUnmount() {}

  getChildContext() {
    return this.muiContext();
  }

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
        openImmediately={this.props.openImmediately}
        title={this.props.title}>
        {this.props.children}
        <div>
          <JsonEditor
            ref="input"
            rows={5}
            cols={40}
            initialValue={this.props.object}
            updateParentState={this.props.updateParentState} />
        </div>
      </Dialog>
    );
  }

  remove() {
    // TODO: dry this code
    React.unmountComponentAtNode(this.props.container);
    this.props.container.parentNode.removeChild(this.props.container);
  }

  dismiss(acknowledged) {
    this.refs.root.dismiss();
    if (this.props.callback) {
      acknowledged = acknowledged ? this.refs.input.state.value : null;
      this.props.callback(acknowledged);
    }
    this.remove();
  }

  show() {
    this.refs.root.show();
  }

}
