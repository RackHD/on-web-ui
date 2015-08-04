'use strict';

import React, // eslint-disable-line no-unused-vars
  { Component, PropTypes } from 'react';

import decorate from 'common-web-ui/lib/decorate';

import {
    RaisedButton
  } from 'material-ui';

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

  componentDidMount() {
    // this.context.editor.onGraphUpdate(() => {
    //   this.forceUpdate();
    // });
  }

  componentWillUnmount() {}

  update(selected) {
    // debugger;
    this.setState({ selected });
    this.refs.outline.updateSelected(selected);
  }

  // get currentWorkflow() {
  //   return this.context.editor.workflowGraph.workflowTemplate;
  // }

  render() {
    var selected = this.state.selected || [];
    // selected = selected.map(function (node) {
    //   var task = null;
    //   if (node.data.task) {
    //     task = node.data.task.label;
    //   }
    //   return (
    //     <div className="task" key={node.id} ref={node.id}>
    //       {node.id}
    //       <div>{task}</div>
    //     </div>
    //   );
    // });
    if (!selected || !selected.length) {
      selected = 'No selected nodes.';
    }
    else {
      selected = selected.length;
    }
    return (
      <div className="WorkflowInspector" style={{padding: 10}}>
        <p style={{color: '#bbb', float: 'left'}}>
          {selected} selected items.
        </p>
        <RaisedButton
            disabled={!!selected}
            style={{float: 'right'}}
            primary={true}
            label="Remove Selected" />
        <hr style={{
          clear: 'both',
          display: 'block',
          height: '1px',
          border: 0,
          borderTop: '1px solid #ddd',
          margin: 0,
          padding: 0
        }} />
        <WEWorkflowOutline ref="outline" model={{}} />
      </div>
    );
  }

}
