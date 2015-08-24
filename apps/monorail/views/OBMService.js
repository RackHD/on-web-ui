'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import { LinearProgress } from 'material-ui';

import JsonInspector from 'react-json-inspector';

import OBMServiceStore from '../stores/OBMServiceStore';
let obmService = new OBMServiceStore();

@mixin.decorate(PageHelpers)
export default class OBMService extends Component {

  state = {
    obmService: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchOBMService = obmService.watchOne(this.getOBMServiceId(), 'obmService', this);
    this.readOBMService();
  }

  componentWillUnmount() { this.unwatchOBMService(); }

  render() {
    return (
      <div className="OBMService">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'obms', label: 'OBM Services'},
          this.props.params.obmsId
        )}
        {this.state.loading ? <LinearProgress mode="indeterminate"  /> : null}
        <JsonInspector
            search={false}
            isExpanded={() => true}
            data={this.state.obmService || {}} />
      </div>
    );
  }

  getOBMServiceId() { return this.props.obmsId || this.props.params.obmsId; }

  readOBMService() {
    this.setState({loading: true});
    let nodeId = this.getNodeId();
    if (nodeId) {

    }
    obmService.read(this.getOBMServiceId()).then(() => this.setState({loading: false}));
  }

}
