// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import CatalogsGrid from './CatalogsGrid';
import JsonInspector from 'react-json-inspector';

import {} from 'material-ui';

import CatalogStore from '../stores/CatalogStore';
let catalogs = new CatalogStore();

@mixin(PageHelpers)
export default class Catalog extends Component {

  state = {
    catalog: null,
    catalogs: []
  };

  getCatalogId(props=this.props) {
    return props.catalogId || props.params && props.params.catalogId;
  }

  get catalogId() {
    return this.state.catalog && this.state.catalog.id || this.getCatalogId();
  }

  get nodeId() {
    return this.props.nodeId || this.props.params && this.props.params.nodeId
  }

  get source() {
    return this.props.source || this.props.params && this.props.params.source
  }

  componentWillReceiveProps(nextProps) {
    this.unwatch();
    this.watch(nextProps);
    this.forceUpdate();
  }

  unwatch() {
    if (this.unwatchCatalog) this.unwatchCatalog();
    if (this.unwatchCatalogs) this.unwatchCatalogs();
  }

  watch(props) {
    if (this.catalogId) {
      this.unwatchCatalog = catalogs.watchOne(this.getCatalogId(props), 'catalog', this);
    }
    else {
      this.unwatchCatalogs = catalogs.watchAll('catalogs', this);
    }
  }

  componentDidMount() {
    this.watch();
    this.readCatalog();
  }

  componentWillUnmount() {
    this.unwatch();
  }

  render() {
    let content;

    if (!this.state.catalog && this.state.catalogs && this.state.catalogs.length === 1) {
      this.state.catalog = this.state.catalogs[0];
    }

    if (this.catalogId && this.state.catalog) {
      content = <div style={{overflow: 'auto', margin: 10}}>
        <JsonInspector
            isExpanded={() => true}
            data={this.state.catalog} />
      </div>;
    }
    else if (this.state.catalogs && this.state.catalogs.length) {
      content = <CatalogsGrid catalogs={this.state.catalogs} nodeId={this.nodeId} source={this.source} />;
    }

    return (
      <div className="Catalog">
        {this.catalogId ?
          this.renderBreadcrumbs(
            {href: 'dash', label: 'Dashboard'},
            {href: 'catalogs', label: 'Catalogs'},
            this.catalogId
          ) :
          this.renderBreadcrumbs(
            {href: 'dash', label: 'Dashboard'},
            {href: 'nodes', label: 'Nodes'},
            {href: 'nodes/' + this.nodeId, label: this.nodeId},
            {href: 'catalogs', label: 'Catalogs'},
            this.source
          )
        }
        {content}
      </div>
    );
  }

  readCatalog() {
    if (this.catalogId) return catalogs.read(this.catalogId);
    if (this.nodeId && this.source) {
      return catalogs.listNodeSource(this.nodeId, this.source);
    }
    throw new Error('Bad catalog params.');
  }

}
