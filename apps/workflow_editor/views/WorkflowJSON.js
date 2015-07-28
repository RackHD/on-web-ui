'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';
// import JsonEditor from 'common-web-ui/views/JsonEditor';

import AceEditor from 'common-web-ui/views/AceEditor';
import 'brace/mode/json';
import 'brace/theme/github';

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
@mixin.decorate(DeveloperHelpers)
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

  componentWillMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <RaisedButton label="Update Graph" onTouchTap={this.updateGraph.bind(this)}/>
        {this.state.error}
        <AceEditor ref="aceEditor" key="aceEditor"
          mode="json"
          theme="github"
          name="workflowAceEditor"
          width="98%"
          height={window.innerHeight - 150}
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
    if (this.silentUpdating) { return; }
    if (newValue === this.lastValue) { return; }
    try {
      let updates = JSON.parse(newValue);
      this.compileJSON(updates, 1500);
    }
    catch (err) {
      console.warn(err.stack || err);
    }
  }

  updateGraph() {
    this.compileJSON(this.refs.aceEditor.editor.getValue());
  }

  compileJSON(newValue, delay) {
    console.log('COMPILE JSON');
    try {
      let updates = typeof newValue === 'string' ? JSON.parse(newValue) : newValue;
      if (updates) {
        this.updateWorkflowGraph(updates, delay || 32);
      }
    }
    catch(err) {
      this.setState({error: err});
    }
  }

  updateWorkflowGraph(updates, delay) {
    console.log('UPDATE WORKFLOW GRAPH');
    let safeMerge = (current, changes) => {
      if (!changes || typeof changes !== 'object') {
        return changes;
      }
      if (Array.isArray(changes)) {
        changes.forEach((item, i) => {
          current[i] = safeMerge(current[i] || changes[i], item);
        });
      }
      else {
        Object.keys(changes).forEach(key => {
          if (key === '_' || key === 'id') {
            throw new Error('WorkflowEditor: Cannot use _ or id as property names in workflow templates.');
          }
          current[key] = safeMerge(current[key] || changes[key], changes[key]);
        });
      }
      return current || changes;
    };

    safeMerge(this.context.editor.currentWorkflowTemplate, updates);
    safeMerge(this.context.editor.currentWorkflowGraph, updates);

    clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(() => {
      this.setState({error: null});
      try {
        this.context.editor.refreshWorkflow();
      } catch (err) {
        console.error(err);
      }
    }, delay || 250);
  }

}
