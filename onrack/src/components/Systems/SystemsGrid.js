'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from '../../../../common/mixins/DialogHelpers';
import FormatHelpers from '../../../../common/mixins/FormatHelpers';
import RouteHelpers from '../../../../common/mixins/RouteHelpers';
import GridHelpers from '../../../../common/mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    IconButton
  } from 'material-ui';
import { systems } from '../../actions/SystemActions';

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class SystemsGrid extends Component {

  state = {systemsList: null};

  componentDidMount() {
    this.unwatchSystems = systems.watchAll('systemsList', this);
    this.listSystems();
  }

  componentWillUnmount() { this.unwatchSystems(); }

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
          }, systemsItem => (
            {
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
            }
          ), 'No systems.')
        }
      </div>
    );
  }

  listSystems() { systems.list(); }

  viewSystemDetails(id) { this.routeTo('systems', id); }

}
