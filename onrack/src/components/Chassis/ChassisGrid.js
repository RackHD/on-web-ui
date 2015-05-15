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
import { chassis } from '../../actions/ChassisActions';

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class ChassisGrid extends Component {

  state = {chassisList: null};

  componentDidMount() {
    this.unwatchNodes = chassis.watchAll('chassisList', this);
    this.listChassis();
  }

  componentWillUnmount() { this.unwatchNodes(); }

  render() {
    return (
      <div className="ChassisGrid">
        {this.renderGridToolbar({
          label: <a href="#/chassis">Chassis List</a>,
          count: this.state.chassisList && this.state.chassisList.length || 0,
          createButton: null
        })}
        <div className="clearfix"></div>
        {
          this.renderGrid({
            results: this.state.chassisList,
            resultsPerPage: 10
          }, chassisItem => (
            {
              ID: <a href={this.routePath('chassis', chassisItem.id)}>{this.shortId(chassisItem.id)}</a>,
              Name: chassisItem.name || 'Unknown',
              Type: chassisItem.type,
              Actions: [
                <IconButton iconClassName="fa fa-info-circle"
                            tooltip="View Chassis"
                            touch={true}
                            onClick={this.viewChassisDetails.bind(this, chassisItem.id)} />
              ]
            }
          ), 'No chassis.')
        }
      </div>
    );
  }

  listChassis() { chassis.list(); }

  viewChassisDetails(id) { this.routeTo('chassis', id); }

}
