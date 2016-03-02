// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component } from 'react';

import mixin from 'rui-common/lib/mixin';
import DialogHelpers from 'rui-common/mixins/DialogHelpers';
import FormatHelpers from 'rui-common/mixins/FormatHelpers';

import EditPoller from './EditPoller';
import CreatePoller from './CreatePoller';
export { CreatePoller, EditPoller };

import {
    FlatButton,
    LinearProgress,
    List, ListItem,
    RaisedButton,
    Snackbar,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import JsonInspector from 'react-json-inspector';

import PollerStore from 'rui-common/stores/PollerStore';

@mixin(DialogHelpers, FormatHelpers)
export default class Poller extends Component {

  poller = new PollerStore();

  state = {
    poller: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchPoller = this.poller.watchOne(this.getPollerId(), 'poller', this);
    this.readPoller();
  }

  componentWillUnmount() { this.unwatchPoller(); }

  render() {
    let poller = this.state.poller || {};
    return (
      <div className="Poller">
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : null}
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <ToolbarTitle text="Poller Details" />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <RaisedButton
                label="Delete Poller"
                primary={true}
                onClick={this.deletePoller.bind(this)}
                disabled={this.state.loading} />
          </ToolbarGroup>
        </Toolbar>
        <div className="ungrid collapse">
          <div className="line">
            <div className="cell">
              <List>
                <ListItem
                  primaryText={poller.type || '(Unknown)'}
                  secondaryText="Type" />
                <ListItem
                  primaryText={this.fromNow(poller.lastStarted)}
                  secondaryText="Run" />
              </List>
            </div>
            <div className="cell">
              <List>
                <ListItem
                  primaryText={poller.failureCount || '0'}
                  secondaryText="Failures" />
              </List>
            </div>
          </div>
        </div>
        {/*<div style={{overflow: 'auto', margin: 10}}><JsonInspector
            search={false}
            isExpanded={() => true}
            data={this.state.poller || {}} /></div>*/}
        <EditPoller poller={this.state.poller} />
      </div>
    );
  }

  getPollerId() { return this.props.pollerId || this.props.params.pollerId; }

  readPoller() {
    this.setState({loading: true});
    this.poller.read(this.getPollerId()).then(() => this.setState({loading: false}));
  }

  deletePoller() {
    var id = this.state.poller.id;
    this.setState({loading: true});
    this.confirmDialog('Are you sure want to delete: ' + id,
      (confirmed) => confirmed ? this.pollers.destroy(id).then(() => this.routeBack()) : this.setState({loading: false}));
  }

}
