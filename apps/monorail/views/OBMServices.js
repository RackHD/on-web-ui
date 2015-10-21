// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import OBMServicesGrid from './OBMServicesGrid';

@mixin(PageHelpers)
export default class OBMServices extends Component {

  render() {
    return (
      <div className="OBMServices">
        {this.renderBreadcrumbs({href: '', label: 'Dashboard'}, 'OBM Services')}
        <OBMServicesGrid />
      </div>
    );
  }

}
