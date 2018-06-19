// Copyright 2015, EMC, Inc.

import { EventEmitter } from 'events';

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import radium from 'radium';

import ContextMenu from 'src-common/views/ContextMenu';
import GraphCanvas from 'src-graph-canvas/views/GraphCanvas';

@radium
export default class WorkflowGraph extends Component {

  static propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    height: PropTypes.number,
    styles: PropTypes.object,
    width: PropTypes.number,
    worldHeight: PropTypes.number,
    worldWidth: PropTypes.number
  };

  static defaultProps = {
    className: '',
    css: {},
    height: 300,
    styles: {},
    width: 300,
    worldHeight: 3000,
    worldWidth: 3000
  };

  static contextTypes = {
    workflowEditor: PropTypes.any,
    workflowOperator: PropTypes.any
  };

  static childContextTypes = {
    workflowGraph: PropTypes.any
  };

  getChildContext() {
    return {
      workflowGraph: this
    };
  }

  state = {
    activeWorkflow: this.activeWorkflow,
    canvasHeight: this.props.height,
    canvasWidth: this.props.width,
    version: 0,
    worldHeight: this.props.worldHeight,
    worldWidth: this.props.worldWidth
  };

  css = {
    root: {}
  };

  componentWillReceiveProps(nextProps) {
    let nextState = {};
    if (nextProps.worldHeight) { nextState.worldHeight = nextProps.worldHeight; }
    if (nextProps.worldWidth) { nextState.worldWidth = nextProps.worldWidth; }
    if (nextProps.height) { nextState.canvasHeight = nextProps.height; }
    if (nextProps.width) { nextState.canvasWidth = nextProps.width; }
    this.setState(nextState);
  }

  componentDidMount() {
    this.handleWorkflowChange = () => {
      this.setState({
        activeWorkflow: this.activeWorkflow,
        version: this.state.version + 1
      });
    };
    this.context.workflowOperator.onChangeWorkflow(this.handleWorkflowChange);
  }

  componenWillUnmount() {
    this.context.workflowOperator.offChangeWorkflow(this.handleWorkflowChange);
  }

  get activeWorkflow() {
    return this.context.workflowOperator.activeWorkflow;
  }

  render() {
    let css = {
      root: [this.css.root, this.props.css.root, this.props.style]
    };

    return (
      <div ref="root"
          className={'WorkflowGraph ' + this.props.className}
          onContextMenu={openEvent => {
            // openEvent.preventDefault();
            // openEvent.stopPropagation();
            // this.setState({ openEvent });
          }}
          style={css.root}>

        <GraphCanvas
            key={'graphCanvas' + this.state.version}
            ref="graphCanvas"
            grid={{}}
            scale={this.lastGraphCanvas ? this.lastGraphCanvas.state.scale : 1}
            x={this.lastGraphCanvas ? this.lastGraphCanvas.state.position.x : 0}
            y={this.lastGraphCanvas ? this.lastGraphCanvas.state.position.y : 0}
            viewHeight={this.state.canvasHeight}
            viewWidth={this.state.canvasWidth}
            worldHeight={this.state.worldHeight}
            worldWidth={this.state.worldWidth}
            onChange={(graphCanvas) => this.lastGraphCanvas = graphCanvas}
            onSelect={this.onSelect.bind(this)}
            onLink={this.addLink.bind(this)}
            onUnlink={this.removeLink.bind(this)}>
          {this.state.activeWorkflow.renderGraph(this.context)}
        </GraphCanvas>

        {/*<ContextMenu
            onClose={() => this.setState({openEvent: null})}
            openEvent={this.state.openEvent}
            menuList={[
              {primaryText: 'Menu Item 1'},
              'divider',
              {primaryText: 'Menu Item 2'}
            ]} />*/}
      </div>
    );
  }

  onSelect(selection) {
    // console.log(selection);
  }

  getSocketDetailsById(socketId) {
    let graph = this.activeWorkflow.meta,
        task = null,
        socket = null;

    Object.keys(graph.nodes).some(nodeLabel => {
      let node = graph.nodes[nodeLabel];
      if (!node.orderSocketIds) { return; }
      return Object.keys(node.orderSocketIds).some(k => {
        if (node.orderSocketIds[k] === socketId) {
          socket = k;
          task = node;
          return true;
        }
      });
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return {
      node: task,
      task: task.template,
      portId: task.orderPortId,
      portType: 'taskOrder',
      socketLabel: socket
    };
  }

  addLink(link) {
    let fromSocketDetails = this.getSocketDetailsById(link.fromSocket.id),
        toSocketDetails = this.getSocketDetailsById(link.toSocket.id);

    // debugger;

    if (fromSocketDetails.portType === 'taskOrder') {
      if (toSocketDetails.portType === 'taskOrder') {

        if (fromSocketDetails.task !== toSocketDetails.task) {

          if (link.fromSocket.props.dir[0] === -1 && link.toSocket.props.dir[0] === 1) {
            fromSocketDetails.task.waitOn = fromSocketDetails.task.waitOn || {};
            fromSocketDetails.task.waitOn[toSocketDetails.task.label] = toSocketDetails.socketLabel;
          }

          else if (link.toSocket.props.dir[0] === -1 && link.fromSocket.props.dir[0] === 1) {
            toSocketDetails.task.waitOn = toSocketDetails.task.waitOn || {};
            toSocketDetails.task.waitOn[fromSocketDetails.task.label] = fromSocketDetails.socketLabel;
          }

          this.activeWorkflow.graphUpdate(this.context);
          // this.activeWorkflow.addWaitOnLink(this.context,
          //   fromSocketDetails.node,
          //   toSocketDetails.node);
        }
      }
    }
  }

  removeLink(link) {
    let fromSocketDetails = this.getSocketDetailsById(link.fromSocket.id),
        toSocketDetails = this.getSocketDetailsById(link.toSocket.id);

    // debugger;

    if (fromSocketDetails.portType === 'taskOrder') {
      if (toSocketDetails.portType === 'taskOrder') {

        if (fromSocketDetails.task !== toSocketDetails.task) {

          if (link.fromSocket.props.dir[0] === -1 && link.toSocket.props.dir[0] === 1) {
            fromSocketDetails.task.waitOn = fromSocketDetails.task.waitOn || {};
            delete fromSocketDetails.task.waitOn[toSocketDetails.task.label];
          }

          else if (link.toSocket.props.dir[0] === -1 && link.fromSocket.props.dir[0] === 1) {
            toSocketDetails.task.waitOn = toSocketDetails.task.waitOn || {};
            delete toSocketDetails.task.waitOn[fromSocketDetails.task.label];
          }

          this.activeWorkflow.graphUpdate(this.context);
          // this.activeWorkflow.removeWaitOnLink(this.context,
          //   fromSocketDetails.node,
          //   toSocketDetails.node);
        }
      }
    }
  }

}
