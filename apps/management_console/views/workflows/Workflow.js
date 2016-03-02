// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import mixin from 'rui-common/lib/mixin';
import DialogHelpers from 'rui-common/mixins/DialogHelpers';

import EditWorkflow from './EditWorkflow';
import CreateWorkflow from './CreateWorkflow';
export { CreateWorkflow, EditWorkflow };

import {
    FlatButton,
    LinearProgress,
    List, ListItem,
    RaisedButton,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import JsonInspector from 'react-json-inspector';

import Console from 'rui-common/views/Console';

import WorkflowMonitor from '../../lib/WorkflowMonitor';
import WorkflowStore from 'rui-common/stores/WorkflowStore';

@mixin(DialogHelpers)
export default class Workflow extends Component {

  workflows = new WorkflowStore();

  state = {
    workflow: null,
    loading: true,
    state: 'Pending',
    logs: []
  };

  componentDidMount() {
    this.unwatchWorkflow = this.workflows.watchOne(this.getWorkflowId(), 'workflow', this);
    this.readWorkflow().then(() => {
      this.workflowMonitor = new WorkflowMonitor(this.state.workflow, {
        logs: msg => {
          this.setState(state => {
            return {logs: [msg.data].concat(state.logs)}
          });
        },
        events: (msg, pattern) => {
          this.setState({state: pattern[1] === 'finished' ? 'Finished' : 'Started'});
          this.readWorkflow();
        }
      });
    });
  }

  componentWillUnmount() {
    this.unwatchWorkflow();
    if (this.workflowMonitor) {
      this.workflowMonitor.disconnect();
    }
  }

  render() {
    let workflow = this.state.workflow || {};
    return (
      <div className="Workflow">
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : null}
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <ToolbarTitle text="Workflow Details" />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <RaisedButton
                label="Delete Workflow"
                primary={true}
                onClick={this.deleteWorkflow.bind(this)}
                disabled={this.state.loading} />
          </ToolbarGroup>
        </Toolbar>
        <div className="ungrid collapse">
          <div className="line">
            <div className="cell">
              <List>
                <ListItem
                  primaryText={workflow._status || this.state.state || '(Unknown)'}
                  secondaryText="Status" />
              </List>
              <Console rows={this.state.logs} mapper={data => (
                <p style={{color: Console.colors[data.level]}}>
                  <b>{data.timestamp}</b>&nbsp;&nbsp;
                  <i>[{data.name}]</i>&nbsp;&nbsp;
                  <i>[{data.module}]</i>&nbsp;&nbsp;
                  <i>[{data.subject}]</i>&nbsp;--&nbsp;
                  <b>{data.message}</b>&nbsp;->&nbsp;
                  <u>{data.caller}</u>
                </p>
              )} />
            </div>
            <div className="cell">
              <div style={{overflow: 'auto', margin: 10, maxHeight: 300}}>
                <JsonInspector
                    isExpanded={() => !true}
                    data={this.state.workflow || {}} />
              </div>
            </div>
          </div>
        </div>
        <EditWorkflow workflow={this.state.workflow} />
      </div>
    );
  }

  getWorkflowId() { return this.props.params.workflowId; }

  readWorkflow() {
    this.setState({loading: true});
    return this.workflows.read(this.getWorkflowId()).then(() => this.setState({loading: false}));
  }

  deleteWorkflow() {
    var id = this.state.workflow.id;
    this.setState({loading: true});
    this.confirmDialog('Are you sure want to delete: ' + id,
      (confirmed) => confirmed ? this.workflows.destroy(id).then(() => this.routeBack()) : this.setState({loading: false}));
  }

}
