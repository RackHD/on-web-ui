'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from '../../../../common/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import ActivitiesGrid from './ActivitiesGrid';
import './Activities.less';

@mixin.decorate(PageHelpers)
export default class Activities extends Component {

  render() {
    return (
      <div className="Activities">
        {this.renderBreadcrumbs({href: 'dash', label: 'Dashboard'}, 'Activities')}
        <ActivitiesGrid />
      </div>
    );
  }

}
