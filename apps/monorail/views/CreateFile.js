// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import EditFile from './EditFile';
import {} from 'material-ui';

@mixin(PageHelpers)
export default class CreateFile extends Component {

  state = {
    file: null
  };

  componentDidMount() {}

  componentWillUnmount() { }

  render() {
    return (
      <div className="File">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'files', label: 'Files'},
          'Create File'
        )}
        <EditFile file={{}} />
      </div>
    );
  }

}
