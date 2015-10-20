// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import CatalogsGrid from './CatalogsGrid';

@mixin(PageHelpers)
export default class Catalogs extends Component {

  render() {
    let params = this.props.params || {};
    let nodeId = this.props.nodeId || params.nodeId,
        source = this.props.source || params.source;
    return (
      <div className="Catalogs">
        {nodeId ?
          (source ?
            this.renderBreadcrumbs(
              {href: '', label: 'Dashboard'},
              {href: 'nodes', label: 'Nodes'},
              {href: 'nodes/' + nodeId, label: nodeId},
              {href: 'catalogs/n/' + nodeId, label: 'Catalogs'},
              source
            ) :
            this.renderBreadcrumbs(
              {href: '', label: 'Dashboard'},
              {href: 'nodes', label: 'Nodes'},
              {href: 'nodes/' + nodeId, label: nodeId},
              'Catalogs'
            )) :
            this.renderBreadcrumbs({href: '', label: 'Dashboard'}, 'Catalogs')
        }
        <CatalogsGrid nodeId={nodeId} source={source} />
      </div>
    );
  }

}
