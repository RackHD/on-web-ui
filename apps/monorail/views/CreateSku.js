'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import EditSku from './EditSku';
import {} from 'material-ui';

@mixin.decorate(PageHelpers)
export default class CreateSku extends Component {

  state = {
    sku: null
  };

  componentDidMount() {}

  componentWillUnmount() { }

  render() {
    return (
      <div className="Sku">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'skus', label: 'Skus'},
          'Create Sku'
        )}
        <EditSku sku={{rules: [{path: 'example.catalog.path', contains: 'value'}]}} />
      </div>
    );
  }

}
