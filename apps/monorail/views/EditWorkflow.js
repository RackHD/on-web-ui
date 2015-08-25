'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import EditorHelpers from 'common-web-ui/mixins/EditorHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
import GridHelpers from 'common-web-ui/mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import Select from 'react-select';
import {
    TextField,
    FlatButton,
    RaisedButton
  } from 'material-ui';
import JsonEditor from 'common-web-ui/views/JsonEditor';

import WorkflowTemplateStore from '../stores/WorkflowTemplateStore';
let workflowTemplates = new WorkflowTemplateStore();

import WorkflowStore from '../stores/WorkflowStore';
let workflows = new WorkflowStore();

import NodeStore from '../stores/NodeStore';
let nodes = new NodeStore();
let nodesRestAPI = nodes.nodesRestAPI;

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(EditorHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class EditWorkflow extends Component {

  state = {
    nodes: [],
    library: null,
    workflow: null,
    disabled: false
  };

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
    if (!this.state.workflow) {
      this.state.workflow = this.props.workflowRef || null;
    }
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
      <div className="EditWorkflow container">
        <div className="row">
          <div className="one-half column">
            <label>Type:</label>
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
          </div>
          <div className="one-half column">
            <label>Node:</label>
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
          </div>
        </div>

        <h3>JSON Editor</h3>
        <JsonEditor initialValue={this.state.workflow}
                    updateParentState={this.updateStateFromJsonEditor.bind(this)}
                    disabled={this.state.disabled}
                    ref="jsonEditor" />
        <div className="buttons container">
          <FlatButton className="button"
                      label="Delete"
                      onClick={this.deleteWorkflow.bind(this)}
                      disabled={this.state.disabled} />
          <FlatButton className="button"
                      label="Clone"
                      onClick={this.cloneWorkflow.bind(this)}
                      disabled={true || this.state.disabled} />

          <div className="right">
            <FlatButton className="button"
                        label="Cancel"
                        onClick={this.routeBack}
                        disabled={this.state.disabled} />
            <RaisedButton className="button"
                          label="Reset"
                          onClick={this.resetWorkflow.bind(this)}
                          disabled={this.state.disabled} />
            <RaisedButton className="button"
                          label="Save" primary={true}
                          onClick={this.saveWorkflow.bind(this)}
                          disabled={this.state.disabled} />
          </div>
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

  deleteWorkflow() {
    var id = this.state.workflow.id;
    this.disable();
    this.confirmDialog('Are you sure want to delete: ' + id,
      (confirmed) => confirmed && workflows.destroy(id).then(() => this.routeBack()));
  }

  resetWorkflow() {
    this.disable();
    workflows.read(this.state.workflow.id)
      .then(workflow => this.setState({workflow: workflow, disabled: false}));
  }

  cloneWorkflow() {}// TODO

}
