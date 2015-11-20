// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import mixin from 'common-web-ui/lib/mixin';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import { RaisedButton, LinearProgress } from 'material-ui';

import ResourceTable from 'common-web-ui/views/ResourceTable';

import SkuStore from '../stores/SkuStore';

@mixin(FormatHelpers, RouteHelpers)
export default class SkusGrid extends Component {

  skus = new SkuStore();

  state = {
    skus: null,
    loading: true
  };

  componentWillMount() {
    this.skus.startMessenger();
  }

  componentDidMount() {
    this.unwatchSkus = this.skus.watchAll('skus', this);
    this.listSkus();
  }

  componentWillUnmount() {
    this.skus.stopMessenger();
    this.unwatchSkus();
  }

  render() {
    return (
      <ResourceTable
          initialEntities={this.state.pollers}
          routeName="skus"
          emptyContent="No skus."
          headerContent="SKUs"
          loadingContent={this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
          toolbarContent={<RaisedButton label="Create SKU" primary={true} onClick={this.createSku.bind(this)} />}
          mapper={sku => (
            {
              ID: <a href={this.routePath('skus', sku.id)}>{this.shortId(sku.id)}</a>,
              Name: sku.name,
              Created: this.fromNow(sku.createdAt),
              Updated: this.fromNow(sku.updatedAt)
            }
          )} />
    );
  }

  listSkus() {
    this.setState({loading: true});
    this.skus.list().then(() => this.setState({loading: false}));
  }

  createSku() { this.routeTo('skus', 'new'); }

}
