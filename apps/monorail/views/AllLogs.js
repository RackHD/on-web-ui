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
        return {logs: state.logs.concat([msg.data])};
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
    return (
      <div className="AllLogs">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          'All Logs'
        )}
        {this.state.logs.map(data => (<p>{data.message}</p>))}
      </div>
    );
  }

}
