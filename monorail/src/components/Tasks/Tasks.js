'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from '../../../../common/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import TasksGrid from './TasksGrid';
import './Tasks.less';

@mixin.decorate(PageHelpers)
export default class Tasks extends Component {

  render() {
    return (
      <div className="Tasks">
        {this.renderBreadcrumbs({href: 'dash', label: 'Dashboard'}, 'Tasks')}
        <TasksGrid />
      </div>
    );
  }

}
