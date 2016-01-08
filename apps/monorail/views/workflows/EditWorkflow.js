// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import mixin from 'common-web-ui/lib/mixin';
import EditorHelpers from 'common-web-ui/mixins/EditorHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import Select from 'react-select';

import {
    FlatButton,
    LinearProgress,
    RaisedButton,
    TextField,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import JsonEditor from 'common-web-ui/views/JsonEditor';

import MonoRailRestAPIv1_1 from '../../messengers/MonoRailRestAPIv1_1';
import WorkflowTemplateStore from '../../stores/WorkflowTemplateStore';
import WorkflowStore from '../../stores/WorkflowStore';
import NodeStore from '../../stores/NodeStore';

@mixin(EditorHelpers, RouteHelpers)
export default class EditWorkflow extends Component {

  workflowTemplates = new WorkflowTemplateStore();
  workflows = new WorkflowStore();
  nodes = new NodeStore();

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
    this.unwatchWorkflowTemplates = this.workflowTemplates.watchAll('library', this);
    this.unwatchNodes = this.nodes.watchAll('nodes', this);
    Promise.all([this.workflowTemplates.list(), this.nodes.list()]).then(() => this.setState({disabled: false}));
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
              onChange={(option) => {
                let workflow = this.state.workflow;
                workflow.name = option && option.value;
                this.setState({workflow: workflow})
              }} />
          <h5 style={{margin: '15px 0 5px', color: '#666'}}>Workflow Node:</h5>
          <Select
              name="node"
              value={this.state.workflow && this.state.workflow.node || this.props.nodeId}
              placeholder="Select a node..."
              options={nodeOptions}
              onChange={(option) => {
                let workflow = this.state.workflow;
                workflow.node = option && option.value;
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
      this.workflows.update(this.state.workflow.id, this.state.workflow).then(() => this.enable());
    }
    else if (this.state.workflow.node) {
      MonoRailRestAPIv1_1.nodes.postWorkflow(this.state.workflow.node, this.state.workflow).then(workflow => {
        this.enable();
        this.routeTo('workflows', workflow.id);
      });
    }
    else {
      this.enable();
    }
  }

}
