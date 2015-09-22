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
    LinearProgress
  } from 'material-ui';

import OBMServiceStore from '../stores/OBMServiceStore';
let obmServices = new OBMServiceStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class OBMServicesGrid extends Component {

  state = {
    obmServices: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchOBMServices = obmServices.watchAll('obmServices', this);
    this.listOBMServices();
  }

  componentWillUnmount() { this.unwatchOBMServices(); }

  render() {
    return (
      <div className="OBMServicesGrid">
        {this.renderGridToolbar({
          label: <a href="#/obms">OBM Services</a>,
          count: this.state.obmServices && this.state.obmServices.length || 0
        })}
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
        {
          this.renderGrid({
            results: this.state.obmServices,
            resultsPerPage: this.props.size || 50
          }, obmService => (
            {
              'Service Name': <a href={this.routePath('obms', obmService.service)}>{obmService.service}</a>,
              'Config Keys': Object.keys(obmService.config).join(', ')
            }
          ), 'No OBM Services.')
        }
      </div>
    );
  }

  listOBMServices() {
    this.setState({loading: true});
    obmServices.list().then(() => this.setState({loading: false}));
  }

}
