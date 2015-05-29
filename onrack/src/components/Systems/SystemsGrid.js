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
import { systems } from '../../actions/SystemActions';

@mixin.decorate(DeveloperHelpers)
@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
export default class SystemsGrid extends Component {

  state = {systemsList: []};
  selected = {};

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

  componentDidUnmount() { this.profileTime('SystemGrid', 'did-unmount'); }

  componentWillUpdate() { this.profileTime('SystemGrid', 'will-update'); }

  componentDidUpdate() {
    this.profileTime('SystemGrid', 'did-update');
    this.refs.entityGrid.update(this.state.systemsList);
  }

  render() {
    return (
      <div
          className="SystemsGrid">
        <EntityGrid
            ref="entityGrid"
            emptyContent="No systems."
            headerContent="Systems List"
            initialEntities={this.state.systemsList}
            tableFields={[
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
            routeName="systems" />
      </div>
    );
  }

  listSystems() { return systems.list(); }

  viewSystemDetails(id) { this.routeTo('systems', id); }

}
