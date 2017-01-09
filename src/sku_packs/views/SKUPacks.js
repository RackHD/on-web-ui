// Copyright 2015, EMC, Inc.

import { EventEmitter } from 'events';

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import radium from 'radium';

import RackHDRestAPIv2_0 from 'src-common/messengers/RackHDRestAPIv2_0';
import { FileReceiver, FileStatus } from 'src-common/views/file_uploader';
import ConfirmDialog from 'src-common/views/ConfirmDialog';

import SkusGrid from 'src-management-console/views/skus/SkusGrid';

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

  state = {
    cleanupSkus: [],
    newSku: {}
  };

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
                onUploadEnd: (file, fileHandler) => {
                  if (file.error) { return; }
                  RackHDRestAPIv2_0.api.skusGet().then(res => {
                    let skus = res.obj;
                    let newSku = skus.filter(sku => sku.id === file.result.id)[0];
                    if (!newSku) return;
                    let cleanupSkus = skus.filter(sku => sku !== newSku && sku.name === newSku.name);
                    this.setState({ cleanupSkus, newSku });
                  });
                },
                uploadUrl: RackHDRestAPIv2_0.url + '/skus/pack'
              }} />
        </div>
        <SkusGrid />

        <ConfirmDialog
            open={state.cleanupSkus && state.cleanupSkus.length !== 0}
            callback={confirmed => {
              if (confirmed) {
                let skuDeletes = state.cleanupSkus.map(sku => {
                  return RackHDRestAPIv2_0.api.skusIdDeletePack({identifier: sku.id});
                });
              }
              this.setState({cleanupSkus: [], newSku: {}});
            }}>
          Detected {state.cleanupSkus.length} SKU(s) also called "{state.newSku.name}".
          <br/>
          Should the older SKU(s) be deleted?
        </ConfirmDialog>
      </div>
    );
  }

}
