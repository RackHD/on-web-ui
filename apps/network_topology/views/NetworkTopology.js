// Copyright 2015, EMC, Inc.

'use strict';

import { EventEmitter } from 'events';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import NetworkTopologyGraph from './NetworkTopologyGraph';

const TOOLBAR_HEIGHT = 70;

@radium
export default class NetworkTopology extends Component {

  static propTypes = {
    css: PropTypes.object,
    params: PropTypes.object,
    style: PropTypes.object
  };

  static defaultProps = {
    css: {},
    params: null,
    style: {},
  };

  static contextTypes = {
    appContainer: PropTypes.any
  };

  static childContextTypes = {
    networkTopology: PropTypes.any
  };

  getChildContext() {
    return {
      networkTopology: this
    };
  }

  state = {
    height: window.innerHeight - TOOLBAR_HEIGHT,
    width: window.innerWidth
  };

  componentWillMount() {
    this.context.appContainer.fullscreenMode(true);

    this.updateSize = () => {
      let splitView = this.refs.splitView;
      this.setState({
        height: window.innerHeight - TOOLBAR_HEIGHT,
        width: window.innerWidth
      });
    };
  }

  componentDidMount() {
    let resizeTimer = null;
    this.handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(this.updateSize, 300);
    };
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);
  }

  componentWillUnmount() {
    this.context.appContainer.fullscreenMode(false);

    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleResize);
    this.handleResize = null;
  }

  css = {
    root: {
      position: 'relative',
      overflow: 'hidden'
    }
  };

  render() {
    let { props, state } = this;

    let css = {
      root: [
        this.css.root,
        props.css.root,
        { width: state.width, height: state.height },
        this.props.style
      ]
    };

    let overlay = [];

    return (
      <div ref="root" style={css.root}>
        <NetworkTopologyGraph ref="graph" width={state.width} height={state.height} />
      </div>
    );
  }

}
