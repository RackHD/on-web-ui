// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import EditorHelpers from 'common-web-ui/mixins/EditorHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
import GridHelpers from 'common-web-ui/mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import Select from 'react-select';

import {
    FlatButton,
    LinearProgress,
    RaisedButton,
    TextField,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import JsonEditor from 'common-web-ui/views/JsonEditor';

import PollerStore from '../stores/PollerStore';
let pollers = new PollerStore();

import NodeStore from '../stores/NodeStore';
let nodes = new NodeStore();

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(EditorHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class EditPoller extends Component {

  state = {
    poller: this.props.poller,
    disabled: !this.props.poller,
    loading: !this.props.poller
  };

  componentWillMount() {
    this.unwatchNodes = nodes.watchAll('nodes', this);
    nodes.list().then(() => this.setState({disabled: false}));
  }

  componentWillUnmount() {
    this.unwatchNodes();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.poller) this.setState({poller: nextProps.poller, loading: false, disabled: false});
  }

  render() {
    let poller = this.state.poller || {},
        nodeOptions = [];
    if (this.state.nodes && this.state.nodes.length) {
      this.state.nodes.forEach(node => {
        nodeOptions.push({
          label: node.name,
          value: node.id
        });
      })
    }
    // var nameLink = this.linkObjectState('poller', 'name');
    return (
      <div className="EditPoller">
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <ToolbarTitle text={poller.id ? 'Edit Poller' : 'Create Poller'} />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <RaisedButton
                label="Cancel"
                onClick={this.routeBack}
                disabled={this.state.disabled} />
            <RaisedButton
                label="Save"
                primary={true}
                onClick={this.savePoller.bind(this)}
                disabled={this.state.disabled} />
          </ToolbarGroup>
        </Toolbar>
        {this.state.loading ? <LinearProgress mode="indeterminate" /> : <div className="clearfix" />}
        <div style={{padding: '0 10px 10px'}}>
          <h5 style={{margin: '15px 0 5px', color: '#666'}}>Type:</h5>
          <Select
              name="type"
              value={poller.type}
              placeholder="Select a type..."
              disabled={this.state.disabled}
              options={[
                {value: 'ipmi', label: 'IPMI'},
                {value: 'snmp', label: 'SNMP'}
              ]}
              onChange={(value) => {
                let poller = this.state.poller;
                poller.type = value;
                this.setState({poller: poller})
              }} />
          <h5 style={{margin: '15px 0 5px', color: '#666'}}>Node:</h5>
          <Select
              name="node"
              value={poller.node}
              placeholder="Select a node..."
              disabled={this.state.disabled}
              options={nodeOptions}
              onChange={(value) => {
                let poller = this.state.poller;
                poller.node = value;
                this.setState({poller: poller})
              }} />
          <h5 style={{margin: '15px 0 5px', color: '#666'}}>Poll Interval:</h5>
          <Select
              name="node"
              value={poller.pollInterval && poller.pollInterval.toString()}
              placeholder="Select a polling interval..."
              disabled={this.state.disabled}
              options={[
                {value: '1000', label: 'Every Second'},
                {value: '5000', label: 'Every 5 Seconds'},
                {value: '30000', label: 'Every 30 Seconds'},
                {value: '60000', label: 'Every Minute'},
                {value: '' + (60000 * 5), label: 'Every 5 Minutes'},
                {value: '' + (60000 * 30), label: 'Every 30 Minutes'},
                {value: '' + (60000 * 60), label: 'Every Hour'},
                {value: '' + (60000 * 60 * 3), label: 'Every 3 Hours'},
                {value: '' + (60000 * 60 * 6), label: 'Every 6 Hours'},
                {value: '' + (60000 * 60 * 12), label: 'Every 12 Hours'},
                {value: '' + (60000 * 60 * 24), label: 'Every Day'},
                {value: '' + (60000 * 60 * 24 * 7), label: 'Every Week'},
              ]}
              onChange={(value) => {
                let poller = this.state.poller;
                poller.pollInterval = value;
                this.setState({poller: poller})
              }} />
            <h5 style={{margin: '15px 0 5px', color: '#666'}}>Poller JSON:</h5>
            <JsonEditor
                initialValue={this.state.poller}
                updateParentState={this.updateStateFromJsonEditor.bind(this)}
                disabled={this.state.disabled}
                ref="jsonEditor" />
          </div>
      </div>
    );
  }

  updateStateFromJsonEditor(stateChange) {
    this.setState({poller: stateChange});
  }

  savePoller() {
    this.disable();
    if (this.state.poller.id) {
      pollers.update(this.state.poller.id, this.state.poller).then(() => this.enable());
    }
    else {
      pollers.create(this.state.poller).then(() => this.routeBack());
    }
  }

  // resetPoller() {
  //   this.disable();
  //   pollers.read(this.state.poller.id)
  //     .then(poller => this.setState({poller: poller, disabled: false}));
  // }

}
