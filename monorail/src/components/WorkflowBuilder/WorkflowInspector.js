'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import {
    Paper
  } from 'material-ui';

export default class WorkflowInspector extends Component {

  state = {selected: null};

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <Paper className="WorkflowInspector">
        Inspector
      </Paper>
    );
  }

}
