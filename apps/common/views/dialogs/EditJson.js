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
@mixin(DeveloperHelpers)
@mixin(MUIContextHelpers)
@decorate({
  propTypes: {
    callback: PropTypes.func,
    className: PropTypes.string,
    modal: PropTypes.bool,
    object: PropTypes.object,
    defaultOpen: PropTypes.bool,
    style: PropTypes.any,
    title: PropTypes.string,
    updateParentState: PropTypes.func
  },

  defaultProps: {
    callback: null,
    className: '',
    modal: false,
    object: null,
    defaultOpen: true,
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
    return render(component, container);
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
        defaultOpen={this.props.defaultOpen}
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
    unmountComponentAtNode(this.props.container);
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
