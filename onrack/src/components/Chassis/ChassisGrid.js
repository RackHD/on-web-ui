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
    Checkbox,
    DropDownIcon
  } from 'material-ui';
import DataTable from 'common-web-ui/components/DataTable';
import DataTableToolbar from 'common-web-ui/components/DataTableToolbar';
import { chassis } from '../../actions/ChassisActions';

@mixin.decorate(DeveloperHelpers)
@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
export default class ChassisGrid extends Component {

  state = {chassisList: []};
  selected = {};

  componentDidMount() {
    this.profileTime('ChassisGrid', 'mount');
    this.unwatchChassis = chassis.watchAll('chassisList', this);
    this.listChassis();
  }

  componentWillUnmount() { this.unwatchChassis(); }

  componentDidUpdate() {
    this.refs.table.update(this.state.chassisList);
    this.profileTime('ChassisGrid', 'update');
  }

  render() {
    return (
      <div className="ChassisGrid">
      <DataTableToolbar
          style={{zIndex: 1}}
          label={<a href="#/chassis">Chassis List</a>}
          count={this.state.chassisList && this.state.chassisList.length || 0}>
        <DropDownIcon
            iconClassName="fa fa-wrench"
            menuItems={[
              { payload: '1', text: 'Reset' },
              { payload: '2', text: <span>Boot&nbsp;Image</span> }
            ]}
            style={{zIndex: 1}} />
      </DataTableToolbar>
      <div className="clearfix"></div>
      <DataTable
          ref="table"
          style={{
            zIndex: 1,
            width: '100%'
          }}
          fields={[
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
            ] },
            { label: <Checkbox onCheck={this.checkAll.bind(this)} />,
              func: (data) =>
                <Checkbox ref={'cb-' + data.id} onCheck={this.linkCheckbox.bind(this, data)} />
            }
          ]}
          initialData={this.state.chassisList}
          emptyContent="No chassis." />
      </div>
    );
  }

  listChassis() { return chassis.list(); }

  viewChassisDetails(id) { this.routeTo('chassis', id); }

  checkAll(event) {
    this.state.systemsList.forEach(system => {
      var checkbox = this.refs.table.refs['cb-' + system.id];
      if (checkbox) {
        checkbox.setChecked(event.target.checked);
      }
    });
  }

  linkCheckbox(item, event) {
    if (event.target.checked) {
      this.selected[item.id] = item;
    }
    else {
      delete this.selected[item.id];
    }
  }

}
