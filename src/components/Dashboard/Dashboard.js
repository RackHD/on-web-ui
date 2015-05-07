'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from '../mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import Nodes from '../Nodes';
import Workflows from '../Workflows';
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
              <Nodes />
            </div>
            <div className="one-half column">
              <Workflows />
            </div>
          </div>
        </div>
      </div>
    );
  }

}
