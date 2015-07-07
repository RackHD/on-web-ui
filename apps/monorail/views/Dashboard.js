'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import NodesGrid from './NodesGrid';
import ProfilesGrid from './ProfilesGrid';
import TemplatesGrid from './TemplatesGrid';
import Chart from './Chart';

@mixin.decorate(PageHelpers)
export default class Dashboard extends Component {

  render() {
    return (
      <div className="Dashboard">
        {this.renderBreadcrumbs('Dashboard')}
        <Chart />
        <NodesGrid />
        <ProfilesGrid />
        <TemplatesGrid />
      </div>
    );
  }

}
