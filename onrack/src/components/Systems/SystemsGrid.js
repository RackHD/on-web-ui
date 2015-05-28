'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
import GridHelpers from 'common-web-ui/mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    IconButton,
    Checkbox
  } from 'material-ui';
import { systems } from '../../actions/SystemActions';

@mixin.decorate(DeveloperHelpers)
@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class SystemsGrid extends Component {

  state = {systemsList: null};
  selected = {};

  componentDidMount() {
    this.profileTime('SystemGrid', 'mount');
    this.unwatchSystems = systems.watchAll('systemsList', this);
    this.listSystems();
  }

  componentWillUnmount() { this.unwatchSystems(); }

  componentDidUpdate() { this.profileTime('SystemGrid', 'update'); }

  render() {
    return (
      <div className="SystemsGrid">
        {this.renderGridToolbar({
          label: <a href="#/systems">Systems List</a>,
          count: this.state.systemsList && this.state.systemsList.length || 0,
          createButton: null
        })}
        <div className="clearfix"></div>
        {
          this.renderGrid({
            results: this.state.systemsList,
            resultsPerPage: 10
          }, systemsItem => {
            return {
              ' ': <Checkbox onCheck={this.linkCheckbox.bind(this, systemsItem)} />,
              ID: <a href={this.routePath('systems', systemsItem.id)}>{this.shortId(systemsItem.id)}</a>,
              Name: systemsItem.name || 'Unknown',
              State: systemsItem.status && systemsItem.status.state || 'Unknown',
              Health: systemsItem.status && systemsItem.status.healthRollUp || 'Unknown',
              Actions: [
                <IconButton iconClassName="fa fa-info-circle"
                            tooltip="View System"
                            touch={true}
                            onClick={this.viewSystemDetails.bind(this, systemsItem.id)} />
              ]
            };
          }, 'No systems.')
        }
      </div>
    );
  }

  linkCheckbox(item, event) {
    if (event.target.checked) {
      this.selected[item.id] = item;
    }
    else {
      delete this.selected[item.id];
    }
  }

  listSystems() { return systems.list(); }

  viewSystemDetails(id) { this.routeTo('systems', id); }

}
