'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import VersionsGrid from './VersionsGrid';

@mixin.decorate(PageHelpers)
export default class Versions extends Component {

  render() {
    return (
      <div className="Versions">
        {this.renderBreadcrumbs({href: 'dash', label: 'Dashboard'}, 'Versions')}
        <VersionsGrid />
      </div>
    );
  }

}
