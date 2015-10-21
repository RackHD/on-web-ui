// Copyright 2015, EMC, Inc.

'use strict';

/* eslint-disable no-unused-vars */
import React, { Component, PropTypes } from 'react';
import decorate from 'common-web-ui/lib/decorate';
import mixin from 'common-web-ui/lib/mixin';
import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
/* eslint-enable no-unused-vars */

import {
    // IconButton,
    DropDownIcon
  } from 'material-ui';
import EntityGrid from 'common-web-ui/views/EntityGrid';

import SystemsStore from '../stores/SystemsStore';
import SystemResetTypesStore from '../stores/SystemResetTypesStore';

let systems = new SystemsStore();
let systemResetActions = new SystemResetTypesStore();

@decorate({
  propTypes: {
    filter: PropTypes.func
  },
  defaultProps: {
    filter: null
  }
})
@mixin(DeveloperHelpers)
@mixin(FormatHelpers)
@mixin(RouteHelpers)
export default class SystemsGrid extends Component {

  state = {
    systemsList: [],
    selected: 0
  };

  componentWillMount() { this.profileTime('SystemGrid', 'will-mount'); }

  componentDidMount() {
    this.profileTime('SystemGrid', 'did-mount');
    var onError = this.refs.entityGrid.showError.bind(this.refs.entityGrid);
    this.unwatchSystems = systems.watchAll('systemsList', this, onError);
    this.listSystems();
  }

  componentWillUnmount() {
    this.profileTime('ChassisGrid', 'will-unmount');
    this.unwatchSystems();
  }

  componentWillUpdate() { this.profileTime('SystemGrid', 'will-update'); }

  componentDidUpdate() {
    this.profileTime('SystemGrid', 'did-update');
    this.refs.entityGrid.update(this.systemsList);
  }

  render() {
    var s = this.state.selected,
        a = s && this.availableActions;
    return (
      <div
          className="SystemsGrid">
        <EntityGrid
            ref="entityGrid"
            emptyContent="No systems."
            headerContent="Systems List"
            initialEntities={this.systemsList}
            tableFields={[
              { label: 'ID', property: 'id',
                func: (id) =>
                  <a href={this.routePath('systems', id)}>{this.shortId(id)}</a>
              },
              { label: 'Name', property: 'name', default: 'Unknown' },
              { label: 'State', property: 'status.state', default: 'Unknown' },
              { label: 'Health', property: 'status.healthRollUp', default: 'Unknown' }
            ]}
            onSelectionChange={this.onSelectionChange.bind(this)}
            toolbarContent={s && a.length ?
              <DropDownIcon
                  onChange={this.onSelectAction.bind(this)}
                  iconClassName="fa fa-wrench"
                  menuItems={a} />
              : null
            }
            routeName="systems" />
      </div>
    );
  }

  get systemsList() {
    var systemsList = this.state.systemsList;
    if (this.props.filter) { return systemsList.filter(this.props.filter); }
    return systemsList;
  }

  listSystems() { return systems.list(); }

  viewSystemDetails(id) { this.routeTo('systems', id); }

  onSelectionChange(selected) {
    this.setState({selected: Object.keys(selected).length});
  }

  onSelectAction(event, selectedIndex, action) {
    if (action && action.take) {
      var selected = this.refs.entityGrid.selected;
      selected = Object.keys(selected).map((id) => selected[id]);
      selected.forEach((system) => {
        action.take(system, event);
      });
      this.refs.entityGrid.checkAll({target: {checked: false}});
    }
  }

  get availableActions() {
    function computerSystemResetActionTest(data, type) {
      var a = data.actions;
      a = a && a['ComputerSystem.Reset'];
      a = a && a.reset_type;
      return a && a.indexOf(type) !== -1;
    }
    var nowrap = {whiteSpace: 'nowrap'};
    var availableActions = [
        {
          text: <strong style={nowrap}>System Actions:</strong>,
          test: () => true
        },
        {
          text: <span style={nowrap}>Power On Server</span>,
          test: (data) => computerSystemResetActionTest(data, 'ForceOn'),
          take: (data) => systemResetActions.sendReset(data.id, 'ForceOn')
        },
        {
          text: <span style={nowrap}>Power Off Server</span>,
          test: (data) => computerSystemResetActionTest(data, 'ForceOff'),
          take: (data) => systemResetActions.sendReset(data.id, 'ForceOff')
        },
        {
          text: <span style={nowrap}>Reset Server</span>,
          test: (data) => computerSystemResetActionTest(data, 'ForceRestart'),
          take: (data) => systemResetActions.sendReset(data.id, 'ForceRestart')
        },
        {
          text: <span style={nowrap}>Restart Server</span>,
          test: (data) => computerSystemResetActionTest(data, 'GracefulRestart'),
          take: (data) => systemResetActions.sendReset(data.id, 'GracefulRestart')
        },
        {
          text: <span style={nowrap}>Toggle Locator LED</span>,
          test: () => true,
          take: () => null
        },
        {
          text: <span style={nowrap}>Boot Image</span>,
          test: () => false,
          take: () => null
        }
    ];
    var selected = this.refs.entityGrid.selected;
    selected = Object.keys(selected).map((id) => selected[id]);
    selected.forEach((system) => {
      availableActions = availableActions.filter((action) => {
        return action.test && action.test(system);
      });
    });
    return availableActions;
  }

}
