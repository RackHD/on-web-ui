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
import PollersGrid from './PollersGrid';
import WorkflowsGrid from './WorkflowsGrid';

import {
    LinearProgress
  } from 'material-ui';

import JsonInspector from 'react-json-inspector';

import NodeStore from '../stores/NodeStore';
let nodes = new NodeStore();
let nodesRestAPI = nodes.nodesRestAPI;

@mixin.decorate(PageHelpers)
export default class Node extends Component {

  state = {
    obm: null,
    node: null,
    loading: true
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
        {this.state.loading ? <LinearProgress mode="indeterminate"  /> : null}
        <CatalogsGrid nodeId={this.getNodeId()} />
        <PollersGrid nodeId={this.getNodeId()} />
        <WorkflowsGrid nodeId={this.getNodeId()} />
        {this.state.obm ? [
          <h4>OBM:</h4>,
          <JsonInspector
              search={false}
              isExpanded={() => true}
              data={this.state.obm || {}} />
        ] : 'No OBM found.'}
        <EditNode nodeRef={this.state.node} />
      </div>
    );
  }

  getNodeId() { return this.props.params.nodeId; }

  readNode() {
    this.setState({loading: true});
    nodes.read(this.getNodeId()).then(node => {
      if (this.state.node && this.state.node.id) {
        nodesRestAPI.getObm(this.state.node.id).then(
          obm => this.setState({obm: obm, loading: false}),
          () => this.setState({loading: false}));
      }
      else this.setState({loading: false})
    });
  }

}
