'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import EditWorkflow from './EditWorkflow';
import {} from 'material-ui';

@mixin.decorate(PageHelpers)
export default class Workflow extends Component {

  state = {
    template: null
  };

  componentDidMount() {}

  componentWillUnmount() { }

  render() {
    return (
      <div className="Workflow">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'workflows', label: 'Workflows'},
          'New Workflow'
        )}
        <EditWorkflow templateRef={{id: null, name: 'New Workflow', contents: ''}} />
      </div>
    );
  }

}
