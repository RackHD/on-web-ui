// Copyright 2015, EMC, Inc.

import { EventEmitter } from 'events';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import GraphCanvas from 'src-graph-canvas/views/GraphCanvas';

import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

import {
    GCGroup,
    GCLink,
    GCNode,
    GCPort,
    GCSocket
  } from 'src-graph-canvas/views/GraphCanvas';

import NodeStore from 'src-common/stores/NodeStore';

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
    networkTopology: PropTypes.any
  };

  static childContextTypes = {
    networkTopologyGraph: PropTypes.any
  };

  getChildContext() {
    return {
      networkTopologyGraph: this
    };
  }

  nodes = new NodeStore();

  componentWillMount() {
    this.nodes.startMessenger();
  }

  componentDidMount() {
    this.unwatchNodes = this.nodes.watchAll('nodes', this);
    this.nodes.list();
  }

  componentWillUnmount() {
    this.nodes.stopMessenger();
    this.unwatchNodes();
  }

  componentWillReceiveProps(nextProps) {
    let nextState = {};
    if (nextProps.worldHeight) { nextState.worldHeight = nextProps.worldHeight; }
    if (nextProps.worldWidth) { nextState.worldWidth = nextProps.worldWidth; }
    if (nextProps.height) { nextState.canvasHeight = nextProps.height; }
    if (nextProps.width) { nextState.canvasWidth = nextProps.width; }
    this.setState(nextState);
  }

  state = {
    canvasHeight: this.props.height,
    canvasWidth: this.props.width,
    loading: true,
    nodes: null,
    version: 0,
    worldHeight: this.props.worldHeight,
    worldWidth: this.props.worldWidth
  };

  css = {
    root: {
      transition: 'width 1s'
    }
  };

  render() {
    let css = {
      root: [this.css.root, this.props.css.root, this.props.style]
    };

    let nodes;

    if (this.state.nodes) {
      nodes = this.state.nodes.map((node, i) => {
        return (
          <GCNode key={node.id} initialId={node.id} initialName={node.name} initialColor="#999"
              initialBounds={[
                1350 + (i * 220),
                1450,
                1550 + (i * 220),
                1550
              ]}
              isRemovable={false} >
            {/*<GCPort key="a-io" initialId="a-io" initialName="IO" initialColor="#6cf">
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
            </GCPort>*/}
          </GCNode>
        );
      });
    }

    let links = [];

    return (
      <div className="NetworkTopology" ref="root" style={css.root}>
        <GraphCanvas
            //key={'graphCanvas' + this.state.version}
            //key={Math.random()}
            ref="graphCanvas"
            grid={{}}
            scale={this.lastGraphCanvas ? this.lastGraphCanvas.state.scale : 1}
            x={this.lastGraphCanvas ? this.lastGraphCanvas.state.position.x : 0}
            y={this.lastGraphCanvas ? this.lastGraphCanvas.state.position.y : 0}
            viewHeight={this.state.canvasHeight}
            viewWidth={this.state.canvasWidth}
            worldHeight={this.state.worldHeight}
            worldWidth={this.state.worldWidth}
            onChange={(graphCanvas) => this.lastGraphCanvas = graphCanvas}>
          {nodes}
          {links}
        </GraphCanvas>
      </div>
    );
  }

  listNodes() {
    this.setState({loading: true});
    this.nodes.list().then(() => {
      this.setState({loading: false});
    });
  }

}
