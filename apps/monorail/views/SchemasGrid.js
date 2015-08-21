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

import SchemaStore from '../stores/SchemaStore';
let schemas = new SchemaStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class SchemasGrid extends Component {

  state = {
    schemas: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchSchemas = schemas.watchAll('schemas', this);
    this.listSchemas();
  }

  componentWillUnmount() { this.unwatchSchemas(); }

  render() {
    return (
      <div className="SchemasGrid">
        {this.renderGridToolbar({
          label: <a href="#/schemas">Schemas</a>,
          count: this.state.schemas && this.state.schemas.length || 0
        })}
        {this.state.loading ? <LinearProgress mode="indeterminate"  /> : <div className="clearfix"></div>}
        {
          this.renderGrid({
            results: this.state.schemas,
            resultsPerPage: this.props.size || 50
          }, schema => (
            {
              ID: <a href={this.routePath('schemas', schema.id)}>{schema.id}</a>,
              Type: schema.type,
              'Property Names': Object.keys(schema.properties).join(', '),
              Required: schema.required
            }
          ), 'No schemas.')
        }
      </div>
    );
  }

  listSchemas() {
    this.setState({loading: true});
    schemas.list().then(() => this.setState({loading: false}));
  }

}
