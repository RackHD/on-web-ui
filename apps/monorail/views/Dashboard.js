// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';

import NodesGrid from './NodesGrid';
import WorkflowsGrid from './WorkflowsGrid';

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
