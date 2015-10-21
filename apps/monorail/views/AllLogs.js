// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import JsonInspector from 'react-json-inspector';

import {} from 'material-ui';

import LogsMessenger from '../messengers/LogsMessenger';
let logs = new LogsMessenger();

@mixin(PageHelpers)
export default class AllLogs extends Component {

  state = {
    logs: []
  };

  componentWillReceiveProps(nextProps) {
    this.unwatch();
    this.watch(nextProps);
    this.forceUpdate();
  }

  unwatch() {
    logs.ignore();
  }

  watch(props) {
    logs.listen(msg => {
      this.setState(state => {
        return {logs: [msg.data].concat(state.logs)};
      });
    });
  }

  componentDidMount() {
    logs.connect();
    this.watch();
  }

  componentWillUnmount() {
    this.unwatch();
    logs.disconnect();
  }

  render() {
    let colors = {
      emerge: 'red',
      alert: 'yellow',
      crit: 'red',
      error: 'red',
      warning: 'red',
      notice: 'yellow',
      info: 'green',
      debug: 'blue',
      silly: 'blue'
    };
    return (
      <div className="AllLogs">
        {this.renderBreadcrumbs(
          {href: '', label: 'Dashboard'},
          'All Logs'
        )}
        <div style={{background: 'black', padding: 5}}>
          {this.state.logs.map(data => (
            <p style={{color: colors[data.level]}}>
              <b>{data.timestamp}</b>&nbsp;&nbsp;
              <i>[{data.name}]</i>&nbsp;&nbsp;
              <i>[{data.module}]</i>&nbsp;&nbsp;
              <i>[{data.subject}]</i>&nbsp;--&nbsp;
              <b>{data.message}</b>&nbsp;->&nbsp;
              <u>{data.caller}</u>
            </p>
          ))}
        </div>
      </div>
    );
  }

}
