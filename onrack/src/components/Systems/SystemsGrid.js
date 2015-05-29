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
import { systems } from '../../actions/SystemActions';

@mixin.decorate(DeveloperHelpers)
@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
export default class SystemsGrid extends Component {

  state = {systemsList: []};
  selected = {};

  componentDidMount() {
    this.profileTime('SystemGrid', 'mount');
    this.unwatchSystems = systems.watchAll('systemsList', this);
    this.listSystems();
  }

  componentWillUnmount() { this.unwatchSystems(); }

  componentDidUpdate() {
    this.refs.table.update(this.state.systemsList);
    this.profileTime('SystemGrid', 'update');
  }

  render() {
    return (
      <div className="SystemsGrid">
        <DataTableToolbar
            style={{zIndex: 1}}
            label={<a href="#/systems">Systems List</a>}
            count={this.state.systemsList && this.state.systemsList.length || 0}>
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
            style={{width: '100%'}}
            fields={[
              { label: 'ID', property: 'id',
                func: (id) =>
                  <a href={this.routePath('systems', id)}>{this.shortId(id)}</a>
              },
              { label: 'Name', property: 'name', default: 'Unknown' },
              { label: 'State', property: 'status.state', default: 'Unknown' },
              { label: 'Health', property: 'status.healthRollUp', default: 'Unknown' },
              { label: 'Actions',
                func: (data) => [
                  <IconButton iconClassName="fa fa-info-circle"
                              tooltip="View System"
                              touch={true}
                              onClick={this.viewSystemDetails.bind(this, data.id)} />
              ] },
              { label: <Checkbox onCheck={this.checkAll.bind(this)} />,
                func: (data) =>
                  <Checkbox ref={'cb-' + data.id} onCheck={this.linkCheckbox.bind(this, data)} />
              }
            ]}
            initialData={this.state.systemsList}
            emptyContent="No systems." />
      </div>
    );
  }

  listSystems() { return systems.list(); }

  viewSystemDetails(id) { this.routeTo('systems', id); }

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
