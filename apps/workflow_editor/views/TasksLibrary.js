'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';

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
      return (
        <LibraryItem key={task.friendlyName}>{task.friendlyName}</LibraryItem>
      );
    });

    return (
      <Library className={this.props.className} style={this.props.style}>
        {libraryTasks}
      </Library>
    );
  }

}
