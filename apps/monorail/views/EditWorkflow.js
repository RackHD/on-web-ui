// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import EditorHelpers from 'common-web-ui/mixins/EditorHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
import GridHelpers from 'common-web-ui/mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import Select from 'react-select';

import {
    FlatButton,
    LinearProgress,
    RaisedButton,
    TextField,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import JsonEditor from 'common-web-ui/views/JsonEditor';

import WorkflowTemplateStore from '../stores/WorkflowTemplateStore';
let workflowTemplates = new WorkflowTemplateStore();

import WorkflowStore from '../stores/WorkflowStore';
let workflows = new WorkflowStore();

import NodeStore from '../stores/NodeStore';
let nodes = new NodeStore();
let nodesRestAPI = nodes.nodesRestAPI;

@mixin(DialogHelpers)
@mixin(FormatHelpers)
@mixin(EditorHelpers)
@mixin(RouteHelpers)
@mixin(GridHelpers)
export default class EditWorkflow extends Component {

  state = {
    nodes: [],
    library: null,
    workflow: this.props.workflow,
    disabled: !this.props.workflow,
    loading: !this.props.workflow
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.workflow) this.setState({workflow: nextProps.workflow, loading: false, disabled: false});
  }

  componentWillMount() {
    this.unwatchWorkflowTemplates = workflowTemplates.watchAll('library', this);
    this.unwatchNodes = nodes.watchAll('nodes', this);
    Promise.all([workflowTemplates.list(), nodes.list()]).then(() => this.setState({disabled: false}));
  }

  componentWillUnmount() {
    this.unwatchWorkflowTemplates();
    this.unwatchNodes();
  }

  render() {
    let workflow = this.state.workflow || {};
    let nodeOptions = [];
    if (this.state.nodes && this.state.nodes.length) {
      this.state.nodes.forEach(node => {
        nodeOptions.push({
          label: node.name,
          value: node.id
        });
      })
    }
    let templateOptions = [];
    if (this.state.library && this.state.library.length) {
      this.state.library.forEach(template => {
        templateOptions.push({
          label: template.friendlyName,
          value: template.injectableName
        });
      });
    }
    return (
      <div className="EditWorkflow">
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <ToolbarTitle text={workflow.id ? 'Edit Workflow' : 'Create Workflow'} />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <RaisedButton
                label="Cancel"
                onClick={this.routeBack}
                disabled={this.state.disabled} />
            <RaisedButton
                label="Save"
                primary={true}
                onClick={this.saveWorkflow.bind(this)}
                disabled={this.state.disabled} />
          </ToolbarGroup>
        </Toolbar>
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix" />}
        <div style={{padding: '0 10px 10px'}}>
          <h5 style={{margin: '15px 0 5px', color: '#666'}}>Workflow Type:</h5>
          <Select
              name="node"
              value={this.state.workflow && this.state.workflow.name || this.props.name}
              placeholder="Select a workflow graph..."
              options={templateOptions}
              onChange={(value) => {
                let workflow = this.state.workflow;
                workflow.name = value;
                this.setState({workflow: workflow})
              }} />
          <h5 style={{margin: '15px 0 5px', color: '#666'}}>Workflow Node:</h5>
          <Select
              name="node"
              value={this.state.workflow && this.state.workflow.node || this.props.nodeId}
              placeholder="Select a node..."
              options={nodeOptions}
              onChange={(value) => {
                let workflow = this.state.workflow;
                workflow.node = value;
                this.setState({workflow: workflow})
              }} />
          <h5 style={{margin: '15px 0 5px', color: '#666'}}>Workflow JSON:</h5>
          <JsonEditor
              initialValue={this.state.workflow}
              updateParentState={this.updateStateFromJsonEditor.bind(this)}
              disabled={this.state.disabled}
              ref="jsonEditor" />
        </div>
      </div>
    );
  }

  updateStateFromJsonEditor(stateChange) {
    this.setState({workflow: stateChange});
  }

  saveWorkflow() {
    this.disable();
    if (this.state.workflow.id) {
      workflows.update(this.state.workflow.id, this.state.workflow).then(() => this.enable());
    }
    else if (this.state.workflow.node) {
      nodesRestAPI.postWorkflow(this.state.workflow.node, this.state.workflow).then(() => this.enable());
    }
    else {
      this.enable();
    }
  }

  // resetWorkflow() {
  //   this.disable();
  //   workflows.read(this.state.workflow.id)
  //     .then(workflow => this.setState({workflow: workflow, disabled: false}));
  // }

}
