// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
import GridHelpers from 'common-web-ui/mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    // IconButton,
    RaisedButton,
    LinearProgress
  } from 'material-ui';

import NodesRestAPI from '../messengers/NodesRestAPI';
let nodesRestAPI = new NodesRestAPI();

import WorkflowStore from '../stores/WorkflowStore';
let workflows = new WorkflowStore();

@mixin(DialogHelpers)
@mixin(FormatHelpers)
@mixin(RouteHelpers)
@mixin(GridHelpers)
export default class WorkflowsGrid extends Component {

  state = {
    workflows: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchWorkflows = workflows.watchAll('workflows', this);
    this.listWorkflows();
  }

  componentWillUnmount() { this.unwatchWorkflows(); }

  render() {
    let rightButtons = [
      <RaisedButton label="Create Workflow" primary={true} onClick={this.createWorkflow.bind(this)} />
    ];
    if (this.nodeId) {
      rightButtons.unshift(
        <RaisedButton label="Cancel Active Workflow" primary={true} onClick={this.cancelActiveWorkflow.bind(this)} />
      );
    }
    return (
      <div className="WorkflowsGrid">
        {this.renderGridToolbar({
          label: <a href={'#/workflows' + (this.nodeId ? '/n/' + this.nodeId : '')}>Workflows</a>,
          count: this.state.workflows && this.state.workflows.length || 0,
          right: rightButtons
        })}
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
        {
          this.renderGrid({
            results: this.state.workflows,
            resultsPerPage: this.props.size || 50
          }, workflow => (
            {
              ID: <a href={this.routePath('workflows', workflow.id)}>{this.shortId(workflow.id)}</a>,
              Node: <a href={this.routePath('nodes', workflow.node)}>{this.shortId(workflow.node)}</a>,
              Name: workflow.name,
              Created: this.fromNow(workflow.createdAt),
              Updated: this.fromNow(workflow.updatedAt)
            }
          ), 'No workflows.')
        }
      </div>
    );
  }

  get nodeId() { return this.props.nodeId; }

  listWorkflows() {
    this.setState({loading: true});
    let nodeId = this.nodeId
    if (nodeId) {
      return workflows.listNode(nodeId).then(() => this.setState({loading: false}));
    }
    workflows.list().then(() => this.setState({loading: false}));
  }

  // editWorkflow(id) { this.routeTo('workflows', id); }

  createWorkflow() {
    if (this.nodeId) return this.routeTo('workflows', 'new', this.nodeId);
    this.routeTo('workflows', 'new');
  }

  cancelActiveWorkflow() {
    if (!this.nodeId) { return; }
    nodesRestAPI.deleteActiveWorkflow(this.nodeId).then(() => {
      this.listWorkflows();
    });
  }

  // deleteWorkflow(id) {
  //   this.confirmDialog('Are you sure want to delete: ' + id,
  //     (confirmed) => confirmed && workflows.destroy(id));
  // }

}
