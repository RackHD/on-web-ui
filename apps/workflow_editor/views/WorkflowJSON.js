// Copyright 2015, EMC, Inc.

'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'common-web-ui/lib/mixin';
import decorate from 'common-web-ui/lib/decorate';

// import JsonEditor from 'common-web-ui/views/JsonEditor';

import AceEditor from 'common-web-ui/views/AceEditor';
import 'common-web-ui/node_modules/brace/mode/json';
import 'common-web-ui/node_modules/brace/theme/github';

import {
    RaisedButton
  } from 'material-ui';

/**
# WEWorkflowJSON

@object
  @type class
  @extends React.Component
  @name WEWorkflowJSON
  @desc
*/

@radium
@decorate({
  propTypes: {
    className: PropTypes.string,
    model: PropTypes.object,
    style: PropTypes.any
  },

  defaultProps: {
    className: 'WorkflowJson',
    model: null,
    style: {}
  },

  contextTypes: {
    layout: PropTypes.any,
    editor: PropTypes.any
  }
})
export default class WEWorkflowJson extends Component {

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
          theme="github"
          name="workflowAceEditor"
          width="98%"
          height={(window.innerHeight - 150) + 'px'}
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
    // console.log('AUTO UPDATE GRAPH');
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
    // console.log('UPDATE GRAPH');
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
    // console.log('COMPILE JSON');
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
    // console.log('UPDATE WORKFLOW GRAPH');
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

    // safeMerge(this.context.editor.currentWorkflowTemplate, updates);
    this.context.editor.currentWorkflowGraph =
      safeMerge(this.context.editor.currentWorkflowGraph, updates);

    // console.log('UPDATE TIMER');
    clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(() => {
      // console.log('REFRESH WORKFLOW');
      // this.setState({error: null});
      try {
        this.context.editor.refreshWorkflow();
      } catch (err) {
        console.error(err);
      }
    }, delay || 250);
  }

}
