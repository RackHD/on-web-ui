'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import WorkflowsGrid from './WorkflowsGrid';

@mixin.decorate(PageHelpers)
export default class Workflows extends Component {

  render() {
    this.props.params = this.props.params || {};
    let nodeId = this.props.nodeId || this.props.params.nodeId;
    return (
      <div className="Workflows">
        {nodeId ?
          this.renderBreadcrumbs(
            {href: 'dash', label: 'Dashboard'},
            {href: 'workflows', label: 'Workflows'},
            'n', nodeId
          ) :
          this.renderBreadcrumbs({href: 'dash', label: 'Dashboard'}, 'Workflows')
        }
        <WorkflowsGrid nodeId={nodeId} />
      </div>
    );
  }

}
