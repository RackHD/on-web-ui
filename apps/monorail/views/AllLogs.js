// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import Console from 'common-web-ui/views/Console';
import JsonInspector from 'react-json-inspector';

import LogsMessenger from '../messengers/LogsMessenger';

export default class AllLogs extends Component {

  static logs = new LogsMessenger();

  logs = this.constructor.logs;

  state = {
    logs: []
  };

  // componentWillReceiveProps(nextProps) {
  //   this.unwatch();
  //   this.watch(nextProps);
  //   this.forceUpdate();
  // }

  unwatch() {
    this.logs.ignore();
  }

  watch(props) {
    this.logs.listen(msg => {
      this.setState(state => {
        return {logs: [msg.data].concat(state.logs)};
      });
    });
  }

  componentDidMount() {
    // this.logs.connect();
    this.watch();
  }

  componentWillUnmount() {
    this.unwatch();
    // this.logs.disconnect();
  }

  render() {
    return (
      <div className="AllLogs">
        <Console rows={this.state.logs} mapper={data => (
          <p style={{color: Console.colors[data.level]}}>
            <b>{data.timestamp}</b>&nbsp;&nbsp;
            <i>[{data.name}]</i>&nbsp;&nbsp;
            <i>[{data.module}]</i>&nbsp;&nbsp;
            <i>[{data.subject}]</i>&nbsp;--&nbsp;
            <b>{data.message}</b>&nbsp;->&nbsp;
            <u>{data.caller}</u>
          </p>
        )} />
      </div>
    );
  }

}

AllLogs.logs.connect();
