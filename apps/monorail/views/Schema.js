// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import { LinearProgress } from 'material-ui';

import JsonInspector from 'react-json-inspector';

import SchemaStore from '../stores/SchemaStore';
let schema = new SchemaStore();

@mixin(PageHelpers)
export default class Schema extends Component {

  state = {
    schema: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchSchema = schema.watchOne(this.getSchemaId(), 'schema', this);
    this.readSchema();
  }

  componentWillUnmount() { this.unwatchSchema(); }

  render() {
    return (
      <div className="Schema">
        {this.renderBreadcrumbs(
          {href: '', label: 'Dashboard'},
          {href: 'schemas', label: 'Schemas'},
          this.getSchemaId()
        )}
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : null}
        <div style={{overflow: 'auto', margin: 10}}>
          <JsonInspector
              search={false}
              isExpanded={() => true}
              data={this.state.schema || {}} />
        </div>
      </div>
    );
  }

  getSchemaId() { return this.props.schemaId || this.props.params.schemaId; }

  readSchema() {
    this.setState({loading: true});
    schema.read(this.getSchemaId()).then(() => this.setState({loading: false}));
  }

}
