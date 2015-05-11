'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import GraphCanvas from '../GraphCanvas';
import './WorkflowEditor.less';

export default class WorkflowEditor extends Component {

  render() {
    return (
      <div className="WorkflowEditor container">
        <GraphCanvas />
      </div>
    );
  }

}
