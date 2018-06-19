// Copyright 2015, EMC, Inc.

import React, { Component } from 'react';

import EditWorkflow from './EditWorkflow';

export default class CreateWorkflow extends Component {

  render() {
    let nodeId = this.props.params && this.props.params.nodeId;
    return <EditWorkflow
      workflow={{node: nodeId}}
      nodeId={nodeId}/>;
  }

}
