// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import mixin from 'common-web-ui/lib/mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import { RaisedButton, LinearProgress } from 'material-ui';

import ResourceTable from 'common-web-ui/views/ResourceTable';

import NodeStore from '../stores/NodeStore';
let nodes = new NodeStore();

@mixin(FormatHelpers, RouteHelpers)
export default class NodesGrid extends Component {

  state = {
    nodes: null,
    loading: true
  };

  componentWillMount() {
    nodes.startMessenger();
  }

  componentDidMount() {
    this.unwatchNodes = nodes.watchAll('nodes', this);
    this.listNodes();
  }

  componentWillUnmount() {
    nodes.stopMessenger();
    this.unwatchNodes();
  }

  render() {
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
              Updated: this.fromNow(node.updatedAt)
            }
          )} />
    );
  }

  listNodes() {
    this.setState({loading: true});
    nodes.list().then(() => this.setState({loading: false}));
  }

  createNode() { this.routeTo('nodes', 'new'); }

}
