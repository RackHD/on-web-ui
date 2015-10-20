// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import EditWorkflow from './EditWorkflow';
import {} from 'material-ui';

@mixin(PageHelpers)
export default class CreateWorkflow extends Component {

  state = {
    workflow: null
  };

  componentDidMount() {}

  componentWillUnmount() { }

  render() {
    return (
      <div className="Workflow">
        {this.props.params.nodeId ?
          this.renderBreadcrumbs(
            {href: '', label: 'Dashboard'},
            {href: 'nodes', label: 'Nodes'},
            {href: 'nodes/' + this.props.params.nodeId, label: this.props.params.nodeId},
            {href: 'workflows/n/' + this.props.params.nodeId, label: 'Workflows'},
            'Create Workflow'
          ) : this.renderBreadcrumbs(
            {href: '', label: 'Dashboard'},
            {href: 'workflows', label: 'Workflows'},
            'Create Workflow'
          )
        }
        <EditWorkflow workflow={{node: this.props.params.nodeId}} nodeId={this.props.params.nodeId}/>
      </div>
    );
  }

}
