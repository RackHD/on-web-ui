// Copyright 2015, EMC, Inc.

import { EventEmitter } from 'events';

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import radium from 'radium';
import { Link } from 'react-router';

import SplitView from 'src-common/views/SplitView';

import WorkflowGraph from './WorkflowGraph';
import WorkflowJSON from './WorkflowJSON';
import WorkflowOperator from './WorkflowOperator';

@radium
export default class WorkflowEditor extends Component {

  static propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    params: PropTypes.object,
    style: PropTypes.object
  };

  static defaultProps = {
    className: '',
    css: {},
    params: null,
    style: {}
  };

  static contextTypes = {
    // app: PropTypes.any,
    parentSplit: PropTypes.any
  };

  static childContextTypes = {
    workflowEditor: PropTypes.any
  };

  getChildContext() {
    return {
      workflowEditor: this
    };
  }

  get activeWorkflowName() {
    return this.props && this.props.params && this.props.params.workflow;
  }

  state = {
    split: 0.6
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

    let contentSplit = this.context.parentSplit,//.app.refs.contentSplit,
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

    let toolbarHeight = 56,
        overlay = [];

    return (
      <div ref="root" className="WorkflowEditor" style={css.root}>

        <WorkflowOperator key="op"
            ref="operator"
            overlay={overlay}
            toolbarHeight={toolbarHeight}
            workflowName={props.params && props.params.workflow}>

          <SplitView key="sv"
              ref="splitView"
              split={this.state.split}
              collapse={1}
              width={contentWidth}
              height={contentHeight - toolbarHeight}
              css={{
                root: {transition: 'width 1s'},
                a: {transition: 'width 1s'},
                b: {transition: 'width 1s, left 1s'},
                resize: {transition: 'width 1s, left 1s'}
              }}
              onUpdate={(splitView) => this.setState({split: splitView.state.split})}
              a={({ width, height }) => <WorkflowGraph key="graph"
                  ref="graph"
                  width={width}
                  height={height} />}
              b={({ width, height }) => <WorkflowJSON key="json"
                  ref="json"
                  width={width}
                  height={height} />} />
        </WorkflowOperator>
      </div>
    );
  }

  get graph() {
    return this.refs.splitView.refs.graph;
  }

  get json() {
    return this.refs.splitView.refs.json;
  }

}
