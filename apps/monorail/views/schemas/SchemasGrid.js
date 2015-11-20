// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import mixin from 'common-web-ui/lib/mixin';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import { LinearProgress } from 'material-ui';

import ResourceTable from 'common-web-ui/views/ResourceTable';

import SchemaStore from '../../stores/SchemaStore';

@mixin(FormatHelpers, RouteHelpers)
export default class SchemasGrid extends Component {

  schemas = new SchemaStore();

  state = {
    schemas: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchSchemas = this.schemas.watchAll('schemas', this);
    this.listSchemas();
  }

  componentWillUnmount() { this.unwatchSchemas(); }

  render() {
    return (
      <ResourceTable
          initialEntities={this.state.schema}
          routeName="schemas"
          emptyContent="No schemas."
          headerContent="Schemas"
          loadingContent={this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
          mapper={schema => (
            {
              ID: <a href={this.routePath('schemas', schema.id)}>{schema.id}</a>,
              Type: schema.type,
              'Property Names': Object.keys(schema.properties).join(', '),
              Required: schema.required
            }
          )} />
    );
  }

  listSchemas() {
    this.setState({loading: true});
    this.schemas.list().then(() => this.setState({loading: false}));
  }

}
