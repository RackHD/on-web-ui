// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
import GridHelpers from 'common-web-ui/mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    RaisedButton,
    LinearProgress
  } from 'material-ui';

import PollerStore from '../stores/PollerStore';
let pollers = new PollerStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class PollersGrid extends Component {

  state = {
    pollers: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchPollers = pollers.watchAll('pollers', this);
    this.listPollers();
  }

  componentWillUnmount() { this.unwatchPollers(); }

  render() {
    return (
      <div className="PollersGrid">
        {this.renderGridToolbar({
          label: <a href={'#/pollers' + (this.nodeId ? '/n/' + this.nodeId : '')}>Pollers</a>,
          count: this.state.pollers && this.state.pollers.length || 0,
          right:
            <RaisedButton label="Create Poller" primary={true} onClick={this.createPoller.bind(this)} />
        })}
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix"></div>}
        {
          this.renderGrid({
            results: this.state.pollers,
            resultsPerPage: this.props.size || 50
          }, poller => (
            {
              ID: <a href={this.routePath('pollers', poller.id)}>{this.shortId(poller.id)}</a>,
              Node: <a href={this.routePath('nodes', poller.node)}>{this.shortId(poller.node)}</a>,
              Name: poller.name,
              Created: this.fromNow(poller.createdAt),
              Updated: this.fromNow(poller.updatedAt)
            }
          ), 'No pollers.')
        }
      </div>
    );
  }

  get nodeId() { return this.props.nodeId; }

  listPollers() {
    this.setState({loading: true});
    let nodeId = this.nodeId
    if (nodeId) {
      return pollers.listNode(nodeId).then(() => this.setState({loading: false}));
    }
    pollers.list().then(() => this.setState({loading: false}));
  }

  createPoller() {
    if (this.nodeId) return this.routeTo('pollers', 'new', this.nodeId);
    this.routeTo('pollers', 'new');
  }

}
