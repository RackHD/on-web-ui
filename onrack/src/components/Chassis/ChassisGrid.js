'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
/* eslint-enable no-unused-vars */

import {
    IconButton,
    DropDownIcon
  } from 'material-ui';
import EntityGrid from 'common-web-ui/components/EntityGrid';
import { chassis } from '../../actions/ChassisActions';

@mixin.decorate(DeveloperHelpers)
@mixin.decorate(DialogHelpers)
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
    this.refs.entityGrid.update(this.state.chassisList);
  }

  render() {
    return (
      <div
          className="ChassisGrid">
        <EntityGrid
            ref="entityGrid"
            emptyContent="No chassis."
            headerContent="Chassis List"
            initialEntities={this.state.chassisList}
            tableFields={[
              { label: 'ID', property: 'id',
                func: (id) =>
                  <a href={this.routePath('chassis', id)}>{this.shortId(id)}</a>
              },
              { label: 'Name', property: 'name', default: 'Unknown' },
              { label: 'State', property: 'status.state', default: 'Unknown' },
              { label: 'Health', property: 'status.healthRollUp', default: 'Unknown' },
              { label: 'Actions',
                func: (data) => [
                  <IconButton iconClassName="fa fa-info-circle"
                              tooltip="View Chassis"
                              touch={true}
                              onClick={this.viewChassisDetails.bind(this, data.id)} />
              ] }
            ]}
            toolbarContent={
              <DropDownIcon
                  iconClassName="fa fa-wrench"
                  menuItems={[
                    { payload: '1', text: 'Reset' },
                    { payload: '2', text: <span>Boot&nbsp;Image</span> }
                  ]}
                  style={{zIndex: 1}} />
            }
            routeName="chassis" />
      </div>
    );
  }

  listChassis() { return chassis.list(); }

  viewChassisDetails(id) { this.routeTo('chassis', id); }

}
