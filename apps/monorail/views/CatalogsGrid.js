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
    // IconButton,
    // RaisedButton,
    LinearProgress
  } from 'material-ui';

import CatalogStore from '../stores/CatalogStore';
let catalogs = new CatalogStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class CatalogsGrid extends Component {

  state = {
    catalogs: this.props.catalogs,
    loading: !this.props.catalogs
  };

  componentDidMount() {
    this.unwatchCatlogs = catalogs.watchAll('catalogs', this);
    this.listCatalogs();
  }

  componentWillUnmount() { this.unwatchCatlogs(); }

  render() {
    return (
      <div className="CatalogsGrid">
        {this.renderGridToolbar({
          label: <a href={'#/catalogs' + (this.nodeId ? '/n/' + this.nodeId : '')}>Catalogs</a>,
          count: this.state.catalogs && this.state.catalogs.length || 0
        })}
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
        {
          this.renderGrid({
            results: this.state.catalogs,
            resultsPerPage: this.props.size || 50
          }, catalog => (
            {
              ID: <a href={this.routePath('catalogs', catalog.id)}>{this.shortId(catalog.id)}</a>,
              Node: <a href={this.routePath('nodes', catalog.node)}>{this.shortId(catalog.node)}</a>,
              Source: <a href={this.routePath('catalogs/n', catalog.node, 's', catalog.source)}>{catalog.source}</a>,
              Created: this.fromNow(catalog.createdAt),
              Updated: this.fromNow(catalog.updatedAt),
            }
          ), 'No catalogs.')
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
