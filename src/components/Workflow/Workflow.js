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
import WorkflowActions from '../../actions/WorkflowActions';
import './Workflow.less';

@mixin.decorate(PageHelpers)
export default class Workflow extends Component {

  state = {
    workflow: null
  };

  componentDidMount() {
    WorkflowActions.getWorkflowTemplate(this.props.params.workflowId)
      .then(workflow => this.setState({workflow: workflow}))
      .catch(err => console.error(err));
  }

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

}
