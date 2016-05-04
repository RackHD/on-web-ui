// Copyright 2015, EMC, Inc.

import React, { Component } from 'react';
import { LinearProgress } from 'material-ui';
import JsonInspector from 'react-json-inspector';

import ConfigStore from 'src-common/stores/ConfigStore';

export default class Config extends Component {

  config = new ConfigStore();

  state = {
    config: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchConfig = this.config.watchOne('config', 'config', this);
    this.readConfig();
  }

  componentWillUnmount() { this.unwatchConfig(); }

  render() {
    return (
      <div className="Config">
        <LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />
        <div style={{overflow: 'auto', margin: 10}}>
          <JsonInspector
              isExpanded={() => true}
              data={this.state.config || {}} />
        </div>
      </div>
    );
  }

  readConfig() {
    this.setState({loading: true});
    this.config.read().then(() => this.setState({loading: false}));
  }

}
