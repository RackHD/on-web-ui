'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';
import JsonEditor from 'common-web-ui/views/JsonEditor';

import { } from 'material-ui';

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

  componentDidUpdate() {
    this.refs.jsonEditor.setState({value: this.prepareJSON(this.state.model)});
  }

  render() {
    // let workflow = this.state.model;
    return <JsonEditor ref="jsonEditor"
        style={{width: '96%', height: window.innerHeight - 200}}
        initialValue={this.prepareJSON(this.props.model)}
        updateParentState={this.updateWorkflowGraph.bind(this)} />;
  }

  prepareJSON(model) {
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
    return safeJsonify({}, model);
  }

  updateWorkflowGraph(updates) {
    clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(() => {
      let safeMerge = (current, changes) => {
        if (!changes || typeof changes !== 'object') {
          return changes;
        }
        if (Array.isArray(changes)) {
          changes.forEach((item, i) => {
            current[i] = safeMerge(current[i], item);
          });
        }
        else {
          Object.keys(changes).forEach(key => {
            if (key === '_' || key === 'id') {
              throw new Error('WorkflowEditor: Cannot use _ or id as property names in workflow templates.');
            }
            current[key] = safeMerge(current[key], changes[key]);
          });
        }
        return current;
      };
      safeMerge(this.context.editor.currentWorkflowTemplate, updates);
      safeMerge(this.context.editor.currentWorkflowGraph, updates);
      try {
        this.context.editor.refreshWorkflow();
      } catch (err) {
        console.error(err);
      }
    }, 2000);
  }

}
