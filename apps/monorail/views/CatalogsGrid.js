// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
import GridHelpers from 'common-web-ui/mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import moment from 'moment';

import {
    // IconButton,
    // RaisedButton,
    LinearProgress
  } from 'material-ui';

import CatalogStore from '../stores/CatalogStore';
let catalogs = new CatalogStore();

@mixin(DialogHelpers)
@mixin(FormatHelpers)
@mixin(RouteHelpers)
@mixin(GridHelpers)
export default class CatalogsGrid extends Component {

  state = {
    catalogs: this.props.catalogs,
    loading: !this.props.catalogs
  };

  componentWillMount() {
    catalogs.startMessenger();
  }

  componentDidMount() {
    this.unwatchCatlogs = catalogs.watchAll('catalogs', this);
    this.listCatalogs();
  }

  componentWillUnmount() {
    catalogs.stopMessenger();
    this.unwatchCatlogs();
  }

  render() {
    let catalogsByNode = [];
    if (this.state.catalogs && this.state.catalogs.length) {
      catalogsByNode = {};
      this.state.catalogs.sort(
        (a, b) => moment(b.updatedAt).unix() - moment(a.updatedAt).unix()
      ).forEach(catalog => {
        let branch = catalogsByNode[catalog.node] = catalogsByNode[catalog.node] || [],
            list = branch[branch.length - 1],
            check = false;
        if (list) {
          check = list.some(item => item.source === catalog.source);
          if (!check) {
            list.push(catalog);
          }
          else {
            branch.push([catalog]);
          }
        }
        else {
          branch.push([catalog]);
        }
      });
      catalogsByNode = Object.keys(catalogsByNode).map(node => {
        let branch = catalogsByNode[node];
        return branch.map(list => {
          list = list.sort((a, b) =>
            (a.source < b.source) ? -1 : (a.source > b.source) ? 1 : 0);
          return {
            node: node,
            sources: list,
            updatedAt: list[list.length - 1].updatedAt
          }
        });
      }).reduce((prev, curr) => prev.concat(curr), []);
    }
    return (
      <div className="CatalogsGrid">
        {this.renderGridToolbar({
          label: <a href={'#/catalogs' + (this.nodeId ? '/n/' + this.nodeId : '')}>Catalogs</a>,
          count: catalogsByNode && catalogsByNode.length || 0
        })}
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
        {
          this.renderGrid({
            results: catalogsByNode,
            resultsPerPage: this.props.size || 50
          }, catalog => {
            let row = {};
            row.Sources = catalog.sources.map(source => (
              <a
                  href={this.routePath('catalogs', source.id)}
                  style={{display: 'inline-block', margin: '0 5px'}}>
                {source.source.toUpperCase()}
              </a>
            ));
            if (!this.nodeId) {
              row.Node = <a href={this.routePath('nodes', catalog.node)}>{this.shortId(catalog.node)}</a>;
            }
            row.Updated = this.fromNow(catalog.updatedAt);
            return row;
          }, 'No catalogs.')
        }
      </div>
    );
  }

  get nodeId() { return this.props.nodeId; }

  get source() { return this.props.source; }

  listCatalogs() {
    this.setState({loading: true});
    let nodeId = this.nodeId,
        source = this.source;
    if (nodeId) {
      if (source) return catalogs.listNodeSource(nodeId, source).then(() => this.setState({loading: false}));
      return catalogs.listNode(nodeId).then(() => this.setState({loading: false}));
    }
    catalogs.list().then(() => this.setState({loading: false}));
  }

}
