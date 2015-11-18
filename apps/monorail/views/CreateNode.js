// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import EditNode from './EditNode';

export default class CreateNode extends Component {

  render() { return <EditNode node={{type: 'compute'}} />; }

}
