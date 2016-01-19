// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import mixin from 'common-web-ui/lib/mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import { RaisedButton, LinearProgress } from 'material-ui';

import ResourceTable from 'common-web-ui/views/ResourceTable';

import NodeStore from '../../stores/NodeStore';
import CatalogStore from '../../stores/CatalogStore';

@mixin(FormatHelpers, RouteHelpers)
export default class NodesGrid extends Component {

  nodes = new NodeStore();
  catalogs = new CatalogStore();

  state = {
    nodes: null,
    loading: true
  };

  componentWillMount() {
    this.nodes.startMessenger();
    this.catalogs.startMessenger();
  }

  componentDidMount() {
    this.unwatchNodes = this.nodes.watchAll('nodes', this);
    this.unwatchCatalogs = this.catalogs.watchAll('catalogs', this);
    this.listNodes();
  }

  componentWillUnmount() {
    this.nodes.stopMessenger();
    this.catalogs.stopMessenger();
    this.unwatchNodes();
  }

  render() {
    let systemInfo = (node, prop) => {
      let curr = node;
      ['dmi', 'data', 'System Information'].forEach(key => {
        curr = curr && curr[key];
      });
      return curr && curr[prop] || 'N/A';
    };
    return (
      <ResourceTable
          initialEntities={this.state.nodes}
          routeName="nodes"
          emptyContent="No nodes."
          headerContent="Nodes"
          toolbarContent={<RaisedButton label="Create Node" primary={true} onClick={this.createNode.bind(this)} />}
          loadingContent={this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
          mapper={node => (
            {
              Name: <a href={this.routePath('nodes', node.id)}>{node.name}</a>,
              Type: node.type,
              Manufacturer: systemInfo(node, 'Manufacturer'),
              Model: systemInfo(node, 'Product Name'),
              Updated: this.fromNow(node.updatedAt)
            }
          )} />
    );
  }

  listNodes() {
    this.setState({loading: true});
    this.nodes.list().then(() => {
      let promises = [];
      this.nodes.each(node => {
        let promise = new Promise((resolve) => {
          this.catalogs.relateNode(node, 'dmi', this.nodes).then(resolve, resolve);
        });
        promises.push(promise);
      });
      Promise.all(promises).then(() => {
        this.setState({loading: false});
      });
    });
  }

  createNode() { this.routeTo('nodes', 'new'); }

}
