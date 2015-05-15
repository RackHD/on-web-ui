'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from '../../../../common/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import { ChassisGrid } from '../Chassis';
import { SystemsGrid } from '../Systems';
import './Dashboard.less';

@mixin.decorate(PageHelpers)
export default class Dashboard extends Component {

  render() {
    return (
      <div className="Dashboard">
        {this.renderBreadcrumbs('Dashboard')}
        <div className="container">
          <div className="row">
            <div className="one-half column">
              <ChassisGrid />
            </div>
            <div className="one-half column">
              {<SystemsGrid />}
            </div>
          </div>
        </div>
      </div>
    );
  }

}
