// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import EditWorkflow from './EditWorkflow';
import CreateWorkflow from './CreateWorkflow';
export { CreateWorkflow, EditWorkflow };

import LogsMessenger from '../messengers/LogsMessenger';
import EventsMessenger from '../messengers/EventsMessenger';
let logs = new LogsMessenger(),
    events = new EventsMessenger();

import {
    FlatButton,
    LinearProgress,
    List, ListItem,
    RaisedButton,
    Snackbar,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import JsonInspector from 'react-json-inspector';

import WorkflowStore from '../stores/WorkflowStore';
let workflows = new WorkflowStore();

@mixin(DialogHelpers)
@mixin(PageHelpers)
export default class Workflow extends Component {

  state = {
    workflow: null,
    loading: true,
    state: 'Pending',
    logs: []
  };

  componentDidMount() {
    this.unwatchWorkflow = workflows.watchOne(this.getWorkflowId(), 'workflow', this);
    this.readWorkflow().then(() => {
      logs.connect();
      events.connect();
      logs.listen(msg => {
        console.log(msg);
        this.setState(state => {
          return {
            logs: msg.data.subject === state.workflow.node ?
              [msg.data].concat(state.logs) : state.logs
          };
        });
      });
      events.listen(msg => {
        let pattern = msg.id.split('.'),
            instanceId = this.state.workflow && this.state.workflow.instanceId;
        if (pattern[0] === 'graph' && pattern[2] === instanceId) {
          this.setState({
            state: pattern[1] === 'finished' ? 'Finished' : 'Started'
          });
          this.readWorkflow();
        }
      });
    });
  }

  componentWillUnmount() {
    this.unwatchWorkflow();
    logs.ignore();
    events.ignore();
    logs.disconnect();
    events.disconnect();
  }

  render() {
    let colors = {
      emerge: 'red',
      alert: 'yellow',
      crit: 'red',
      error: 'red',
      warning: 'red',
      notice: 'yellow',
      info: 'green',
      debug: 'blue',
      silly: 'blue'
    };
    let workflow = this.state.workflow || {};
    return (
      <div className="Workflow">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'workflows', label: 'Workflows'},
          this.getWorkflowId()
        )}
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
        <div className="ungrid">
          <div className="line">
            <div className="cell">
              <List>
                <ListItem
                  primaryText={workflow._status || this.state.state || '(Unknown)'}
                  secondaryText="Status" />
              </List>
              {this.state.logs && this.state.logs.length ?
                <div style={{background: 'black', padding: 5}}>
                  {this.state.logs.map(data => (
                    <p style={{color: colors[data.level]}}>
                      <b>{data.timestamp}</b>&nbsp;&nbsp;
                      <i>[{data.name}]</i>&nbsp;&nbsp;
                      <i>[{data.module}]</i>&nbsp;&nbsp;
                      <i>[{data.subject}]</i>&nbsp;--&nbsp;
                      <b>{data.message}</b>&nbsp;->&nbsp;
                      <u>{data.caller}</u>
                    </p>
                  ))}
                </div> : null
              }
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
    return workflows.read(this.getWorkflowId()).then(() => this.setState({loading: false}));
  }

  deleteWorkflow() {
    var id = this.state.workflow.id;
    this.setState({loading: true});
    this.confirmDialog('Are you sure want to delete: ' + id,
      (confirmed) => confirmed ? workflows.destroy(id).then(() => this.routeBack()) : this.setState({loading: false}));
  }

}
