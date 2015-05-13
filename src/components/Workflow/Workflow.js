'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from '../mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import EditWorkflow from './EditWorkflow';
import CreateWorkflow from './CreateWorkflow';
export { CreateWorkflow, EditWorkflow };

import {} from 'material-ui';
import { workflows } from '../../actions/WorkflowActions';
import './Workflow.less';

@mixin.decorate(PageHelpers)
export default class Workflow extends Component {

  state = {
    workflow: null
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
          this.props.params.workflowId
        )}
        <EditWorkflow workflowRef={this.state.workflow} />
      </div>
    );
  }

  getWorkflowId() { return this.props.params.workflowId; }

  readWorkflow() { workflows.read(this.getWorkflowId()); }

}
