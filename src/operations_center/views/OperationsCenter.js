// Copyright 2015, EMC, Inc.

import { EventEmitter } from 'events';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import SplitView from 'src-common/views/SplitView';

import TaskDefinitionStore from 'src-common/stores/TaskDefinitionStore';
import WorkflowTemplateStore from 'src-common/stores/WorkflowTemplateStore';
import WorkflowStore from 'src-common/stores/WorkflowStore';

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

  workflowStore = new WorkflowStore();
  workflowTemplateStore = new WorkflowTemplateStore();

  componentWillMount() {
    this.workflowStore.startMessenger();
    this.workflowTemplateStore.startMessenger();
  }

  componentDidMount() {
    this.unwatchWorkflows = this.workflowStore.watchAll('workflows', this);
    this.unwatchWorkflowTemplates = this.workflowTemplateStore.watchAll('workflowTemplates', this);
    this.listWorkflowTemplates().then(() => {
      this.listWorkflows().then(() => {
        this.load(this.props.params.workflow);
      });
    });
  }

  componentWillUnmount() {
    if (this.cleanupWorkflowMonitor) {
      this.cleanupWorkflowMonitor();
    }
    this.workflowStore.stopMessenger();
    this.workflowTemplateStore.stopMessenger();
    this.unwatchWorkflows();
    this.unwatchWorkflowTemplates();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
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
    workflow: null,
    workflows: [],
    workflowTemplates: []
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

    return (
      <div ref="root" className="OperationsCenter" style={css.root}>
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
                loading={this.state.loading}
                workflows={this.state.workflows.map(workflow => {
                  workflow.nodeId = this.workflowStore.getNodeId(workflow);
                  return workflow;
                })}
                width={width}
                height={height} />} />
      </div>
    );
  }

  load(workflowId) {
    if (!workflowId) return;
    this.setState({loading: true});
    const getWorkflow = () => {
      let workflow = this.workflowStore.get(workflowId);
      let workflowTemplate = this.workflowTemplateStore.get(workflow.injectableName);
      workflow.definition = workflowTemplate;
      return workflow ? Object.assign({}, workflow) : null;
    };
    if (this.cleanupWorkflowMonitor) {
      this.cleanupWorkflowMonitor();
    }
    this.cleanupWorkflowMonitor = this.workflowStore.watchOne(workflowId, 'workflow', this);
    // TODO: watch workflow template deinition for updates
    // this.cleanupWorkflowTemplateMonitor = this.workflowTemplateStore.watchOne()
    return this.workflowStore.read(workflowId).then(() => {
      this.setState({
        loading: false,
        workflow: getWorkflow()
      });
    });
  }

  listWorkflows() {
    this.setState({loading: true});
    return this.workflowStore.list().then(() => this.setState({loading: false}));
  }

  listWorkflowTemplates() {
    this.setState({loading: true});
    return this.workflowTemplateStore.list().then(() => this.setState({loading: false}));
  }

}
