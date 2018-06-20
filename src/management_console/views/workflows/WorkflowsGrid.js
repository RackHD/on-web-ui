// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import { RaisedButton, LinearProgress } from 'material-ui';

import FormatHelpers from 'src-common/lib/FormatHelpers';
import ResourceTable from 'src-common/views/ResourceTable';
import RackHDRestAPIv2_0 from 'src-common/messengers/RackHDRestAPIv2_0';
import WorkflowStore from 'src-common/stores/WorkflowStore';

export default class WorkflowsGrid extends Component {

  static contextTypes = {router: PropTypes.any}

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
          headerContent="Workflow History"
          toolbarContent={rightButtons}
          loadingContent={<LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />}
          mapper={workflow => {
            let row = {};
            row.Name = <Link to={'/mc/workflows/' + workflow.instanceId}>{workflow.name}</Link>;
            if (!this.nodeId) {
              let node = this.workflows.getNodeId(workflow);
              if (node) row.Node =
                <Link to={'/mc/nodes/' + node}>{FormatHelpers.shortId(node)}</Link>;
            }
            row.Status = workflow.status || 'unknown';
                // workflow.completeEventString ||
                // (workflow.cancelled ? 'cancelled' : workflow._status);
            row.Status = row.Status.charAt(0).toUpperCase() + row.Status.substr(1);
            let tmp = {};
            Object.keys(workflow.tasks).forEach(taskId => {
              let state = workflow.tasks[taskId].state || 'unknown';
              state = state.charAt(0).toUpperCase() + state.substr(1);
              tmp[state] = (tmp[state] || 0) + 1;
            });
            let tmpKeys = Object.keys(tmp);
            if (tmpKeys.length > 1) tmpKeys.forEach(key => row[key] = tmp[key]);
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
    let nodeId = this.nodeId;
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
    RackHDRestAPIv2_0.api.nodesWorkflowActionById({
        identifier: this.nodeId,
        action:{"command" : "cancel"}
    }).then(() => {
      this.listWorkflows();
    });
  }

}
