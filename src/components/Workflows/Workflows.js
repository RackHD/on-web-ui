'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import mixin from 'react-mixin'; // eslint-disable-line no-unused-vars

import Griddle from 'griddle-react';
import {
    IconButton,
    Toolbar,
    ToolbarGroup,
    RaisedButton
  } from 'material-ui';

import Breadcrumbs from '../Breadcrumbs';
import FormatHelpers from '../mixins/FormatHelpers'; // eslint-disable-line no-unused-vars
import WorkflowsActions from '../../actions/WorkflowsActions';
import WorkflowActions from '../../actions/WorkflowActions';
import './Workflows.less';

@mixin.decorate(FormatHelpers)
class Workflows extends Component {

  state = {
    workflows: null
  }

  componentDidMount() {
    this.getWorkflows();
  }

  getWorkflows() {
    WorkflowsActions.getWorkflows()
      .then(workflows => this.setState({workflows: workflows}))
      .catch(err => console.error(err));
  }

  deleteWorkflow(id) {
    if (!window.confirm('Are you sure want to delete: ' + id)) { // eslint-disable-line no-alert
      return;
    }
    WorkflowActions.deleteWorkflow(id)
      .then(out => {
        console.log(out);
        this.getWorkflows();
      })
      .catch(err => console.error(err));
  }

  render() {
    var workflows = <p>No workflows</p>;
    if (this.state.workflows) {
      workflows = this.state.workflows.map(workflow => ({
        ID: <a href={'#/workflows/' + workflow.id}>{this.shortId(workflow.id)}</a>,
        Name: workflow.definition.friendlyName,
        Created: this.fromNow(workflow.createdAt),
        Actions: (<div>
          <a href={'#/workflows/' + workflow.id}>
            <IconButton iconClassName="fa fa-edit" tooltip="Edit Worfklow" touch={true} />
          </a>
          <IconButton iconClassName="fa fa-remove" tooltip="Remove Workflow" touch={true}
                      onClick={this.deleteWorkflow.bind(this, workflow.id)} />
        </div>)
      }));
      workflows = <Griddle results={workflows} resultsPerPage={10} />;
    }
    var breadcrumbs = this.props.params ? (
      <Breadcrumbs>
        <a href="#/dash">Dashboard</a>
        &nbsp;/&nbsp;Workflows
      </Breadcrumbs>
    ) : null;
    return (
      <div className="Workflows">
        {breadcrumbs}
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <h3 style={{display: 'inline-block'}}>
              &nbsp; <a href="#/workflows">Workflows</a> &nbsp;
              <span>({this.state.workflows && this.state.workflows.length || 0})</span>
            </h3>
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <span className="mui-toolbar-separator">&nbsp;</span>
            <a href="#/workflows/new">
              <RaisedButton label="Create Workflow" primary={true} />
            </a>
          </ToolbarGroup>
        </Toolbar>
        <div className="u-cf">
          {workflows}
        </div>
      </div>
    );
  }

}

export default Workflows;
