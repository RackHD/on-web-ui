// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import mixin from 'common-web-ui/lib/mixin';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import { RaisedButton, LinearProgress } from 'material-ui';

import ResourceTable from 'common-web-ui/views/ResourceTable';

import PollerStore from '../../stores/PollerStore';

@mixin(FormatHelpers, RouteHelpers)
export default class PollersGrid extends Component {

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
            console.log(poller);
            row.Type = <a href={this.routePath('pollers', poller.id)}>{poller.type.toUpperCase()}</a>;
            if (!this.nodeId) {
              row.Node = <a href={this.routePath('nodes', poller.node)}>{this.shortId(poller.node)}</a>;
            }
            row.Updated = this.fromNow(poller.updatedAt);
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
    if (this.nodeId) return this.routeTo('pollers', 'new', this.nodeId);
    this.routeTo('pollers', 'new');
  }

}
