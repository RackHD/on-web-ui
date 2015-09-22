// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
import GridHelpers from 'common-web-ui/mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    RaisedButton,
    LinearProgress
  } from 'material-ui';

import SkuStore from '../stores/SkuStore';
let skus = new SkuStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class SkusGrid extends Component {

  state = {
    skus: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchSkus = skus.watchAll('skus', this);
    this.listSkus();
  }

  componentWillUnmount() { this.unwatchSkus(); }

  render() {
    return (
      <div className="SkusGrid">
        {this.renderGridToolbar({
          label: <a href="#/skus">Skus</a>,
          count: this.state.skus && this.state.skus.length || 0,
          right:
            <RaisedButton label="Create SKU" primary={true} onClick={this.createSku.bind(this)} />
        })}
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
        {
          this.renderGrid({
            results: this.state.skus,
            resultsPerPage: this.props.size || 50
          }, sku => (
            {
              ID: <a href={this.routePath('skus', sku.id)}>{this.shortId(sku.id)}</a>,
              Name: sku.name,
              Created: this.fromNow(sku.createdAt),
              Updated: this.fromNow(sku.updatedAt)
            }
          ), 'No skus.')
        }
      </div>
    );
  }

  listSkus() {
    this.setState({loading: true});
    skus.list().then(() => this.setState({loading: false}));
  }

  createSku() { this.routeTo('skus', 'new'); }

}
