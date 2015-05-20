'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import {
    Menu,
    MenuItem
  } from 'material-ui';
import { workflows } from '../../actions/WorkflowActions';

export default class WorkflowsMenu extends Component {

  state = {workflows: null};

  componentDidMount() {
    this.unwatchWorkflows = workflows.watchAll('workflows', this);
    this.listWorkflows();
  }

  componentWillUnmount() { this.unwatchWorkflows(); }

  render() {
    var workflowMenuItems = [
      {text: 'Workflows', type: MenuItem.Types.SUBHEADER}
    ];
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
              onItemClick={this.loadWorkflow.bind(this)}
              autoWidth={false} />
      </div>
    );
  }

  listWorkflows() { return workflows.list(); }

  loadWorkflow(event, index, menuItem) {
    var workflow = menuItem.workflow;
    if (!workflow) { return; }
    console.log(workflow.name);
  }

}
