// Copyright 2015, EMC, Inc.

import React, { Component } from 'react';

import EditSku from './EditSku';

export default class CreateSku extends Component {

  render() {
    return <EditSku sku={{rules: [{path: 'example.catalog.path', contains: 'value'}]}} />;
  }

}
