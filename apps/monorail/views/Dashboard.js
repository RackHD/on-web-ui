'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import CatalogsGrid from './CatalogsGrid';
import NodesGrid from './NodesGrid';
import ProfilesGrid from './ProfilesGrid';
import SkusGrid from './SkusGrid';
import TemplatesGrid from './TemplatesGrid';
import WorkflowsGrid from './WorkflowsGrid';

import Chart from './Chart';

@mixin.decorate(PageHelpers)
export default class Dashboard extends Component {

  render() {
    return (
      <div className="Dashboard">
        {this.renderBreadcrumbs('Dashboard')}
        <CatalogsGrid />
        <NodesGrid />
        <ProfilesGrid />
        <SkusGrid />
        <TemplatesGrid />
        <WorkflowsGrid />
        <Chart />
      </div>
    );
  }

}
