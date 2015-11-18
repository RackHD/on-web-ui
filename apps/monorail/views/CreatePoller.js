// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import EditPoller from './EditPoller';

export default class CreatePoller extends Component {

  render() { return <EditPoller poller={{config: {}}} />; }

}
