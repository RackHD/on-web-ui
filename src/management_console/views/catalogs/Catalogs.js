// Copyright 2015, EMC, Inc.

import React, { Component } from 'react';

import CatalogsGrid from './CatalogsGrid';

export default class Catalogs extends Component {

  render() {
    let params = this.props.params || {},
        nodeId = this.props.nodeId || params.nodeId,
        source = this.props.source || params.source;
    return <CatalogsGrid nodeId={nodeId} source={source} />;
  }

}
