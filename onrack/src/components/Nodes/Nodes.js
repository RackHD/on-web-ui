'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from '../mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import NodesGrid from './NodesGrid';
import './Nodes.less';

@mixin.decorate(PageHelpers)
export default class Nodes extends Component {

  render() {
    return (
      <div className="Nodes">
        {this.renderBreadcrumbs({href: 'dash', label: 'Dashboard'}, 'Nodes')}
        <NodesGrid />
      </div>
    );
  }

}
