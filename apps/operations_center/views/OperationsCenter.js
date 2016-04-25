// Copyright 2015, EMC, Inc.

'use strict';

import { EventEmitter } from 'events';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import SplitView from 'rui-common/views/SplitView';

import TaskDefinitionStore from 'rui-common/stores/TaskDefinitionStore';
import WorkflowTemplateStore from 'rui-common/stores/WorkflowTemplateStore';
import WorkflowStore from 'rui-common/stores/WorkflowStore';

import ActiveList from './ActiveList';
import OperationsCenterGraph from './OperationsCenterGraph';

@radium
export default class OperationsCenter extends Component {

  static defaultProps = {
    css: {},
    params: null,
    style: {}
  };

  static contextTypes = {
    parentSplit: PropTypes.any
  };

  static childContextTypes = {
    operationsCenter: PropTypes.any
  };

  getChildContext() {
    return {
      operationsCenter: this
    };
  }

  taskDefinitionStore = new TaskDefinitionStore();

  workflowTemplateStore = new WorkflowTemplateStore();

  workflowStore = new WorkflowStore();

  getTaskDefinition(name) {
    return this.taskDefinitionStore.collection[name];
  }

  getWorkflowTemplate(name) {
    return this.workflowTemplateStore.collection[name];
  }

  getTaskDefinitionFromTask(task) {
    return task.taskDefinition || this.getTaskDefinition(task.taskName) || {};
  }

  componentDidMount() {
    this.load(this.props.params.workflow);
    this.reloadInterval = setInterval(() => {
      this.load(this.props.params.workflow)
    }, 6000);
  }

  componentWillUnmount() {
    clearInterval(this.reloadInterval);
  }

  componentWillReceiveProps(nextProps) {
    let props = this.props,
        shouldReloadWorkflow = nextProps.params &&
          nextProps.params.workflow &&
          nextProps.params.workflow !== props.params.workflow;

    if (shouldReloadWorkflow) {
      this.load(nextProps.params.workflow);
    }
  }

  state = {
    loading: false,
    split: 0.7,
    workflow: null
  };

  css = {
    root: {
      position: 'relative',
      overflow: 'hidden',
      transition: 'width 1s'
    }
  };

  render() {
    let { props, state } = this;

    let contentSplit = this.context.parentSplit,
        contentWidth = contentSplit.width,
        contentHeight = contentSplit.height * contentSplit.splitB;

    let css = {
      root: [
        this.css.root,
        props.css.root,
        { width: contentWidth, height: contentHeight },
        this.props.style
      ]
    };

    let overlay = [];

    return (
      <div ref="root" style={css.root}>
        <SplitView key="sv"
            ref="splitView"
            split={this.state.split}
            collapse={1}
            width={contentWidth}
            height={contentHeight}
            css={{
              root: {transition: 'width 1s'},
              a: {transition: 'width 1s'},
              b: {transition: 'width 1s, left 1s'},
              resize: {transition: 'width 1s, left 1s'}
            }}
            onUpdate={(splitView) => this.setState({split: splitView.state.split})}
            a={({ width, height }) => <OperationsCenterGraph key="graph"
                ref="graph"
                workflow={this.state.workflow}
                width={width}
                height={height} />}
            b={({ width, height }) => <ActiveList key="activeList"
                ref="activeList"
                width={width}
                height={height} />} />
      </div>
    );
  }

  load(workflowId) {
    this.setState({loading: true});

    let promises = [
      this.taskDefinitionStore.list(),
      this.workflowTemplateStore.list()
    ];

    if (workflowId) {
      promises.push(this.workflowStore.read(workflowId))
    }

    Promise.all(promises).then(() => {
      this.setState({
        loading: false,
        workflow: this.workflowStore.get(workflowId) || null
      })
    });
  }

}
