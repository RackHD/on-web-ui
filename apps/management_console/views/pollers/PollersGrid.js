// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { RaisedButton, LinearProgress } from 'material-ui';

import FormatHelpers from 'rui-common/mixins/FormatHelpers';
import ResourceTable from 'rui-common/views/ResourceTable';
import PollerStore from 'rui-common/stores/PollerStore';

export default class PollersGrid extends Component {

  static contextTypes = {router: PropTypes.any};

  pollers = new PollerStore();

  state = {
    pollers: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchPollers = this.pollers.watchAll('pollers', this);
    this.listPollers();
  }

  componentWillUnmount() { this.unwatchPollers(); }

  render() {
    return (
      <ResourceTable
          initialEntities={this.state.pollers}
          routeName="pollers"
          emptyContent="No pollers."
          headerContent="Pollers"
          loadingContent={this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
          toolbarContent={<RaisedButton label="Create Poller" primary={true} onClick={this.createPoller.bind(this)} />}
          mapper={poller => {
            let row = {};
            row.Type = <Link to={'/mc/pollers/' + poller.id}>{poller.type && poller.type.toUpperCase()}</Link>;
            if (!this.nodeId) {
              row.Node = <Link to={'/mc/nodes/' + poller.node}>{FormatHelpers.shortId(poller.node)}</Link>;
            }
            row.Updated = FormatHelpers.fromNow(poller.updatedAt);
            return row;
          }} />
    );
  }

  get nodeId() { return this.props.nodeId; }

  listPollers() {
    this.setState({loading: true});
    let nodeId = this.nodeId
    if (nodeId) {
      return this.pollers.listNode(nodeId).then(() => this.setState({loading: false}));
    }
    this.pollers.list().then(() => this.setState({loading: false}));
  }

  createPoller() {
    if (this.nodeId) {
      return this.context.router.push('/mc/nodes/' + this.nodeId + '/pollers/new');
    }
    this.context.router.push('/mc/pollers/new');
  }

}
