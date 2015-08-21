'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import EditNode from './EditNode';
import CreateNode from './CreateNode';
export { CreateNode, EditNode };

import CatalogsGrid from './CatalogsGrid';

import {} from 'material-ui';

import NodeStore from '../stores/NodeStore';
let nodes = new NodeStore();

@mixin.decorate(PageHelpers)
export default class Node extends Component {

  state = {
    node: null
  };

  componentDidMount() {
    this.unwatchNode = nodes.watchOne(this.getNodeId(), 'node', this);
    this.readNode();
  }

  componentWillUnmount() { this.unwatchNode(); }

  render() {
    return (
      <div className="Node">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'nodes', label: 'Nodes'},
          this.getNodeId()
        )}
        <CatalogsGrid nodeId={this.getNodeId()} />
        <EditNode nodeRef={this.state.node} />
      </div>
    );
  }

  getNodeId() { return this.props.params.nodeId; }

  readNode() { nodes.read(this.getNodeId()); }

}
