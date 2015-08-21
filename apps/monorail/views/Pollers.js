'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import PollersGrid from './PollersGrid';

@mixin.decorate(PageHelpers)
export default class Pollers extends Component {

  render() {
    return (
      <div className="Pollers">
        {this.renderBreadcrumbs({href: 'dash', label: 'Dashboard'}, 'Pollers')}
        <PollersGrid />
      </div>
    );
  }

}
