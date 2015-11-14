// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import CatalogsGrid from './CatalogsGrid';
import FilesGrid from './FilesGrid';
import NodesGrid from './NodesGrid';
import OBMServiceGrid from './OBMServicesGrid';
import PollersGrid from './PollersGrid';
import ProfilesGrid from './ProfilesGrid';
import SkusGrid from './SkusGrid';
import TemplatesGrid from './TemplatesGrid';
// import SchemasGrid from './SchemasGrid';
// import VersionsGrid from './VersionsGrid';
import WorkflowsGrid from './WorkflowsGrid';


@mixin(PageHelpers)
export default class Dashboard extends Component {

  render() {
    return (
      <div className="Dashboard" style={{overflow: 'hidden'}}>
        {this.renderBreadcrumbs('Dashboard')}
        <NodesGrid size={5} />
        <WorkflowsGrid
          filter={(workflow) => workflow.node}
          limit={5} />
      </div>
    );
  }

}
