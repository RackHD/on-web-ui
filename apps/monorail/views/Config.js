// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';
import { LinearProgress } from 'material-ui';
import JsonInspector from 'react-json-inspector';

import ConfigStore from '../stores/ConfigStore';
let config = new ConfigStore();

export default class Config extends Component {

  state = {
    config: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchConfig = config.watchOne('config', 'config', this);
    this.readConfig();
  }

  componentWillUnmount() { this.unwatchConfig(); }

  render() {
    return (
      <div className="Config">
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : null}
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
    config.read().then(() => this.setState({loading: false}));
  }

}
