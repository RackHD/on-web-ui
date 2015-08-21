'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import EditPoller from './EditPoller';
import {} from 'material-ui';

@mixin.decorate(PageHelpers)
export default class Poller extends Component {

  state = {
    template: null
  };

  componentDidMount() {}

  componentWillUnmount() { }

  render() {
    return (
      <div className="Poller">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'pollers', label: 'Pollers'},
          'New Poller'
        )}
        <EditPoller templateRef={{id: null, name: 'New Poller', contents: ''}} />
      </div>
    );
  }

}
