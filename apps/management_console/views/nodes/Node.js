// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';

import DialogHelpers from 'rui-common/mixins/DialogHelpers';

import EditNode from './EditNode';
import CreateNode from './CreateNode';
export { CreateNode, EditNode };

import CatalogsGrid from '../catalogs/CatalogsGrid';
import PollersGrid from '../pollers/PollersGrid';
import WorkflowsGrid from '../workflows/WorkflowsGrid';

import {
    FlatButton,
    LinearProgress,
    List, ListItem,
    RaisedButton,
    Snackbar,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import JsonInspector from 'react-json-inspector';

import Console from 'rui-common/views/Console';
import RackHDRestAPIv1_1 from 'rui-common/messengers/RackHDRestAPIv1_1';

import NodeMonitor from '../../lib/NodeMonitor';
import NodeStore from 'rui-common/stores/NodeStore';

export default class Node extends Component {

  static contextTypes = {router: PropTypes.any};

  nodes = new NodeStore();

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
    this.unwatchNode = this.nodes.watchOne(this.getNodeId(), 'node', this, (err) => {
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

  render() {
    let node = this.state.node || {};
    return (
      <div className="Node">
        <LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />
        <div className="ungrid collapse">
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
              <Console elements={this.state.logs} />
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
          open={!!this.state.error}
          message={this.state.error || 'Unknown error.'}
          onActionClick={this.dismissError.bind(this)} />
      </div>
    );
  }

  showError(error) {
    this.setState({error: error.message || error});
  }

  dismissError() {
    this.setState({error: null});
  }

  getNodeId() { return this.props.params.nodeId; }

  readNode() {
    this.setState({loading: true});
    this.nodes.read(this.getNodeId()).then(node => {
      if (this.state.node && this.state.node.id) {
        RackHDRestAPIv1_1.nodes.getObm(this.state.node.id).then(
          obm => this.setState({obm: obm, loading: false}),
          () => this.setState({loading: false}));
      }
      else this.setState({loading: false})
    });
  }

  deleteNode() {
    var id = this.state.node.id;
    this.setState({loading: true});
    DialogHelpers.confirmDialog('Are you sure want to delete: ' + id,
      (confirmed) => confirmed ?
        this.nodes.destroy(id).then(() => this.context.router.goBack()) :
        this.setState({loading: false}));
  }

}
