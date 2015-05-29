'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import JsonEditor from 'common-web-ui/components/JsonEditor';
import { systems } from '../../actions/SystemActions';
import { chassis } from '../../actions/ChassisActions';
import ChassisDetails from '../Chassis/ChassisDetails';

@mixin.decorate(PageHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(DeveloperHelpers)
export default class SystemDetails extends Component {

  state = {
    system: systems.get(this.getSystemId()) || null,
    chassis: null
  };

  componentDidMount() {
    this.profileTime('SystemDetails', 'mount');
    this.unwatchSystem = systems.watchOne(this.getSystemId(), 'system', this);
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
          this.getSystemId()
        )}
        <h3 className="right">{system.type || 'Unknown type.'}</h3>
        <h2>{system.name || 'Unknown system.'}</h2>
        <div className="clearfix">Modified: {this.longDate(system.modified)}</div>
        <div className="container">
          <div className="two columns">
            <h4>BMC Information</h4>
            <ul>
              <li>Hostname: NodeName</li>
              <li>IP Address: X.X.X.X</li>
              <li>MAC Address: XXXXXXXXX</li>
              <li>Firmware Version: X.XX</li>
            </ul>
            <h4>Server Actions</h4>
            <ul>
              <li>Power On Server</li>
              <li>Shutdown Server</li>
              <li>Power Off Server</li>
              <li>Restart Server</li>
              <li>Reset Server</li>
              <li>Launch KVM Console</li>
              <li>Map Virtual Media</li>
              <li>Turn On Locator LED</li>
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
              <li>Power State: On</li>
              <li>Server Status: Good</li>
              <li>Processors: Good</li>
              <li>Memory: Good</li>
              <li>Power Supply: Good</li>
              <li>Locator LED: Off</li>
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
        {system.chassis ? <ChassisDetails chassisId={system.chassis} /> : null}
      </div>
    );
  }

  getSystemId() { return this.props.systemId || this.props.params.systemId; }

  readSystem() { return systems.read(this.getSystemId()); }

  readChassis(id) { return chassis.read(id); }

  updateSystem(system) { this.setState({system: system}); }

}
