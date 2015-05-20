'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import GraphCanvas from '../GraphCanvas';
import WorkflowsMenu from './WorkflowsMenu';
import WorkflowTasksTray from './WorkflowTasksTray';
import './WorkflowBuilder.less';

export default class WorkflowBuilder extends Component {

  render() {
    return (
      <div className="WorkflowBuilder container">
        <div className="two columns">
          <WorkflowsMenu />
          <br/>
          <WorkflowTasksTray />
        </div>
        <div className="eight columns">
          <GraphCanvas />
        </div>
        <div className="two columns">
          <br /><br />
        </div>
      </div>
    );
  }

}
