// Copyright 2015, EMC, Inc.

'use strict';

import { EventEmitter } from 'events';

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom'
import radium from 'radium';

import RackHDRestAPIv1_1 from 'rui-common/messengers/RackHDRestAPIv1_1';
import { FileReceiver, FileStatus } from 'rui-common/views/file_uploader';

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

  componentDidMount() {}

  componentWillUnmount() {}

  componentWillReceiveProps(nextProps) {}

  state = {};

  css = {
    root: {
      position: 'relative',
      overflow: 'auto', //hidden
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
        <div style={{padding: 15}}>
          <p>Drag and Drop your SKU packs to automatically add them to RackHD</p>
          <FileReceiver ref="fileReceiver"
              fileHandlerProps={{
                uploadUrl: RackHDRestAPIv1_1.url + '/skus/pack'
              }} />
        </div>
      </div>
    );
  }

}
