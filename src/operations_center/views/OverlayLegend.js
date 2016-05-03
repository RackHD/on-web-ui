// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import {
    CircularProgress
  } from 'material-ui';

@radium
export default class OverlayLegend extends Component {

  static defaultProps = {
    className: '',
    css: {},
    loading: false
  }

  state = {
    loading: this.props.loader
  };

  css = {
    root: {
      position: 'relative'
    }
  };

  render() {
    let { props, state } = this;

    let css = {
      root: [this.css.root, props.css.root, props.style]
    };

    return (
      <div ref="root"
          className={'OverlayLegend ' + props.className}
          style={css.root}>
        {props.children}

        <ul style={{width: 100, position: 'absolute', top: 0, left: -10, textAlign: 'left', fontWeight: 'bold', opacity: 0.8, zIndex: -1}}>
          <li style={{color: 'red'}}>Error</li>
          <li style={{color: 'yellow'}}>Failed</li>
          <li style={{color: 'green'}}>Succeeded</li>
          <li style={{color: '#6cf'}}>Finished</li>
          <li style={{color: '#999'}}>Pending</li>
        </ul>

        {state.loading && <CircularProgress
            mode="indeterminate"
            size={2}
            style={{marginTop: 200}} />}
      </div>
    );
  }

}
