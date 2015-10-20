// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'common-web-ui/lib/mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

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

import NodeStore from '../stores/NodeStore';
let nodes = new NodeStore();
let nodesRestAPI = nodes.nodesRestAPI;

@mixin(DialogHelpers)
@mixin(PageHelpers)
export default class Node extends Component {

  state = {
    obm: null,
    node: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchNode = nodes.watchOne(this.getNodeId(), 'node', this, (err) => {
      // console.log('GOT HERE', err);
      if (err.message.indexOf('Not Found') !== -1) {
        // this.routeTo('notFound');
        this.showError('Unable to locate node.');
      }
    });
    this.readNode();
  }

  componentWillUnmount() { this.unwatchNode(); }

  componentDidUpdate() {
    if (this.state.error) { this.refs.error.show(); }
  }

  render() {
    let node = this.state.node || {};
    return (
      <div className="Node">
        {this.renderBreadcrumbs(
          {href: '', label: 'Dashboard'},
          {href: 'nodes', label: 'Nodes'},
          this.getNodeId()
        )}
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : null}
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <ToolbarTitle text="Node Details" />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <FlatButton
                className="button"
                label="Clone Node"
                onClick={this.cloneNode.bind(this)}
                disabled={true || this.state.loading} />
            <RaisedButton
                label="Delete Node"
                primary={true}
                onClick={this.deleteNode.bind(this)}
                disabled={this.state.loading} />
          </ToolbarGroup>
        </Toolbar>
        <div className="ungrid">
          <div className="line">
            <div className="cell">
              <List>
                <ListItem
                  primaryText={node.name || '(Untitled)'}
                  secondaryText="Name" />
              </List>
            </div>
            <div className="cell">
              <List>
                <ListItem
                  primaryText={node.type || '(Unknown)'}
                  secondaryText="Type" />
              </List>
            </div>
          </div>
        </div>
        <div style={{overflow: 'auto', margin: 10}}>
          <h3>{this.state.obm ? 'OBM' : 'OBM Not Found'}</h3>
          {this.state.obm && <div style={{overflow: 'auto', margin: 10}}><JsonInspector
                search={false}
                isExpanded={() => true}
                data={this.state.obm || {}} /></div>}
        </div>
        <CatalogsGrid nodeId={this.getNodeId()} />
        <PollersGrid nodeId={this.getNodeId()} />
        <WorkflowsGrid nodeId={this.getNodeId()} />
        <EditNode node={this.state.node} />
        <Snackbar
          ref="error"
          action="dismiss"
          message={this.state.error || 'Unknown error.'}
          onActionTouchTap={this.dismissError.bind(this)} />
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

  cloneNode() {}

}
