'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorateComponent from 'common-web-ui/lib/decorateComponent';
import mixin from 'react-mixin';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import JsonEditor from 'common-web-ui/components/JsonEditor';
import ErrorNotification from 'common-web-ui/components/ErrorNotification';
import SystemsGrid from '../Systems/SystemsGrid';
import { chassis } from '../../actions/ChassisActions';

@decorateComponent({
  propTypes: {
    showSystems: PropTypes.bool
  },
  defaultProps: {
    showSystems: true
  }
})
@mixin.decorate(PageHelpers)
@mixin.decorate(DeveloperHelpers)
export default class ChassisDetails extends Component {

  state = {chassis: null};

  componentDidMount() {
    this.profileTime('ChassisDetails', 'mount');
    var onError = this.refs.error.showError.bind(this.refs.error);
    this.unwatchChassis = chassis.watchOne(this.getChassisId(), 'chassis', this, onError);
    this.readChassis();
  }

  componentWillUnmount() { this.unwatchChassis(); }

  componentDidUpdate() {
    this.profileTime('ChassisDetails', 'update');
    this.refs.chassis.setState({value: this.state.chassis});
  }

  render() {
    return (
      <div className="ChassisDetails">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'chassis', label: 'Chassis'},
          this.getChassisId()
        )}
        <h2>Chassis</h2>
        <ErrorNotification ref="error"/>
        <JsonEditor
            initialValue={this.state.chassis}
            updateParentState={this.updateChassis.bind(this)}
            disabled={this.state.disabled}
            ref="chassis" />
        {this.props.showSystems ? <SystemsGrid
            filter={this.filterComputeSystems.bind(this)} /> : null}
      </div>
    );
  }

  filterComputeSystems(system) {
    var computeSystems = this.state.chassis && this.state.chassis.computeSystems || [];
    if (!system) { return false; }
    return computeSystems.indexOf(system.id) !== -1;
  }

  getChassisId() { return this.props.chassisId || this.props.params.chassisId; }

  readChassis() { return chassis.read(this.getChassisId()); }

  updateChassis(data) {
    this.setState({chassis: data});
  }

}
