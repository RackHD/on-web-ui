// Copyright 2015, EMC, Inc.

'use strict';

import { Component } from 'mach-react';

export default class GSElementsLayer extends Component {

  static defaultProps = {
    className: 'GSElementsLayer',
    css: {},
    style: {},
    width: 'auto'
  }

  get canvas() { return this.context.canvas; }

  state = {
    width: this.props.width
  }

  componentWillReceiveProps(nextProps) {
    this.setState({width: nextProps.width});
  }

  shouldComponentUpdate(nextProps, nextState) {
    let state = this.state,
        props = this.props;
    if (!state.width || !nextState.width) return true;
    return (
      props.children !== nextProps.children ||
      state.width !== nextState.width
    );
  }

  render(React) {
    try {
      let props = this.props,
          width = this.state.width || this.canvas.worldSize.x;

      return (
        <div
            className={props.className}
            style={{
              width: width,
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

    catch (err) {
      console.error(err.stack || err);
    }
  }

}
