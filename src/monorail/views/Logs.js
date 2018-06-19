// Copyright 2015, EMC, Inc.

import React, { Component } from 'react';
import moment from 'moment';

import Console from 'src-common/views/Console';
import JsonInspector from 'react-json-inspector';

import ElasticsearchAPI from 'src-common/messengers/ElasticsearchAPI';
import LogsMessenger from 'src-common/messengers/LogsMessenger';

export default class Logs extends Component {

  static defaultProps = {
    open: false
  };

  static logs = new LogsMessenger();

  get logs() { return this.constructor.logs; }

  state = {
    previousLogs: [],
    realtimeLogs: []
  };

  unwatch() {
    this.logs.ignore();
  }

  watch(props) {
    this.logs.listen(msg => {
      this.setState(state => {
        return {realtimeLogs: [msg.data].concat(state.realtimeLogs)};
      });
    });
  }

  componentDidMount() {
    this.watch();
  }

  componentWillUnmount() {
    this.unwatch();
  }

  loadPreviousLogs(offset=0, size=300) {
    return ElasticsearchAPI.search({
      q: '*',
      sort: 'timestamp:desc',
      index: 'logstash-*',
      from: offset,
      size
    });
  }

  render() {
    if (this.props.open === false) { return null; }

    let props = {style: this.props.style},
        state = this.state;

    let elements = state.previousLogs.concat(state.realtimeLogs).sort(
      (a, b) => moment(a.timestamp).unix() -
                moment(b.timestamp).unix()
    );

    return (
      <div className="Logs" {...props}>
        <Console
          elements={elements}
          height={this.props.height}
          handleInfiniteLoad={cb => {
            this.loadPreviousLogs(elements.length).then(res => {
              let previousLogs = res.hits.hits.map(hit => hit._source);

              this.setState(state => {
                previousLogs = previousLogs.concat(state.previousLogs);
                return { previousLogs };
              }, cb);
            }).catch(cb);
          }} />
      </div>
    );
  }

}

Logs.logs.connect();
