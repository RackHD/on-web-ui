'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from '../mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import JobsGrid from './JobsGrid';
import './Jobs.less';

@mixin.decorate(PageHelpers)
export default class Jobs extends Component {

  render() {
    return (
      <div className="Jobs">
        {this.renderBreadcrumbs({href: 'dash', label: 'Dashboard'}, 'Jobs')}
        <JobsGrid />
      </div>
    );
  }

}
