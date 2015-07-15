'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import decorate from 'common-web-ui/lib/decorate';

import {} from 'material-ui';

import WEWorkflowOutline from './WorkflowOutline';

@decorate({
  propTypes: {},
  defaultProps: {},
  contextTypes: {
    layout: PropTypes.any,
    editor: PropTypes.any
  }
})
export default class WEInspector extends Component {

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
    if (!selected || !selected.length) {
      selected = 'No selected nodes.';
    }
    return (
      <div className="WorkflowInspector" style={{padding: 10}}>
        <WEWorkflowOutline ref="json" />
        <hr />
        <div className="selected">
          {selected}
        </div>
      </div>
    );
  }

}
