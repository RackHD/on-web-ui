'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from '../mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import NodesGrid from '../Nodes/NodesGrid';
import WorkflowsGrid from '../Workflows/WorkflowsGrid';
import TasksGrid from '../Tasks/TasksGrid';
import JobsGrid from '../Jobs/JobsGrid';
import ActivitiesGrid from '../Activities/ActivitiesGrid';
import Chart from './Chart';
import './Dashboard.less';

@mixin.decorate(PageHelpers)
export default class Dashboard extends Component {

  render() {
    return (
      <div className="Dashboard">
        {this.renderBreadcrumbs('Dashboard')}
        <div className="container">
          <div className="row">
            <div className="three columns chart"><Chart /></div>
            <div className="three columns chart"><Chart /></div>
            <div className="three columns chart"><Chart /></div>
            <div className="three columns chart"><Chart /></div>
          </div>
          <div className="row">
            <div className="one-half column">
              <NodesGrid />
              <ActivitiesGrid />
            </div>
            <div className="one-half column">
              <WorkflowsGrid />
              <TasksGrid />
              <JobsGrid />
            </div>
          </div>
        </div>
      </div>
    );
  }

}
