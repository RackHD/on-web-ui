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
    TextField,
    FlatButton,
    RaisedButton
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
    poller: null,
    disabled: true
  };

  componentWillMount() {
    this.unwatchNodes = nodes.watchAll('nodes', this);
    nodes.list().then(() => this.setState({disabled: false}));
  }

  componentWillUnmount() {
    this.unwatchNodes();
  }

  render() {
    if (!this.state.poller) {
      this.state.poller = this.props.pollerRef || null;
    }
    this.state.poller = this.state.poller || {};
    let nodeOptions = [];
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
      <div className="EditPoller container">
        <div className="row">
          <div className="one-half column">
            {/*<TextField valueLink={nameLink}
                       hintText="Name"
                       floatingLabelText="Name"
                       disabled={this.state.disabled} />*/}
            <label>Type:</label>
            <Select
                name="type"
                value={this.state.poller && this.state.poller.type}
                placeholder="Select a type..."
                options={[
                  {value: 'ipmi', label: 'IPMI'},
                  {value: 'snmp', label: 'SNMP'}
                ]}
                onChange={(value) => {
                  let poller = this.state.poller;
                  poller.type = value;
                  this.setState({poller: poller})
                }} />
          </div>
          <div className="one-half column">
            <label>Node:</label>
            <Select
                name="node"
                value={this.state.poller && this.state.poller.node}
                placeholder="Select a node..."
                options={nodeOptions}
                onChange={(value) => {
                  let poller = this.state.poller;
                  poller.node = value;
                  this.setState({poller: poller})
                }} />
            <br/>
            <label>Poll Interval:</label>
            <Select
                name="node"
                value={this.state.poller && this.state.poller.pollInterval}
                placeholder="Select a polling interval..."
                options={[
                  {value: 1000, label: 'Every Second'},
                  {value: 5000, label: 'Every 5 Seconds'},
                  {value: 30000, label: 'Every 30 Seconds'},
                  {value: 60000, label: 'Every Minute'},
                  {value: 60000 * 5, label: 'Every 5 Minutes'},
                  {value: 60000 * 30, label: 'Every 30 Minutes'},
                  {value: 60000 * 60, label: 'Every Hour'},
                  {value: 60000 * 60 * 3, label: 'Every 3 Hours'},
                  {value: 60000 * 60 * 6, label: 'Every 6 Hours'},
                  {value: 60000 * 60 * 12, label: 'Every 12 Hours'},
                  {value: 60000 * 60 * 24, label: 'Every Day'},
                  {value: 60000 * 60 * 24 * 7, label: 'Every Week'},
                ]}
                onChange={(value) => {
                  let poller = this.state.poller;
                  poller.pollInterval = value;
                  this.setState({poller: poller})
                }} />
          </div>
        </div>

        <h3>JSON Editor</h3>
        <JsonEditor initialValue={this.state.poller}
                    updateParentState={this.updateStateFromJsonEditor.bind(this)}
                    disabled={this.state.disabled}
                    ref="jsonEditor" />
        <div className="buttons container">
          <FlatButton className="button"
                      label="Delete"
                      onClick={this.deletePoller.bind(this)}
                      disabled={this.state.disabled} />
          <FlatButton className="button"
                      label="Clone"
                      onClick={this.clonePoller.bind(this)}
                      disabled={true || this.state.disabled} />

          <div className="right">
            <FlatButton className="button"
                        label="Cancel"
                        onClick={this.routeBack}
                        disabled={this.state.disabled} />
            <RaisedButton className="button"
                          label="Reset"
                          onClick={this.resetPoller.bind(this)}
                          disabled={this.state.disabled} />
            <RaisedButton className="button"
                          label="Save" primary={true}
                          onClick={this.savePoller.bind(this)}
                          disabled={this.state.disabled} />
          </div>
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
      pollers.create(this.state.poller).then(() => this.enable());
    }
  }

  deletePoller() {
    var id = this.state.poller.id;
    this.disable();
    this.confirmDialog('Are you sure want to delete: ' + id,
      (confirmed) => confirmed && pollers.destroy(id).then(() => this.routeBack()));
  }

  resetPoller() {
    this.disable();
    pollers.read(this.state.poller.id)
      .then(poller => this.setState({poller: poller, disabled: false}));
  }

  clonePoller() {}// TODO

}
