'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
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
    Snackbar
  } from 'material-ui';

import JsonInspector from 'react-json-inspector';

import NodeStore from '../stores/NodeStore';
let nodes = new NodeStore();
let nodesRestAPI = nodes.nodesRestAPI;

@mixin.decorate(DialogHelpers)
@mixin.decorate(PageHelpers)
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
    return (
      <div className="Node">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'nodes', label: 'Nodes'},
          this.getNodeId()
        )}
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : null}
        {this.state.node && this.state.node.id ?
          <div className="right">
            <FlatButton className="button"
                        label="Delete"
                        onClick={this.deleteNode.bind(this)}
                        disabled={this.state.loading} />
            <FlatButton className="button"
                        label="Clone"
                        onClick={this.cloneNode.bind(this)}
                        disabled={true || this.state.loading} />
          </div> : null}
        <div className="clearfix"></div>
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

  cloneNode() {}// TODO

}
