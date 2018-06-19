// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import { RefreshIndicator } from 'material-ui';

@radium
export default class WorkflowOverlay extends Component {

  static defaultProps = {
    className: '',
    css: {},
    style: {}
  };

  static contextTypes = {
    app: PropTypes.any,
    muiTheme: PropTypes.any,
    workflowEditor: PropTypes.any,
    workflowOperator: PropTypes.any
  };

  static childContextTypes = {
    workflowOverlay: PropTypes.any
  };

  get workflowOperator() {
    return this.context.workflowOperator;
  }

  getTaskDefinition(name) {
    return this.workflowOperator.getTaskDefinition(name);
  }

  getWorkflowTemplate(name) {
    return this.workflowOperator.getWorkflowTemplate(name);
  }

  getTaskDefinitionFromTask(task) {
    return this.getWorkflowTemplate.getTaskDefinitionFromTask(task);
  }

  state = {
    loading: true
  };

  get activeWorkflow() {
    return this.workflowOperator.activeWorkflow;
  }

  getChildContext() {
    return { workflowOverlay: this };
  }

  css = {
    root: {
      position: 'relative'
    }
  };

  render() {
    let { props, state } = this;

    let css = {
      root: [this.css.root, props.css.root, this.props.style]
    };

    return (
      <div ref="root"
          className={'WorkflowOverlay ' + props.className}
          style={css.root}>
        {props.children}

        <ul style={{width: 100, position: 'absolute', top: 0, left: -10, textAlign: 'left', fontWeight: 'bold', opacity: 0.8, zIndex: -1}}>
          <li style={{color: 'red'}}>Failed</li>
          <li style={{color: 'green'}}>Succeeded</li>
          <li style={{color: '#6cf'}}>Finished</li>
        </ul>

        {state.loading && <RefreshIndicator
            size={50}
            left={0}
            top={250}
            status="loading"
            style={{
              display: 'inline-block',
              position: 'relative'
            }} /> }
      </div>
    );
  }

}
