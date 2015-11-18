// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import JsonInspector from 'react-json-inspector';
import Select from 'react-select';

import moment from 'moment';
import JsonDiff from 'common-web-ui/views/JsonDiff';

import CatalogsGrid from './CatalogsGrid';
import CatalogStore from '../stores/CatalogStore';

let catalogs = new CatalogStore();
let otherCatalogs = new CatalogStore();

export default class Catalog extends Component {

  state = {
    catalog: null,
    catalogs: [],
    otherCatalogs: [],
    compareCatalog: null
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
    this.unwatchOtherCatalogs();
  }

  watch(props) {
    this.unwatchOtherCatalogs = otherCatalogs.watchAll('otherCatalogs', this);
    otherCatalogs.list().then(() => {
      if (this.catalogId) {
        this.unwatchCatalog = catalogs.watchOne(this.getCatalogId(props), 'catalog', this);
      }
      else {
        this.unwatchCatalogs = catalogs.watchAll('catalogs', this);
      }
    });
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
      let otherCatalogsOptions = [];
      if (this.state.otherCatalogs && this.state.otherCatalogs.length) {
        this.state.otherCatalogs.forEach(otherCatalog => {
          if (otherCatalog.id === this.state.catalog.id) { return; }
          if (otherCatalog.source !== this.state.catalog.source) { return; }
          let isSameNode = otherCatalog.node === this.state.catalog.node,
              fromNow = moment(otherCatalog.updatedAt).fromNow();
          otherCatalogsOptions.push({
            label: isSameNode ? fromNow : fromNow + ', from ' + otherCatalog.node,
            value: otherCatalog.id
          });
        })
      }
      content = <div style={{padding: 10}}>
        <div style={{overflow: 'auto', margin: 10}}>
          <JsonInspector
              isExpanded={() => true}
              data={this.state.catalog} />
        </div>
        <div>
          <h5 style={{margin: '15px 0 5px', color: '#666'}}>Compare With Other Catalogs:</h5>
          <Select
              name="otherCatalogs"
              value={this.state.compareCatalog && this.state.compareCatalog.id}
              placeholder="Select a catalog to compare..."
              options={otherCatalogsOptions}
              onChange={(value) => {
                let compareCatalog;
                this.state.otherCatalogs.some(catalog => {
                  if (catalog.id === value) {
                    compareCatalog = catalog;
                    return true;
                  }
                });
                this.setState({ compareCatalog });
              }} />
          {this.state.catalog && this.state.compareCatalog ?
            <JsonDiff a={this.state.catalog} b={this.state.compareCatalog} /> : null}
        </div>
      </div>;
    }
    else if (this.state.catalogs && this.state.catalogs.length) {
      content = <CatalogsGrid catalogs={this.state.catalogs} nodeId={this.nodeId} source={this.source} />;
    }

    return (
      <div className="Catalog">
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
