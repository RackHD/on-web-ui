// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import ElasticsearchAPI from 'src-common/messengers/ElasticsearchAPI';
import ConfirmDialog from 'src-common/views/ConfirmDialog';

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

import Console from 'src-common/views/Console';
import RackHDRestAPIv2_0 from 'src-common/messengers/RackHDRestAPIv2_0';

import NodeMonitor from '../../lib/NodeMonitor';
import NodeStore from 'src-common/stores/NodeStore';

export default class Node extends Component {

  static contextTypes = {router: PropTypes.any};

  nodes = new NodeStore();

  state = {
    confirmDelete: false,
    loading: true,
    node: null,
    obm: null,
    previousLogs: [],
    realtimeLogs: []
  };

  componentWillMount() {
    this.nodeMonitor = new NodeMonitor(this.getNodeId(), msg => {
      this.setState(state => {
        return {realtimeLogs: [msg.data].concat(state.realtimeLogs)};
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
      size
    });
  }

  render() {
    let { state } = this;
    let node = state.node || {};

    let logs = state.previousLogs.concat(state.realtimeLogs).sort(
      (a, b) => moment(a.timestamp).unix() -
                moment(b.timestamp).unix()
    );

    return (
      <div className="Node">
        <LinearProgress mode={state.loading ? 'indeterminate' : 'determinate'} value={100} />

        <ConfirmDialog
            open={state.confirmDelete}
            callback={confirmed => {
              if (confirmed) {
                return this.nodes.destroy(node.id).
                  then(() => this.context.router.goBack());
              }
              this.setState({loading: false, confirmDelete: false});
            }}>
          Are you sure want to delete this Node? "{node.id}"
        </ConfirmDialog>

        <Tabs>
          <Tab
              icon={<FontIcon className="fa fa-server" />}
              label="Details">

            <Toolbar>
              <ToolbarGroup key={0} firstChild={true}>
                <ToolbarTitle text={node.name + ' -- ' + node.type + ' node.'}
                              style={{color: 'white'}}/>
              </ToolbarGroup>
              <ToolbarGroup key={1} lastChild={true}>
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
              elements={logs}
              height={Math.max(500, window.innerHeight - 150)}
              handleInfiniteLoad={cb => {
                this.loadPreviousLogs(logs.length).then(res => {
                  let previousLogs = res.hits.hits.map(hit => hit._source);

                  this.setState(state => {
                    previousLogs = previousLogs.concat(state.previousLogs);
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
        RackHDRestAPIv2_0.api.nodesGetObmsByNodeId({
          identifier: this.state.node.id
        }).then(
          res => this.setState({obm: res.obj, loading: false}),
          () => this.setState({loading: false}));
      }
      else this.setState({loading: false});
    });
  }

  deleteNode() {
    this.setState({loading: true, confirmDelete: true});
  }

}
