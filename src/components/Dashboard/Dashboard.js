'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import Nodes from '../Nodes';
import Workflows from '../Workflows';
import Breadcrumbs from '../Breadcrumbs';

import './Dashboard.less';

export default class Dashboard extends Component {

  render() {
    return (
      <div className="Dashboard">
        <Breadcrumbs>Dashboard</Breadcrumbs>
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
