'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';

import Library from './Library';
import LibraryItem from './LibraryItem';
import WorkflowStore from '../stores/WorkflowStore';

/**
# WEWorkflowsLibrary

@object
  @type class
  @extends React.Component
  @name WEWorkflowsLibrary
  @desc
*/

@radium
@mixin.decorate(DeveloperHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    editor: PropTypes.any,
    style: PropTypes.any
  },

  defaultProps: {
    className: '',
    editor: null,
    style: {}
  }
})
export default class WEWorkflowsLibrary extends Component {

  workflowStore = new WorkflowStore();
  state = {workflows: []};

  componentDidMount() {
    this.unwatchWorkflows = this.workflowStore.watchAll('workflows', this);
    this.workflowStore.list();
  }

  componentWillUnmount() {
    this.unwatchWorkflows();
  }

  render() {
    var libraryWorkflows = this.state.workflows.map(task => {
      return (
        <LibraryItem key={task.friendlyName}>{task.friendlyName}</LibraryItem>
      );
    });

    return (
      <Library className={this.props.className} style={this.props.style}>
        {libraryWorkflows}
      </Library>
    );
  }

  loadWorkflow(event, index, menuItem) {
    var workflow = menuItem.workflow;
    if (!workflow) { return; }
    // if (workflow.id) {
    //   this.routeTo('builder', workflow.id);
    // }
    // else {
    //   this.routeTo('builder', 'new');
    // }
    if (workflow.id) {
      this.props.editor.loadWorkflow(workflow);
    }
    else {
      this.props.editor.resetWorkflow();
    }
  }

}
