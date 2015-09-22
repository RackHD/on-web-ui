// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import TemplatesGrid from './TemplatesGrid';

@mixin.decorate(PageHelpers)
export default class Templates extends Component {

  render() {
    return (
      <div className="Templates">
        {this.renderBreadcrumbs({href: 'dash', label: 'Dashboard'}, 'Templates')}
        <TemplatesGrid />
      </div>
    );
  }

}
