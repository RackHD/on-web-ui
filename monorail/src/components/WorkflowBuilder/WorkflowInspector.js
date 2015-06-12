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
    var selected = this.state.selected.map(function (node) {
      return (
        <div>{node.id}</div>
      );
    });
    return (
      <Paper className="WorkflowInspector">
        {selected}
      </Paper>
    );
  }

}
