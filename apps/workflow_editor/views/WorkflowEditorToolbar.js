// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

export default class WorkflowEditorToolbar extends Component {

  render() {
    return (
      <div className="WorkflowEditorToolbar">
        {this.props.children}
      </div>
    );
  }

}
