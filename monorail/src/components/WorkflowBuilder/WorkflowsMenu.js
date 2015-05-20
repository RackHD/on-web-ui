'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import { Menu } from 'material-ui'
import { workflows } from '../../actions/WorkflowActions';

export default class WorkflowsMenu extends Component {

  state = {workflows: null};

  componentDidMount() {
    this.unwatchWorkflows = workflows.watchAll('workflows', this);
    this.listWorkflows();
  }

  componentWillUnmount() { this.unwatchWorkflows(); }

  render() {
    var workflowMenuItems = [];
    if (this.state.workflows) {
      this.state.workflows.forEach(workflow => {
        workflowMenuItems.push({
          text: workflow.name,
          workflow: workflow
        });
      });
    }
    return (
      <div className="WorkflowsMenu container">
        <Menu menuItems={workflowMenuItems}
              onItemClick={this.loadWorkflow.bind(this)} />
      </div>
    );
  }

  listWorkflows() { workflows.list(); }

  loadWorkflow(event, index, menuItem) {
    var workflow = menuItem.workflow;
    console.log(workflow.name);
  }

}
