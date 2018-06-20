// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { RaisedButton, LinearProgress } from 'material-ui';

import FormatHelpers from 'src-common/lib/FormatHelpers';
import ResourceTable from 'src-common/views/ResourceTable';
import PollerStore from 'src-common/stores/PollerStore';

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
          loadingContent={<LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />}
          toolbarContent={<RaisedButton label="Create Poller" primary={true} onClick={this.createPoller.bind(this)} />}
          mapper={poller => {
            let row = {};
            row.Type = <Link to={'/mc/pollers/' + poller.id}>{this.getPollerType(poller)}</Link>;
            if (!this.nodeId) {
              row.Node = <Link to={'/mc/nodes/' + poller.node}>{FormatHelpers.shortId(poller.node)}</Link>;
            }
            row.Updated = FormatHelpers.fromNow(poller.updatedAt);
            return row;
          }} />
    );
  }

  get nodeId() { return this.props.nodeId; }

  getPollerType(poller) {
    if (poller.type) {
      return poller.type.toString().toUpperCase();
    }
    if (poller.name) {
      return poller.name.toString().split('.').slice(1).join('.');
    }
    return '(Unknown)';
  }

  listPollers() {
    this.setState({loading: true});
    let nodeId = this.nodeId;
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
