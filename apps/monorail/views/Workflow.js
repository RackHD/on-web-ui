'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import EditWorkflow from './EditWorkflow';
import CreateWorkflow from './CreateWorkflow';
export { CreateWorkflow, EditWorkflow };

import { LinearProgress } from 'material-ui';

import JsonInspector from 'react-json-inspector';

import WorkflowStore from '../stores/WorkflowStore';
let workflows = new WorkflowStore();

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
    return (
      <div className="Workflow">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'workflows', label: 'Workflows'},
          this.getWorkflowId()
        )}
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : null}
        <JsonInspector
            search={false}
            isExpanded={() => true}
            data={this.state.workflow || {}} />
        <EditWorkflow workflowRef={this.state.workflow} />
      </div>
    );
  }

  getWorkflowId() { return this.props.params.workflowId; }

  readWorkflow() {
    this.setState({loading: true});
    workflows.read(this.getWorkflowId()).then(() => this.setState({loading: false}));
  }

}
