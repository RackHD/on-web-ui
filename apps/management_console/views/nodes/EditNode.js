// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';

import mixin from 'rui-common/lib/mixin';
import EditorHelpers from 'rui-common/mixins/EditorHelpers';

import Select from 'react-select';

import {
    FlatButton,
    LinearProgress,
    RaisedButton,
    TextField,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import JsonEditor from 'rui-common/views/JsonEditor';

import NodeStore from 'rui-common/stores/NodeStore';

@mixin(EditorHelpers)
export default class EditNode extends Component {

  static contextTypes = {router: PropTypes.any};

  nodes = new NodeStore();

  state = {
    node: this.props.node,
    disabled: !this.props.node,
    loading: !this.props.node
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.node) {
      this.setState({node: nextProps.node, loading: false, disabled: false});
    }
  }

  render() {
    let { state } = this;

    let node = state.node || {},
        nameLink = this.linkObjectState('node', 'name');

    return (
      <div className="EditNode">
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <ToolbarTitle text={node.id ? 'Edit Node' : 'Create Node'}
                          style={{color: 'white'}}/>
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <RaisedButton
                label="Cancel"
                onClick={this.routeBack}
                disabled={state.disabled} />
            <RaisedButton
                label="Save"
                primary={true}
                onClick={this.saveNode.bind(this)}
                disabled={state.disabled} />
          </ToolbarGroup>
        </Toolbar>
        <LinearProgress mode={state.loading ? 'indeterminate' : 'determinate'} value={100} />
        <div style={{padding: '0 10px 10px'}}>
          <TextField
              valueLink={nameLink}
              hintText="Name"
              floatingLabelText="Name"
              disabled={state.disabled}
              fullWidth={true} />
          <h5 style={{margin: '15px 0 5px', color: '#666'}}>Node Type:</h5>
          <Select
              name="type"
              value={node && node.type}
              placeholder="Select a type..."
              disabled={state.disabled}
              options={[
                {value: 'compute', label: 'Compute Node'},
                {value: 'dea', label: 'DEA Node'},
                {value: 'mgmt', label: 'Management Node'},
                {value: 'pdu', label: 'PDU Node'},
                {value: 'switch', label: 'Switch Node'}
              ]}
              onChange={(option) => {
                let node = state.node || {};
                node.type = option && option.value;
                this.setState({ node });
              }} />
          <h5 style={{margin: '15px 0 5px', color: '#666'}}>Node JSON:</h5>
          <JsonEditor
              value={node}
              updateParentState={this.updateStateFromJsonEditor.bind(this)}
              disabled={state.disabled}
              ref="jsonEditor" />
        </div>
      </div>
    );
  }

  updateStateFromJsonEditor(stateChange) {
    this.setState({node: stateChange});
  }

  saveNode() {
    this.disable();

    if (this.state.node.id) {
      this.nodes.update(this.state.node.id, this.state.node).then(() => this.enable());
    }

    else {
      this.nodes.create(this.state.node).then(() => this.context.router.goBack());
    }
  }

}
