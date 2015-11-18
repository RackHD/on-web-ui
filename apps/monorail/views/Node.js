// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import mixin from 'common-web-ui/lib/mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import EditNode from './EditNode';
import CreateNode from './CreateNode';
export { CreateNode, EditNode };

import CatalogsGrid from './CatalogsGrid';
import PollersGrid from './PollersGrid';
import WorkflowsGrid from './WorkflowsGrid';

import {
    FlatButton,
    LinearProgress,
    List, ListItem,
    RaisedButton,
    Snackbar,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import JsonInspector from 'react-json-inspector';

import Console from 'common-web-ui/views/Console';
import NodeMonitor from '../lib/NodeMonitor';

import NodeStore from '../stores/NodeStore';
let nodes = new NodeStore();
let nodesRestAPI = nodes.nodesRestAPI;

@mixin(DialogHelpers, RouteHelpers)
export default class Node extends Component {

  state = {
    logs: [],
    obm: null,
    node: null,
    loading: true
  };

  componentWillMount() {
    this.nodeMonitor = new NodeMonitor(this.getNodeId(), msg => {
      this.setState(state => {
        return {logs: [msg.data].concat(state.logs)}
      });
    });
  }

  componentDidMount() {
    this.unwatchNode = nodes.watchOne(this.getNodeId(), 'node', this, (err) => {
      if (err.message.indexOf('Not Found') !== -1) {
        this.showError('Unable to locate node.');
      }
    });
    this.readNode();
  }

  componentWillUnmount() {
    this.nodeMonitor.disconnect();
    this.unwatchNode();
  }

  componentDidUpdate() {
    if (this.state.error) { this.refs.error.show(); }
  }

  render() {
    let node = this.state.node || {};
    return (
      <div className="Node">
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : null}
        <div className="ungrid">
          <div className="line">
            <div className="cell" style={{borderRight: '1px solid black'}}>
              <Toolbar>
                <ToolbarGroup key={0} float="left">
                  <ToolbarTitle text="Node Details" />
                </ToolbarGroup>
                <ToolbarGroup key={1} float="right">
                  <RaisedButton
                      label="Delete Node"
                      primary={true}
                      onClick={this.deleteNode.bind(this)}
                      disabled={this.state.loading} />
                </ToolbarGroup>
              </Toolbar>
              <List>
                <ListItem
                  primaryText={node.name || '(Untitled)'}
                  secondaryText="Name" />
                <ListItem
                  primaryText={node.type || '(Unknown)'}
                  secondaryText="Type" />
              </List>
              <div style={{overflow: 'auto', margin: 10}}>
                <h3>{this.state.obm ? 'OBM' : 'OBM Not Found'}</h3>
                {this.state.obm && <div style={{overflow: 'auto', margin: 10}}><JsonInspector
                      search={false}
                      isExpanded={() => true}
                      data={this.state.obm || {}} /></div>}
              </div>
            </div>
            <div className="cell">
              <WorkflowsGrid nodeId={this.getNodeId()} />
              <CatalogsGrid nodeId={this.getNodeId()} />
            </div>
          </div>
          <div className="line">
            <div className="cell">
              <Console rows={this.state.logs} mapper={data => (
                <p style={{
                  color: Console.colors[data.level],
                  borderTop: '1px dotted #888',
                  padding: '5px 0',
                  margin: 0
                }}>
                  <b>{data.timestamp}</b>&nbsp;&nbsp;
                  <i>[{data.name}]</i>&nbsp;&nbsp;
                  <i>[{data.module}]</i>&nbsp;&nbsp;
                  <i>[{data.subject}]</i>&nbsp;--&nbsp;
                  <b>{data.message}</b>&nbsp;->&nbsp;
                  <u>{data.caller}</u>
                </p>
              )} />
            </div>
            <div className="cell">
              <PollersGrid nodeId={this.getNodeId()} />
              <EditNode node={this.state.node} />
            </div>
          </div>
        </div>
        <Snackbar
          ref="error"
          action="dismiss"
          message={this.state.error || 'Unknown error.'}
          onActionClick={this.dismissError.bind(this)} />
      </div>
    );
  }

  showError(error) { this.setState({error: error.message || error}); }

  dismissError() {
    this.refs.error.dismiss();
    this.setState({error: null});
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

  deleteNode() {
    var id = this.state.node.id;
    this.setState({loading: true});
    this.confirmDialog('Are you sure want to delete: ' + id,
      (confirmed) => confirmed ? nodes.destroy(id).then(() => this.routeBack()) : this.setState({loading: false}));
  }

}
