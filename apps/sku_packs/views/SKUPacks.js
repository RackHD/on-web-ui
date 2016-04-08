// Copyright 2015, EMC, Inc.

'use strict';

import { EventEmitter } from 'events';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

@radium
export default class OperationsCenter extends Component {

  static defaultProps = {
    css: {},
    params: null,
    style: {}
  };

  static contextTypes = {
    parentSplit: PropTypes.any
  };

  static childContextTypes = {
    skuPacks: PropTypes.any
  };

  getChildContext() {
    return {
      skuPacks: this
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  state = {
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

    let contentSplit = this.context.parentSplit,
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

    return (
      <div ref="root" style={css.root}>
        SKU PACKS
      </div>
    );
  }

}
