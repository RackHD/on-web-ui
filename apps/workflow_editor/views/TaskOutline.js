'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';

import {
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
    editor: PropTypes.object,
    style: PropTypes.any
  },

  defaultProps: {
    className: '',
    editor: null,
    style: {}
  },

  contextTypes: {
    layout: PropTypes.any,
    editor: PropTypes.any
  }
})
export default class WEWorkflowOutline extends Component {

  state = {};

  componentWillMount() {
    this.context.editor.onGraphUpdate(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {}

  render() {
    // console.log('outline', this.context.editor);
    var tasks = this.context.editor.tasks;
    if (tasks) {
      tasks = tasks.map((task, i) => {
        let definition = task.taskDefinition ||
          this.context.editor.getTaskDefinitionByName(task.taskName) ||
          {};
        // console.log(task, definition);
        return (
          <div key={i} onClick={this.selectNode.bind(this, task)}>
            {task.label}
            <div style={{padding: 20}}>
              <br/>implementsTask:<br/>
              {JSON.stringify(definition.implementsTask) || 'undefined'}
              <br/>options:<br/>
              {JSON.stringify(definition.options) || 'undefined'}
              <br/>properties:<br/>
              {JSON.stringify(definition.properties) || 'undefined'}
              <br/>waitOn:<br/>
              {JSON.stringify(task.waitOn) || 'undefined'}
              <br/><br/>
            </div>
          </div>
        );
      });
    }
    return (
      <div>
        <div>
          {this.context.editor.workflowGraph.name || '(Unknown)'}
        </div>
        <div>
          <h3>Tasks</h3>
          {tasks || '(No tasks)'}
        </div>
      </div>
    );
  }

  selectNode(task, e) {
    e.stopPropagation();
    e.preventDefault();
    this.context.layout.refs.graphCanvas.selectNode(task._node, e.shiftKey);
  }

}
