'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';

import PromptDialog from 'common-web-ui/views/dialogs/Prompt';

import Library from './Library';
import LibraryItem from './LibraryItem';

/**
# WETasksLibrary

@object
  @type class
  @extends React.Component
  @name WETasksLibrary
  @desc
*/

@radium
@mixin.decorate(DeveloperHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    style: PropTypes.any
  },

  defaultProps: {
    className: '',
    style: {}
  }
})
export default class WETasksLibrary extends Component {

  state = {tasks: []};

  componentWillMount() {
    this.taskStore = this.props.editor.taskStore;
  }

  componentDidMount() {
    this.unwatchTasks = this.taskStore.watchAll('tasks', this);
    this.taskStore.list();
  }

  componentWillUnmount() {
    this.unwatchTasks();
  }

  render() {
    var libraryTasks = this.state.tasks.map(task => {
      let onSelect = this.loadTask.bind(this, task);
      return (
        <LibraryItem key={task.friendlyName} onSelect={onSelect} object={task} name={task.friendlyName}></LibraryItem>
      );
    });

    return (
      <Library className={this.props.className} style={this.props.style}>
        {libraryTasks}
      </Library>
    );
  }

  loadTask(task, event) {
    if (!task) { return; }
    event.stopPropagation();
    event.preventDefault();
    var promptProps = {
      callback: (label) => {
        if (label) {
          task.insertGraphNode(this.props.editor, label, [1000, 1000, 1100, 1100]);
          this.props.editor.layout.refs.graphCanvas.refs.world.updateGraph();
        }
      },
      children: 'Please label your task.',
      title: 'Define Task Label:'
    };
    PromptDialog.create(promptProps,
      React.findDOMNode(this.props.editor.layout.refs.overlay));
  }

}
