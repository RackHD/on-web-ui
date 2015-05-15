'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from '../../../../common/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import ChassisGrid from './ChassisGrid';
import './Chassis.less';

@mixin.decorate(PageHelpers)
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
