'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
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

// import Chart from './Chart';

@mixin.decorate(PageHelpers)
export default class Dashboard extends Component {

  render() {
    return (
      <div className="Dashboard" style={{overflow: 'hidden'}}>
        {this.renderBreadcrumbs('Dashboard')}
        <CatalogsGrid size={5}/>
        <FilesGrid size={5} />
        <NodesGrid size={5} />
        <OBMServiceGrid size={5} />
        <PollersGrid size={5} />
        <ProfilesGrid size={5} />
        <SkusGrid size={5} />
        <TemplatesGrid size={5} />
        {/*<SchemasGrid size={5} />*/}
        {/*<VersionsGrid size={5} />*/}
        <WorkflowsGrid size={5} />
        {/*<Chart />*/}
      </div>
    );
  }

}
