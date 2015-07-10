'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import Library from './Library';
import LibraryItem from './LibraryItem';

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
@mixin.decorate(RouteHelpers)
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

  state = {workflows: []};

  componentWillMount() {
    this.workflowStore = this.props.editor.workflowStore;
  }

  componentDidMount() {
    this.unwatchWorkflows = this.workflowStore.watchAll('workflows', this);
    this.workflowStore.list();
  }

  componentWillUnmount() {
    this.unwatchWorkflows();
  }

  render() {
    var libraryWorkflows = this.state.workflows.map(workflow => {
      let onLoad = this.loadWorkflow.bind(this, workflow, true);
      let onSelect = this.loadWorkflow.bind(this, workflow, false);
      return (
        <LibraryItem key={workflow.friendlyName} onSelect={onSelect} object={workflow} name={workflow.friendlyName}>
          <a
              title="Load this workflow."
              style={{display: 'inline-block', margin: '0 5px'}}
              onClick={onLoad}
              className="fa fa-external-link-square fa-flip-horizontal" />
        </LibraryItem>
      );
    });

    return (
      <Library className={this.props.className} style={this.props.style}>
        {libraryWorkflows}
      </Library>
    );
  }

  loadWorkflow(workflow, newGraph, event) {
    if (!workflow) { return null; }
    event.stopPropagation();
    event.preventDefault();
    if (workflow.id) {
      if (newGraph) {
        return this.props.editor.loadWorkflow(workflow, newGraph);
      }
      else {
        return this.routeTo(encodeURIComponent(workflow.id));
      }
    }
    return this.props.editor.resetWorkflow();
  }

}
