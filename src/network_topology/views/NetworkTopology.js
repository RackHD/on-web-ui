// Copyright 2015, EMC, Inc.

import { EventEmitter } from 'events';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import NetworkTopologyGraph from './NetworkTopologyGraph';

@radium
export default class NetworkTopology extends Component {

  static defaultProps = {
    css: {},
    params: null,
    style: {}
  };

  static contextTypes = {
    parentSplit: PropTypes.any
  };

  static childContextTypes = {
    networkTopology: PropTypes.any
  };

  getChildContext() {
    return {
      networkTopology: this
    };
  }

  state = {};

  css = {
    root: {
      position: 'relative',
      overflow: 'hidden',
      transition: 'width 1s'
    }
  };

  render() {
    let { props, state } = this;

    let parentSplitView = this.context.parentSplit,
        height = parentSplitView.height * parentSplitView.splitB,
        width = parentSplitView.width;

    let css = {
      root: [
        this.css.root,
        props.css.root,
        { width, height },
        this.props.style
      ]
    };

    let overlay = [];

    return (
      <div ref="root" style={css.root}>
        <NetworkTopologyGraph ref="graph" width={width} height={height} />
      </div>
    );
  }

}
