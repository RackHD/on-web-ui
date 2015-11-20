// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import { LinearProgress } from 'material-ui';

import JsonInspector from 'react-json-inspector';

import TaskStore from '../stores/TaskStore';
let task = new TaskStore();

export default class Task extends Component {

  state = {
    task: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchTask = task.watchOne('task', 'task', this);
    this.readTask();
  }

  componentWillUnmount() { this.unwatchTask(); }

  render() {
    return (
      <div className="Task">
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : null}
        <div style={{overflow: 'auto', margin: 10}}>
          <JsonInspector
              search={false}
              isExpanded={() => true}
              data={this.state.task || {}} />
        </div>
      </div>
    );
  }

  readTask() {
    this.setState({loading: true});
    task.read().then(() => this.setState({loading: false}));
  }

}
