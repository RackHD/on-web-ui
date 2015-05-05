'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import mixin from 'react-mixin'; // eslint-disable-line no-unused-vars

// import {
//   } from 'material-ui';

import Breadcrumbs from '../Breadcrumbs';
import FormatHelpers from '../mixins/FormatHelpers'; // eslint-disable-line no-unused-vars
import WorkflowActions from '../../actions/WorkflowActions';
import EditWorkflow from './EditWorkflow';
import CreateWorkflow from './CreateWorkflow';
import './Workflow.less';

export { CreateWorkflow, EditWorkflow };

@mixin.decorate(FormatHelpers)
export default class Workflow extends Component {

  state = {
    workflow: null
  };

  componentDidMount() {
    WorkflowActions.getWorkflow(this.props.params.workflowId)
      .then(workflow => this.setState({workflow: workflow}))
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div className="Workflow">
        <Breadcrumbs>
          <a href="#/dash">Dashboard</a>
          &nbsp;/&nbsp;
          <a href="#/workflows">Workflows</a>
          {this.state.workflow ? ' / ' + this.state.workflow.id : ''}
        </Breadcrumbs>
        <EditWorkflow workflowRef={this.state.workflow} />
      </div>
    );
  }

}
