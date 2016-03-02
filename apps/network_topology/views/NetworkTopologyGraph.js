// Copyright 2015, EMC, Inc.

'use strict';

import { EventEmitter } from 'events';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import GraphCanvas from 'rui-graph-canvas/views/GraphCanvas';

import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

import {
    GCGroup,
    GCLink,
    GCNode,
    GCPort,
    GCSocket
  } from 'rui-graph-canvas/views/GraphCanvas';

@radium
export default class NetworkTopologyGraph extends Component {

  static propTypes = {
    css: PropTypes.object,
    height: PropTypes.number,
    styles: PropTypes.object,
    width: PropTypes.number,
    worldHeight: PropTypes.number,
    worldWidth: PropTypes.number
  };

  static defaultProps = {
    css: {},
    height: 300,
    styles: {},
    width: 300,
    worldHeight: 3000,
    worldWidth: 3000
  };

  static contextTypes = {
    networkTopology: PropTypes.any,
  };

  static childContextTypes = {
    networkTopologyGraph: PropTypes.any
  };

  getChildContext() {
    return {
      networkTopologyGraph: this
    };
  }

  state = {
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
    let nextState = {}
    if (nextProps.worldHeight) { nextState.worldHeight = nextProps.worldHeight; }
    if (nextProps.worldWidth) { nextState.worldWidth = nextProps.worldWidth; }
    if (nextProps.height) { nextState.canvasHeight = nextProps.height; }
    if (nextProps.width) { nextState.canvasWidth = nextProps.width; }
    this.setState(nextState);
  }

  componentDidMount() {
    this.handleWorkflowChange = () => {
      this.setState({
        version: this.state.version + 1
      });
    }
  }

  componenWillUnmount() {}

  render() {
    let css = {
      root: [this.css.root, this.props.css.root, this.props.style]
    };

    return (
      <div ref="root" style={css.root}>
        <GraphCanvas
            key={'graphCanvas' + this.state.version}
            ref="graphCanvas"
            grid={{}}
            initialScale={this.lastGraphCanvas ? this.lastGraphCanvas.state.scale : 1}
            initialX={this.lastGraphCanvas ? this.lastGraphCanvas.state.position.x : 0}
            initialY={this.lastGraphCanvas ? this.lastGraphCanvas.state.position.y : 0}
            viewHeight={this.state.canvasHeight}
            viewWidth={this.state.canvasWidth}
            worldHeight={this.state.worldHeight}
            worldWidth={this.state.worldWidth}
            onChange={(graphCanvas) => this.lastGraphCanvas = graphCanvas}>

          <GCNode key="a" initialId="a" initialName="A" initialColor="#999"
              initialBounds={[
                1350,
                1450,
                1450,
                1550
              ]}
              isRemovable={false} >
            <GCPort key="a-io" initialId="a-io" initialName="IO" initialColor="#6cf">
              <GCSocket key="a-in-0" dir={[-1, 0]}
                  initialId="a-in-0"
                  initialName="IN 0"
                  initialColor="#6cf" />
              <GCSocket key="a-in-1" dir={[-1, 0]}
                  initialId="a-in-1"
                  initialName="IN 1"
                  initialColor="#6cf" />
              <GCSocket key="a-out-0" dir={[1, 0]}
                  initialId="a-out-0"
                  initialName="OUT 0"
                  initialColor="#6cf" />
              <GCSocket key="a-out-1" dir={[1, 0]}
                  initialId="a-out-1"
                  initialName="OUT 1"
                  initialColor="#6cf" />
            </GCPort>
          </GCNode>

          <GCNode key="b" initialId="b" initialName="B" initialColor="#999"
              initialBounds={[
                1550,
                1450,
                1650,
                1550
              ]}
              isRemovable={false} >
            <GCPort key="b-io" initialId="b-io" initialName="IO" initialColor="#6cf">
              <GCSocket key="b-in-0" dir={[-1, 0]}
                  initialId="b-in-0"
                  initialName="IN 0"
                  initialColor="#6cf" />
              <GCSocket key="b-in-1" dir={[-1, 0]}
                  initialId="b-in-1"
                  initialName="IN 1"
                  initialColor="#6cf" />
              <GCSocket key="b-out-0" dir={[1, 0]}
                  initialId="b-out-0"
                  initialName="OUT 0"
                  initialColor="#6cf" />
              <GCSocket key="b-out-1" dir={[1, 0]}
                  initialId="b-out-1"
                  initialName="OUT 1"
                  initialColor="#6cf" />
            </GCPort>
          </GCNode>

          <GCLink key="l-0"
              from="a-out-0"
              to="b-in-1"
              initialId="l-0"
              initialColor="#6cf" />
          <GCLink key="l-1"
              from="a-out-1"
              to="b-in-0"
              initialId="l-1"
              initialColor="#6cf" />
        </GraphCanvas>
      </div>
    );
  }

}
