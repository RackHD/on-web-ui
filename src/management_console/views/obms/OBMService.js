// Copyright 2015, EMC, Inc.

import React, { Component } from 'react';

import { LinearProgress } from 'material-ui';
import JsonInspector from 'react-json-inspector';

import OBMServiceStore from 'src-common/stores/OBMServiceStore';

export default class OBMService extends Component {

  obmService = new OBMServiceStore();

  state = {
    obmService: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchOBMService = this.obmService.watchOne(this.getOBMServiceId(), 'obmService', this);
    this.readOBMService();
  }

  componentWillUnmount() { this.unwatchOBMService(); }

  render() {
    return (
      <div className="OBMService">
        <LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />
        <div style={{overflow: 'auto', margin: 10}}>
          <JsonInspector
              search={false}
              isExpanded={() => true}
              data={this.state.obmService || {}} />
        </div>
      </div>
    );
  }

  getOBMServiceId() { return this.props.obmsId || this.props.params.obmsId; }

  readOBMService() {
    this.setState({loading: true});
    this.obmService.read(this.getOBMServiceId()).then(() => this.setState({loading: false}));
  }

}
