// Copyright 2015, EMC, Inc.

import React, { Component } from 'react';

import NodesGrid from './nodes/NodesGrid';
import WorkflowsGrid from './workflows/WorkflowsGrid';

export default class Dashboard extends Component {

  render() {
    return (
      <div className="Dashboard">
        <NodesGrid size={5} />
        <WorkflowsGrid
          filter={(workflow) => workflow.node}
          limit={5} />
      </div>
    );
  }

}
