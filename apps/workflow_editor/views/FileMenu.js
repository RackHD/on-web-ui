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

import WorkflowStore from '../stores/WorkflowStore';
let workflows = new WorkflowStore();

@mixin.decorate(RouteHelpers)
export default class WEFileMenu extends Component {

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
          text: workflow.id,
          workflow: workflow
        });
      });
    }

    var fileMenuItems = [
      {text: 'File', type: MenuItem.Types.SUBHEADER},
      {text: 'New Workflow'},//, workflow: {}},
      {text: 'Load Workflow'}//, type: MenuItem.Types.NESTED, items: workflowMenuItems}
    ];

    return (
      <DropDownMenu ref="root" className="WorkflowsFileMenu"
          menuItems={fileMenuItems}
          onChange={this.loadWorkflow.bind(this)} />
    );
  }

  listWorkflows() { return workflows.list(); }

  loadWorkflow(event, selectedIndex, menuItem) {
    if (menuItem.text === 'Load Workflow') {
      this.props.editor.refs.dialog.show();
    }
    if (selectedIndex !== 0) {
      setTimeout(() => {
        this.refs.root._setSelectedIndex({selectedIndex: 0});
      }, 500);
    }
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
