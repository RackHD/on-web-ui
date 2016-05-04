// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { RaisedButton, LinearProgress } from 'material-ui';

import FormatHelpers from 'src-common/lib/FormatHelpers';
import ResourceTable from 'src-common/views/ResourceTable';
import NodeStore from 'src-common/stores/NodeStore';
import CatalogStore from 'src-common/stores/CatalogStore';

export default class NodesGrid extends Component {

  static contextTypes = {router: PropTypes.any};

  nodes = new NodeStore();
  catalogs = new CatalogStore();

  state = {
    nodes: null,
    catalogs: null,
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
          loadingContent={<LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />}
          mapper={node => (
            {
              Name: <Link to={'/mc/nodes/' + node.id}>{node.name}</Link>,
              Type: node.type,
              Manufacturer: systemInfo(node, 'Manufacturer'),
              Model: systemInfo(node, 'Product Name'),
              Updated: FormatHelpers.fromNow(node.updatedAt)
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

  createNode() {
    this.context.router.push('/mc/nodes/new');
  }

}
