// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

export default class VisualAnalytics extends Component {

  render() {
    return (
      <div className="VisualAnalytics">
        {this.props.children}
      </div>
    );
  }

}
