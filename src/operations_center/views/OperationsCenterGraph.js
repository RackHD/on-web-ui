// Copyright 2015, EMC, Inc.

import { EventEmitter } from 'events';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

import GraphCanvas from 'src-graph-canvas/views/GraphCanvas';

import OverlayLegend from './OverlayLegend';
import Operation from '../lib/Operation';

import {
    GCGroup,
    GCLink,
    GCNode,
    GCPort,
    GCSocket
  } from 'src-graph-canvas/views/GraphCanvas';

@radium
export default class OperationsCenterGraph extends Component {

  static propTypes = {
    css: PropTypes.object,
    height: PropTypes.number,
    styles: PropTypes.object,
    width: PropTypes.number,
    workflow: PropTypes.any,
    worldHeight: PropTypes.number,
    worldWidth: PropTypes.number
  };

  static defaultProps = {
    css: {},
    height: 300,
    styles: {},
    width: 300,
    workflow: null,
    worldHeight: 3000,
    worldWidth: 3000
  };

  static contextTypes = {
    operationsCenter: PropTypes.any
  };

  static childContextTypes = {
    operationsCenterGraph: PropTypes.any
  };

  getChildContext() {
    return {
      operationsCenterGraph: this
    };
  }

  componentWillReceiveProps(nextProps) {
    let nextState = {};
    if (nextProps.worldHeight) { nextState.worldHeight = nextProps.worldHeight; }
    if (nextProps.worldWidth) { nextState.worldWidth = nextProps.worldWidth; }
    if (nextProps.height) { nextState.canvasHeight = nextProps.height; }
    if (nextProps.width) { nextState.canvasWidth = nextProps.width; }
    if (nextProps.workflow) {
      nextState.workflow = nextProps.workflow;
      nextState.version = this.state.version + 1;
    }
    this.setState(nextState);
  }

  componentDidMount() {}

  componenWillUnmount() {}

  state = {
    canvasHeight: this.props.height,
    canvasWidth: this.props.width,
    version: 0,
    workflow: this.props.workflow,
    worldHeight: this.props.worldHeight,
    worldWidth: this.props.worldWidth
  };

  css = {
    root: {
      transition: 'width 1s'
    },

    overlay: {
      textAlign: 'center',
      position: 'absolute',
      height: 0,
      width: '100%',
      top: this.props.toolbarHeight || 0,
      zIndex: 9
    }
  };

  render() {
    let { props, state } = this;

    let css = {
      root: [this.css.root, props.css.root, props.style],
      overlay: [this.css.overlay, props.css.overlay]
    };

    let operation = new Operation(state.workflow, this.context.operationsCenter);

    return (
      <div className="OperationsCenterGraph" ref="root" style={css.root}>
        <GraphCanvas
            key={'graphCanvas' + state.version}
            ref="graphCanvas"
            grid={{}}
            scale={this.lastGraphCanvas ? this.lastGraphCanvas.state.scale : 1}
            x={this.lastGraphCanvas ? this.lastGraphCanvas.state.position.x : 0}
            y={this.lastGraphCanvas ? this.lastGraphCanvas.state.position.y : 0}
            viewHeight={state.canvasHeight}
            viewWidth={state.canvasWidth}
            worldHeight={state.worldHeight}
            worldWidth={state.worldWidth}
            onChange={(graphCanvas) => this.lastGraphCanvas = graphCanvas}>
          {operation && operation.renderGraph()}
        </GraphCanvas>

        <OverlayLegend ref="overlay" style={css.overlay}>{props.overlay}</OverlayLegend>
      </div>
    );
  }

}
