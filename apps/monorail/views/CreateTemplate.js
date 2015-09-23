// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import EditTemplate from './EditTemplate';
import {} from 'material-ui';

@mixin.decorate(PageHelpers)
export default class CreateTemplate extends Component {

  state = {
    template: null
  };

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className="Template">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'templates', label: 'Templates'},
          'Create Template'
        )}
        <EditTemplate template={{}} />
      </div>
    );
  }

}
