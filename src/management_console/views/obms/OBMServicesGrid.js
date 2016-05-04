// Copyright 2015, EMC, Inc.

import React, { Component } from 'react';
import { Link } from 'react-router';
import { LinearProgress } from 'material-ui';

import ResourceTable from 'src-common/views/ResourceTable';
import OBMServiceStore from 'src-common/stores/OBMServiceStore';

export default class OBMServicesGrid extends Component {

  obmServices = new OBMServiceStore();

  state = {
    obmServices: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchOBMServices = this.obmServices.watchAll('obmServices', this);
    this.listOBMServices();
  }

  componentWillUnmount() { this.unwatchOBMServices(); }

  render() {
    return (
      <ResourceTable
          initialEntities={this.state.obmServices}
          routeName="obms"
          emptyContent="No OBM Services."
          headerContent="OBM Services"
          loadingContent={<LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />}
          mapper={obmService => (
            {
              'Service Name': <Link to={'/mc/obms/' + obmService.service}>{obmService.service}</Link>,
              'Config Keys': Object.keys(obmService.config).join(', ')
            }
          )} />
    );
  }

  listOBMServices() {
    this.setState({loading: true});
    this.obmServices.list().then(() => this.setState({loading: false}));
  }

}
