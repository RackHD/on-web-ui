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
    layout: PropTypes.any,
    editor: PropTypes.any
  };

  state = {
    model: this.props.model
  };

  componentWillMount() {
    this.workflowTemplateStore = this.context.editor.workflowTemplateStore;
  }

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <RaisedButton label="Update Graph" onTouchTap={this.updateGraph.bind(this)}/>
        <RaisedButton label="Save Graph" onTouchTap={this.saveGraph.bind(this)}/>
        {this.state.error}
        <AceEditor ref="aceEditor" key="aceEditor"
          mode="json"
          theme="monokai"
          name="workflowAceEditor"
          width="98%"
          height={(window.innerHeight - 174) + 'px'}
          value={this.prepareJSON(this.state.model || this.props.model)}
          onChange={this.autoUpdateGraph.bind(this)} />
      </div>
    );
  }

  prepareJSON(model) {
    if (!model || Object.keys(model).length === 0) {
      this.lastValue = '{}';
      return this.lastValue;
    }
    let safeJsonify = (output, source) => {
      if (!source || typeof source !== 'object') { return source; }
      if (Array.isArray(source)) {
        return source.slice(0).map(item => safeJsonify({}, item));
      }
      Object.keys(source).forEach(key => {
        if (key === '_' || key === 'id') { return; }
        output[key] = safeJsonify({}, source[key]);
      });
      return output;
    };
    this.lastValue = JSON.stringify(safeJsonify({}, model), '\t', 2);
    return this.lastValue;
  }

  silentUpdate() {
    this.silentUpdating = true;
    this.forceUpdate();
    setTimeout(() => {
      delete this.silentUpdating;
    }, 32);
  }

  autoUpdateGraph(newValue) {
    clearTimeout(this.updateTimer);
    if (this.silentUpdating) { return; }
    if (newValue === this.lastValue) { return; }
    try {
      let updates = JSON.parse(newValue);
      this.compileJSON(updates, 7000);
    }
    catch (err) {
      console.warn(err.stack || err);
    }
  }

  updateGraph() {
    this.compileJSON(this.refs.aceEditor.editor.getValue());
  }

  saveGraph() {
    let workflow = JSON.parse(this.refs.aceEditor.editor.getValue());
    workflow.injectableName = workflow.injectableName || 'Graph.' + workflow.friendlyName.replace(' ', '.');
    this.workflowTemplateStore.create(workflow.injectableName, workflow).then(
      () => {this.workflowTemplateStore.list()},
      err => console.error(err));
  }

  compileJSON(newValue, delay) {
    try {
      let updates = typeof newValue === 'string' ? JSON.parse(newValue) : newValue;
      if (updates) {
        this.updateWorkflowGraph(updates, delay || 32);
      }
    }
    catch(err) {
      console.warn(err);
      // this.setState({error: err});
    }
  }

  updateWorkflowGraph(updates, delay) {
    let safeMerge = (current, changes) => {
      if (!changes || typeof changes !== 'object') {
        return changes;
      }
      let safe;
      if (Array.isArray(changes)) {
        safe = [];
        changes.forEach((item, i) => {
          safe[i] = safeMerge(safe[i], item);
        });
      }
      else {
        safe = {};
        Object.keys(changes).forEach(key => {
          if (key === '_' || key === 'id') {
            throw new Error('WorkflowEditor: Cannot use _ or id as property names in workflow templates.');
          }
          safe[key] = safeMerge(safe[key], changes[key]);
        });
      }
      return safe;
    };

    this.context.editor.currentWorkflowGraph =
      safeMerge(this.context.editor.currentWorkflowGraph, updates);

    clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(() => {
      // this.setState({error: null});
      try {
        this.context.editor.refreshWorkflow();
      } catch (err) {
        console.error(err);
      }
    }, delay || 250);
  }

}
