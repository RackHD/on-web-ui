// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

import ConfirmDialog from 'src-common/views/ConfirmDialog';
import SkuStore from 'src-common/stores/SkuStore';

import EditSku from './EditSku';
import CreateSku from './CreateSku';
export { CreateSku, EditSku };

import {
    FlatButton,
    LinearProgress,
    List, ListItem,
    RaisedButton,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import JsonInspector from 'react-json-inspector';

export default class Sku extends Component {

  static contextTypes = {
    router: PropTypes.any
  };

  skus = new SkuStore();

  state = {
    confirmDelete: false,
    loading: true,
    sku: null
  };

  componentDidMount() {
    this.unwatchSku = this.skus.watchOne(this.getSkuId(), 'sku', this);
    this.readSku();
  }

  componentWillUnmount() { this.unwatchSku(); }

  render() {
    let sku = this.state.sku || {};
    return (
      <div className="Sku">
        <LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />

        <ConfirmDialog
            open={this.state.confirmDelete}
            callback={confirmed => {
              if (confirmed) {
                return this.skus.destroy(sku.id).
                  then(() => this.context.router.goBack());
              }
              this.setState({loading: false, confirmDelete: false});
            }}>
          Are you sure want to delete this SKU? "{sku.id}"
        </ConfirmDialog>

        <Toolbar>
          <ToolbarGroup key={0} firstChild={true}>
            <ToolbarTitle text="SKU Details" />
          </ToolbarGroup>
          <ToolbarGroup key={1} lastChild={true}>
            <RaisedButton
                label="Delete SKU"
                primary={true}
                onClick={this.deleteSku.bind(this)}
                disabled={this.state.loading} />
          </ToolbarGroup>
        </Toolbar>
        <div className="ungrid collapse">
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
    this.skus.read(this.getSkuId()).then(() => this.setState({loading: false}));
  }

  deleteSku() {
    this.setState({loading: true, confirmDelete: true});
  }

}
