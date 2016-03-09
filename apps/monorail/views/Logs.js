// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import Console from 'rui-common/views/Console';
import JsonInspector from 'react-json-inspector';

import LogsMessenger from 'rui-common/messengers/LogsMessenger';

export default class Logs extends Component {

  static defaultProps = {
    open: false
  };

  static logs = new LogsMessenger();

  get logs() { return this.constructor.logs; }

  state = {
    logs: []
  };

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
    this.watch();
  }

  componentWillUnmount() {
    this.unwatch();
  }

  render() {
    if (this.props.open === false) { return null; }

    let props = {style: this.props.style};

    return (
      <div className="Logs" {...props}>
        <Console rows={this.state.logs} height={this.props.height} mapper={data => (
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

Logs.logs.connect();
