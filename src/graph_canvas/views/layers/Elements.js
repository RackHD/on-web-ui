// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

import radium from 'radium';

@radium
export default class GCElementsLayer extends Component {

  static propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    style: PropTypes.object,
    width: PropTypes.any
  };

  static defaultProps = {
    className: 'GraphCanvasElementsLayer',
    css: {},
    style: {},
    width: 'auto'
  };

  static contextTypes = {
    graphCanvas: PropTypes.any
  };

  get graphCanvas() {
    return this.context.graphCanvas;
  }

  componentWillReceiveProps(nextProps) {
    // console.log('NEW PROPS FOR ELEMENTS');
    this.setState({
      width: nextProps.width
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    let state = this.state,
        props = this.props;
    // console.log('UPDATE ELEMENTS?');
    if (!state.width || !nextState.width) {
      return true;
    }
    return (
      props.children !== nextProps.children ||
      state.width !== nextState.width
    );
  }

  state = {
    width: this.props.width
  };

  render() {
    let props = this.props,
        width = this.state.width || this.graphCanvas.worldSize.x;

    return (
      <div
          className={props.className}
          style={{
            width,
            height: 0,
            overflow: 'visible',
            position: 'absolute',
            left: 0,
            top: 0
          }}>
        {props.children}
      </div>
    );
  }

}
