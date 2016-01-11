// Copyright 2015, EMC, Inc.

'use strict';


import React, { Component } from 'react';

import moment from 'moment';

import mixin from 'common-web-ui/lib/mixin';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import { RaisedButton, LinearProgress } from 'material-ui';

import ResourceTable from 'common-web-ui/views/ResourceTable';

import MonoRailRestAPIv1_1 from 'monorail-web-ui/messengers/MonoRailRestAPIv1_1';
import WorkflowStore from 'monorail-web-ui/stores/WorkflowStore';

@mixin(FormatHelpers, RouteHelpers)
export default class RunningWorkflows extends Component {

  static defaultProps = {
    sort: (a, b) => moment(b.updatedAt).unix() - moment(a.updatedAt).unix()
  };

  workflows = new WorkflowStore();

  state = {
    workflows: null,
    loading: true
  };

  componentWillMount() {
    this.workflows.startMessenger();
  }

  componentDidMount() {
    this.unwatchWorkflows = this.workflows.watchAll('workflows', this);
    this.listWorkflows();
  }

  componentWillUnmount() {
    this.workflows.stopMessenger();
    this.unwatchWorkflows();
  }

  render() {
    return (
      <ResourceTable
          initialEntities={this.state.workflows}
          routeName="workflows"
          emptyContent="No workflows."
          headerContent="Workflows"
          loadingContent={this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
          mapper={workflow => {
            let row = {};
            row.Name = <a href={this.routePath('workflows', workflow.id)}>{workflow.name}</a>;
            row.Node = <a href={this.routePath('nodes', workflow.node)}>{this.shortId(workflow.node)}</a>;
            row.Status = workflow.completeEventString || (workflow.cancelled ? 'cancelled' : workflow._status);
            row.Progress = workflow.finishedTasks.length + ' / ' +
              (workflow.finishedTasks.length + workflow.pendingTasks.length);
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
      return this.workflows.listNode(nodeId).then(() => this.setState({loading: false}));
    }
    this.workflows.list().then(() => this.setState({loading: false}));
  }

  createWorkflow() {
    if (this.nodeId) return this.routeTo('workflows', 'new', this.nodeId);
    this.routeTo('workflows', 'new');
  }

  cancelActiveWorkflow() {
    if (!this.nodeId) { return; }
    MonoRailRestAPIv1_1.nodes.deleteActiveWorkflow(this.nodeId).then(() => {
      this.listWorkflows();
    });
  }

}
