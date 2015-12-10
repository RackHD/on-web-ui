// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import radium from 'radium';

import { Dialog, TextField } from 'material-ui';

@radium
export default class PromptDialog extends Component {

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
    title: 'Prompt'
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

  state = {
    open: true
  };

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    let confirmActions = [
      { text: 'Cancel', onTouchTap: this.dismiss.bind(this, false) },
      { text: 'OK', onTouchTap: this.dismiss.bind(this, true), ref: 'ok' }
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
        defaultOpen={this.props.defaultOpen}
        title={this.props.title}>
        {this.props.children}
        <div>
          <TextField
            ref="input"
            fullWidth={true}
            floatingLabelText="Value" />
        </div>
      </Dialog>
    );
  }

  remove() {
    unmountComponentAtNode(this.props.container);
    this.props.container.parentNode.removeChild(this.props.container);
  }

  dismiss(acknowledged) {
    this.setState({open: false}, () => {
      if (this.props.callback) {
        acknowledged = acknowledged ? this.refs.input.getValue() : null;
        this.props.callback(acknowledged);
      }
      this.remove();
    });
  }

  show() {
    this.setState({open: true});
  }

}
