// Copyright 2015, EMC, Inc.

'use strict';


import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import { RaisedButton, LinearProgress } from 'material-ui';

import FormatHelpers from 'rui-common/mixins/FormatHelpers';
import ResourceTable from 'rui-common/views/ResourceTable';
import RackHDRestAPIv1_1 from 'rui-common/messengers/RackHDRestAPIv1_1';
import WorkflowStore from 'rui-common/stores/WorkflowStore';

export default class RunningWorkflows extends Component {

  static contextTypes = {router: PropTypes.any};

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
            row.Name = <Link to={'/mc/workflows/' + workflow.id}>{workflow.name}</Link>;
            row.Node = <Link to={'/mc/nodes/' + workflow.node}>{FormatHelpers.shortId(workflow.node)}</Link>;
            row.Status = workflow.completeEventString || (workflow.cancelled ? 'cancelled' : workflow._status);
            // row.Progress = workflow.finishedTasks.length + ' / ' +
            //   (workflow.finishedTasks.length + workflow.pendingTasks.length);
            row.Updated = FormatHelpers.fromNow(workflow.updatedAt);
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
    if (this.nodeId) {
      return this.context.router.push('/mc/nodes/' + this.nodeId + '/workflows/new');
    }
    this.context.router.push('/mc/workflows/new');
  }

  cancelActiveWorkflow() {
    if (!this.nodeId) { return; }
    RackHDRestAPIv1_1.nodes.deleteActiveWorkflow(this.nodeId).then(() => {
      this.listWorkflows();
    });
  }

}
