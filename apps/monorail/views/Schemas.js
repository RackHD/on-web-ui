'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import SchemasGrid from './SchemasGrid';

@mixin.decorate(PageHelpers)
export default class Schemas extends Component {

  render() {
    return (
      <div className="Schemas">
        {this.renderBreadcrumbs({href: 'dash', label: 'Dashboard'}, 'Schemas')}
        <SchemasGrid />
      </div>
    );
  }

}
