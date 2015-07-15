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
  },

  contextTypes: {
    layout: PropTypes.any,
    editor: PropTypes.any
  }
})
export default class WEWorkflowsLibrary extends Component {

  state = {workflowTemplates: []};

  componentWillMount() {
    this.workflowTemplateStore = this.context.editor.workflowTemplateStore;
  }

  componentDidMount() {
    this.unwatchWorkflows = this.workflowTemplateStore.watchAll('workflowTemplates', this);
    this.workflowTemplateStore.list();
  }

  componentWillUnmount() {
    this.unwatchWorkflows();
  }

  render() {
    var libraryWorkflows = this.state.workflowTemplates.map(workflowTemplate => {
      let onLoad = this.loadWorkflow.bind(this, workflowTemplate, true);
      let onSelect = this.loadWorkflow.bind(this, workflowTemplate, false);
      return (
        <LibraryItem key={workflowTemplate.friendlyName}
            onSelect={onSelect}
            object={workflowTemplate}
            name={workflowTemplate.friendlyName}>
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

  loadWorkflow(workflowTemplate, newGraph, event) {
    if (!workflowTemplate) { return null; }
    event.stopPropagation();
    event.preventDefault();
    if (workflowTemplate.id) {
      if (newGraph) {
        try {
          this.context.editor.loadWorkflow(workflowTemplate, newGraph);
        } catch (err) { console.error(err); }
        return this.routeTo(encodeURIComponent(workflowTemplate.id));
      }
      else {
        return this.context.editor.loadWorkflow(workflowTemplate, newGraph);
      }
    }
    return this.context.editor.resetWorkflow();
  }

}
