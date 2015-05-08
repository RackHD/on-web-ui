'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from '../mixins/DialogHelpers';
import FormatHelpers from '../mixins/FormatHelpers';
import RouteHelpers from '../mixins/RouteHelpers';
import PageHelpers from '../mixins/PageHelpers';
import GridHelpers from '../mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    IconButton,
    RaisedButton
  } from 'material-ui';
import WorkflowAPI from '../../api/WorkflowAPI';
import './Workflows.less';

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(PageHelpers)
@mixin.decorate(GridHelpers)
export default class Workflows extends Component {

  state = {
    workflows: null
  }

  componentDidMount() { this.getWorkflows(); }

  render() {
    return (
      <div className="Workflows">
        {this.renderBreadcrumbs({href: 'dash', label: 'Dashboard'}, 'Workflows')}
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

  getWorkflows() {
    WorkflowAPI.getWorkflows()
      .then(workflows => this.setState({workflows: workflows}))
      .catch(err => console.error(err));
  }

  editWorkflow(id) { this.routeTo('workflows', id); }

  createWorkflow() { this.routeTo('workflows', 'new'); }

  deleteWorkflow(id) {
    this.confirmDialog('Are you sure want to delete: ' + id, (confirmed) => {
      if (!confirmed) { return; }

      WorkflowAPI.deleteWorkflow(id)
        .then(() => this.getWorkflows())
        .catch(err => console.error(err));
    });
  }

}
