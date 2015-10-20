// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import EditNode from './EditNode';
import {} from 'material-ui';

@mixin(PageHelpers)
export default class CreateNode extends Component {

  state = {
    node: null
  };

  componentDidMount() {}

  componentWillUnmount() { }

  render() {
    return (
      <div className="Node">
        {this.renderBreadcrumbs(
          {href: '', label: 'Dashboard'},
          {href: 'nodes', label: 'Nodes'},
          'Create Node'
        )}
        <EditNode node={{type: 'compute'}} />
      </div>
    );
  }

}
