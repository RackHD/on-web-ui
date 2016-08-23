// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';

import Select from 'react-select';

import {
    FlatButton,
    LinearProgress,
    RaisedButton,
    TextField,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import JsonEditor from 'src-common/views/JsonEditor';

import PollerStore from 'src-common/stores/PollerStore';
import NodeStore from 'src-common/stores/NodeStore';

export default class EditPoller extends Component {

  static contextTypes = {router: PropTypes.any};

  pollers = new PollerStore();
  nodes = new NodeStore();

  state = {
    poller: this.props.poller,
    disabled: !this.props.poller,
    loading: !this.props.poller
  };

  componentWillMount() {
    this.unwatchNodes = this.nodes.watchAll('nodes', this);
    this.nodes.list().then(() => this.setState({disabled: false}));
  }

  componentWillUnmount() {
    this.unwatchNodes();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.poller) {
      this.setState({
        poller: nextProps.poller,
        loading: false,
        disabled: false
      });
    }
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
      });
    }
    return (
      <div className="EditPoller">
        <Toolbar>
          <ToolbarGroup key={0} firstChild={true}>
            <ToolbarTitle text={poller.id ? 'Edit Poller' : 'Create Poller'} />
          </ToolbarGroup>
          <ToolbarGroup key={1} lastChild={true}>
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
        <LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />
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
              onChange={(option) => {
                let poller = this.state.poller;
                poller.type = option && option.value;
                this.setState({ poller });
              }} />
          <h5 style={{margin: '15px 0 5px', color: '#666'}}>Node:</h5>
          <Select
              name="node"
              value={poller.node}
              placeholder="Select a node..."
              disabled={this.state.disabled}
              options={nodeOptions}
              onChange={(option) => {
                let poller = this.state.poller;
                poller.node = option && option.value;
                this.setState({ poller });
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
                {value: '' + (60000 * 60 * 24 * 7), label: 'Every Week'}
              ]}
              onChange={(option) => {
                let poller = this.state.poller;
                poller.pollInterval = option && option.value;
                this.setState({ poller });
              }} />
            <h5 style={{margin: '15px 0 5px', color: '#666'}}>Poller JSON:</h5>
            <JsonEditor
                value={this.state.poller}
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
      this.pollers.update(this.state.poller.id, this.state.poller).then(() => this.enable());
    }
    else {
      this.pollers.create(this.state.poller).then(() => this.context.router.goBack());
    }
  }

  disable() { this.setState({disabled: true}); }

  enable() {
    setTimeout(() => this.setState({disabled: false}), 500);
  }

}
