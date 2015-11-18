// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import radium from 'radium';

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
export default class WETasksLibrary extends Component {

  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.any
  };

  static defaultProps = {
    className: '',
    style: {}
  };

  static contextTypes = {
    layout: PropTypes.any,
    editor: PropTypes.any
  };

  state = {taskDefinitions: []};

  componentWillMount() {
    this.taskDefinitionStore = this.context.editor.taskDefinitionStore;
  }

  componentDidMount() {
    this.unwatchTasks = this.taskDefinitionStore.watchAll('taskDefinitions', this, err => {
      console.error(err);
    });
    setTimeout(() => {
      this.taskDefinitionStore.list();
    }, 0)
  }

  componentWillUnmount() {
    this.unwatchTasks();
  }

  render() {
    var libraryTasks = this.state.taskDefinitions.map(taskDefinition => {
      let onSelect = this.loadTask.bind(this, taskDefinition);
      return (
        <LibraryItem key={taskDefinition.id}
            onSelect={onSelect}
            object={taskDefinition}
            name={taskDefinition.friendlyName}></LibraryItem>
      );
    });

    return (
      <Library className={this.props.className} style={this.props.style}>
        {libraryTasks}
      </Library>
    );
  }

  loadTask(taskDefinition, event) {
    if (!taskDefinition) { return; }
    event.stopPropagation();
    event.preventDefault();
    var promptProps = {
      callback: (label) => {
        if (label) {
          // let taskNode = taskDefinition.toTaskNode(this, taskDefinition, { label });
          // taskNode.addGraphCanvasNode([1000, 1000, 1100, 1100]);
          // this.context.layout.refs.graphCanvas.refs.world.updateGraph();
          this.context.editor.addTask(taskDefinition, label);
        }
      },
      children: 'Please label your task.',
      title: 'Define Task Label:'
    };
    PromptDialog.create(promptProps,
      findDOMNode(this.context.layout.refs.overlay));
  }

}
