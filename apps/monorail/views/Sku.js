'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import { LinearProgress } from 'material-ui';

import JsonInspector from 'react-json-inspector';

import SkuStore from '../stores/SkuStore';
let skus = new SkuStore();

@mixin.decorate(PageHelpers)
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
    return (
      <div className="Sku">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'skus', label: 'Skus'},
          this.getSkuId()
        )}
        {this.state.loading ? <LinearProgress mode="indeterminate"  /> : null}
        <JsonInspector
            search={false}
            isExpanded={() => true}
            data={this.state.sku || {}} />
      </div>
    );
  }

  getSkuId() { return this.props.skuId || this.props.params.skuId; }

  readSku() {
    this.setState({loading: true});
    skus.read(this.getSkuId()).then(() => this.setState({loading: false}));
  }

}
