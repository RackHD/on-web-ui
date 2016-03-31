// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import ElasticsearchAPI from 'rui-common/messengers/ElasticsearchAPI';
import DialogHelpers from 'rui-common/mixins/DialogHelpers';

import EditNode from './EditNode';
import CreateNode from './CreateNode';
export { CreateNode, EditNode };

import CatalogsGrid from '../catalogs/CatalogsGrid';
import PollersGrid from '../pollers/PollersGrid';
import WorkflowsGrid from '../workflows/WorkflowsGrid';

import {
    FlatButton,
    FontIcon,
    LinearProgress,
    List, ListItem,
    RaisedButton,
    Snackbar,
    Tabs, Tab,
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
    previousLogs: [],
    realtimeLogs: [],
    obm: null,
    node: null,
    loading: true
  };

  componentWillMount() {
    this.nodeMonitor = new NodeMonitor(this.getNodeId(), msg => {
      this.setState(state => {
        return {realtimeLogs: [msg.data].concat(state.realtimeLogs)}
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

  loadPreviousLogs(offset=0, size=100) {
    return ElasticsearchAPI.search({
      q: 'subject:' + this.getNodeId(),
      sort: 'timestamp:desc',
      index: 'logstash-*',
      from: offset,
      size: size
    });
  }

  render() {
    let { state } = this;
    let node = state.node || {};

    return (
      <div className="Node">
        <LinearProgress mode={state.loading ? 'indeterminate' : 'determinate'} value={100} />

        <Tabs>
          <Tab
              icon={<FontIcon className="fa fa-server" />}
              label="Details">

            <Toolbar>
              <ToolbarGroup key={0} float="left">
                <ToolbarTitle text={node.name + ' -- ' + node.type + ' node.'}
                              style={{color: 'white'}}/>
              </ToolbarGroup>
              <ToolbarGroup key={1} float="right">
                <RaisedButton
                    label="Delete Node"
                    primary={true}
                    onClick={this.deleteNode.bind(this)}
                    disabled={state.loading} />
              </ToolbarGroup>
            </Toolbar>

            <div style={{overflow: 'auto', margin: 10}}>
              <h3>{state.obm ? 'OBM' : 'OBM Not Found'}</h3>
              {state.obm && <div style={{overflow: 'auto', margin: 10}}><JsonInspector
                    search={false}
                    isExpanded={() => true}
                    data={state.obm || {}} /></div>}
            </div>

            <WorkflowsGrid nodeId={this.getNodeId()} />
            <CatalogsGrid nodeId={this.getNodeId()} />
            <PollersGrid nodeId={this.getNodeId()} />

          </Tab>
          <Tab
              icon={<FontIcon className="fa fa-terminal" />}
              label="Console">

            <Console
              elements={state.previousLogs.concat(state.realtimeLogs)}
              height={Math.max(500, window.innerHeight - 150)}
              handleInfiniteLoad={cb => {
                this.loadPreviousLogs(
                  state.previousLogs.length +
                  state.realtimeLogs.length
                ).then(res => {
                  let previousLogs = res.hits.hits.map(hit => hit._source);

                  this.setState(state => {
                    previousLogs = previousLogs.concat(state.previousLogs).sort(
                      (a, b) => moment(a.timestamp).unix() -
                                moment(b.timestamp).unix()
                    );

                    return { previousLogs };
                  }, cb);
                }).catch(cb);
              }} />

          </Tab>
          <Tab
              icon={<FontIcon className="fa fa-edit" />}
              label="Editor">

            <EditNode node={node} />

          </Tab>
        </Tabs>

        <Snackbar
          ref="error"
          action="dismiss"
          open={!!state.error}
          message={state.error || 'Unknown error.'}
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
