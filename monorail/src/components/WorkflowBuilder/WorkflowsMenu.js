'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import RouteHelpers from '../../../../common/mixins/RouteHelpers';
/* eslint-enable no-unused-vars */

import {
    Menu,
    MenuItem
  } from 'material-ui';
import { workflows } from '../../actions/WorkflowActions';

@mixin.decorate(RouteHelpers)
export default class WorkflowsMenu extends Component {

  state = {workflows: null};

  componentDidMount() {
    this.unwatchWorkflows = workflows.watchAll('workflows', this);
    this.listWorkflows();
  }

  componentWillUnmount() { this.unwatchWorkflows(); }

  render() {
    var workflowMenuItems = [
      {text: 'Workflows', type: MenuItem.Types.SUBHEADER},
      {text: 'New +', workflow: {}}
    ];
    if (this.state.workflows) {
      this.state.workflows.forEach(workflow => {
        workflowMenuItems.push({
          text: workflow.id,
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
    if (workflow.id) {
      this.routeTo('builder', workflow.id);
    }
    else {
      this.routeTo('builder');
    }
  }

}
