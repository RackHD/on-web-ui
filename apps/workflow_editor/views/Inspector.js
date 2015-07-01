'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import {
    Paper
  } from 'material-ui';

export default class WorkflowInspector extends Component {

  state = {selected: []};

  componentDidMount() {}

  componentWillUnmount() {}

  update(selected) {
    this.setState({ selected });
  }

  render() {
    var selected = this.state.selected || [];
    selected = selected.map(function (node) {
      var task = null;
      if (node.data.task) {
        task = node.data.task.label;
      }
      return (
        <div className="task" key={node.id} ref={node.id}>
          {node.id}
          <div>{task}</div>
        </div>
      );
    });
    return (
      <Paper className="WorkflowInspector">
        {selected}
      </Paper>
    );
  }

}
