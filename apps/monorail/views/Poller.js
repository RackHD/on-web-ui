'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

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

import PollerStore from '../stores/PollerStore';
let poller = new PollerStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(PageHelpers)
export default class Poller extends Component {

  state = {
    poller: null,
    loading: true
  };

  componentDidMount() {
    this.unwatchPoller = poller.watchOne(this.getPollerId(), 'poller', this);
    this.readPoller();
  }

  componentWillUnmount() { this.unwatchPoller(); }

  render() {
    let poller = this.state.poller || {};
    return (
      <div className="Poller">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'pollers', label: 'Pollers'},
          this.getPollerId()
        )}
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
        <div className="ungrid">
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
    poller.read(this.getPollerId()).then(() => this.setState({loading: false}));
  }

  deletePoller() {
    var id = this.state.poller.id;
    this.setState({loading: true});
    this.confirmDialog('Are you sure want to delete: ' + id,
      (confirmed) => confirmed ? pollers.destroy(id).then(() => this.routeBack()) : this.setState({loading: false}));
  }

}
