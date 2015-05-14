'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from '../mixins/DialogHelpers';
import FormatHelpers from '../mixins/FormatHelpers';
import RouteHelpers from '../mixins/RouteHelpers';
import GridHelpers from '../mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    IconButton,
    RaisedButton
  } from 'material-ui';
import { workflows } from '../../actions/WorkflowActions';

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
          createButton:
            <RaisedButton label="Create Workflow" primary={true} onClick={this.createWorkflow.bind(this)} />
        })}
        <div className="clearfix"></div>
        {
          this.renderGrid({
            results: this.state.workflows,
            resultsPerPage: 10
          }, workflow => (
            {
              ID: <a href={this.routePath('workflows', workflow.id)}>{workflow.id}</a>,
              Name: workflow.name,
              Actions: [
                <IconButton iconClassName="fa fa-edit"
                            tooltip="Edit Workflow"
                            touch={true}
                            onClick={this.editWorkflow.bind(this, workflow.injectableName)} />,
                <IconButton iconClassName="fa fa-remove"
                            tooltip="Remove Workflow"
                            touch={true}
                            disabled={true}
                            onClick={this.deleteWorkflow.bind(this, workflow.injectableName)} />
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
