// Copyright 2015, EMC, Inc.

import React, { Component } from 'react';

import EditWorkflow from 'src-management-console/views/workflows/EditWorkflow';

export default class RunWorkflow extends Component {

  render() {
    return <EditWorkflow
      title="Run Workflow"
      workflow={{name: this.props.name, node: '', options: this.props.options}}
      onDone={this.props.onDone} />;
  }

}
