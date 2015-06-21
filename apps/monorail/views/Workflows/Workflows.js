'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import WorkflowsGrid from './WorkflowsGrid';
import './Workflows.less';

@mixin.decorate(PageHelpers)
export default class Workflows extends Component {

  render() {
    return (
      <div className="Workflows">
        {this.renderBreadcrumbs({href: 'dash', label: 'Dashboard'}, 'Workflows')}
        <WorkflowsGrid />
      </div>
    );
  }

}
