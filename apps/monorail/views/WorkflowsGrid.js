// Copyright 2015, EMC, Inc.

'use strict';


import React, { Component } from 'react';

import moment from 'moment';

import mixin from 'common-web-ui/lib/mixin';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import { RaisedButton, LinearProgress } from 'material-ui';

import ResourceTable from 'common-web-ui/views/ResourceTable';

import NodesRestAPI from '../messengers/NodesRestAPI';
let nodesRestAPI = new NodesRestAPI();

import WorkflowStore from '../stores/WorkflowStore';
let workflows = new WorkflowStore();

@mixin(FormatHelpers, RouteHelpers)
export default class WorkflowsGrid extends Component {

  static defaultProps = {
    sort: (a, b) => moment(b.updatedAt).unix() - moment(a.updatedAt).unix()
  }

  state = {
    workflows: null,
    loading: true
  };

  componentWillMount() {
    workflows.startMessenger();
  }

  componentDidMount() {
    this.unwatchWorkflows = workflows.watchAll('workflows', this);
    this.listWorkflows();
  }

  componentWillUnmount() {
    workflows.stopMessenger();
    this.unwatchWorkflows();
  }

  render() {
    let rightButtons = [
      <RaisedButton key={0} label="Create Workflow" primary={true} onClick={this.createWorkflow.bind(this)} />
    ];
    if (this.nodeId) {
      rightButtons.unshift(
        <RaisedButton key={1} label="Cancel Active Workflow" primary={true} onClick={this.cancelActiveWorkflow.bind(this)} />
      );
    }
    return (
      <ResourceTable
          initialEntities={this.state.workflows}
          routeName="workflows"
          emptyContent="No workflows."
          headerContent="Workflows"
          toolbarContent={rightButtons}
          loadingContent={this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
          mapper={workflow => {
            let row = {};
            row.Name = <a href={this.routePath('workflows', workflow.id)}>{workflow.name}</a>;
            if (!this.nodeId) {
              row.Node = <a href={this.routePath('nodes', workflow.node)}>{this.shortId(workflow.node)}</a>;
            }
            row.Status = workflow.completeEventString || (workflow.cancelled ? 'cancelled' : workflow._status);
            row['Pending Tasks'] = workflow.pendingTasks.length;
            row['Finished Tasks'] = workflow.finishedTasks.length;
            row.Updated = this.fromNow(workflow.updatedAt);
            return row;
          }}
          filter={this.props.filter}
          sort={this.props.sort}
          limit={this.props.limit} />
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

}
