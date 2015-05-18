'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from '../../../../common/mixins/PageHelpers';
import DeveloperHelpers from '../../../../common/mixins/DeveloperHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import { chassis } from '../../actions/ChassisActions';

@mixin.decorate(PageHelpers)
@mixin.decorate(DeveloperHelpers)
export default class ChassisDetails extends Component {

  state = {chassis: null};

  componentDidMount() {
    this.profileTime('ChassisDetails', 'mount');
    this.unwatchChassis = chassis.watchOne(this.getChassisId(), 'chassis', this);
    this.readChassis();
  }

  componentWillUnmount() { this.unwatchChassis(); }

  componentDidUpdate() { this.profileTime('ChassisDetails', 'update'); }

  render() {
    return (
      <div className="ChassisDetails">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'chassis', label: 'Chassis'},
          this.getChassisId()
        )}
        <h2>Chassis</h2>
        {JSON.stringify(this.state.chassis)}
      </div>
    );
  }

  getChassisId() { return this.props.chassisId || this.props.params.chassisId; }

  readChassis() { return chassis.read(this.getChassisId()); }

  unwatchSystems() {}

}
