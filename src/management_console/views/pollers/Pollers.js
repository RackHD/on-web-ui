// Copyright 2015, EMC, Inc.

import React, { Component } from 'react';

import PollersGrid from './PollersGrid';

export default class Pollers extends Component {

  render() {
    let params = this.props.params || {};
    let nodeId = this.props.nodeId || params.nodeId;
    return <PollersGrid />;
  }

}
