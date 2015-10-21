// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import PollersGrid from './PollersGrid';

@mixin(PageHelpers)
export default class Pollers extends Component {

  render() {
    let params = this.props.params || {};
    let nodeId = this.props.nodeId || params.nodeId;
    return (
      <div className="Pollers">
        {nodeId ?
          this.renderBreadcrumbs(
            {href: '', label: 'Dashboard'},
            {href: 'nodes', label: 'Nodes'},
            {href: 'nodes/' + nodeId, label: nodeId},
            'Pollers'
          ) :
          this.renderBreadcrumbs({href: '', label: 'Dashboard'}, 'Pollers')
        }
        <PollersGrid />
      </div>
    );
  }

}
