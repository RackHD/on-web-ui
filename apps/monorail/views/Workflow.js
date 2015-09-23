// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import EditWorkflow from './EditWorkflow';
import CreateWorkflow from './CreateWorkflow';
export { CreateWorkflow, EditWorkflow };

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

@mixin.decorate(DialogHelpers)
@mixin.decorate(PageHelpers)
export default class Workflow extends Component {

  state = {
    workflow: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchWorkflow = workflows.watchOne(this.getWorkflowId(), 'workflow', this);
    this.readWorkflow();
  }

  componentWillUnmount() { this.unwatchWorkflow(); }

  render() {
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
                  primaryText={workflow._status || '(Unknown)'}
                  secondaryText="Status" />
              </List>
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
    workflows.read(this.getWorkflowId()).then(() => this.setState({loading: false}));
  }

  deleteWorkflow() {
    var id = this.state.workflow.id;
    this.setState({loading: true});
    this.confirmDialog('Are you sure want to delete: ' + id,
      (confirmed) => confirmed ? workflows.destroy(id).then(() => this.routeBack()) : this.setState({loading: false}));
  }

}
