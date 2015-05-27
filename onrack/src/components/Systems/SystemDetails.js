'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
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

  componentDidUpdate() { this.profileTime('SystemDetails', 'update'); }

  render() {
    var system = this.state.system || {};
    return (
      <div className="SystemDetails">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'systems', label: 'System'},
          this.getSystemId()
        )}
        <h2>System</h2>
        <h3>{system.name || 'Unknown'}</h3>
        <div>{system.type || 'Unknown'}</div>
        <div>{this.longDate(system.modified)}</div>
        <div>{JSON.stringify(system)}</div>
        {system.chassis ? <ChassisDetails chassisId={system.chassis} /> : null}
      </div>
    );
  }

  getSystemId() { return this.props.systemId || this.props.params.systemId; }

  readSystem() { return systems.read(this.getSystemId()); }

  readChassis(id) { return chassis.read(id); }

}
