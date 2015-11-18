// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import mixin from 'common-web-ui/lib/mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';

import EditSku from './EditSku';
import CreateSku from './CreateSku';
export { CreateSku, EditSku };

import {
    FlatButton,
    LinearProgress,
    List, ListItem,
    RaisedButton,
    Snackbar,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import JsonInspector from 'react-json-inspector';

import SkuStore from '../stores/SkuStore';
let skus = new SkuStore();

@mixin(DialogHelpers)
export default class Sku extends Component {

  state = {
    sku: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchSku = skus.watchOne(this.getSkuId(), 'sku', this);
    this.readSku();
  }

  componentWillUnmount() { this.unwatchSku(); }

  render() {
    let sku = this.state.sku || {};
    return (
      <div className="Sku">
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : null}
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <ToolbarTitle text="SKU Details" />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <RaisedButton
                label="Delete SKU"
                primary={true}
                onClick={this.deleteSku.bind(this)}
                disabled={this.state.loading} />
          </ToolbarGroup>
        </Toolbar>
        <div className="ungrid">
          <div className="line">
            <div className="cell">
              <List>
                <ListItem
                  primaryText={sku.name || '(Untitled)'}
                  secondaryText="Name" />
              </List>
            </div>
            <div className="cell">
              <div style={{overflow: 'auto', margin: 10}}>
                <JsonInspector
                    search={false}
                    isExpanded={() => true}
                    data={sku.rules || []} />
              </div>
            </div>
          </div>
        </div>
        <EditSku sku={this.state.sku} />
      </div>
    );
  }

  getSkuId() { return this.props.skuId || this.props.params.skuId; }

  readSku() {
    this.setState({loading: true});
    skus.read(this.getSkuId()).then(() => this.setState({loading: false}));
  }

  deleteSku() {
    var id = this.state.sku.id;
    this.setState({loading: true});
    this.confirmDialog('Are you sure want to delete: ' + id,
      (confirmed) => confirmed ? skus.destroy(id).then(() => this.routeBack()) : this.setState({loading: false}));
  }

}
