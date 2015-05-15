'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from '../../../../common/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import { chassis } from '../../actions/ChassisActions';

@mixin.decorate(PageHelpers)
export default class ChassisDetails extends Component {

  state = {chassis: null};

  componentDidMount() {
    this.unwatchNode = chassis.watchOne(this.getChassisId(), 'chassis', this);
    this.readNode();
  }

  componentWillUnmount() { this.unwatchNode(); }

  render() {
    return (
      <div className="ChassisDetails">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'nodes', label: 'Chassis'},
          this.getChassisId()
        )}
        {JSON.stringify(this.state.chassis)}
      </div>
    );
  }

  getChassisId() { return this.props.params.chassisId; }

  readNode() { chassis.read(this.getChassisId()); }

}
