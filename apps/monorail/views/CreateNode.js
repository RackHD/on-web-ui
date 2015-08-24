'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import EditNode from './EditNode';
import {} from 'material-ui';

@mixin.decorate(PageHelpers)
export default class CreateNode extends Component {

  state = {
    node: null
  };

  componentDidMount() {}

  componentWillUnmount() { }

  render() {
    return (
      <div className="Node">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'nodes', label: 'Nodes'},
          'New Node'
        )}
        <EditNode nodeRef={{id: null, name: 'New Node', contents: ''}} />
      </div>
    );
  }

}
