// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { RaisedButton, LinearProgress } from 'material-ui';

import FormatHelpers from 'src-common/lib/FormatHelpers';
import ResourceTable from 'src-common/views/ResourceTable';
import SkuStore from 'src-common/stores/SkuStore';

export default class SkusGrid extends Component {

  static contextTypes = {router: PropTypes.any};

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
          initialEntities={this.state.skus}
          routeName="skus"
          emptyContent="No skus."
          headerContent="SKUs"
          loadingContent={<LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />}
          toolbarContent={<RaisedButton label="Create SKU" primary={true} onClick={this.createSku.bind(this)} />}
          mapper={sku => (
            {
              ID: <Link to={'/mc/skus/' + sku.id}>{FormatHelpers.shortId(sku.id)}</Link>,
              Name: sku.name,
              Created: FormatHelpers.fromNow(sku.createdAt),
              Updated: FormatHelpers.fromNow(sku.updatedAt)
            }
          )} />
    );
  }

  listSkus() {
    this.setState({loading: true});
    this.skus.list().then(() => this.setState({loading: false}));
  }

  createSku() {
    this.context.router.push('/mc/skus/new');
  }

}
