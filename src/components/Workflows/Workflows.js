'use strict';

import './Workflows.less';
import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import WorkflowActions from '../../actions/WorkflowActions';

class Workflows extends Component {

  state = {
    workflows: null
  }

  componentDidMount() {
    WorkflowActions.requestWorkflows()
      .then(workflows => this.setState({workflows: workflows}))
      .catch(err => this.setState({error: err.stack || err}));
  }

  render() {
    return (
      <div className="Workflows">
        <div>{this.state.error ? JSON.stringify(this.state.error) : 'NO-ERROR'}</div>
        <div>{this.state.workflows ? JSON.stringify(this.state.workflows) : 'NO-WORKFLOWS'}</div>
      </div>
    );
  }

}

export default Workflows;
