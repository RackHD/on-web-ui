// Copyright 2015, EMC, Inc.

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';

import WorkflowsGrid from './WorkflowsGrid';

export default class Workflows extends Component {

  render() {
    let params = this.props.params || {},
        nodeId = this.props.nodeId || params.nodeId;
    return <WorkflowsGrid nodeId={nodeId} />;
  }

}
