// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import ChassisGrid from './ChassisGrid';

@mixin(PageHelpers)
export default class ChassisCollection extends Component {

  render() {
    return (
      <div className="ChassisCollection">
        {this.renderBreadcrumbs({href: 'dash', label: 'Dashboard'}, 'Chassis')}
        <ChassisGrid />
      </div>
    );
  }

}
