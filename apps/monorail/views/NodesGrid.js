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

import {
    // IconButton,
    RaisedButton,
    LinearProgress
  } from 'material-ui';

import NodeStore from '../stores/NodeStore';
let nodes = new NodeStore();

@mixin(DialogHelpers)
@mixin(FormatHelpers)
@mixin(RouteHelpers)
@mixin(GridHelpers)
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
      <div className="NodesGrid">
        {this.renderGridToolbar({
          label: <a href="#/nodes">Nodes</a>,
          count: this.state.nodes && this.state.nodes.length || 0,
          right:
            <RaisedButton label="Create Node" primary={true} onClick={this.createNode.bind(this)} />
        })}
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
        {
          this.renderGrid({
            results: this.state.nodes,
            resultsPerPage: this.props.size || 50
          }, node => (
            {
              ID: <a href={this.routePath('nodes', node.id)}>{this.shortId(node.id)}</a>,
              Name: node.name,
              Created: this.fromNow(node.createdAt),
              Updated: this.fromNow(node.updatedAt)//,
              // Actions: [
              //   <IconButton iconClassName="fa fa-edit"
              //               tooltip="Edit Node"
              //               touch={true}
              //               onClick={this.editNode.bind(this, node.id)} />,
              //   <IconButton iconClassName="fa fa-remove"
              //               tooltip="Remove Node"
              //               touch={true}
              //               onClick={this.deleteNode.bind(this, node.id)} />
              // ]
            }
          ), 'No nodes.')
        }
      </div>
    );
  }

  listNodes() {
    this.setState({loading: true});
    nodes.list().then(() => this.setState({loading: false}));
  }

  // editNode(id) { this.routeTo('nodes', id); }

  createNode() { this.routeTo('nodes', 'new'); }

  // deleteNode(id) {
  //   this.confirmDialog('Are you sure want to delete: ' + id,
  //     (confirmed) => confirmed && nodes.destroy(id));
  // }

}
