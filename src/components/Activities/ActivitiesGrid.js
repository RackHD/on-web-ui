'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from '../mixins/DialogHelpers';
import FormatHelpers from '../mixins/FormatHelpers';
import RouteHelpers from '../mixins/RouteHelpers';
import GridHelpers from '../mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    IconButton,
    RaisedButton
  } from 'material-ui';
import ActivityActions, { activities } from '../../actions/ActivityActions';

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class ActivitiesGrid extends Component {

  state = {
    activities: null
  };

  componentDidMount() {
    activities.on('change', () => this.setState({
      activities: activities.all()
    }));

    ActivityActions.add5();

    this.getActivities();
  }

  render() {
    return (
      <div className="ActivitiesGrid">
        {this.renderGridToolbar({
          label: <a href="#/activities">Activities</a>,
          count: this.state.activities && this.state.activities.length || 0,
          createButton:
            <RaisedButton label="Create Activity" primary={true} onClick={this.createActivity.bind(this)} />
        })}
        <div className="clearfix"></div>
        {
          this.renderGrid({
            results: this.state.activities,
            resultsPerPage: 10
          }, activity => (
            {
              ID: <a href={this.routePath('activities', activity.id)}>{this.shortId(activity.id)}</a>,
              Status: activity.status,
              Actions: [
                <IconButton iconClassName="fa fa-edit"
                            tooltip="Edit Activity"
                            touch={true}
                            onClick={this.editActivity.bind(this, activity.id)} />,
                <IconButton iconClassName="fa fa-remove"
                            tooltip="Remove Activity"
                            touch={true}
                            onClick={this.deleteActivity.bind(this, activity.id)} />
              ]
            }
          ), 'No activities.')
        }
      </div>
    );
  }

  getActivities() {
    activities.list();
  }

  editActivity(id) { this.routeTo('activities', id); }

  createActivity() { this.routeTo('activities', 'new'); }

  deleteActivity(id) {
    this.confirmDialog('Are you sure want to delete: ' + id, (confirmed) => {
      if (!confirmed) { return; }

      activities.destroy(id);
    });
  }

}
