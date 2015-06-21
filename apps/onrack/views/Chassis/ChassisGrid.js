'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorate from 'common-web-ui/lib/decorate';
import mixin from 'react-mixin';
import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
/* eslint-enable no-unused-vars */

import {
    IconButton,
    DropDownIcon
  } from 'material-ui';
import EntityGrid from 'common-web-ui/views/EntityGrid';
import { chassis } from '../../actions/ChassisActions';

@decorate({
  propTypes: {
    filter: PropTypes.func
  },
  defaultProps: {
    filter: null
  }
})
@mixin.decorate(DeveloperHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
export default class ChassisGrid extends Component {

  state = {chassisList: []};

  componentWillMount() { this.profileTime('ChassisGrid', 'will-mount'); }

  componentDidMount() {
    this.profileTime('ChassisGrid', 'did-mount');
    var onError = this.refs.entityGrid.showError.bind(this.refs.entityGrid);
    this.unwatchChassis = chassis.watchAll('chassisList', this, onError);
    this.listChassis();
  }

  componentWillUnmount() {
    this.profileTime('ChassisGrid', 'will-unmount');
    this.unwatchChassis();
  }

  componentDidUnmount() { this.profileTime('EntityGrid', 'did-unmount'); }

  componentWillUpdate() { this.profileTime('ChassisGrid', 'will-update'); }

  componentDidUpdate() {
    this.profileTime('ChassisGrid', 'did-update');
    this.refs.entityGrid.update(this.chassisList);
  }

  render() {
    return (
      <div
          className="ChassisGrid">
        <EntityGrid
            ref="entityGrid"
            checkable={false}
            emptyContent="No chassis."
            headerContent="Chassis List"
            initialEntities={this.chassisList}
            tableFields={[
              { label: 'ID', property: 'id',
                func: (id) =>
                  <a href={this.routePath('chassis', id)}>{this.shortId(id)}</a>
              },
              { label: 'Name', property: 'name', default: 'Unknown' },
              { label: 'State', property: 'status.state', default: 'Unknown' },
              { label: 'Health', property: 'status.healthRollUp', default: 'Unknown' }
            ]}
            toolbarContent={null}
            routeName="chassis" />
      </div>
    );
  }

  get chassisList() {
    var chassisList = this.state.chassisList;
    if (this.props.filter) { return chassisList.filter(this.props.filter); }
    return chassisList;
  }

  listChassis() { return chassis.list(); }

  viewChassisDetails(id) { this.routeTo('chassis', id); }

}
