// Copyright 2015, EMC, Inc.

import React, { Component } from 'react';

import FormatHelpers from 'src-common/lib/FormatHelpers';
import ConfirmDialog from 'src-common/views/ConfirmDialog';

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

import PollerStore from 'src-common/stores/PollerStore';

export default class Poller extends Component {

  pollers = new PollerStore();

  state = {
    confirmDelete: false,
    loading: true,
    poller: null
  };

  componentDidMount() {
    this.unwatchPoller = this.pollers.watchOne(this.getPollerId(), 'poller', this);
    this.readPoller();
  }

  componentWillUnmount() { this.unwatchPoller(); }

  render() {
    let poller = this.state.poller || {};
    return (
      <div className="Poller">
        <LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />

        <ConfirmDialog
            open={this.state.confirmDelete}
            callback={confirmed => {
              if (confirmed) {
                return this.pollers.destroy(poller.id).
                  then(() => this.context.router.goBack());
              }
              this.setState({loading: false, confirmDelete: false});
            }}>
          Are you sure want to delete this Poller? "{poller.id}"
        </ConfirmDialog>

        <Toolbar>
          <ToolbarGroup key={0} firstChild={true}>
            <ToolbarTitle text="Poller Details" />
          </ToolbarGroup>
          <ToolbarGroup key={1} lastChild={true}>
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
                  primaryText={FormatHelpers.fromNow(poller.lastStarted)}
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
    this.pollers.read(this.getPollerId()).then(() => this.setState({loading: false}));
  }

  deletePoller() {
    this.setState({loading: true, confirmDelete: true});
  }

}
