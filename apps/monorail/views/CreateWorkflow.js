// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import EditWorkflow from './EditWorkflow';

export default class CreateWorkflow extends Component {

  render() {
    return <EditWorkflow
      workflow={{node: this.props.params.nodeId}}
      nodeId={this.props.params.nodeId}/>;
  }

}
