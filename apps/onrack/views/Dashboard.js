// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import ChassisGrid from './ChassisGrid';
// import SystemsGrid from './SystemsGrid';

@mixin(PageHelpers)
export default class Dashboard extends Component {

  render() {
    return (
      <div className="Dashboard">
        {this.renderBreadcrumbs('Dashboard')}
        <div className="container">
          {/*<div className="row">
            <div className="one-half column">*/}
              <ChassisGrid />
            {/*</div>
            <div className="one-half column">
              <SystemsGrid />
            </div>
          </div>*/}
        </div>
      </div>
    );
  }

}
