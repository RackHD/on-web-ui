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
          'New Template'
        )}
        <EditTemplate templateRef={{name: 'New Template', contents: ''}} />
      </div>
    );
  }

}
