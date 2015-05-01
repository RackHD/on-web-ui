'use strict';

import moment from 'moment';
import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import Griddle from 'griddle-react';
import {
    IconButton,
    Toolbar,
    ToolbarGroup,
    RaisedButton
  } from 'material-ui';

import WorkflowActions from '../../actions/WorkflowActions';
import './Workflows.less';

class Workflows extends Component {

  state = {
    workflows: null
  }

  componentDidMount() {
    WorkflowActions.requestWorkflows()
      .then(workflows => this.setState({workflows: workflows}))
      .catch(err => console.error(err));
  }

  render() {
    var workflows = <p>No workflows</p>;
    if (this.state.workflows) {
      workflows = this.state.workflows.map(workflow => ({
        // node: workflow.node,
        Name: workflow.definition.friendlyName,
        // Status: workflow._status, // eslint-disable-line no-underscore-dangle
        // Cancelled: workflow.cancelled,
        Created: moment(workflow.createdAt).fromNow(),
        Actions: (<div>
          <IconButton iconClassName="fa fa-edit" tooltip="Edit Worfklow" touch={true}/>
          <IconButton iconClassName="fa fa-remove" tooltip="Remove Workflow" touch={true}/>
        </div>)
      }));
      workflows = <Griddle results={workflows} resultsPerPage={15} />;
    }
    return (
      <div className="Workflows">
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <h3>
              &nbsp; Workflows &nbsp;
              <span>({this.state.workflows && this.state.workflows.length || 0})</span>
            </h3>
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <span className="mui-toolbar-separator">&nbsp;</span>
            <RaisedButton label="Create Workflow" primary={true} />
          </ToolbarGroup>
        </Toolbar>
        {workflows}
      </div>
    );
  }

}

export default Workflows;
