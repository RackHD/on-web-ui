// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import AceEditor from 'common-web-ui/views/AceEditor';
import 'brace/mode/json';
import 'brace/theme/monokai';

import { RaisedButton } from 'material-ui';

@radium
export default class WEWorkflowJson extends Component {

  static propTypes = {
    className: PropTypes.string,
    model: PropTypes.object,
    style: PropTypes.any
  };

  static defaultProps = {
    className: 'WorkflowJson',
    model: null,
    style: {}
  };

  static contextTypes = {
    workflowEditor: PropTypes.any,
    workflowOperator: PropTypes.any
  };

  state = {
    activeWorkflow: this.activeWorkflow,
    version: 0
  };

  get workflowTemplateStore() {
    return this.context.workflowOperator.workflowTemplateStore;
  }

  componentDidMount() {
    this.handleWorkflowChange = (source) => {
      if (source === 'json') { return; }
      this.setState({
        activeWorkflow: this.context.workflowOperator.activeWorkflow,
        version: this.state.version + 1
      }, () => {
        this.refs.aceEditor.editor.selection.moveCursorFileStart();
      });
    }
    this.context.workflowOperator.onChangeWorkflow(this.handleWorkflowChange);
    this.refs.aceEditor.editor.on('blur', () => {
      clearTimeout(this.updateTimer);
      this.compileJSON();
    });
  }

  componenWillUnmount() {
    this.context.workflowOperator.offChangeWorkflow(this.handleWorkflowChange);
  }

  get activeWorkflow() {
    return this.context.workflowOperator.activeWorkflow;
  }

  render() {
    return (
      <div>
        <AceEditor ref="aceEditor" key="aceEditor"
          mode="json"
          theme="monokai"
          name="workflowAceEditor"
          width="100%"
          height={(window.innerHeight - 70) + 'px'}
          value={this.prepareJSON(this.state.activeWorkflow)}
          onChange={this.autoUpdateGraph.bind(this)} />
      </div>
    );
  }

  prepareJSON(activeWorkflow) {
    if (!activeWorkflow || Object.keys(activeWorkflow).length === 0) {
      this.lastValue = '{}';
      return this.lastValue;
    }

    this.lastValue = activeWorkflow.source;
    return this.lastValue;
  }

  silentUpdate() {
    this.silentUpdating = true;
    this.forceUpdate(() => this.silentUpdating = false);
  }

  autoUpdateGraph(newValue) {
    if (this.silentUpdating) { return; }
    if (newValue === this.lastValue) { return; }

    let absDiff = Math.abs(newValue.length - this.lastValue.length);

    clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(() => {
      this.compileJSON(newValue);
    }, absDiff > 15 ? 1500 : 5000);
  }

  compileJSON(newJsonObject) {
    newJsonObject = newJsonObject || this.refs.aceEditor.editor.getValue();

    if (typeof newJsonObject === 'string') {
      try {
        newJsonObject = JSON.parse(newJsonObject);
      }

      catch(err) {
        console.warn('WorkflowJSON parse failure.', err);
        return;
      }
    }

    if (newJsonObject) {
      this.state.activeWorkflow.jsonUpdate(this.context, newJsonObject);
    }
  }

}
