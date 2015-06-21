'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';
/* eslint-enable no-unused-vars */

import {
    FlatButton,
    Toggle
  } from 'material-ui';
import JsonEditor from 'common-web-ui/views/JsonEditor';
import ErrorNotification from 'common-web-ui/views/ErrorNotification';
import { systems, systemResetActions } from '../../actions/SystemActions';
import { chassis } from '../../actions/ChassisActions';
import ChassisDetails from '../Chassis/ChassisDetails';

@mixin.decorate(PageHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(DeveloperHelpers)
export default class SystemDetails extends Component {

  state = {
    system: systems.get(this.systemId) || null,
    chassis: null
  };

  componentDidMount() {
    this.profileTime('SystemDetails', 'mount');
    var onError = this.refs.error.showError.bind(this.refs.error);
    this.unwatchSystem = systems.watchOne(this.systemId, 'system', this, onError);
    this.readSystem();
  }

  componentWillUnmount() { this.unwatchSystem(); }

  componentDidUpdate() {
    this.profileTime('SystemDetails', 'update');
    this.refs.system.setState({value: this.state.system});
  }

  render() {
    var system = this.state.system || {};
    return (
      <div className="SystemDetails">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'systems', label: 'System'},
          this.systemId
        )}
        <h3 className="right">{system.type || 'Unknown type.'}</h3>
        <h2>{system.name || 'Unknown system.'}</h2>
        <div className="clearfix">Modified: {this.longDate(system.modified)}</div>
        <ErrorNotification ref="error"/>
        <div className="container">
          <div className="two columns">
            <Toggle
                defaultToggled={true}
                name="powerState"
                value="On"
                label="Power:" />
            <Toggle
                name="powerState"
                value="On"
                label="Locator LED:" />
            <h4>BMC Information</h4>
            <ul>
              <li>Hostname: NodeName</li>
              <li>IP Address: X.X.X.X</li>
              <li>MAC Address: XXXXXXXXX</li>
              <li>Firmware Version: X.XX</li>
            </ul>
            <h4>Server Actions</h4>
            <ul>
              {this.availableActions}
              <li>Launch KVM Console</li>
              <li>Map Virtual Media</li>
            </ul>

          </div>
          <div className="eight columns">
            <JsonEditor
                initialValue={system}
                updateParentState={this.updateSystem.bind(this)}
                disabled={this.state.disabled}
                ref="system" />
          </div>
          <div className="two columns">
            <h4>Server Status</h4>
            <ul>
              <li>Server Status: Good</li>
              <li>Processors: Good</li>
              <li>Memory: Good</li>
              <li>Power Supply: Good</li>
            </ul>
            <h4>Server Properties</h4>
            <ul>
              <li>Node Model: Model Name</li>
              <li>Serial Number: XXX-XXX-XXXX</li>
              <li>UUID: XXXX-XXXX-XXXXXX</li>
              <li>BIOS Version: XXX-XXX</li>
              <li>Description: Lala Foofoo</li>
            </ul>
          </div>
        </div>
        {system.chassis ? <ChassisDetails
            chassisId={system.chassis} showSystems={false} /> : null}
      </div>
    );
  }

  get systemId() { return this.props.systemId || this.props.params.systemId; }

  readSystem() { return systems.read(this.systemId); }

  readChassis(id) { return chassis.read(id); }

  updateSystem(system) { this.setState({system: system}); }

  get availableActions() {
    var system = this.state.system;
    function computerSystemResetActionTest(type) {
      var a = system && system.actions;
      a = a && a['ComputerSystem.Reset'];
      a = a && a.reset_type;
      return a && a.indexOf(type) !== -1;
    }
    var availableActions = [
      {
        filter: () => computerSystemResetActionTest('ForceOn'),
        button: (
          <li>
            <FlatButton
                label="Power On Server"
                onClick={() =>
                  systemResetActions.sendReset(this.systemId, 'ForceOn')
                } />
          </li>
        )
      },
      {
        filter: () => computerSystemResetActionTest('ForceOff'),
        button: (
          <li>
            <FlatButton
                label="Power Off Server"
                onClick={() =>
                  systemResetActions.sendReset(this.systemId, 'ForceOff')
                } />
          </li>
        )
      },
      {
        filter: () => computerSystemResetActionTest('ForceRestart'),
        button: (
          <li>
            <FlatButton
                label="Reset Server"
                onClick={() =>
                  systemResetActions.sendReset('ForceRestart')
                } />
          </li>
        )
      },
      {
        filter: () => computerSystemResetActionTest('GracefulRestart'),
        button: (
          <li>
            <FlatButton
                label="Restart Server"
                onClick={() =>
                  systemResetActions.sendReset(this.systemId, 'GracefulRestart')
                } />
          </li>
        )
      },
      {
        filter: () => true,
        button: (
          <li>
            <FlatButton
                label="Toggle Locator LED"
                onClick={() => null} />
          </li>
        )
      },
      {
        filter: () => false,
        button: (
          <li>
            <FlatButton
                label="Boot Image"
                onClick={() => null} />
          </li>
        )
      }
    ];
    availableActions = availableActions.filter((action) => {
      return action.filter && action.filter();
    });
    return availableActions;
  }

}
