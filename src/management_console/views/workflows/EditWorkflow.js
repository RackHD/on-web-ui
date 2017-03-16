// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

import Select from 'react-select';

import {
    FlatButton,
    LinearProgress,
    RaisedButton,
    TextField,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import JsonEditor from 'src-common/views/JsonEditor';

import RackHDRestAPIv2_0 from 'src-common/messengers/RackHDRestAPIv2_0';
import WorkflowTemplateStore from 'src-common/stores/WorkflowTemplateStore';
import WorkflowStore from 'src-common/stores/WorkflowStore';
import NodeStore from 'src-common/stores/NodeStore';

export default class EditWorkflow extends Component {

  static contextTypes = {router: PropTypes.any};

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
    if (nextProps.workflow) {
      this.setState({workflow: nextProps.workflow, loading: false, disabled: false});
    }
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
      });
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
          <ToolbarGroup key={0} firstChild={true}>
            <ToolbarTitle text={this.props.title ||
              (workflow.context && workflow.context.graphId ? 'Edit Workflow' : 'Create Workflow')} />
          </ToolbarGroup>
          <ToolbarGroup key={1} lastChild={true}>
            <RaisedButton
                label="Cancel"
                onClick={this.props.onDone || this.routeBack}
                disabled={this.state.disabled} />
            <RaisedButton
                label="Save"
                primary={true}
                onClick={this.saveWorkflow.bind(this)}
                disabled={this.state.disabled} />
          </ToolbarGroup>
        </Toolbar>
        <LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />
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
                this.setState({ workflow });
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
                this.setState({ workflow });
              }} />
          <h5 style={{margin: '15px 0 5px', color: '#666'}}>Workflow JSON:</h5>
          <JsonEditor
              value={{"options": this.state.workflow && this.state.workflow.options || {}}}
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
    if (this.state.workflow.context && this.state.workflow.context.graphId) {
      this.workflows.update(this.state.workflow.context.graphId, this.state.workflow).then(() => this.enable());
    }
    else if (this.state.workflow.node) {
      RackHDRestAPIv2_0.api.nodesPostWorkflowById({
          body: {"options": this.state.workflow && this.state.workflow.options || {}},
          identifier: this.state.workflow.node,
          name: this.state.workflow.name
      }).then(res => {
        let workflow = res.obj;
        this.enable();
        if (this.props.onDone) {
          this.props.onDone();
        }
        else {
          this.context.router.push('/mc/workflows/' + workflow.context.graphId);
        }
      }).catch((err) => {
        if (this.props.onDone) {
          return this.props.onDone(err);
        }
        console.error(err);
      });
    }
    else {
      this.enable();
    }
  }

  disable() { this.setState({disabled: true}); }

  enable() {
    setTimeout(() => this.setState({disabled: false}), 500);
  }

}
