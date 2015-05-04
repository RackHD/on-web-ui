'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import Nodes from '../Nodes';
import Workflows from '../Workflows';

import './Dashboard.less';

class Dashboard extends Component {

  render() {
    return (
      <div className="Dashboard">
        <div className="breadcrumbs">Dashboard</div>
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

export default Dashboard;
