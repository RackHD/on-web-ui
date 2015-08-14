'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
import GridHelpers from 'common-web-ui/mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    IconButton,
    RaisedButton
  } from 'material-ui';

import WorkflowStore from '../stores/WorkflowStore';
let workflows = new WorkflowStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class WorkflowsGrid extends Component {

  state = {workflows: null};

  componentDidMount() {
    this.unwatchWorkflows = workflows.watchAll('workflows', this);
    this.listWorkflows();
  }

  componentWillUnmount() { this.unwatchWorkflows(); }

  render() {
    return (
      <div className="WorkflowsGrid">
        {this.renderGridToolbar({
          label: <a href="#/workflows">Workflows</a>,
          count: this.state.workflows && this.state.workflows.length || 0,
          right:
            <RaisedButton label="Create Workflow" primary={true} onClick={this.createWorkflow.bind(this)} />
        })}
        <div className="clearfix"></div>
        {
          this.renderGrid({
            results: this.state.workflows,
            resultsPerPage: 10
          }, workflow => (
            {
              ID: <a href={this.routePath('workflows', workflow.id)}>{this.shortId(workflow.id)}</a>,
              Name: workflow.name,
              Created: this.fromNow(workflow.createdAt),
              Updated: this.fromNow(workflow.updatedAt),
              Actions: [
                <IconButton iconClassName="fa fa-edit"
                            tooltip="Edit Workflow"
                            touch={true}
                            onClick={this.editWorkflow.bind(this, workflow.id)} />
              ]
            }
          ), 'No workflows.')
        }
      </div>
    );
  }

  listWorkflows() { workflows.list(); }

  editWorkflow(id) { this.routeTo('workflows', id); }

  createWorkflow() { this.routeTo('workflows', 'new'); }

  deleteWorkflow(id) {
    this.confirmDialog('Are you sure want to delete: ' + id,
      (confirmed) => confirmed && workflows.destroy(id));
  }

}
