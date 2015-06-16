'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
/* eslint-enable no-unused-vars */

import {
    DropDownMenu,
    MenuItem
  } from 'material-ui';
import { workflows } from '../../actions/WorkflowActions';

@mixin.decorate(RouteHelpers)
export default class WorkflowsFileMenu extends Component {

  state = {workflows: null};

  componentDidMount() {
    this.unwatchWorkflows = workflows.watchAll('workflows', this);
    this.listWorkflows();
  }

  componentWillUnmount() { this.unwatchWorkflows(); }

  render() {
    var workflowMenuItems = [
      {text: 'File', type: MenuItem.Types.SUBHEADER},
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
      <DropDownMenu ref="root" className="WorkflowsFileMenu"
          menuItems={workflowMenuItems}
          onChange={this.loadWorkflow.bind(this)} />
    );
  }

  listWorkflows() { return workflows.list(); }

  loadWorkflow(event, index, menuItem) {
    var workflow = menuItem.workflow;
    if (!workflow) { return; }
    // if (workflow.id) {
    //   this.routeTo('builder', workflow.id);
    // }
    // else {
    //   this.routeTo('builder');
    // }
    if (workflow.id) {
      this.props.editor.loadWorkflow(workflow);
    }
    else {
      this.props.editor.resetWorkflow();
    }
  }

}
