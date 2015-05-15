'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from '../../../../common/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import SystemsGrid from './SystemsGrid';

@mixin.decorate(PageHelpers)
export default class SystemsCollection extends Component {

  render() {
    return (
      <div className="SystemsCollection">
        {this.renderBreadcrumbs({href: 'dash', label: 'Dashboard'}, 'Systems')}
        <SystemsGrid />
      </div>
    );
  }

}
