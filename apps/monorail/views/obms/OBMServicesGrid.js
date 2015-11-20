// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import mixin from 'common-web-ui/lib/mixin';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import { LinearProgress } from 'material-ui';

import ResourceTable from 'common-web-ui/views/ResourceTable';

import OBMServiceStore from '../../stores/OBMServiceStore';

@mixin(FormatHelpers, RouteHelpers)
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
          loadingContent={this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
          mapper={obmService => (
            {
              'Service Name': <a href={this.routePath('obms', obmService.service)}>{obmService.service}</a>,
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
